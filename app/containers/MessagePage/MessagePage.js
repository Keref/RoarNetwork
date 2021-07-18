/*
 * FeedPage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React, { useEffect, memo } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { useParams } from 'react-router-dom';

import { StyledBox } from 'components/MessageBox';
import messages from './messages';
import MessageComments from './MessageComments';
import CloutContext from "../../cloutContext";


const key = 'feed';

class MessagePage extends React.Component {
	static contextType = CloutContext;
	

	render(){
	return (
	<div style={{	borderRight: "1px solid lightgrey", borderLeft: "1px solid lightgrey" }}>
		<StyledBox>
			<h2 style={{ padding: 12, margin: 0 }}><span onClick={() => this.context.history.goBack() } >&#8592;</span> Tweet</h2>
		</StyledBox>
		
		<MessageComments messageId={this.props.match.params.msgId} />
	</div>
	);}
}







export default MessagePage;

