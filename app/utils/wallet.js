import Web3 from 'web3';
import ethers from 'ethers';
import MessagesABI from './ABI/MessagesABI';
import ProfileABI from './ABI/ProfileABI';
import ProfileFactoryABI from './ABI/ProfileFactoryABI';
import InteractionTipsABI from './ABI/InteractionTipsABI';

class Wallet {
	#privateKey;
	publicKey;
	address = '';
	web3;
	userName;
	balance;	//stock balance
	ethBalance; //base layer token balance 
	
	
	myAccount = '';

	maxGas = 6000000;
	//profile contract is ERC20 + a few other functions
	profileContract;
	myProfileAddress;

	messagesAddress = "0x2d990ce5393a7E287Ed54D7794aE53c55B262d88";
	profileFactoryAddress = "0x88588DF25C89eBe0b67446F1Cd27AE9312C7d46D";
	interactionTipsAddress = "0x0aA5bA7eCe0D30715B061F02CFE4FceCf69C295d";

	messagesContract;
	profileFactoryContract;
	interactionTipsContract;
	
	messagesHeight = 0;
	updateStateCallback;
	
	/*
	 * @dev Create a wallet connected to the  network RPC
	 * This wallet 
	 */
	constructor (){
		web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));
		this.connectToRPCAccount();
		
		this.messagesContract = new web3.eth.Contract(MessagesABI, this.messagesAddress);
		this.profileFactoryContract = new web3.eth.Contract(ProfileFactoryABI, this.profileFactoryAddress );
		this.interactionTipsContract = new web3.eth.Contract(InteractionTipsABI, this.interactionTipsAddress );
		
		this.loginAsN();
		
	}
	
	
	/*
	 * @dev Uses a 12 words mnemonic to initialize a wallet
	 */
	importMnemonic(mnemonic){
		console.log("Unlocking Account with mnemonic", mnemonic)

		let mnemonicWallet = ethers.Wallet.fromMnemonic(mnemonic);
		console.log(mnemonicWallet);
		
		web3.eth.accounts.wallet.add(mnemonicWallet.privateKey)
	}
	
	
	/*
	 * @dev Uses the RPC account as user account, useful for testing locally
	 */
	connectToRPCAccount(){
		web3.eth.getAccounts( (error, result) => {
			console.log('got rpc accounts', result, result[0]);
			this.setVars ( result[0] );
			this.myAccount = result[0];
		})
	}
	
	/*
	 * @dev Set local vars for easy access
	 */
	setVars(address, publicKey, privateKey){
		this.address = address;
	}
	
	setUpdateProfileCallback (updateStateCallback) {
		this.updateStateCallback = updateStateCallback;
	}
	updateProfile () {
		if (this.updateStateCallback)
			this.updateStateCallback(this.userName, this.address);
	}
	
	
	/**
	 * @dev login as user N
	 * If profile doesnt exist then create it
	 */
	loginAsN(){
		console.log("Create profile");
		var myName = 'joe';
		//check if profile exists
		this.profileFactoryContract.methods.getProfile(myName).call( async (err, address) => {
			if(err) console.log(err)
				
			//console.log(address, address == 0)
			if( address == 0){
				this.profileFactoryContract.methods.deployNewProfile(myName)
					.send({from: this.myAccount, gas: this.maxGas} )
					.on('transactionHash', function(receipt){ })
					.on('receipt', function(receipt){
						//console.log("Success creating profile");
						//console.log(receipt);
						var profileEvent = receipt.events.ProfileCreated
						this.myProfileAddress = profileEvent.returnValues.tokenAddress
						this.profileContract = new web3.eth.Contract(ProfileABI, this.myProfileAddress );
						this.userName = myName;
						this.updateProfile();
					})
					.on('error', function(error){
						console.log(error);
					});
				
			}
			else {
				this.myProfileAddress = address;
				this.profileContract = new web3.eth.Contract(ProfileABI, this.myProfileAddress );
				this.balance = await this.profileContract.methods.balanceOf(this.address).call();
				console.log("user coin balance", this.balance)
				this.userName = myName;
				this.updateProfile();
			}
			
			web3.eth.getBalance(this.address, (err, res) => { this.ethBalance = res});
									

		}) 
	}
	
	
	sendMessage = async (message, commentId) => {
		if ( !message ) { console.log("Empty message"); return; }
		console.log("Tweeting", message,"isAnswer to", commentId)

		var sentTx;
		//check message type, if none or tweet nothing special, else parse along regex and call accordingly
		//regex for newsletter: just keyword
		if (message.indexOf("/post") == 0){
			let type = "post";
			var i = message.indexOf(' ');
			sentTx = await this.messagesContract.methods.publishTypedMessage(this.myProfileAddress, commentId, message.slice(i+1), "post", [])
				.send({from: this.myAccount, gas: this.maxGas} )
				.on('transactionHash', function(receipt){ })
				.on('receipt', (receipt) => {
					var messageId = receipt.events.MessagePublished.returnValues.messageId;
					
					console.log("Sent message ID", messageId);

					mid = messageId;
				})
		}
		
		else {
			sentTx = await this.messagesContract.methods.publishMessage(this.myProfileAddress, commentId || 0, message )
				.send({from: this.myAccount, gas: this.maxGas} )
				.on('transactionHash', function(receipt){ return 'plip'; })
				.on('receipt', (receipt) => {
					return receipt;
				})
		}
		
		if ( sentTx.events.MessagePublished ){
			return sentTx.events.MessagePublished.returnValues.messageId
		}
		if ( sentTx.events.CommentPublished ){
			return sentTx.events.CommentPublished.returnValues.messageId
			
		}

	}
	
	

	
	/**
	 * @dev Send tip to user; fixed amount for now
	 */ 
	sendTip = async ( messageId ) => {
		var result = await this.interactionTipsContract.methods.sendTip(messageId)
			.send({value: "100000000000000000", from: this.myAccount, gas: this.maxGas} )
			.on('transactionHash', function(receipt){  })
			.on('receipt', async (receipt) => {
				return receipt;
				console.log("Sent tip ", messageId);
			})

		return result
	}
	
	getTips = async (messageId) => {
		let tips = await this.interactionTipsContract.methods.getTips(messageId).call();
		console.log("Current tips status", tips)
		return tips;
	}
	
	
	
	/**
	 * @dev Retweet message
	 */
	retweet = async (messageId) => {
		console.log("Retweeting ", messageId);
		//TODO: should not allow retweeting if message already in the list
		let retweet = this.messagesContract.methods.retweet(this.myProfileAddress, messageId)
			.send({from: this.myAccount, gas: this.maxGas} )
			.on('transactionHash', function(receipt){  })
			.on('receipt', async (receipt) => {
				console.log("Retweeted ", messageId);
				return receipt;
			})
		
	}
	
		
	
	
	/**
	 * @dev Buy Creator Stock
	 */
	buyTokens = async (amount, profileAddress) => {
		console.log('buy', amount, "creator tokens at ", profileAddress);
		let profileContract = new web3.eth.Contract(ProfileABI, profileAddress );
		
		let sale = await profileContract.methods.buyStock()
			.send({from: this.myAccount, gas: this.maxGas, value: web3.utils.toWei(amount) } )
			.on('transactionHash', function(receipt){  })
			.on('receipt', async (receipt) => {
				return receipt;
			})
		//console.log('bought tokens', sale);
		//get amonut bought from events
		var amountBought = sale.events.StockBought.returnValues.amount;
		return amountBought;
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
}


export default Wallet;