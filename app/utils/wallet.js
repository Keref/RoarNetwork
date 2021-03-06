import Web3 from 'web3';
import { ethers } from 'ethers';
import roarAPI from './api';

import MessagesAbi from '../../ABI/Messages.json';
import ProfileAbi from '../../ABI/Profile.json';
import ProfileFactoryAbi from '../../ABI/ProfileFactory.json';
import InteractionTipsAbi from '../../ABI/InteractionTips.json';
import ProfileListsAbi from '../../ABI/ProfileLists.json';
import Addresses from '../../ABI/Addresses.json';



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

  messagesContract;

  profileFactoryContract;

  interactionTipsContract;
  
  profileListsContract;

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
  		MessagesAbi.abi,
  		Addresses.messagesAddress,
  	);
  	this.profileFactoryContract = new this.web3.eth.Contract(
  		ProfileFactoryAbi.abi,
  		Addresses.profileFactoryAddress,
  	);
  	this.interactionTipsContract = new this.web3.eth.Contract(
  		InteractionTipsAbi.abi,
  		Addresses.interactionTipsAddress,
  	);
  	this.profileListsContract = new this.web3.eth.Contract(
  		ProfileListsAbi.abi,
  		Addresses.profileListsAddress,
  	);
  }

  /*
   * @dev Uses a mnemonic to initialize a wallet
   */
  async importMnemonic(mnemonic, username) {
	  console.log('import mnemonic,', mnemonic, username)
  	const mnemonicWallet = ethers.Wallet.fromMnemonic(mnemonic);
  	console.log(mnemonicWallet)
  	this.web3.eth.accounts.wallet.add(mnemonicWallet.privateKey);
  	this.username = username;
  	this.address = mnemonicWallet.address;
  	this.myAccount = mnemonicWallet.address;
  	this.updateProfile({ username, address: mnemonicWallet.address });
	
  	this.getOrSetProfile();
  	const foll = await roarAPI.getFollowing(this.address)
  	this.updateProfile({ following: foll })
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

  updateProfile(params) {
  	if (this.updateStateCallback)
  		this.updateStateCallback(params);
  }

  /**
   * @dev destroy wallet and update app profile
   */
  async logout() {
  	this.address = '';
  	this.myAccount = '';
  	this.username = '';
  	this.profileContract = null;
  	localStorage.removeItem('RoarUserPrivateKey');
  	localStorage.removeItem('RoarUserMnemonic');
  	localStorage.removeItem('RoarUserAddress');
	
  	this.updateProfile({username: null, address: null, profile: {}, following: [] });
	
  	return true;
  }
  
  /**
   * @dev Update self token balance and Eth balance
   */
  async updateBalances() {
  	this.balance = await this.profileContract.methods.balanceOf(this.address).call();
  	this.ethBalance = await this.web3.eth.getBalance(this.address, (balance) => balance);
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
  			if (address === "0x0000000000000000000000000000000000000000") {
  				// no profile, need to create, but do we have eth? if no request airdrop
				
  				await roarAPI.getAirdrop();
  				/* let bal = await this.web3.eth.getBalance(this.address, (balance) => return balance);
  				console.log('getBal', bal); */
  				this.profileFactoryContract.methods
  					.deployNewProfile(this.username)
  					.send({ from: this.myAccount, gas: this.maxGas })
  					.on('receipt', function(receipt) {
  						const profileEvent = receipt.events.ProfileCreated;
  						this.myProfileAddress = profileEvent.returnValues.tokenAddress;
  						this.profileContract = new this.web3.eth.Contract(ProfileAbi.abi, this.myProfileAddress);
  						this.updateBalances();
  					})
  					.on('error', function(error) {
  						console.log(error);
  					});
  			} else {
  				this.myProfileAddress = address;
  				this.profileContract = new this.web3.eth.Contract(ProfileAbi.abi, this.myProfileAddress);
  				this.updateBalances();
  			}

  			
  		});
  }
  
  
  /**
	* @dev Update profile name
	*/
  async changeProfileName( newName ){
  	this.profileFactoryContract.methods
  		.changeProfileName(this.username, newName)
  		.send({ from: this.myAccount, gas: this.maxGas })
  			.on('receipt', async receipt => {
  			// check that change was registered, then change on server
  			console.log('changed name and receipt:', receipt);
  			const profile = await roarAPI.updateProfile({ username: newName });
  			console.log("New profile:", profile)
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
  		ProfileAbi.abi,
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
  
  
  /**
   * @dev Follow a profile
   */
  follow = async (profileAddress, addRemoveFollower) => {
	  
  	await this.profileListsContract.methods[ addRemoveFollower ](profileAddress, 0)
  		.send({
  			from: this.myAccount,
  			gas: this.maxGas,
  		})
  		.catch(() => {		})

  	const foll = await roarAPI.getFollowing(this.myAccount);
  	this.updateProfile({ following: foll })
  }

}

export default Wallet;
