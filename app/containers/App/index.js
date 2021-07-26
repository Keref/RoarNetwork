/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import React, { useContext } from 'react';
import { Helmet } from 'react-helmet';
import { Switch, Route } from 'react-router-dom';

import styled, { ThemeProvider } from 'styled-components';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import CssBaseline from '@material-ui/core/CssBaseline';

import FeedPage from 'containers/FeedPage/Loadable';
import PostPage from 'containers/PostPage/Loadable';
import MessagePage from 'containers/MessagePage/Loadable';
import ProfilePage from 'containers/ProfilePage/Loadable';
import DocPage from 'containers/DocPage/Loadable';
import NotFoundPage from 'containers/NotFoundPage/Loadable';

import Container from '@material-ui/core/Container';

import Header from 'components/Header/Header';

import CloutContext from '../../cloutContext';

import GlobalStyle from '../../global-styles';

const useStyles = makeStyles(theme => ({
  mainGrid: {
    marginTop: theme.spacing(3),
  },
}));

export default function App() {
  // const appState = useContext(CloutContext);
  const classes = useStyles();
  return (
    <React.Fragment>
      <Helmet titleTemplate="%s - Roar.Network" defaultTitle="Roar.Network">
        <meta name="description" content="Roar.Network" />
      </Helmet>

      <MainDiv classes={classes} />
    </React.Fragment>
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
      <Container maxWidth="lg" style={{ height: 'auto' }}>
        <Header />

        <Container maxWidth="md">
          <Switch>
            <Route exact path="/" component={FeedPage} />
            <Route exact path="/post" component={PostPage} />
            <Route exact path="/m/:msgId" component={MessagePage} />
            <Route exact path="/u/:userHandle" component={ProfilePage} />

            <Route exact path="/docs" component={DocPage} />
            <Route exact path="/docs/:docPage" component={DocPage} />

            <Route path="" component={NotFoundPage} />
          </Switch>
        </Container>
      </Container>
    );
  }
}
