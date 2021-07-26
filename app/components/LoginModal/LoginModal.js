import React from 'react';

import Link from '@material-ui/core/Link';
import CircularProgress from '@material-ui/core/CircularProgress';
import { AiOutlineTwitter } from 'react-icons/ai';
import Button from '@material-ui/core/Button';

import Modal from 'react-modal';
import { ethers } from 'ethers';
import CloutContext from '../../cloutContext';
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

class LoginModal extends React.Component {
  static contextType = CloutContext;

  state = {
    mnemonic: '',
    randomString: 'dummyWillReplace',
    signature: '',
    address: '',
    isLoginDisabled: true,
    isGenerating: false,
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
    console.log('gotprofsdf', profile);
    // if no seed found locally nor in login information, cant do anything, destroy session and start afresh
    if (!myMnemonic && !profile.mnemonic) {
      roarAPI.logout();
      this.context.wallet.logout();
    } else if (profile.status == 'success') {
      this.context.updateProfile(profile.username, profile.address);
      this.context.wallet.importMnemonic(myMnemonic || profile.mnemonic);
    } else {
      // we have a mnemonic, but we've been logged out of the server, use mnemonic to log in with signature
      this.checkMnemonic(myMnemonic || profile.mnemonic);
      this.login();
    }
  };

  // / Check if the textarea contains a valid mnemonic, in which case generate the wallet and allow login
  checkMnemonic = async mnemonic => {
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
      this.setState({ isLoginDisabled: false });
      this.setState({ isGenerating: false });
    } catch (error) {
      this.setState({ isLoginDisabled: true });
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
    if (profile.status == 'success') {
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

  loginOrLogout = e => {
    if (this.context.address == '') this.props.toggle();
    else this.logout();
  };

  render() {
    return (
      <Modal
        ariaHideApp={false}
        isOpen={this.props.isVisible}
        // onAfterOpen={afterOpenModal}
        onRequestClose={this.props.toggle}
        style={customStyles}
        contentLabel="Login / Register"
      >
        <Button onClick={this.props.toggle} style={{ float: 'right' }}>
          X
        </Button>
        <h1>Login / Register</h1>
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
        <div>
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
            disabled={this.state.isLoginDisabled}
          >
            {' '}
            Log in
          </Button>
        </div>
        OR
        <br />
        <br />
        <Button href="/auth/twitter">
          <AiOutlineTwitter />
          Sign in with Twitter
        </Button>
        <br />
        <br />
      </Modal>
    );
  }
}

export default LoginModal;
