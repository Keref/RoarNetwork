/*
 * ProfilePage
 */

import React, { useEffect, memo } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { useParams } from 'react-router-dom';

import ReactMarkdown from 'react-markdown';


class DocPage extends React.Component {
	state = {
		docString: "",
	}
	
	componentDidMount = async () => {
		const doc = await fetch('/README.md')
			.then(response => response.text())
			.then(text => {
				return text;;
			});
		this.setState({ docString: doc });
	}
	
	render(){
	return (
	<div style={{	borderRight: "1px solid lightgrey", borderLeft: "1px solid lightgrey", padding: 10 }}>

		<ReactMarkdown 
			children={this.state.docString} 
			className="_old_docMarkdown"
		/>

	</div>
	);}
}







export default DocPage;

