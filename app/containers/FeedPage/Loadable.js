/**
 * Asynchronously loads the component for FeedPage
 */

import React from 'react';
import loadable from 'utils/loadable';
import LoadingIndicator from 'components/LoadingIndicator';

export default loadable(() => import('./FeedPage'), {
  fallback: <LoadingIndicator />,
});
