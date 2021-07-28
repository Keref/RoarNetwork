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
import Modal from 'react-modal';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import { Feed } from 'components/Feed';
import { BiArrowBack } from 'react-icons/bi';
import CloutContext from '../../cloutContext';
import ProfileFinancials from './ProfileFinancials';
import BuySellBox from './BuySellBox';

import Banner from '../../images/banner.jpg';
import DefaultUser from '../../images/defaultuser.png';

import roarAPI from '../../utils/api';

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
  };

  updateState = async () => {
  	const profile = await roarAPI.getProfile(
  		this.props.match.params.userHandle,
  	);
  	console.log('Got profile info', profile);
  	this.setState({ profile });
  };

  static getDerivedStateFromProps(nextProps, prevState) {
  	if (nextProps.match.params.userHandle != prevState.userName)
  		return { userHandle: nextProps.match.params.userHandle };
  	return {};
  }

  componentDidMount = () => {
  	this.updateState();
  };

  componentDidUpdate = (prevProps, prevState) => {
  	console.log(
  		'prevProps',
  		this.props.match.params.userHandle,
  		prevProps,
  		prevState,
  	);
  	if (prevState.profile.statusCode != 404 && this.props.match.params.userHandle != prevState.profile.handle)
  		this.updateState();
  };

  toggleModal = () => {
  	this.setState({ isUpdateModalOpen: !this.state.isUpdateModalOpen });
  };



  RenderUpdateModal = () => (
  	<Modal
  		ariaHideApp={false}
  		isOpen={this.state.isUpdateModalOpen}
  		// onAfterOpen={afterOpenModal}
  		onRequestClose={this.toggleModal}
  		style={customStyles}
  		contentLabel="Example Modal"
  	>
  		<Button onClick={this.toggleModal} className="btn btn-light">
        X
  		</Button>
  		<Button onClick={this.toggleModal} style={{ float: 'right' }}>
        Save
  		</Button>
  		<div>Plop</div>
  	</Modal>
  );

  render() {
  	if ( this.state.profile.statusCode == 404 ){
  		return (
  			<div style={{ borderRight: '1px solid lightgrey', borderLeft: '1px solid lightgrey' }}>
  				<div>
  					<img src={Banner} style={{ width: '100%', height: 80 }} />
			
  					<IconButton  onClick={() => this.context.history.goBack()}>
  						<ArrowBackIcon />
  					</IconButton>

  					<img
  						src={this.state.profile.profilePicture || DefaultUser}
  						alt={this.state.profile.handle}
  						style={{
				  backgroundColor: 'white',
				  borderRadius: 5,
				  padding: 5,
				  marginLeft: 0,
				  marginTop: -20,
				  zIndex: 1,
				  width: 80,
				  height: 80,
  						}}
  					/>
  					<span>Profile Not Found</span>
  				</div>
  			</div>
  		)
  	}

  	return (
  		<div
  			style={{
  				borderRight: '1px solid lightgrey',
  				borderLeft: '1px solid lightgrey',
  			}}
  		>
  			<div>
  				<img src={Banner} style={{ width: '100%', height: 80 }} />
  				<IconButton  onClick={() => this.context.history.goBack()}>
  					<ArrowBackIcon />
  				</IconButton>

  				<img
  					src={this.state.profile.profilePicture || DefaultUser}
  					alt={this.state.profile.handle}
  					style={{
  						backgroundColor: 'white',
  						borderRadius: 5,
  						padding: 5,
  						marginLeft: 0,
  						marginTop: -20,
  						zIndex: 1,
  						width: 80,
  						height: 80,
  					}}
  				/>

  				{this.context.username == this.state.profile.handle ? (
  					<Button
  						style={{ float: 'right', marginRight: 10, marginTop: 10 }}
  						onClick={this.toggleModal}
  					>
              Update Profile
  					</Button>
  				) : (
            <>
              <a href="#">Follow</a>
              <a href="#">Stealth Follow</a>
            </>
  				)}
  				<this.RenderUpdateModal />
  				<StyledBox
  					style={{
  						marginLeft: 40,
  						marginRight: 10,
  						paddingLeft: 0,
  						flexDirection: 'column',
  					}}
  				>
  					<span style={{ fontSize: 25, fontWeight: 'bold' }}>
              @{this.state.profile.handle}
  					</span>
  					<br />
  					<span style={{}}>
  						{this.state.profile.description ||
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'}
  					</span>
  					<div
  						style={{
  							display: 'flex',
  							flexDirection: 'row',
  							justifyContent: 'space-between',
  							marginRight: 10,
  							marginTop: 10,
  							width: '100%',
  						}}
  					>
  						<span>0 Followers</span>
  						<span>0 Following</span>
  						<span>
                A{' '}
  							{this.context.address
  								? `${this.context.address.substring(0, 10)}...`
  								: '0x0'}
  						</span>
  					</div>
  				</StyledBox>
  				<StyledBox
  					style={{
  						marginLeft: 40,
  						marginRight: 10,
  						paddingLeft: 0,
  						flexDirection: 'row',
  						justifyContent: 'space-between',
  					}}
  				>
  					<ProfileFinancials profile={this.state.profile} />
            
  					<BuySellBox profile={this.state.profile} />
  				</StyledBox>
  				<div
  					style={{
  						height: 10,
  						backgroundColor: '#f5f5f5',
  						marginTop: 20,
  						marginBottom: 20,
  					}}
  				/>
  			</div>

  			{/* <Feed messages={this.state.messages} /> */}
  		</div>
  	);
  }
}

export default ProfilePage;
