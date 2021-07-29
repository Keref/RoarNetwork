/*
 * Header Messages
 *
 * This contains all the text for the Header component.
 */
import { defineMessages } from 'react-intl';

export const scope = 'boilerplate.components.LoginModal';

export default defineMessages({
	title: {
		id: `${scope}.title`,
		defaultMessage: 'Login / Register',
	},
	login: {
		id: `${scope}.login`,
		defaultMessage: 'Login',
	},
	log_in: {
		id: `${scope}.log_in`,
		defaultMessage: 'Log In',
	},
	get_code: {
		id: `${scope}.get_code`,
		defaultMessage: 'Get Code',
	},
	enter_code: {
		id: `${scope}.enter_code`,
		defaultMessage: 'Enter Code',
	},
	select_country: {
		id: `${scope}.select_country`,
		defaultMessage: 'Select a Country',
	},
	phone_number: {
		id: `${scope}.phone_number`,
		defaultMessage: 'Phone Number',
	},
});
