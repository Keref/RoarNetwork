import React, { useContext } from 'react';
import { FormattedMessage } from 'react-intl';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import messages from './messages';
import CloutContext from '../../cloutContext';
import StyledBox from '../MessageBox/StyledBox';
import LoginModal from '../LoginModal/LoginModal';

class WelcomeBox extends React.Component {
  state = {
    isLoginOpen: false,
  };

  toggleLogin = () => {
    this.setState({ isLoginOpen: !this.state.isLoginOpen });
  };

  render() {
    return (
      <StyledBox>
        <h2>Welcome</h2>

        <Typography>This is a great news</Typography>

        <Button variant="contained" color="primary" href="/login">
          Login
        </Button>

        <LoginModal
          toggle={this.toggleLogin}
          isVisible={this.state.isLoginOpen}
        />
      </StyledBox>
    );
  }
}

export default WelcomeBox;
