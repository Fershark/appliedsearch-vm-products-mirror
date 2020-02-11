import React from 'react';
import {NavLink} from 'react-router-dom';
import clsx from 'clsx';
import {makeStyles} from '@material-ui/core/styles';
import drawerStyles from '../assets/jss/views/drawer';
import {Drawer, Divider, List, ListItem, ListItemIcon, ListItemText, Paper} from '@material-ui/core';
//import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ComputerIcon from '@material-ui/icons/Computer';
import config from '../config';
//import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';

const useStyles = makeStyles(drawerStyles);

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
          <ListItem>
            <ListItemText classes={{primary: classes.listItem}} primary={config.appName}/>
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
      </List>
    </Drawer>
  );
}
