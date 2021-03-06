const url = require('url');
// const nodemailer = require('nodemailer');
/*
const NODEMAILER_TRANSPORT_OPTIONS = {
	host: process.env.SMTP_HOST,
	port: process.env.SMTP_PORT,
	auth: {
		user: process.env.SMTP_USER,
		pass: process.env.SMTP_PASSWORD,
	}
} */

class MessageBot  {
	constructor(options) {
		this.options = {
			defaultTitle: '����Ϣ',
			defaultBtnText: '�Ķ�����',
			...options
		}
	}

	async send(user, message) {
 		const PARAMS = {
			apikey: process.env.YUNPIAN_API_KEY,
			mobile: encodeURI( (user.countryCode ? `+${user.countryCode}` : "")+user.phone),
			text: message
		}
		
		let smsurl = "https://yunpian.com/v2/sms/single_send.json";
		if ( user.countryCode === '86')
			smsurl = "https://sms.yunpian.com/v2/sms/single_send.json"

		const header = {
			'Accept': 'application/json;charset=utf-8;',
			'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
		}

		const params = new url.URLSearchParams();
		params.append('apikey', PARAMS.apikey);
		params.append('mobile', PARAMS.mobile);
		params.append('text', message);
		console.log("yunpian", params)

		fetch(smsurl, {
			method: 'POST',
			headers: header,
			body: params,
		})
			.then( async (response) => {
				const result = await response.json();
				console.log(result, "[login] SMS sent")
			})
			.catch( (error) => {
				console.error(smsurl, error);
			});
	}



	// check language for phone based verif code
	async messageSMS(user, message, code) {
		console.log("OTHERSMS", user.phone, user.countryCode, message, code)
		let msg = `��Bibo��Your verification code is ${code}`
		
		if ( user.countryCode === '86' )
			msg = message

		await this.send(user, msg, code)
	}
	
	// for otc dont translate
	async messageOtcSMS(user, message, code) {
		console.log("OTCSMS", user.phone, user.countryCode, message, code)
		await this.send(user, message, code)
	}

	async messageOtcEmail(user, message, code) {
		console.log("OTC email not implemented", user.phone, user.countryCode, message, code)

	}
	/*
	async messageEmail(user, message) {
		let transporter = nodemailer.createTransport(NODEMAILER_TRANSPORT_OPTIONS);
		const mailOptions = {
		  to: user.email,
		  from: 'noreply@bibo.gold',
		  subject: 'Bibo Security Code',
		  text: message
		};
		transporter.sendMail(mailOptions)
		  .then(() => {
				req.flash('info', { msg: `An e-mail has been sent to ${user.email} with further instructions.` });
		  })
		  .catch((err) => {
				if (err.message === 'self signed certificate in certificate chain') {
			  console.log('WARNING: Self signed certificate in certificate chain. Retrying with the self signed certificate. Use a valid certificate if in production.');
			  transporter = nodemailer.createTransport(NODEMAILER_TRANSPORT_OPTIONS);
			  return transporter.sendMail(mailOptions)
						.then(() => {
				  req.flash('info', { msg: `An e-mail has been sent to ${user.email} with further instructions.` });
						});
				}
				console.log('ERROR: Could not send forgot password email after security downgrade.\n', err);
				req.flash('errors', { msg: 'Error sending the password reset message. Please try again shortly.' });
				return err;
		  });
	} */
	
	async check() {
		return true;
	}
	
}

const messageBot = new MessageBot({
	isAtAll: true,
	quiet: false
})

module.exports = messageBot