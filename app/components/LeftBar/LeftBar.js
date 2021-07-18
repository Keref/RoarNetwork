import React, { useContext } from 'react';
import { FormattedMessage } from 'react-intl';

import A from './A';
import Collapsible from './Collapsible';
import Img from './Img';
import NavBar from './NavBar';
import HeaderLink from './HeaderLink';
import Banner from './banner.jpg';
import Logo from '../../images/lion.png';
import messages from './messages';
import CloutContext from "../../cloutContext";

import Nav from 'react-bootstrap/Nav';


function LeftBar() {
	const appState = useContext(CloutContext);
	console.log("appfkinstate",appState)
	let linkk = "/u/"+appState.userName;
	return (
	<Nav id="sidebar" style={{ display: 'flex', width: 200}}>
		<div className="sticky-top" style={{ position: 'fixed', top: 0, width: 'auto' }} >
			<A href="/">
			<Img src={Logo} alt="Roar Network" />
			</A>
			<span id="userName" style={{ fontWeigth: 'bold',  lineHeight: 2, color: '#ed1951',  }} >{appState.userName}</span>
			&nbsp;- <span id="userAddress" style={{ lineHeight: 2 }} >{appState.wallet.address.substring(0,10)}... </span>
			
			<br />
			<a href="/post" style={{ lineHeight: 2 }} >New Post</a>
			<br />
			<a href={linkk} style={{ lineHeight: 2 }} >Profile</a>
			<br />
			<a href="/docs" style={{ lineHeight: 2 }} >Docs</a>

		</div>
	</Nav>
	);
}

export default LeftBar;
