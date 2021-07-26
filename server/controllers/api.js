const Web3 = require('web3');
const ethers = require('ethers');
const { MessagesABI } = require('../ABI/MessagesABI');
const { ProfileABI } = require('../ABI/ProfileABI');
const { ProfileFactoryABI } = require('../ABI/ProfileFactoryABI');
const { InteractionTipsABI } = require('../ABI/InteractionTipsABI');

const messagesAddress = '0x2d990ce5393a7E287Ed54D7794aE53c55B262d88';
const profileFactoryAddress = '0x88588DF25C89eBe0b67446F1Cd27AE9312C7d46D';
const interactionTipsAddress = '0x0aA5bA7eCe0D30715B061F02CFE4FceCf69C295d';

/**
 * Web3 query functions. Not meant to send transactions
 */
console.log('Initializing API -- connecting to web3 RPC');
const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'));

const messagesContract = new web3.eth.Contract(MessagesABI, messagesAddress);
const profileFactoryContract = new web3.eth.Contract(
  ProfileFactoryABI,
  profileFactoryAddress,
);
const interactionTipsContract = new web3.eth.Contract(
  InteractionTipsABI,
  interactionTipsAddress,
);

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
  if (!req.params.id) return res.json({ status: 'INVALID_ID' });
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

  message = {
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
 * GET /api/getProfile/:handle
 * returns profile information
 */
exports.getProfile = async (req, res) => {
  if (!req.params.handle) return res.json({ status: 'INVALID_ID' });

  const profileAddress = await profileFactoryContract.methods
    .getProfile(req.params.handle)
    .call();
  const profileContract = new web3.eth.Contract(ProfileABI, profileAddress);

  const desc = await profileContract.methods.description().call();
  const owner = await profileContract.methods.owner().call();
  const lifetimeDividends = await profileContract.methods
    .lifetimeDividends()
    .call();

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
    profileAddress,
    profilePicture: '/images/defaultprofile.png',
  };
  profile.status = 'SUCCESS';

  return res.json(profile);
};
