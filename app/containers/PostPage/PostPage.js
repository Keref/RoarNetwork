/*
 * ProfilePage
 */

import React, { useEffect, memo } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { useParams } from 'react-router-dom';

//import ReactMarkdown from 'react-markdown';
import Editor from "rich-markdown-editor";

import CloutContext from "../../cloutContext";


class DocPage extends React.Component {
	static contextType = CloutContext;
	state = {
		docString: "",
		postContent: "",
		postOrigContent: "",
	}
	
	componentDidMount = async () => {
		var plip = `# Title  
> Type an up to 200 characters abstract as a blockquote.


Wonderful thougts...

## Heading 2

`
		this.setState({postOrigContent: plip});
	}
	
	
	savePost = () => {
		console.log("should show mardown content", this.state.postContent);
		this.context.wallet.sendMessage(this.state.postContent);
	}
	
	render(){

	return (
	<div style={{	borderRight: "1px solid lightgrey", borderLeft: "1px solid lightgrey", padding: "1em 2em" }}>
		<input type="button" className="btn btn-primary" value="Publish" onClick={this.savePost} />
		<Editor

			onChange={ (value) => {this.setState({ postContent: value() })} }
			value={this.state.postOrigContent}
			uploadImage={file => {
				console.log("File upload triggered: ", file);

				// Delay to simulate time taken to upload
				return new Promise(resolve => {
				setTimeout(() => resolve(URL.createObjectURL(file)), 1500);
				});
			}}
		/>

	</div>
	);}
}







export default DocPage;

