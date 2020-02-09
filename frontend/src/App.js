import React from 'react';
import {Route, Switch} from 'react-router-dom';
import {makeStyles} from '@material-ui/core/styles';
import {CssBaseline} from '@material-ui/core';
import PrivateRoute from './containers/PrivateRoute';
import appStyles from './assets/jss/views/app';
import Login from './pages/Login';
import {doSignOut} from './actions/authenticate';
import Home from './pages/Home';
//import SignUp from './pages/SignUp';

const useStyles = makeStyles(appStyles);

export default function App(props) {
  const classes = useStyles();
  //const userLogged = JSON.parse(localStorage.getItem('app_user'));

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Switch>
        <Route path="/login" render={props => <Login {...props} appStyle={classes} />} />
        <Route path="/logout" exact render={props => doSignOut(props)} />
        <PrivateRoute path="/home" component={Home} appStyle={classes} />
      </Switch>
    </div>
  );
}
