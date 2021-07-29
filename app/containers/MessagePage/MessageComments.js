import React, { useContext } from 'react';

import styled from 'styled-components';
import InfiniteScroll from 'react-infinite-scroll-component';

import { MessageBox } from 'components/MessageBox';
import CloutContext from '../../cloutContext';
import roarAPI from '../../utils/api';

class MessageComments extends React.Component {
  static contextType = CloutContext;

  state = {
  	mainMessage: {},
  	items: [],
  	currentHeight: 0,
  };

  /**
   * @dev fetch X messages below currentHeight
   */
  fetchComments = async () => {
  	//

  	console.log(
  		'fetch all comments, paginate another time',
  		this.state.mainMessage,
  	);
  	const lacheTesComs = this.state.mainMessage.comments.length;
  	for (let k = lacheTesComs - 1; k >= 0; k--) {
  		const item = await roarAPI.getMessage(this.state.mainMessage.comments[k]);
  		const { items } = this.state;
  		items.push(item);
  		this.setState({ items });
  	}
  };

  fetchMessage = async () => {
  	const item = await roarAPI.getMessage(this.props.messageId);
  	this.setState({ currentHeight: item.comments.length });
  	await this.setState({ mainMessage: item });

  	this.fetchComments();
  };

  componentDidMount = () => {
  	// console.log("MessageId", this.props.messageId)
  	this.fetchMessage();
  };

  render() {
  	return (
  		<div id="scrollableDiv">
  			<InfiniteScroll
  				dataLength={this.state.items.length}
  				next={this.fetchMoreData}
  				style={{ display: 'flex', flexDirection: 'column' }}
  				hasMore
  				loader={<h4>Loading...</h4>}
  			>
  				<MessageBox
  					key={this.props.messageId}
  					message={this.state.mainMessage.URI}
  					replyTo={this.state.mainMessage.replyId}
  					comments={this.state.mainMessage.comments || []}
  					messageId={this.state.mainMessage.messageId}
  					ownerName={this.state.mainMessage.ownerName}
  					emphasize
  				/>
  				{this.state.items.map((item, index) => (
  					<MessageBox
  						key={item.messageId}
  						message={item.URI}
  						replyTo={item.replyToId}
  						comments={item.comments}
  						messageId={item.id}
  						ownerName={item.ownerName}
  					/>
  				))}
  			</InfiniteScroll>
  		</div>
  	);
  }
}

export default MessageComments;
