const Web3 = require('web3');
// const ethers = require('ethers');

const MessagesABI = require('../../ABI/Messages.json');
const ProfileABI = require('../../ABI/Profile.json');
const ProfileFactoryABI = require('../../ABI/ProfileFactory.json');
const InteractionTipsABI = require('../../ABI/InteractionTips.json');
const ProfileListsABI = require('../../ABI/ProfileLists.json');
const Addresses = require('../../ABI/Addresses.json');

/**
 * Web3 query functions. Not meant to send transactions
 */
const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'));
const messagesContract = new web3.eth.Contract(MessagesABI.abi, Addresses.messagesAddress);
const profileFactoryContract = new web3.eth.Contract(ProfileFactoryABI.abi, Addresses.profileFactoryAddress);
const interactionTipsContract = new web3.eth.Contract(InteractionTipsABI.abi, Addresses.interactionTipsAddress);
const profileListsContract = new web3.eth.Contract(ProfileListsABI.abi, Addresses.profileListsAddress);

/**
 * GET /api/getAppInfo
 * API: returns API information and various information including messages Height
 */
exports.getAppInfo = async (req, res) => {
	const appinfo = {
		apiVersion: '0.1',
	};

	const messagesHeight = await messagesContract.methods.totalSupply().call();
	appinfo.messagesHeight = messagesHeight;

	return res.json(appinfo);
};

/**
 * GET /api/getMessage/:id
 * returns message with additional important info
 * currently relying on asking the rpc but later will ask the DB and populate results
 */
exports.getMessage = async (req, res) => {
	/* eslint no-restricted-globals: 0 */
	if (!req.params.id || isNaN(req.params.id) ) return res.json({ status: 'INVALID_ID' });
	const rawMessage = await messagesContract.methods
		.getMessage(req.params.id)
		.call();
	/*			uint256 messageId, 
			string memory ownerName, 
			string memory messageURI, 
			uint256 replyToId, 
			uint256[] memory comments, 
			string[] memory interactions */
	const tips = await interactionTipsContract.methods
		.getTips(req.params.id)
		.call();

	const message = {
		id: rawMessage[0],
		ownerName: rawMessage[1],
		URI: rawMessage[2],
		replyToId: rawMessage[3],
		comments: rawMessage[4],
		interactions: rawMessage[5],
		tips: {
			total: tips.total,
			tippers: tips.tippers,
			tippersAmount: tips.tippersAmount,
		},
	};
	// console.log(message);

	// populate the creator
	message.status = 'SUCCESS';

	return res.json(message);
};


/**
 * GET /api/getNextMessages/:id
 * returns message with additional important info
 * currently relying on asking the rpc but later will ask the DB and populate results
 */
exports.getNextMessages = async (req, res) => {
	/* eslint no-restricted-globals: 0 */
	if (!req.params.id || isNaN(req.params.id) ) return res.json({ status: 'INVALID_ID' });
};





/**
 * GET /api/getFollowing/:handle
 * returns following list
 */
exports.getFollowing = async (req, res) => {
	if (!req.params.handle) return res.json({ status: 'INVALID_ID' });
	
	const listIndex = await profileListsContract.methods.following(req.params.handle).call();
	const following = await profileListsContract.methods.getList(listIndex).call();
	
	return res.json(following.profileAddresses);
};



/**
 * GET /api/getProfile/:handle
 * returns profile information
 */
exports.getProfile = async (req, res) => {
	if (!req.params.handle) return res.json({ status: 'INVALID_ID' });

	const profileAddress = await profileFactoryContract.methods
		.getProfile(req.params.handle)
		.call();
	/* eslint eqeqeq: 0 */
	if ( profileAddress == 0 ) return res.status(404).json({})
		
	const profileContract = new web3.eth.Contract(ProfileABI.abi, profileAddress);

	const desc = await profileContract.methods.description().call();
	const owner = await profileContract.methods.owner().call();
	const lifetimeDividends = await profileContract.methods.lifetimeDividends().call();
	const founderReward = await profileContract.methods.founderReward().call();
	/*
	const followersIndex = await profileListsContract.methods.following(profileAddress).call();
	console.log("his follower index list", followersIndex);
	const followers = await profileListsContract.methods.profileLists(followersIndex).call();
	console.log("the follower struct", followers);
*/
	const tokenSupply = await profileContract.methods.totalSupply().call();
	const tokenValue = await web3.eth.getBalance(
		profileAddress,
		(err, result) =>
		// console.log(err, result);
			result,
	);

	const profile = {
		handle: req.params.handle,
		description: desc,
		owner,
		tokenSupply,
		tokenValue,
		lifetimeDividends,
		founderReward,
		profileAddress,
		profilePicture: '/images/defaultprofile.png',
	};
	profile.status = 'SUCCESS';

	return res.json(profile);
};

/**
 * GET /api/airdrop
 * airdrops tokens to user for gas
 */
exports.getAirdrop = async (req, res) => {
	// TODO: checks to avoid abuse
	web3.eth.getAccounts((error, result) => {
  		const [account0] = result;
		
		web3.eth.sendTransaction({to: req.user.address, from: account0, value: web3.utils.toWei('0.2', 'ether') })
			.on( 'receipt', (receipt) => res.json(receipt) );
  	});
};
