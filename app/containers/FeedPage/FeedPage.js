/*
 * FeedPage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { StyledBox } from 'components/MessageBox';
import PublishBox from 'components/PublishBox/PublishBox';
import WelcomeBox from 'components/WelcomeBox/WelcomeBox';
import RightBar from 'components/RightBar/RightBar';
import { Feed } from 'components/Feed';

import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import messages from './messages';
import CloutContext from '../../cloutContext';

const key = 'feed';

export function FeedPage({
	username,
	loading,
	error,
	repos,
	onSubmitForm,
	onChangeUsername,
}) {
	const reposListProps = {
		loading,
		error,
		repos,
	};

	const appState = useContext(CloutContext);

	return (
		<Grid container spacing={3}>
			<Grid item sm={12} md={8}>
				{!appState.address || appState.address == '' ? <WelcomeBox /> : <PublishBox />}
				<Feed ignoreComments />
			</Grid>

			<Hidden smDown>
				<RightBar />
			</Hidden>
		</Grid>
	);
}

FeedPage.propTypes = {
	loading: PropTypes.bool,
	error: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
	repos: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
	onSubmitForm: PropTypes.func,
	username: PropTypes.string,
	onChangeUsername: PropTypes.func,
};

export default FeedPage;
