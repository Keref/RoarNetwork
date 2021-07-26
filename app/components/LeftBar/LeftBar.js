import React, { useContext } from 'react';
import { FormattedMessage } from 'react-intl';

import Drawer from '@material-ui/core/Drawer';
import Link from '@material-ui/core/Link';

import A from './A';
import Collapsible from './Collapsible';
import Img from './Img';
import NavBar from './NavBar';
import HeaderLink from './HeaderLink';
import { LoginModule } from '../LoginModule';
import Banner from './banner.jpg';

import Logo from '../../images/lion.png';
import messages from './messages';
import CloutContext from '../../cloutContext';

class LeftBar extends React.Component {
  static contextType = CloutContext;

  render() {
    const linkk = `/u/${this.context.username}`;
    return (
      <Drawer
        id="sidebar"
        variant="permanent"
        style={{ display: 'flex', width: 200 }}
      >
        <div
          className="sticky-top"
          style={{ position: 'fixed', top: 0, width: 'auto' }}
        >
          <Link href="/">{/* <Img src={Logo} alt="Roar Network" /> */}</Link>
          <span style={{ fontWeigth: 'bold', lineHeight: 2, color: '#ed1951' }}>
            {this.context.username}
          </span>
          <br />
          <span style={{ lineHeight: 2 }}>
            {(this.context.address || '').substring(0, 10)}...{' '}
          </span>

          <br />
          <Link href="/post" style={{ lineHeight: 2 }}>
            Write
          </Link>
          <br />
          <Link style={{ lineHeight: 2 }}>Lists</Link>
          <br />
          <Link style={{ lineHeight: 2 }}>Groups</Link>
          <br />
          <Link href={linkk} style={{ lineHeight: 2 }}>
            Profile
          </Link>
          <br />
          <Link href="/docs" style={{ lineHeight: 2 }}>
            Docs
          </Link>
          <br />
          <LoginModule />
        </div>
      </Drawer>
    );
  }
}

export default LeftBar;
