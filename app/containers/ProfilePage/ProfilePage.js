/*
 * ProfilePage
 */

import React, { useEffect, memo } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { useParams } from 'react-router-dom';

import { MessageBox, StyledBox } from 'components/MessageBox';
import PublishBox from 'components/PublishBox/PublishBox';
import CloutContext from "../../cloutContext";

import Banner from '../../images/banner.jpg'
import DefaultUser from '../../images/defaultuser.png';

import Modal from 'react-modal';
import Button from 'react-bootstrap/Button';

import { Feed } from 'components/Feed';
import roarAPI from "../../utils/api";
import { BiArrowBack } from 'react-icons/bi';

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


class ProfilePage extends React.Component {
	static contextType = CloutContext;
	
	state = {
		userName: '',
		description: '',
		isUpdateModalOpen: false,
		messages: [],
		profile: {},
		
		buyOrSell: 'buy',
		amount: 0,
	}
	
	updateState = async () => {
		let profile = await roarAPI.getProfile(this.props.match.params.userHandle);
		console.log("Got profile info", profile)
		this.setState({ profile: profile })
	}

	
	static getDerivedStateFromProps (nextProps, prevState) {
		if (nextProps.match.params.userHandle != prevState.userName)
			return { userHandle: nextProps.match.params.userHandle }
		else 
			return {}
	}
	componentDidMount = () => {
		this.updateState()
	}
	
	componentDidUpdate = (prevProps, prevState) => {
		console.log("prevProps", this.props.match.params.userHandle, prevProps, prevState)
		if (this.props.match.params.userHandle != prevState.profile.handle)
			this.updateState()
	}
	
	toggleModal = () => {
		this.setState({ isUpdateModalOpen: !this.state.isUpdateModalOpen })
	}
	
	setDirection = (buyOrSell) => {
		this.setState({buyOrSell: buyOrSell}) 
	}
	updateAmount = (event) => { this.setState({amount: event.target.value}); }
	
	
	buySellTokens = async () => {
		//CHeck if balance enough
		var amountBought;
		if ( this.state.buyOrSell == 'buy' ){
			let amountBought = await this.context.wallet.buyTokens(this.state.amount, this.state.profile.profileAddress);
		}
		else {
			let valueSold = await this.context.wallet.sellTokens(this.state.amount, this.state.profile.profileAddress);
		}
	}
	
	
	RenderUpdateModal = () => {
		return (
		<Modal
			ariaHideApp={false}
			isOpen={this.state.isUpdateModalOpen}
			//onAfterOpen={afterOpenModal}
			onRequestClose={this.toggleModal}
			style={customStyles}
			contentLabel="Example Modal"
		>
			
			<Button onClick={this.toggleModal} className="btn btn-light">X</Button>
			<Button onClick={this.toggleModal} style={{ float: 'right' }}>Save</Button>
			<div>Plop</div>
		</Modal>
		)
	}

	render(){
		var sharePrice = parseFloat(this.state.profile.tokenValue ? this.state.profile.tokenSupply / this.state.profile.tokenValue : 0).toFixed(2);
		var peratio = ( this.state.profile.lifetimeDividends > 0 && this.state.profile.tokenValue / this.state.profile.lifetimeDividends )
	return (
	<div style={{ borderRight: "1px solid lightgrey", borderLeft: "1px solid lightgrey" }}>
		<div>
			<img src={Banner } style={{ width: "100%", height: 80 }} />
			<BiArrowBack onClick={() => this.context.history.goBack() }
				style={{ backgroundColor: 'white', marginTop: -20, marginLeft: 5, height: 30, width: 30, borderRadius: 15 }} /> 

			<img src={this.state.profile.profilePicture || DefaultUser} alt={this.state.profile.handle} style={{ backgroundColor: 'white', borderRadius: 5, padding: 5, marginLeft: 0, marginTop: -20, zIndex: 1, width: 80, height: 80}} />
			
			{ this.context.userName == this.state.profile.handle ?
				<Button style={{ float: 'right', marginRight: 10, marginTop: 10 }} onClick={this.toggleModal}>Update Profile</Button>
				: <>
					<a href="#">Follow</a>
					<a href="#">Stealth Follow</a>
				</>
			}
			<this.RenderUpdateModal />
			<StyledBox style={{ marginLeft: 40, marginRight: 10, paddingLeft: 0, flexDirection: 'column' }}>
				<span style={{fontSize: 25, fontWeight: 'bold' }}>@{this.state.profile.handle}</span>
				<br />
				<span style={{  }}>{this.state.profile.description || "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."}</span>
				<div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginRight: 10, marginTop: 10, width: '100%' }}>
					<span>0 Followers</span>
					<span>0 Following</span>
					<span>A {this.context.address ? this.context.address.substring(0,10)+'...' : '0x0' }</span>
				</div>
			</StyledBox>
			<StyledBox style={{ marginLeft: 40, marginRight: 10, paddingLeft: 0, flexDirection: 'row', justifyContent: 'space-between' }}>
				<div style={{ display: 'flex', flexDirection: 'column' }}>
					<span style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>Total Shares: 
						<img src={this.state.profile.profilePicture || DefaultUser} style={{ width: 20, height: 20, marginLeft: 5, marginRight: 5 }} />
						<span style={{fontSize: 18, fontWeight: 'bold' }}>{parseFloat((this.state.profile.tokenSupply||0) / 10**18).toFixed(2)} </span>
					</span>
					<span>Share Price: <span style={{fontSize: 18, fontWeight: 'bold' }}>$ {sharePrice} </span></span>
					<span>Dividends distributed: <span style={{fontSize: 18, fontWeight: 'bold' }}>$ {parseFloat(this.state.profile.lifetimeDividends || 0).toFixed(2)}</span></span>
					<span>PE ratio: <span style={{fontSize: 18, fontWeight: 'bold' }}>{peratio || <span style={{fontSize: 25}}>&#8734;</span>}</span></span>
				</div>
				<div style={{ display: 'flex', flexDirection: 'column' }}>
					<div style={{ display: 'flex', flexDirection: 'row', marginBottom: 10, justifyContent: 'space-between' }}>
						<div onClick={() => { this.setDirection('buy') } }
							style={{ backgroundColor: ( this.state.buyOrSell == 'buy' ? 'rgb(14, 203, 129)' : 'rgba(230, 232, 234, 0.6)' ), 
									color: ( this.state.buyOrSell == 'buy' ? 'white' : 'grey' ), 
									display: 'block', padding: '5px 25px 5px 25px', borderRadius: 5
								}}
						>Buy </div>
						<div onClick={() => { this.setDirection('sell') } }
							style={{ backgroundColor: ( this.state.buyOrSell == 'sell' ? 'rgb(248, 73, 96)' : 'rgba(230, 232, 234, 0.6)' ), 
									color: ( this.state.buyOrSell == 'sell' ? 'white' : 'grey' ), 
									display: 'block', padding: '5px 25px 5px 25px', borderRadius: 5,
									marginLeft: 20,
								}}
						>Sell </div>
					</div>
					<div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
						<input type='text' placeholder='Amount' style={{ marginBottom: 0}}
							onChange={ this.updateAmount }
						/>
						{ this.state.buyOrSell == 'buy'
							? <span style={{ marginLeft: -20 }}>$</span>
							: <img src={this.state.profile.profilePicture || DefaultUser} style={{ width: 20, height: 20, marginLeft: -30 }} />
						}

					</div>
					<span>Avail: 0</span>
					<Button onClick={ this.buySellTokens }>{this.state.buyOrSell}</Button>
				</div>
			</StyledBox>
			<div style={{ height: 10, backgroundColor: '#f5f5f5', marginTop: 20, marginBottom: 20 }}></div>

		</div>
		
		{/*<Feed messages={this.state.messages} />*/}
	</div>
	);}
}







export default ProfilePage;

