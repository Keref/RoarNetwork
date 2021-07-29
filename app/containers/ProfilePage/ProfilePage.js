/*
 * ProfilePage
 */

import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {  StyledBox } from 'components/MessageBox';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
// import { Feed } from 'components/Feed';
import CloutContext from '../../cloutContext';
import ProfileFinancials from './ProfileFinancials';
import BuySellBox from './BuySellBox';
import messages from './messages';
import Banner from '../../images/banner.jpg';
import DefaultUser from '../../images/defaultuser.png';
import roarAPI from '../../utils/api';


class ProfilePage extends React.Component {
  static contextType = CloutContext;

  state = {
  	userName: '',
  	newName: '', 
  	isUpdateModalOpen: false,
  	profile: {},
  };

  updateState = async () => {
  	const profile = await roarAPI.getProfile(
  		this.props.match.params.userHandle,
  	);
  	console.log('Got profile info', profile);
  	this.setState({ profile });
  };

  static getDerivedStateFromProps(nextProps, prevState) {
  	if (nextProps.match.params.userHandle !== prevState.userName)
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
  	if (prevState.profile.statusCode !== 404 && this.props.match.params.userHandle !== prevState.profile.handle)
  		this.updateState();
  };

  toggleModal = () => {
  	this.setState(prevState => ({ isUpdateModalOpen: !prevState.isUpdateModalOpen }));
  };
  
  updateUsername = async () => {
	  if( !this.state.newName) return;
	  const profile = await this.context.wallet.changeProfileName(this.state.newName);
	  console.log(profile);
  }
  
  
  followUnfollow = async () => {
  	const addRemoveFollower = (this.context.following.includes(this.state.profile.profileAddress ) ? "removeFollower" : "addFollower" )
  	await this.context.wallet.follow(this.state.profile.profileAddress, addRemoveFollower);	
	
  }


  render() {
  	if ( this.state.profile.statusCode === 404 ){
  		return (
  			<div style={{ borderRight: '1px solid lightgrey', borderLeft: '1px solid lightgrey' }}>
  				<div>
  					<img src={Banner} style={{ width: '100%', height: 80 }} alt="Banner" />
			
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
  				<img src={Banner} style={{ width: '100%', height: 80 }} alt="banner" />
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

  				{this.context.username === this.state.profile.handle ? (
  					<Button
  						style={{ float: 'right', marginRight: 10, marginTop: 10 }}
  						onClick={this.toggleModal}
  						variant="contained"
  						color="primary"
  					>
  						<FormattedMessage {...messages.update_profile} />
  					</Button>
  				) : (
  					<Button
  						style={{ float: 'right', marginRight: 10, marginTop: 10 }}
  						onClick={this.followUnfollow}
  						variant="contained"
  						color="primary"
  					>
  						{ this.context.following.includes(this.state.profile.profileAddress ) ? 
  							<FormattedMessage {...messages.unfollow} />
  							: <FormattedMessage {...messages.follow} />
  						}
  					</Button>
  				)}
  				<Dialog
  					aria-labelledby="Update Profile"
  					aria-describedby="Update Profile"
  					open={this.state.isUpdateModalOpen}
  					// onAfterOpen={afterOpenModal}
  					onClose={this.toggleModal}
  					contentLabel="Update Profile"
  				>
  					<DialogTitle id="customized-dialog-title" onClose={this.toggleModal}>
  						<FormattedMessage {...messages.update_profile} />
  						<IconButton aria-label="close" style={{ position: 'absolute', right: 8, top: 8 }} onClick={this.toggleModal}>
  							<CloseIcon />
  						</IconButton>
  					</DialogTitle>
  					<DialogContent dividers>
  						<div style={{ marginTop: 20, display: 'flex' }}>
  							<TextField
  								name="username" 
  								onChange={e => {
  									this.setState({ newName: e.target.value });
  								}}
  								label=<FormattedMessage {...messages.username} /> variant="outlined" />
  							<Button variant="contained" color="primary" style={{ marginLeft: 20 }} onClick={this.updateUsername} >
  								<FormattedMessage {...messages.update_username} />
  							</Button>
  						</div>
  					</DialogContent>
  				</Dialog>
  				<StyledBox
  					style={{
  						marginLeft: 40,
  						marginRight: 10,
  						paddingLeft: 0,
  						flexDirection: 'column',
  					}}
  				>
  					<h2>@{this.state.profile.handle}</h2>
  					<span style={{}}>
  						{this.state.profile.description || <FormattedMessage {...messages.default_description} /> }
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
  						<span>0 <FormattedMessage {...messages.followers} /></span>
  						<span>0 <FormattedMessage {...messages.following} /></span>
  						<span>
  							<FormattedMessage {...messages.address} />
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


ProfilePage.propTypes = {
	match: PropTypes.object,
}


export default ProfilePage;
