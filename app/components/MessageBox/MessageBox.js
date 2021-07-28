import React from 'react';
import PropTypes from 'prop-types';

import { FaRegComments } from 'react-icons/fa';
import { AiOutlineHeart, AiOutlineRetweet } from 'react-icons/ai';

import { MdAttachMoney } from 'react-icons/md';
import Button from '@material-ui/core/Button';
import Modal from 'react-modal';

import ActionIcons from './ActionIcons';

import CloutContext from '../../cloutContext';
import PublishBox from '../PublishBox/PublishBox';
import Message from './Message';

const customStyles = {
	content: {
		top: '50%',
		left: '50%',
		right: 'auto',
		bottom: 'auto',
		marginRight: '-50%',
		transform: 'translate(-50%, -50%)',
		width: 600,
	},
};

/**
 * MessageBox displays a message with type and owner props
 */
class MessageBox extends React.Component {
  static contextType = CloutContext;

  state = {
  	isCommentModalOpen: false,
  	hasTipped: false, // if ahs tipped, dont use prop but latest tip result
  	tips: {},
  };

  toggleModal = () => {
  	this.setState(prevState => ({
  		isCommentModalOpen: !prevState.isCommentModalOpen,
  	}));
  };

  displayMessage = () => {
  	const target = `/m/${this.props.messageId}`;
  	if (this.context.history.location.pathname !== target)
  		this.context.history.push(`/m/${this.props.messageId}`);
  };

  // / On publish message, this is callback with new message ID so we can display it.
  publishCallback = messageId => {
  	// send it back up to the feed and close modal
  	if ( this.props.publishCallback) this.props.publishCallback(messageId);
  	console.log("commented ", messageId, " to post ", this.props.messageId)
  	this.toggleModal();
  };

  RenderInterations = () => {
  	let tipTotal;
  	if (this.state.hasTipped)
  		tipTotal = this.state.tips ? this.state.tips.total : 0;
  	else
  		tipTotal =
        (this.props.tips ? this.props.tips.total : 0) / 1000000000000000000;

  	return (
  		<div
  			id="messagesInteractions"
  			style={{
  				display: 'flex',
  				justifyContent: 'space-between',
  				marginRight: 20,
  			}}
  		>
  			<ActionIcons
  				style={{ display: 'flex', alignItems: 'center' }}
  				onClick={e => {
  					e.stopPropagation();
  					this.toggleModal();
  				}}
  			>
  				<FaRegComments style={{ color: '#aaaaaa', marginRight: 12 }} />
  				<span> {this.props.comments.length}</span>
  			</ActionIcons>
  			<ActionIcons
  				style={{ display: 'flex', alignItems: 'center' }}
  				onClick={e => {
  					e.stopPropagation();
  					this.context.wallet.retweet(this.props.messageId);
  				}}
  			>
  				<AiOutlineRetweet style={{ color: '#aaaaaa', marginRight: 12 }} />
  				<span> 1</span>
  			</ActionIcons>
  			<ActionIcons
  				style={{ display: 'flex', alignItems: 'center' }}
  				onClick={async e => {
  					e.stopPropagation();
  					let t = await this.context.wallet.sendTip(this.props.messageId);
  					t = await this.context.wallet.getTips(this.props.messageId);
  					this.setState({ hasTipped: true });
  					this.setState({ tips: t });
  				}}
  			>
  				<MdAttachMoney style={{ color: '#aaaaaa', marginRight: 12 }} />
  				<span> {tipTotal}</span>
  			</ActionIcons>
  			<ActionIcons style={{ display: 'flex', alignItems: 'center' }}>
  				<AiOutlineHeart style={{ color: '#aaaaaa', marginRight: 12 }} />
  				<span> 1</span>
  			</ActionIcons>
  		</div>
  	);
  };

  render() {
  	let emphasize = {};
  	if (this.props.emphasize) emphasize = { borderLeft: '4px solid blue' };

  	return (
  		<div style={emphasize}>
  			<Message
  				{...this.props}
  				interactions={<this.RenderInterations />}
  				displayMessage={this.displayMessage}
  			/>

  			<Modal
  				ariaHideApp={false}
  				isOpen={this.state.isCommentModalOpen}
  				// onAfterOpen={afterOpenModal}
  				onRequestClose={this.toggleModal}
  				style={customStyles}
  				contentLabel="Example Modal"
  			>
  				<Button onClick={this.toggleModal} style={{ float: 'right' }}>
            X
  				</Button>

  				<Message {...this.props} interactions={<></>} />

  				<span style={{ fontSize: '0.8rem' }}>Replying to @BrickPaper</span>

  				<PublishBox
  					messageId={this.props.messageId}
  					publishCallback={this.publishCallback}
  				/>
  			</Modal>
  		</div>
  	);
  }
}

MessageBox.propTypes = {
	messageId: PropTypes.string,
	tips: PropTypes.object,
	comments: PropTypes.array,
	emphasize: PropTypes.bool,
	ownerName: PropTypes.string,
	message: PropTypes.string,
	publishCallback: PropTypes.func,
};

export default MessageBox;
