/**
 * app.js
 *
 * This is the entry file for the application, only setup and boilerplate
 * code.
 */

// Needed for redux-saga es6 generator support
import '@babel/polyfill';

// Import all the third party stuff
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import FontFaceObserver from 'fontfaceobserver';
import history from 'utils/history';
import 'sanitize.css/sanitize.css';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'milligram/dist/milligram.css';

// Import root app
import App from 'containers/App';

// Import Language Provider
import LanguageProvider from 'containers/LanguageProvider';

// Import web3 wallet and functions
import Wallet from 'utils/wallet';
import CloutContext from './cloutContext';

// Load the favicon and the .htaccess file
import '!file-loader?name=[name].[ext]!./images/favicon.ico';
import 'file-loader?name=.htaccess!./.htaccess'; // eslint-disable-line import/extensions
import 'file-loader?name=README.md!./doc/README.md';

import configureStore from './configureStore';

// Import i18n messages
import { translationMessages } from './i18n';
const wallet = new Wallet();

// Observe loading of Open Sans (to remove open sans, remove the <link> tag in
// the index.html file and this observer)
const openSansObserver = new FontFaceObserver('Open Sans', {});

// When Open Sans is loaded, add a font-family using Open Sans to the body
openSansObserver.load().then(() => {
	document.body.classList.add('fontLoaded');
});

// Create redux store with history
const initialState = {};
const store = configureStore(initialState, history);
const MOUNT_NODE = document.getElementById('app');

const render = messages => {
	ReactDOM.render(<MainApp messages={messages} />, MOUNT_NODE);
};

class MainApp extends React.Component {
	constructor() {
		super();
		/* eslint react/no-unused-state: 0 */
		this.state = {
			username: '',
			address: '',
			wallet,
			history,
			profile: {},
			following: [],
			updateProfile: this.updateProfile,
		};
	}

  updateProfile = async (params) => {
  	// console.log('Got profile update', userName, address, profile);
  	if ( params.username ) this.setState({ username: params.username });
  	if ( params.address ) this.setState({ address: params.address });
  	if ( params.profile ) this.setState({ profile: params.profile });
  	if ( params.following ) this.setState({ following: params.following });
  };

  componentDidMount = () => {
  	this.state.wallet.setUpdateProfileCallback(this.updateProfile);
  };

  render() {
  	return (
  		<Provider store={store}>
  			<CloutContext.Provider value={this.state}>
  				<LanguageProvider messages={this.props.messages}>
  					<ConnectedRouter history={history}>
  						<App />
  					</ConnectedRouter>
  				</LanguageProvider>
  			</CloutContext.Provider>
  		</Provider>
  	);
  }
}

MainApp.propTypes = {
	messages: PropTypes.object,
}

if (module.hot) {
	// Hot reloadable React components and translation json files
	// modules.hot.accept does not accept dynamic dependencies,
	// have to be constants at compile-time
	module.hot.accept(['./i18n', 'containers/App'], () => {
		ReactDOM.unmountComponentAtNode(MOUNT_NODE);
		render(translationMessages);
	});
}

// Chunked polyfill for browsers without Intl support
if (!window.Intl) {
	new Promise(resolve => {
		resolve(import('intl'));
	})
		.then(() =>
			Promise.all([
        import('intl/locale-data/jsonp/en.js'),
        import('intl/locale-data/jsonp/de.js'),
			]),
		) // eslint-disable-line prettier/prettier
		.then(() => render(translationMessages))
		.catch(err => {
			throw err;
		});
} else {
	render(translationMessages);
}

// Install ServiceWorker and AppCache in the end since
// it's not most important operation and if main code fails,
// we do not want it installed
if (process.env.NODE_ENV === 'production') {
	require('offline-plugin/runtime').install(); // eslint-disable-line global-require
}
