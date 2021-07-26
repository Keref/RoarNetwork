/*
 * HomePage Messages
 *
 * This contains all the text for the HomePage component.
 */
import { defineMessages } from 'react-intl';

export const scope = 'boilerplate.components.PublishBox';

export default defineMessages({
  tweet: {
    id: `${scope}.tweet`,
    defaultMessage: 'Tweet',
  },
  post: {
    id: `${scope}.post`,
    defaultMessage: 'Post',
  },
});
