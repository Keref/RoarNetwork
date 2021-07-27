/*
 * HomePage Messages
 *
 * This contains all the text for the HomePage component.
 */
import { defineMessages } from 'react-intl';

export const scope = 'boilerplate.components.WelcomeBox';

export default defineMessages({
	welcome: {
		id: `${scope}.welcome`,
		defaultMessage: 'Welcome',
	},
	content: {
		id: `${scope}.content`,
		defaultMessage: 'A decentralized content creator network.',
	},
});
