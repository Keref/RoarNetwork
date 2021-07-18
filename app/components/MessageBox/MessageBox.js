import React, { useContext } from 'react';
import { FormattedMessage } from 'react-intl';

import ReactMarkdown from 'react-markdown';
import style from './markdown-styles.module.css';

import { FaImages, FaCode, FaRegComments } from 'react-icons/fa';
import { AiOutlineHeart, AiOutlineRetweet } from 'react-icons/ai';
import { GiPayMoney, GiTakeMyMoney } from 'react-icons/gi';
import { MdAttachMoney } from 'react-icons/md';

import Button from 'react-bootstrap/Button';
import Img from './Img';
import ActionIcons from './ActionIcons';

import DefaultUser from '../../images/defaultuser.png';
import CloutContext from "../../cloutContext";
import StyledBox from './StyledBox'
import PublishBox from '../PublishBox/PublishBox';

import Modal from 'react-modal';
import { useHistory } from "react-router-dom";



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
		hasTipped: false, //if ahs tipped, dont use prop but latest tip result
		tips: {},
	}
	
	toggleModal = () => {
		this.setState({ isCommentModalOpen: !this.state.isCommentModalOpen })
	}
	
	
	displayMessage = () => {
		var target = '/m/'+this.props.messageId
		if ( this.context.history.location.pathname != target )
			this.context.history.push('/m/'+this.props.messageId);
	}
	
	/// On publish message, this is callback with new message ID so we can display it.
	publishCallback = (messageId) => {
		//send it back up to the feed and close modal
		this.props.publishCallback(messageId);
		this.toggleModal();
	}
	
	
	RenderInterations = () => {
		var tipTotal = ( this.state.hasTipped ? (this.state.tips? this.state.tips.total : 0 ): (this.props.tips ? this.props.tips.total : 0 )) / 1000000000000000000;
		return (
			<div id="messagesInteractions" style={{ display: 'flex', justifyContent: 'space-between', marginRight: 20 }}>
				<ActionIcons
					style={{ display: 'flex', alignItems: 'center'}}
					onClick={(e) => { e.stopPropagation(); this.toggleModal()} }
				>
					<FaRegComments style={{color: '#aaaaaa', marginRight: 12 }}/>
					<span> {this.props.comments.length}</span>
				</ActionIcons>
				<ActionIcons
					style={{ display: 'flex', alignItems: 'center'}}
					onClick={(e) => { e.stopPropagation(); this.context.wallet.retweet(this.props.messageId)} }
				>
					<AiOutlineRetweet style={{color: '#aaaaaa', marginRight: 12 }} />
					<span> 1</span>
				</ActionIcons>
				<ActionIcons 
					style={{ display: 'flex', alignItems: 'center'}}
					onClick={async (e) => { 
						e.stopPropagation(); 
						let t = await this.context.wallet.sendTip(this.props.messageId); 
						t = await this.context.wallet.getTips(this.props.messageId); 
						this.setState({hasTipped: true}) ;
						this.setState({tips: t});
					}}
				>
					<MdAttachMoney style={{color: '#aaaaaa', marginRight: 12 }} />
					<span> {tipTotal}</span>
				</ActionIcons>
				<ActionIcons 
					style={{ display: 'flex', alignItems: 'center'}}
				>
					<AiOutlineHeart style={{color: '#aaaaaa', marginRight: 12 }} />
					<span> 1</span>
				</ActionIcons>
			</div>
		)
		
	}
	
	
	render(){
		let emphasize = {}
		if (this.props.emphasize) emphasize = {borderLeft: '4px solid blue' }
		
	return(
	<div style={emphasize}>
		<StyledBox onClick={this.displayMessage} style={{backgroundColor: 'white', }}>
			<a href="/profile">
				<Img src={DefaultUser} alt="react-boilerplate - Logo" />
			</a>
			<div style={{ flexGrow: 1 }}>
				<div id="messageContentHeader" style={{ }} onClick={ (e) => { e.stopPropagation(); this.context.history.push('/u/'+this.props.ownerName)}}>
					<span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Brick Stone Paper</span>
					<span style={{ marginLeft: 4, color: 'grey', fontSize: '0.9rem' }}>@{this.props.ownerName}</span>
					<span style={{ marginLeft: 4, color: 'grey', fontSize: '0.9rem' }}>. Jul 7</span>
				</div>
				<div style={{ marginTop: 4, marginBottom: 4 }} className="reactMarkDown">
					<ReactMarkdown 
						children={this.props.message} 
						className={style.reactMarkDown}
					/>

				</div>
				<this.RenderInterations />
			</div>
		</StyledBox>
		<Modal
			ariaHideApp={false}
			isOpen={this.state.isCommentModalOpen}
			//onAfterOpen={afterOpenModal}
			onRequestClose={this.toggleModal}
			style={customStyles}
			contentLabel="Example Modal"
		>
			
			<Button onClick={this.toggleModal} style={{ float: 'right' }}>X</Button>

			<StyledBox style={{ borderBottomWidth: 0 }} >
				<a href="/profile">
					<Img src={DefaultUser} alt="react-boilerplate - Logo" />
				</a>
				<div style={{ flexGrow: 1 }}>
					<div id="messageContentHeader" style={{ }}>
						<span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Brick Stone Paper</span>
						<span style={{ marginLeft: 4, color: 'grey', fontSize: '0.9rem' }}>@BrickPaper</span>
						<span style={{ marginLeft: 4, color: 'grey', fontSize: '0.9rem' }}>. Jul 7</span>
					</div>
					<div style={{ marginTop: 4, marginBottom: 4 }} className="reactMarkDown">
						<ReactMarkdown 
							children={this.props.message} 
							className={style.reactMarkDown}
						/>

					</div>
				</div>
			</StyledBox>
			<span style={{ fontSize: '0.8rem', }}>Replying to @BrickPaper</span>
			<PublishBox messageId={this.props.messageId} publishCallback={this.publishCallback} />
		</Modal>
	</div>
	)
	}
}


export default MessageBox;