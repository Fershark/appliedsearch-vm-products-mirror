import React from 'react';
import {NavLink} from 'react-router-dom';
import clsx from 'clsx';
import {makeStyles} from '@material-ui/core/styles';
import {Drawer, Divider, List, ListItem, ListItemIcon, ListItemText, Paper} from '@material-ui/core';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ComputerIcon from '@material-ui/icons/Computer';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
//import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';

import config from '../config';

const drawerWidth = config.drawerWidth;
const useStyles = makeStyles(theme => ({
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    margin: 0,
    padding: 0,
  },
  listItem: {
    color: theme.palette.primary.dark,
  },
  icon: {
    color: theme.palette.primary.contrastText,
  },
}));

export default function(props) {
  let open = props.open;
  const classes = useStyles();
  return (
    <Drawer
      variant="permanent"
      classes={{
        paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
      }}
      open={open}>
      {/*
      <div className={classes.toolbarIcon}>
        <IconButton onClick={this.handleDrawerClose}>
          <ChevronLeftIcon />
        </IconButton>
      </div>
      */}
      <Paper square={true} className={classes.paper}>
        <List>
          <ListItem component={NavLink} to="/">
            <ListItemText classes={{primary: classes.listItem}} primary={config.appName} />
          </ListItem>
        </List>
      </Paper>
      <Divider />
      <List>
        <ListItem button component={NavLink} to="/home" activeClassName="Mui-selected">
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem button component={NavLink} to="/vms" activeClassName="Mui-selected">
          <ListItemIcon>
            <ComputerIcon />
          </ListItemIcon>
          <ListItemText primary="Virtual Machines" />
        </ListItem>
        <ListItem button component={NavLink} to="/logout" activeClassName="Mui-selected">
          <ListItemIcon>
            <PowerSettingsNewIcon />
          </ListItemIcon>
          <ListItemText primary="Sign out" />
        </ListItem>
      </List>
    </Drawer>
  );
}
