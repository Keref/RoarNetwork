/*
 * Displays a message and the comments
 */

import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { StyledBox } from 'components/MessageBox';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import messages from './messages';
import MessageComments from './MessageComments';
import CloutContext from '../../cloutContext';

class MessagePage extends React.Component {
  static contextType = CloutContext;

  render() {
  	return (
  		<div
  			style={{
  				borderRight: '1px solid lightgrey',
  				borderLeft: '1px solid lightgrey',
  			}}
  		>
  			<StyledBox>
  				<h2 style={{ padding: 12, margin: 0 }}>
  					<IconButton  onClick={() => this.context.history.goBack()}>
  						<ArrowBackIcon />
  					</IconButton>
  					<FormattedMessage {...messages.header} />
  				</h2>
  			</StyledBox>

  			<MessageComments messageId={this.props.match.params.msgId} />
  		</div>
  	);
  }
}

MessagePage.propTypes = {
	match: PropTypes.object,
};

export default MessagePage;
