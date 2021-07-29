const crypto = require('crypto');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
	{
		email: String,
		username: String,
		address: String, // eth address
		mnemonic: String, // mnemonic exists for users who dont login/signup with seed
	
		countryCode: String,
		phone: String,
		phone2fa: String,
		following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
		/*
	twoFA: {
		googleAuthToken: String,
		googleAuthActivated: {type: Boolean, default: false },
		twoFAToken: String,
	}, */

		twitter: String,
		tokens: Array,
	},
	{ timestamps: true },
);

/**
 * Helper method for getting user's gravatar.
 */
userSchema.methods.gravatar = function gravatar(size) {
	if (!size) {
		size = 200;
	}
	if (!this.email) {
		return `https://gravatar.com/avatar/?s=${size}&d=retro`;
	}
	const md5 = crypto
		.createHash('md5')
		.update(this.email)
		.digest('hex');
	return `https://gravatar.com/avatar/${md5}?s=${size}&d=retro`;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
