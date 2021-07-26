import React from 'react';
import { FormattedMessage } from 'react-intl';

import { withStyles, makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import HelpIcon from '@material-ui/icons/Help';
import DraftsIcon from '@material-ui/icons/Drafts';
import CreateIcon from '@material-ui/icons/Create';
import Toolbar from '@material-ui/core/Toolbar';
import SearchIcon from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

import messages from './messages';

import LoginModal from '../LoginModal/LoginModal';

const useStyles = makeStyles(theme => ({
  toolbar: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  toolbarTitle: {
    flex: 1,
  },
  toolbarSecondary: {
    justifyContent: 'space-between',
    overflowX: 'auto',
  },
  toolbarLink: {
    padding: theme.spacing(1),
    flexShrink: 0,
  },
}));

const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
  },
})(props => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles(theme => ({
  root: {
    '&:focus': {
      backgroundColor: theme.palette.primary.main,
      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
        color: theme.palette.common.white,
      },
    },
  },
}))(MenuItem);

export default function Header() {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Toolbar className={classes.toolbar}>
      <IconButton
        aria-controls="customized-menu"
        aria-haspopup="true"
        variant="contained"
        color="primary"
        onClick={handleClick}
      >
        <MenuIcon />
      </IconButton>

      <Button className={classes.toolbarTitle}>
        <FormattedMessage {...messages.title} />
      </Button>

      <IconButton>
        <SearchIcon />
      </IconButton>

      <LoginButton />

      <StyledMenu
        id="customized-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <StyledMenuItem component="a" href="/post">
          <ListItemIcon>
            <CreateIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Write" />
        </StyledMenuItem>

        <StyledMenuItem>
          <ListItemIcon>
            <DraftsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="List" />
        </StyledMenuItem>

        <StyledMenuItem>
          <ListItemIcon>
            <CreateIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Groups" />
        </StyledMenuItem>

        <StyledMenuItem>
          <ListItemIcon>
            <CreateIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Profile" />
        </StyledMenuItem>

        <StyledMenuItem>
          <ListItemIcon>
            <HelpIcon fontSize="small" href="/docs" />
          </ListItemIcon>
          <ListItemText primary="Docs" />
        </StyledMenuItem>
      </StyledMenu>
    </Toolbar>
  );
}

class LoginButton extends React.Component {
  state = {
    isLoginVisible: false,
  };

  toggleLogin = () => {
    this.setState(prevState => ({ isLoginVisible: !prevState.isLoginVisible }));
  };

  render() {
    return (
      <React.Fragment>
        <Button variant="outlined" size="small" onClick={this.toggleLogin}>
          H
        </Button>
        <LoginModal
          isVisible={this.state.isLoginVisible}
          toggle={this.toggleLogin}
        />
      </React.Fragment>
    );
  }
}
