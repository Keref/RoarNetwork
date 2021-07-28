/*
 * Header Messages
 *
 * This contains all the text for the Header component.
 */
import { defineMessages } from 'react-intl';

export const scope = 'boilerplate.components.RightBar';

export default defineMessages({
	suggestions: {
		id: `${scope}.suggestions`,
		defaultMessage: 'Suggestions',
	},
	trending: {
		id: `${scope}.trending`,
		defaultMessage: 'Trending',
	},
});
