/*
 * New MarkDown Post Page
 */
 
import React from 'react';
import { FormattedMessage } from 'react-intl';

import Button from '@material-ui/core/Button';
import Editor from "rich-markdown-editor";
import messages from './messages';

// import ReactMarkdown from 'react-markdown';

import CloutContext from "../../cloutContext";


class DocPage extends React.Component {
	static contextType = CloutContext;

	state = {
		postContent: "",
		postOrigContent: "",
	}
	
	componentDidMount = async () => {
		const plip = `# Title  
> Type an up to 200 characters abstract as a blockquote.


Wonderful thougts...

## Heading 2

`
		this.setState({postOrigContent: plip});
	}
	
	
	savePost = async () => {
		const mid = await this.context.wallet.sendMessage(this.state.postContent);
		console.log('sent messge got id', mid)
		this.context.history.push(`/m/${mid}`);
	}
	
	render(){

		return (
			<div style={{	borderRight: "1px solid lightgrey", borderLeft: "1px solid lightgrey", padding: "1em 2em" }}>
				<div style={{ display: 'flex', justifyContent: 'space-between' }}>
					<h2 style={{ margin: 0, paddingRight: 120, borderBottom: '1px solid pink', }}><FormattedMessage {...messages.title} /></h2>
					<Button variant="contained" color="primary" onClick={this.savePost} ><FormattedMessage {...messages.publish} /></Button>
				</div>
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

