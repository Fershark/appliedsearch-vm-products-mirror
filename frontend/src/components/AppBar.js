import React from 'react';
import clsx from 'clsx';
import {makeStyles} from '@material-ui/core/styles';
import appBarStyles from '../assets/jss/views/appBar';
import {
  AppBar,
  Toolbar,
  Typography,
  Link,
  //IconButton,
} from '@material-ui/core';
//import MenuIcon from '@material-ui/icons/Menu';

const useStyles = makeStyles(appBarStyles);

export default function(props) {
  let open = props.open;
  const classes = useStyles();
  return (
    <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
      <Toolbar className={classes.toolbar}>
        {/*
        <IconButton
          edge="start"
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerOpen}
          className={clsx(classes.menuButton, open && classes.menuButtonHidden)}>
          <MenuIcon />
        </IconButton>
        */}
        <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
          <Link href="/" color="inherit" underline="none">
            Virtual Machine Products
          </Link>
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
