import React, { useContext } from 'react';
import styled from 'styled-components';
import InfiniteScroll from 'react-infinite-scroll-component';

import { MessageBox } from 'components/MessageBox';
import CloutContext from '../../cloutContext';
import roarAPI from '../../utils/api';

class Feed extends React.Component {
  static contextType = CloutContext;

  state = {
    items: [],
    currentHeight: 0,
  };

  /**
   * @dev fetch X messages below currentHeight
   */
  fetchMoreData = async () => {
    for (let k = 0; k < 5; k++) {
      if (this.state.currentHeight < 0) return;

      const item = await roarAPI.getMessage(this.state.currentHeight);
      const { items } = this.state;
      items.push(item);

      this.setState({ items });
      this.setState({ currentHeight: this.state.currentHeight - 1 });
    }
  };

  componentDidMount = async () => {
    const topMessage = await roarAPI.getHighestMessage();
    await this.setState({ currentHeight: topMessage - 1 });
    this.fetchMoreData();
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
          {this.state.items.map((item, index) => (
            <MessageBox
              key={item.id}
              message={item.URI}
              replyTo={item.replyId}
              comments={item.comments}
              messageId={item.id}
              ownerName={item.ownerName}
              tips={item.tips}
            />
          ))}
        </InfiniteScroll>
      </div>
    );
  }
}

export default Feed;
