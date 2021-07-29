/*
 * HomePage Messages
 *
 * This contains all the text for the HomePage component.
 */
import { defineMessages } from 'react-intl';

export const scope = 'boilerplate.containers.PostPage';

export default defineMessages({
	publish: {
		id: `${scope}.publish`,
		defaultMessage: 'Publish',
	},
	title: {
		id: `${scope}.title`,
		defaultMessage: 'New Post',
	},
});
