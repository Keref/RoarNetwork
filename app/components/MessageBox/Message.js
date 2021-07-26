import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import Link from '@material-ui/core/Link';
import ReactMarkdown from 'react-markdown';

import DefaultUser from '../../images/defaultuser.png';
import messages from './messages';
import Img from './Img';
import StyledBox from './StyledBox';
import './markdown-styles.module.css';

// eslint-disable-next-line react/prefer-stateless-function
export class Message extends React.Component {
  render() {
    return (
      <StyledBox>
        <Link href={`/u/${this.props.ownerName}`}>
          <div
            className="postHeader"
            id="messageContentHeader"
            style={{
              display: 'flex',
              alignItems: 'center',
              flexGrow: 1,
              flexDirection: 'row',
            }}
          >
            <Img
              src={DefaultUser}
              alt={<FormattedMessage {...messages.author} />}
            />

            <span
              style={{
                marginLeft: 4,
                fontWeight: 'bold',
                fontSize: '0.9rem',
              }}
            >
              {this.props.ownerName}
            </span>
            <span style={{ marginLeft: 4, color: 'grey', fontSize: '0.9rem' }}>
              @{this.props.ownerName}
            </span>
            <span style={{ marginLeft: 4, color: 'grey', fontSize: '0.9rem' }}>
              . Jul 7
            </span>
          </div>
        </Link>
        <div
          role="button"
          tabIndex={0}
          style={{ flexGrow: 1 }}
          onClick={this.props.displayMessage}
          onKeyDown={this.props.displayMessage}
        >
          <div
            style={{ marginTop: 4, marginBottom: 4 }}
            className="reactMarkDown"
          >
            <ReactMarkdown className="reactMarkDown">
              {this.props.message}
            </ReactMarkdown>
          </div>

          {this.props.interactions}
        </div>
      </StyledBox>
    );
  }
}

Message.propTypes = {
  messageId: PropTypes.number,
  tips: PropTypes.array,
  comments: PropTypes.array,
  emphasize: PropTypes.bool,
  ownerName: PropTypes.string,
  interactions: PropTypes.element,
  displayMessage: PropTypes.array,
  message: PropTypes.string,
};
