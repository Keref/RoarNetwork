/*
 * HomePage Messages
 *
 * This contains all the text for the HomePage component.
 */
import { defineMessages } from 'react-intl';

export const scope = 'boilerplate.containers.ProfilePage';

export default defineMessages({
	update_profile: {
		id: `${scope}.update_profile`,
		defaultMessage: 'Update Profile',
	},
	buy: {
		id: `${scope}.buy`,
		defaultMessage: 'Buy',
	},
	sell: {
		id: `${scope}.sell`,
		defaultMessage: 'Sell',
	},
	avail: {
		id: `${scope}.avail`,
		defaultMessage: 'Avail.',
	},
	followers: {
		id: `${scope}.followers`,
		defaultMessage: 'followers.',
	},
	following: {
		id: `${scope}.following`,
		defaultMessage: 'following.',
	},
	message_number: {
		id: `${scope}.message_number`,
		defaultMessage: 'Messages',
	},
	address: {
		id: `${scope}.address`,
		defaultMessage: 'Addr',
	},
	default_description: {
		id: `${scope}.default_description`,
		defaultMessage: 'This profile has no description yet.',
	},
	username: {
		id: `${scope}.username`,
		defaultMessage: 'Username',
	},
	update_username: {
		id: `${scope}.update_username`,
		defaultMessage: 'Update',
	},
	follow: {
		id: `${scope}.follow`,
		defaultMessage: 'Follow',
	},
	unfollow: {
		id: `${scope}.unfollow`,
		defaultMessage: 'Unfollow',
	},
});
