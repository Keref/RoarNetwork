import React from 'react';
import { FormattedMessage } from 'react-intl';

import { withStyles, makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import LoginIcon from '@material-ui/icons/Input';
import LoginModal from '../LoginModal/LoginModal';

// import messages from './messages';


class LoginButton extends React.Component {
  state = {
  	isLoginVisible: false,
  };

  toggleLogin = () => {
  	this.setState(prevState => ({ isLoginVisible: !prevState.isLoginVisible }));
  };

  render() {
  	return (
  		<React.Fragment>
  			<Button variant="outlined" size="small" onClick={this.toggleLogin}>
  				<LoginIcon style={{marginRight: 8, fontSize: 15}} /> Login
  			</Button>
  			<LoginModal
  				isVisible={this.state.isLoginVisible}
  				toggle={this.toggleLogin}
  			/>
  		</React.Fragment>
  	);
  }
}

export default LoginButton;