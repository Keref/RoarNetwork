const passport = require('passport');
const ethers = require('ethers');
const User = require('../models/User');

/**
 * GET /login
 * Signup/login page
 */
exports.getLogin = (req, res) => {
  if (req.user) {
    return res.json({
      status: 'success',
      username: req.user.username,
      address: req.user.address,
      mnemonic: req.user.mnemonic,
    });
  }

  return res.status(401).json({ status: 'error' });
};

/**
 * POST /login
 * Sign in using seed
 */
exports.postLogin = async (req, res, next) => {
  let user;
  // console.log(req.body)
  // we test login validity here then let passport just handle the session stuff
  try {
    const msg = `${req.body.randomString}.ROAR.${req.body.userAddress}`;
    const whoSigned = ethers.utils.verifyMessage(msg, req.body.userSignature);
    console.log('whoSigned', whoSigned, whoSigned === req.body.userAddress);
    //
    user = await User.findOne({ address: req.body.userAddress });
    if (!user) {
      user = new User({
        address: req.body.userAddress,
        username: req.body.userAddress.substring(0, 20),
      });
      await user.save();
    }
    req.body.username = user.username;
    req.body.password = 'dummy';
  } catch (err) {
    console.log('Signature error', err);
    return res.json({ status: 'error' });
  }
  passport.authenticate('local', (err, user, info) => {
    console.log('plip', err, user, info);
    if (err) {
      return next(err);
    }

    if (!user) {
      if (req.headers.accept == 'application/json') {
        console.log('app failed to login');
        return res.status(401).json({ status: 'error' });
      }
      return res.redirect('/login');
    }
    req.logIn(user, err => {
      if (err) {
        return next(err);
      }
      return res.json({
        status: 'success',
        username: req.user.username,
        address: req.user.address,
      });
    });
  })(req, res, next);
};

/**
 * GET /logout
 * Logs out
 */
exports.logout = (req, res) => {
  req.logout();
  req.session.destroy(err => {
    if (err)
      console.log('Error : Failed to destroy the session during logout.', err);
    req.user = null;

    if (req.headers.accept == 'application/json') return res.json({});
    return res.redirect('/');
  });
};

/**
 * GET /api/twitter
 * Twitter API example.
 */
exports.getTwitter = async (req, res, next) => {
  const token = req.user.tokens.find(token => token.kind === 'twitter');
  const T = new Twitter({
    consumer_key: process.env.TWITTER_KEY,
    consumer_secret: process.env.TWITTER_SECRET,
    access_token_key: token.accessToken,
    access_token_secret: token.tokenSecret,
  });
  try {
    const { statuses: tweets } = await T.get('search/tweets', {
      q: 'nodejs since:2013-01-01',
      geocode: '40.71448,-74.00598,5mi',
      count: 10,
    });
    res.render('api/twitter', {
      title: 'Twitter API',
      tweets,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/twitter
 * Post a tweet.
 */
exports.postTwitter = async (req, res, next) => {
  const validationErrors = [];
  if (validator.isEmpty(req.body.tweet))
    validationErrors.push({ msg: 'Tweet cannot be empty' });

  if (validationErrors.length) {
    req.flash('errors', validationErrors);
    return res.redirect('/api/twitter');
  }

  const token = req.user.tokens.find(token => token.kind === 'twitter');
  const T = new Twitter({
    consumer_key: process.env.TWITTER_KEY,
    consumer_secret: process.env.TWITTER_SECRET,
    access_token_key: token.accessToken,
    access_token_secret: token.tokenSecret,
  });
  try {
    await T.post('statuses/update', { status: req.body.tweet });
    req.flash('success', { msg: 'Your tweet has been posted.' });
    res.redirect('/api/twitter');
  } catch (error) {
    next(error);
  }
};
