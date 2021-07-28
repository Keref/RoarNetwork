import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import CircularProgress from '@material-ui/core/CircularProgress';

import TwitterIcon from '@material-ui/icons/Twitter';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Toolbar from '@material-ui/core/Toolbar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import { ethers } from 'ethers';
import CountrySelect from './CountrySelect';
import messages from './messages';

import CloutContext from '../../cloutContext';
import roarAPI from '../../utils/api';


const withMediaQuery = (...args) => Component => props => {
	const mediaQuery = useMediaQuery(...args);
	return <Component mediaQuery={mediaQuery} {...props} />;
};






class LoginModal extends React.Component {
  static contextType = CloutContext;

  state = {
  	mnemonic: '',
  	randomString: 'dummyWillReplace',
  	signature: '',
  	address: '',
  	isSeedLoginDisabled: true,
  	isGenerating: false,
  	value: 0,
  	country: '',
  };

  componentDidMount = async () => {
  	this.checkLogin();
  };

  /**
   * @dev checkLogin
   * Check session with server, check seed locally
   */
  checkLogin = async () => {
  	// Check local keys
  	const myMnemonic = localStorage.getItem('RoarUserMnemonic');

  	// on oaut login callback, it will be logged in but without mnemonic, which is provided by the server, so need to check login first
  	const profile = await roarAPI.login();

  	// if no seed found locally nor in login information, cant do anything, destroy session and start afresh
  	if (!myMnemonic && !profile.mnemonic) {
  		this.context.wallet.logout();
  		roarAPI.logout();
  	} else if (profile.status === 'success') {
  		this.context.wallet.importMnemonic(
  			myMnemonic || profile.mnemonic,
  			profile.username,
  		);
  	} else {
  		// we have a mnemonic, but we've been logged out of the server, use mnemonic to log in with signature
  		this.checkMnemonic(myMnemonic || profile.mnemonic, this.login);
  	}
  };

  // / Check if the textarea contains a valid mnemonic, in which case generate the wallet and allow login
  checkMnemonic = async (mnemonic, callback) => {
  	console.log("checking mnemo", mnemonic)
  	try {
  		// will fail if mnemonic aint valid
  		const wallet = ethers.Wallet.fromMnemonic(mnemonic);

  		localStorage.setItem('RoarUserPrivateKey', wallet.privateKey);
  		localStorage.setItem('RoarUserMnemonic', mnemonic);
  		localStorage.setItem('RoarUserAddress', wallet.address);

  		const randomString = ethers.utils.base64.encode(
  			ethers.utils.randomBytes(32),
  		);
  		this.setState({ randomString });
  		const msg = `${randomString}.ROAR.${wallet.address}`;
  		const signature = await wallet.signMessage(msg);

  		this.setState({ signature });
  		this.setState({ address: wallet.address });
	  console.log('wtf')
  		this.setState({ isSeedLoginDisabled: false });
  		this.setState({ isGenerating: false });
	  if( callback ) callback();
  	} catch (error) {
  		this.setState({ isSeedLoginDisabled: true });
  	}
  };

  generateMnemonic = async () => {
  	await this.setState({ isGenerating: true });
  	const newMnem = ethers.Wallet.createRandom().mnemonic;

  	this.setState({ mnemonic: newMnem.phrase });
  	this.checkMnemonic(newMnem.phrase);
  };

  // / Login
  login = async () => {
  	const profile = await roarAPI.login(
  		this.state.address,
  		this.state.signature,
  		this.state.randomString,
  	);
  	// console.log(profile);
  	if (profile.status === 'success') {
  		// display vars
  		this.context.updateProfile(profile.username, profile.address);
  		// setup wallet
  		this.context.wallet.importMnemonic(this.state.mnemonic, profile.username);
  		// this.setState({ isLoginModalOpen: false });
  		this.props.toggle();
  	}
  };

  // / Logout - delete local keys and asks server to delete session
  logout = async () => {
  	this.context.wallet.logout();
  	roarAPI.logout();
  };

  loginOrLogout = () => {
  	if (this.context.address === '') this.props.toggle();
  	else this.logout();
  };
  
  handleTabChange = (event, newValue) => {
	  this.setState({value: newValue})
  }
  
  inputCountry = (country) => {
	  this.setState({country});
  }
  
  getCode = async () => {
	  // checks
	  if (!this.state.country) return;
	  
	  await roarAPI.getCode({phone: this.state.phone, countryCode: this.state.country.phone});
	  // start timer
  }

  sendCode = async () => {
	  if (!this.state.phone2fa || !this.state.phone || !this.state.country ) return;
	  console.log('loginwith',{phone: this.state.phone, countryCode: this.state.country.phone, phone2fa: this.state.phone2fa})
	  const profile = await roarAPI.loginWithCode({phone: this.state.phone, countryCode: this.state.country.phone, phone2fa: this.state.phone2fa});
	  if (profile.status === 'success') {
		  // setup wallet
		  this.context.wallet.importMnemonic(profile.mnemonic, profile.username);
		  this.props.toggle();
  	}
  }
  

  render() {
	  const {value} = this.state;
  	const fullScreen = !this.props.mediaQuery;
  	return (
  		<Dialog
  			fullScreen={fullScreen}
  			aria-labelledby="Login / Register"
  			aria-describedby="Login-Register Modal"
  			open={this.props.isVisible}
  			onClose={this.props.toggle}

  		>
  			<DialogTitle id="customized-dialog-title" onClose={this.props.toggle}>
  				<FormattedMessage {...messages.title} />
  				<IconButton aria-label="close" style={{ position: 'absolute', right: 8, top: 8 }} onClick={this.props.toggle}>
  					<CloseIcon />
  				</IconButton>
  			</DialogTitle>
  			<DialogContent dividers>
  				<Toolbar position="static">
  					<Tabs value={value} onChange={this.handleTabChange} aria-label="simple tabs example">
  						<Tab label="Phone" id="simple-tab-0" aria-controls="simple-tabpanel-0" />
  						<Tab label="Seed"  id="simple-tab-1" aria-controls="simple-tabpanel-1"/>
  						<Tab label="Social Login"  id="simple-tab-2" aria-controls="simple-tabpanel-2" />
  					</Tabs>
  				</Toolbar>
			
  				<div
  					role="tabpanel"
  					hidden={value !== 0}
  					id="simple-tabpanel-0"
  					aria-labelledby="simple-tab-0" value={value} index={0}>
  					<div style={{ marginTop: 20, display: 'flex' }}>
  						<CountrySelect change={this.inputCountry} label=<FormattedMessage {...messages.select_country} /> />
  					</div>
  					<div style={{ marginTop: 20, display: 'flex' }}>
  						<TextField
  							id="phone"  
  							onChange={e => {
  								this.setState({ phone: e.target.value });
  							}}
  							label=<FormattedMessage {...messages.phone_number} /> variant="outlined" />
  						<Button variant="contained" color="primary" style={{ marginLeft: 20 }} onClick={this.getCode}><FormattedMessage {...messages.get_code} /></Button>
  					</div>
				
  					<div style={{ marginTop: 20, display: 'flex' }}>
  						<TextField
  							id="phone2fa" 
  							onChange={e => {
  								this.setState({ phone2fa: e.target.value });
  							}}
  							label=<FormattedMessage {...messages.enter_code} /> variant="outlined" />
  						<Button variant="contained" color="primary" style={{ marginLeft: 20 }} onClick={this.sendCode} ><FormattedMessage {...messages.log_in} /></Button>
  					</div>
  				</div>
			
			
  				<div
  					role="tabpanel"
  					hidden={value !== 1}
  					id="simple-tabpanel-1"
  					aria-labelledby="simple-tab-1" value={value} index={1}>
  					<div style={{ padding: 20 }}>
					  <textarea
  							id="mnemonic"
  							placeholder="Enter your mnemonic"
  							value={this.state.mnemonic}
  							onChange={e => {
						  this.setState({ mnemonic: e.target.value });
						  this.checkMnemonic(e.target.value);
  							}}
  							style={{
						  width: '100%',
						  resize: 'none',
						  borderRadius: '10px',
						  padding: 5,
  							}}
  							rows="3"
					  />
  					</div>
  					<div style={{ padding: 20, display: 'flex', justifyContent: 'space-between' }}>
					  <Button
  							variant="contained"
  							color="primary"
  							onClick={this.generateMnemonic}
					  >
  							{this.state.isGenerating ? (
						  <CircularProgress />
  							) : (
						  'Generate New Mnemonic'
  							)}
					  </Button>
					  <Button
  							variant="contained"
  							color="primary"
  							onClick={this.login}
  							disabled={this.state.isSeedLoginDisabled}
					  >
						Log in
					  </Button>
  					</div>
  				</div>
			
  				<div
  					role="tabpanel"
  					hidden={value !== 2}
  					id="simple-tabpanel-2"
  					aria-labelledby="simple-tab-2" value={value} index={2}
  				>
  					<div  style={{ marginTop: 20, display: 'flex', justifyContent: 'center' }} >
  						<Button href="/auth/twitter" variant="contained" color="primary">
  							<TwitterIcon style={{ color: "#ffffff", marginRight: 8}}/>
						Sign in with Twitter
  						</Button>
  					</div>
  				</div>
  			</DialogContent>
  		</Dialog>
  	);
  }
}


LoginModal.propTypes = {
	toggle: PropTypes.func,
	mediaQuery: PropTypes.bool,
	isVisible: PropTypes.bool,
};




export default (withMediaQuery('(min-width:600px)')(LoginModal));
