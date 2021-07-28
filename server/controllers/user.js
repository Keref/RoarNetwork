const passport = require('passport');
const ethers = require('ethers');
const User = require('../models/User');
const messageBot = require('../models/MessageBot');
/**
 * GET /login
 * Signup/login page
 */
exports.getLogin = (req, res) => {
	// console.log('req.user', req.user)
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
 * POST /profile
 * Update user profile
 */
exports.updateProfile = async ( req,res, next) => {
	//update username
	if ( req.body.username ){
		let existingUser = await User.findOne({ username: req.body.username }).exec()
		
		if (existingUser) return res.status(500).json({status: 'error'})
		
		req.user.username = req.body.username;
		await user.save()
		
		return res.json({ status: 'success' });
	}
}


/**
 * POST /login
 * Sign in using seed or phone and phone 2FA
 */
exports.postLogin = async (req, res, next) => {
	// we test login validity here then let passport just handle the session stuff
	let user ;
	// if login with seed signature
	if ( req.body.randomString && req.body.userAddress && req.body.userSignature ){
		try {
			const msg = `${req.body.randomString}.ROAR.${req.body.userAddress}`;
			const whoSigned = ethers.utils.verifyMessage(msg, req.body.userSignature);
			console.log('whoSigned', whoSigned, whoSigned === req.body.userAddress);
			if ( !whoSigned === req.body.userAddress ) throw new Error("Signature error");

			user = await User.findOne({ address: req.body.userAddress });
			if (!user) {
				user = new User({
					address: req.body.userAddress,
					username: req.body.userAddress.substring(2, 14),
				});
				await user.save();
			}
		} catch (err) {
			console.log('Signature error', err);
			return res.json({ status: 'error' });
		}
	}
	else if ( req.body.phone2fa && req.body.countryCode && req.body.phone ){
		console.log('loginwith code', req.body)
		user = await User.findOne({ phone: req.body.phone, countryCode: req.body.countryCode, phone2fa: req.body.phone2fa });
		if (!user ) return res.status(401).json({status: 'error'})
	}
	else {
		return res.status(401).json({status: 'error'})
	}
	// passport expects those values or will throw "missing credentials"
	req.body.username = user.username;
	req.body.password = 'dummy4515465565464';
	
	/* eslint no-unused-vars: 0 */
	passport.authenticate('local', (err, user, info) => {
		// console.log('plip', err, user, info);
		if (err) {
			return next(err);
		}

		if (!user) {
			if (req.headers.accept === 'application/json') {
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
				mnemonic: req.user.mnemonic,
			});
		});
	})(req, res, next);
};

/**
 * POST /loginPhone
 * Prepare phone 2FA
 */
exports.prepareLoginPhone = async (req, res, next) => {
	// console.log(req.body)
	// we test login validity here then let passport just handle the session stuff
	try {
		console.log('prepre login', req.body);
		let user = await User.findOne({ phone: req.body.phone, countryCode: req.body.countryCode });
		if (!user) {
			user = new User({
				phone: req.body.phone,
				countryCode: req.body.countryCode
			});
			
			user.mnemonic = ethers.Wallet.createRandom().mnemonic.phrase;
			const wallet = ethers.Wallet.fromMnemonic(user.mnemonic);
			user.address = wallet.address;
			user.username = user.address.substring(2,14);
			
		}
		user.phone2fa = 6666; // Math.floor(Math.random()*9000) + 1000;
		await user.save();
		// send sms
		console.log('Sending token by SMS');

		const message = `【BIBO】您的验证码是${user.phone2fa}。如非本人操作，请忽略本短信，千万不要将验证码告诉任何人`
		console.log("USDERSMSS", message)
		// messageBot.messageSMS(user, message, user.phone2fa)
		messageBot.check()
		
		// generate 4 nums phone2fa and return success
		return res.json({status: 'success' })
	} catch (err) {
		return res.json({ status: 'error' });
	}
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

		if (req.headers.accept === 'application/json') return res.json({});
		return res.redirect('/');
	});
};

/**
 * GET /api/twitter
 * Twitter API example.
*//*
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
}; */

/**
 * POST /api/twitter
 * Post a tweet.
 *//*
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
}; */
