/*
 * FeedPage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React, { useEffect, memo } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';

import H2 from 'components/H2';
import ReposList from 'components/ReposList';
import AtPrefix from './AtPrefix';
import CenteredSection from './CenteredSection';
import Form from './Form';
import Input from './Input';
import Section from './Section';
import {StyledBox} from 'components/MessageBox';
import PublishBox from 'components/PublishBox/PublishBox';
import messages from './messages';
import { Feed } from 'components/Feed';


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

	return (
	<div style={{	borderRight: "1px solid lightgrey", borderLeft: "1px solid lightgrey" }}>
		<StyledBox>
			<h2 style={{ padding: 12, margin: 0 }}>Home</h2>
		</StyledBox>
		<PublishBox />
		
		<Feed />
	</div>
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
