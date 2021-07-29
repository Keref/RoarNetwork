import React from 'react';
import { FormattedMessage } from 'react-intl';

import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import messages from './messages';

class RightBar extends React.Component {
	render() {
		return (
			<Grid item sm={4} md={4}>
				<div style={{ padding: 10, borderBottom: 'solid 1px lightgrey' }}>
					<h3><FormattedMessage {...messages.suggestions} /></h3>
					<Typography>
						<Link href="/u/roar">Roar</Link>
						<br />
						<Link href="/u/0xCoffee">0xCoffee</Link>
						<br />
						<Link href="/u/roarNFT">RoarNFT</Link>
						<br />
						<Link href="/u/Eth.cc">Eth.cc</Link>
						<br />
					</Typography>
					<h3><FormattedMessage {...messages.trending} /></h3>
					<Typography>
            Crypto
						<br />
            Art
						<br />
            Olympics
						<br />
            Lorem ipsum
						<br />
					</Typography>
				</div>
			</Grid>
		);
	}
}

export default RightBar;
