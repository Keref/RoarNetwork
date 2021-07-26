import Web3 from 'web3';
import { ethers } from 'ethers';
// import roarAPI from './api';
import MessagesABI from './ABI/MessagesABI';
import ProfileABI from './ABI/ProfileABI';
import ProfileFactoryABI from './ABI/ProfileFactoryABI';
import InteractionTipsABI from './ABI/InteractionTipsABI';

class Wallet {
	// #privateKey;

	// publicKey;

  address = '';

  web3;

  username;

  balance;

  // stock balance
  ethBalance; // base layer token balance

  myAccount = '';

  maxGas = 6000000;

  // profile contract is ERC20 + a few other functions
  profileContract;

  myProfileAddress;

  messagesAddress = '0xC0977bfA44719b9D31a87B853A3Bed5a43Ca9A6F';

  profileFactoryAddress = '0x1fBEB810c3ca6e3e5375B553EfdbC20E1c43937F';

  interactionTipsAddress = '0x2BFfFB5BEFbD440f08Ce769252Da1A63495D8A0B';

  messagesContract;

  profileFactoryContract;

  interactionTipsContract;

  messagesHeight = 0;

  updateStateCallback;

  /*
   * @dev Create a wallet connected to the  network RPC
   * This wallet
   */
  constructor() {
  	this.web3 = new Web3(
  		new Web3.providers.HttpProvider('http://127.0.0.1:8545'),
  	);
  	// this.connectToRPCAccount();
  	this.messagesContract = new this.web3.eth.Contract(
  		MessagesABI,
  		this.messagesAddress,
  	);
  	this.profileFactoryContract = new this.web3.eth.Contract(
  		ProfileFactoryABI,
  		this.profileFactoryAddress,
  	);
  	this.interactionTipsContract = new this.web3.eth.Contract(
  		InteractionTipsABI,
  		this.interactionTipsAddress,
  	);
  }

  /*
   * @dev Uses a mnemonic to initialize a wallet
   */
  importMnemonic(mnemonic, username) {
  	const mnemonicWallet = ethers.Wallet.fromMnemonic(mnemonic);

  	this.web3.eth.accounts.wallet.add(mnemonicWallet.privateKey);
  	this.username = username;
  	this.address = mnemonicWallet.address;
  	this.myAccount = mnemonicWallet.address;
  	this.updateProfile(username, mnemonicWallet.address);
	
  	this.getOrSetProfile();
  }

  /*
   * @dev Uses the RPC account as user account, useful for testing locally
   */
  connectToRPCAccount() {
  	this.web3.eth.getAccounts((error, result) => {
  		// console.log('got rpc accounts', result, result[0]);
  		const [account1] = result;

  		this.address = account1;
  		this.myAccount = account1;
  	});
  }

  /**
	 * Update profile callback to update app state when wallet changes
	 */
  setUpdateProfileCallback(updateStateCallback) {
  	this.updateStateCallback = updateStateCallback;
  }

  updateProfile() {
  	if (this.updateStateCallback)
  		this.updateStateCallback(this.username, this.address);
  }

  /**
   * @dev destroy wallet and update app profile
   */
  async logout() {
  	this.address = '';
  	this.myAccount = '';
  	this.username = '';
  	this.profileContract = null;

  	this.updateProfile();
  }

  /**
   * @dev getOrSetProfile
   * Set and connect to onchain profile
   */
  async getOrSetProfile() {
  	// check if profile exists
  	this.profileFactoryContract.methods
  		.getProfile(this.username)
  		.call(async (err, address) => {
  			if (err) console.log(err);
			console.log('sdfsfdsd', address, address === "0x0000000000000000000000000000000000000000"  )
  			if (address === "0x0000000000000000000000000000000000000000") {
  				this.profileFactoryContract.methods
  					.deployNewProfile(this.username)
  					.send({ from: this.myAccount, gas: this.maxGas })
  				// .on('transactionHash', function(receipt) {})
  					.on('receipt', function(receipt) {
  						// console.log('Success creating profile');
  						// console.log(receipt);
  						const profileEvent = receipt.events.ProfileCreated;
  						this.myProfileAddress = profileEvent.returnValues.tokenAddress;
  						this.profileContract = new this.web3.eth.Contract(
  							ProfileABI,
  							this.myProfileAddress,
  						);
  					})
  					.on('error', function(error) {
  						console.log(error);
  					});
  			} else {
  				this.myProfileAddress = address;

  				this.profileContract = new this.web3.eth.Contract(
  					ProfileABI,
  					this.myProfileAddress,
  				);
  				this.balance = await this.profileContract.methods
  					.balanceOf(this.address)
  					.call();
  			}

  			this.web3.eth.getBalance(this.address, (error, res) => {
  				this.ethBalance = res;
  			});
  		});
  }

  sendMessage = async (message, commentId) => {
  	if (!message) {
  		// console.log('Empty message');
  		return -1;
  	}
  	console.log('Tweeting', message, 'isAnswer to', commentId);

  	let sentTx;
  	// check message type, if none or tweet nothing special, else parse along regex and call accordingly
  	// regex for newsletter: just keyword
  	if (message.indexOf('/post') === 0) {
  		const i = message.indexOf(' ');
  		sentTx = await this.messagesContract.methods
  			.publishTypedMessage(
  				this.myProfileAddress,
  				commentId,
  				message.slice(i + 1),
  				'post',
  				[],
  			)
  			.send({ from: this.myAccount, gas: this.maxGas })
  			.on('receipt', receipt => receipt);
  	} else {
  		sentTx = await this.messagesContract.methods
  			.publishMessage(this.myProfileAddress, commentId || 0, message)
  			.send({ from: this.myAccount, gas: this.maxGas });
  	}

  	if (sentTx.events.MessagePublished) {
  		return sentTx.events.MessagePublished.returnValues.messageId;
  	}
  	if (sentTx.events.CommentPublished) {
  		return sentTx.events.CommentPublished.returnValues.messageId;
  	}
  	return -1;
  };

  /**
   * @dev Send tip to user; fixed amount for now
   */

  sendTip = async messageId => {
  	const result = await this.interactionTipsContract.methods
  		.sendTip(messageId)
  		.send({
  			value: '100000000000000000',
  			from: this.myAccount,
  			gas: this.maxGas,
  		})
  	// .on('transactionHash', function(receipt) {})
  		.on('receipt', receipt => receipt);

  	return result;
  };

  getTips = async messageId => {
  	const tips = await this.interactionTipsContract.methods
  		.getTips(messageId)
  		.call();
  	console.log('Current tips status', tips);
  	return tips;
  };

  /**
   * @dev Retweet message
   */
  retweet = async messageId => {
  	console.log('Retweeting ', messageId);
  	// TODO: should not allow retweeting if message already in the list
  	const retweet = this.messagesContract.methods
  		.retweet(this.myProfileAddress, messageId)
  		.send({ from: this.myAccount, gas: this.maxGas });

  	return retweet;
  };

  /**
   * @dev Buy Creator Stock
   */
  buyTokens = async (amount, profileAddress) => {
  	console.log('buy', amount, 'creator tokens at ', profileAddress);
  	const profileContract = new this.web3.eth.Contract(
  		ProfileABI,
  		profileAddress,
  	);

  	const sale = await profileContract.methods
  		.buyStock()
  		.send({
  			from: this.myAccount,
  			gas: this.maxGas,
  			value: this.web3.utils.toWei(amount),
  		})
  	// .on('transactionHash', function(receipt) {})
  		.on('receipt', async receipt => receipt);
  	// console.log('bought tokens', sale);
  	// get amonut bought from events
  	const amountBought = sale.events.StockBought.returnValues.amount;
  	return amountBought;
  };
}

export default Wallet;
