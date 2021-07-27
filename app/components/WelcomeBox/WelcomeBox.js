import React from 'react';
import { FormattedMessage } from 'react-intl';

import Typography from '@material-ui/core/Typography';
import messages from './messages';
import StyledBox from '../MessageBox/StyledBox';
import LoginButton from '../LoginButton/LoginButton';

export default function WelcomeBox () {
  	return (
  		<StyledBox>
  			<h2><FormattedMessage {...messages.welcome} /></h2>

  			<Typography><FormattedMessage {...messages.content} /></Typography>

  			<LoginButton />
  		</StyledBox>
  	);
}
