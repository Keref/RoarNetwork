/*
 * SettingsPage
 */

import React, { useEffect, memo } from 'react';
// import PropTypes from 'prop-types';
// import { Helmet } from 'react-helmet';
// import { FormattedMessage } from 'react-intl';
// import { useParams } from 'react-router-dom';


import CloutContext from "../../cloutContext";


class SettingsPage extends React.Component {
	static contextType = CloutContext;

	state = {
		saveSettings: ""
	}
	
	componentDidMount = async () => {

	}
	
	
	saveSettings = () => {
		console.log("Settings saved", this.state.saveSettings);
		this.context.wallet.sendMessage(this.state.saveSettings);
	}
	
	render(){

		return (
			<div style={{	borderRight: "1px solid lightgrey", borderLeft: "1px solid lightgrey", padding: "1em 2em" }}>
				<div>
					<h2>Settings</h2>
					<div>
						<h3>Private messages</h3>
        
					</div>
				</div>
				<input type="button" className="btn btn-primary" value="Save Settings" onClick={this.saveSettings} />
			</div>
		);}
}



export default SettingsPage;

