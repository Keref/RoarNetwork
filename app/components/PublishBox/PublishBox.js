import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { FaImages, FaCode } from 'react-icons/fa';

import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import Link from '@material-ui/core/Link';

import ButtonBar from './ButtonBar';
import messages from './messages';
import CloutContext from '../../cloutContext';
import StyledBox from '../MessageBox/StyledBox';

class PublishBox extends React.Component {
  static contextType = CloutContext;

  state = {
    value: '',
  };

  sendMessage = async () => {
    /* console.log(
      'tweeting',
      this.state.value,
      'answer to',
      this.props.messageId,
    ); */
    const messageId = await this.context.wallet.sendMessage(
      this.state.value,
      this.props.messageId,
    );

    if (this.props.publishCallback) this.props.publishCallback(messageId);
  };

  render() {
    return (
      <StyledBox>
        <div
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start',
          }}
        >
          <Link href="/profile">
            <Avatar src="../../images/defaultuser.png" alt="User Profile Pic" />
          </Link>
          <div style={{ flexGrow: 1 }}>
            <div>
              <Button color="primary">
                <FormattedMessage {...messages.tweet} />
              </Button>
              <Button href="/post">
                <FormattedMessage {...messages.post} />
              </Button>
            </div>
            <textarea
              rows="4"
              id="newMessage"
              placeholder="What's on your mind..."
              onChange={e => this.setState({ value: e.target.value })}
              value={this.state.value}
              style={{
                boxSizing: 'border-box',
                height: '100%',
                border: '1px solid lightgrey',
                width: '100%',
                resize: 'none',
                borderRadius: 4,
                padding: 4,
              }}
            />
          </div>
        </div>

        <ButtonBar style={{ alignSelf: 'flex-end' }}>
          <FaCode
            style={{ color: 'grey', fontSize: '1.2rem', marginRight: 12 }}
          />
          <FaImages
            style={{ color: 'grey', fontSize: '1.2rem', marginRight: 12 }}
          />
          <Button onClick={() => this.sendMessage()}>Submit</Button>
        </ButtonBar>
      </StyledBox>
    );
  }
}

PublishBox.propTypes = {
  messageId: PropTypes.string,
  publishCallback: PropTypes.func,
};

export default PublishBox;
