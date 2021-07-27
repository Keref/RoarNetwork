import React, {useContext } from 'react';
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
import ExitIcon from '@material-ui/icons/ExitToApp';

import LocaleToggle from 'containers/LocaleToggle';
import messages from './messages';
import CloutContext from '../../cloutContext';

import LoginButton from '../LoginButton/LoginButton';

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
	const appState = useContext(CloutContext);
	
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

			<Button className={classes.toolbarTitle} href="/" >
				<FormattedMessage {...messages.title} />
			</Button>

			<LocaleToggle />
			
			<IconButton>
				<SearchIcon />
			</IconButton>

			{appState.address === '' ? <LoginButton /> : <></>}

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

				<StyledMenuItem component="a" href="/profile">
					<ListItemIcon>
						<CreateIcon fontSize="small" />
					</ListItemIcon>
					<ListItemText primary="Profile" />
				</StyledMenuItem>

				<StyledMenuItem component="a" href="/docs">
					<ListItemIcon>
						<HelpIcon fontSize="small" />
					</ListItemIcon>
					<ListItemText primary="Docs" />
				</StyledMenuItem>

				<StyledMenuItem component="a" href="/logout" >
					<ListItemIcon>
						<ExitIcon fontSize="small" />
					</ListItemIcon>
					<ListItemText primary="Logout" />
				</StyledMenuItem>
			</StyledMenu>
		</Toolbar>
	);
}

