import React, { useContext } from 'react';
import { FormattedMessage } from 'react-intl';
import { FaImages, FaCode } from 'react-icons/fa';

import A from './A';
import Img from './Img';
import DefaultUser from '../../images/defaultuser.png';
import ButtonBar from './ButtonBar';
import HeaderLink from './HeaderLink';
import messages from './messages';
import CloutContext from "../../cloutContext";
import StyledBox from '../MessageBox/StyledBox'
import Button from 'react-bootstrap/Button';

function PublishBox(props) {
	return (
		<Publish messageId={props.messageId} />
	);
}

class Publish extends React.Component {
	static contextType = CloutContext;
	
	state = {
		value: '',
	}
	
	sendMessage = async () => {
		console.log("tweeting", this.state.value, "answer to", this.props.messageId);
		var messageId = await this.context.wallet.sendMessage(this.state.value, this.props.messageId);
		if (this.props.publishCallback) this.props.publishCallback(messageId);
	}
	
	render(){
		return (
	
	<StyledBox >
		<A href={"/u/"+this.context.wallet.userName}>
			<Img src={DefaultUser} alt="User Profile Pic" />
		</A>
		<div style={{ flexGrow: 1 }}>
			<textarea
				rows="4"
				style={{  }}
				id="newMessage" 
				placeholder="What's on your mind..." 
				onChange={(e) => this.setState({value: e.target.value}) }
				value={this.state.value}
				style={{ boxSizing: 'border-box', height: '100%', border: '1px solid lightgrey', width: '100%', resize: 'none', borderRadius: 4, padding: 4 }}
			>
			</textarea>
			
			<ButtonBar >
				<FaCode style={{ color: 'grey', fontSize: '1.2rem', marginRight: 12 }} />
				<FaImages style={{ color: 'grey', fontSize: '1.2rem', marginRight: 12 }} />
				<Button onClick={()=>this.sendMessage()} >Submit</Button>
			</ButtonBar>
		</div>
	</StyledBox>
		)
	}
}

export default PublishBox;
