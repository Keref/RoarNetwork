/*
 * Header Messages
 *
 * This contains all the text for the Header component.
 */
import { defineMessages } from 'react-intl';

export const scope = 'boilerplate.components.Header';

export default defineMessages({
	title: {
		id: `${scope}.title`,
		defaultMessage: 'Roar Network',
	},
	features: {
		id: `${scope}.features`,
		defaultMessage: 'Features',
	},
});
