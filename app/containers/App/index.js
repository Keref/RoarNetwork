/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import React, { useContext } from 'react';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { Switch, Route } from 'react-router-dom';

import FeedPage from 'containers/FeedPage/Loadable';
import PostPage from 'containers/PostPage/Loadable';
import FeaturePage from 'containers/FeaturePage/Loadable';
import MessagePage from 'containers/MessagePage/Loadable';
import ProfilePage from 'containers/ProfilePage/Loadable';
import DocPage from 'containers/DocPage/Loadable';
import NotFoundPage from 'containers/NotFoundPage/Loadable';
import LeftBar from 'components/LeftBar/LeftBar';
import Footer from 'components/Footer';
import CloutContext from '../../cloutContext';

import GlobalStyle from '../../global-styles';

// max-width: calc(768px + 16px * 2);
const AppWrapper = styled.div`
  margin: 0 auto;
  display: flex;
  min-height: 100%;
  padding: 0 16px;
  flex-direction: column;
  align-items: center;
`;

export default function App() {
  // const appState = useContext(CloutContext);

  return (
    <AppWrapper className="wrapper">
      <Helmet titleTemplate="%s - Roar.Network" defaultTitle="Roar.Network">
        <meta name="description" content="Roar.Network" />
      </Helmet>
      <MainDiv />
      <Footer />
      <GlobalStyle />
    </AppWrapper>
  );
}

class MainDiv extends React.Component {
  static contextType = CloutContext;

  render() {
    let width = 600;
    if (
      this.context.history.location.pathname === '/docs' ||
      this.context.history.location.pathname === '/post'
    )
      width = 900;
    return (
      <div style={{ display: 'flex', overflow: 'hidden', height: 'auto' }}>
        <LeftBar />
        <div style={{ width, overflow: 'auto' }}>
          <Switch>
            <Route exact path="/" component={FeedPage} />
            <Route exact path="/post" component={PostPage} />
            <Route path="/features" component={FeaturePage} />
            <Route exact path="/m/:msgId" component={MessagePage} />
            <Route exact path="/u/:userHandle" component={ProfilePage} />

            <Route exact path="/docs" component={DocPage} />
            <Route exact path="/docs/:docPage" component={DocPage} />

            <Route path="" component={NotFoundPage} />
          </Switch>
        </div>
      </div>
    );
  }
}
