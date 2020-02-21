import React from 'react';
import {Route, Switch} from 'react-router-dom';
import {makeStyles} from '@material-ui/core/styles';
import 'react-toastify/dist/ReactToastify.css';
import {CssBaseline} from '@material-ui/core';

import PrivateRoute from './containers/PrivateRoute';
import appStyles from './assets/jss/views/app';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Home from './pages/Home';
import VMs from './pages/VMs';
import LandingPage from './pages/LandingPage';

const useStyles = makeStyles(appStyles);

export default function App(props) {
  const classes = useStyles();
  //const userLogged = JSON.parse(localStorage.getItem('app_user'));

  return (
    <React.Fragment>
      <CssBaseline />
      <Switch>
        <Route path="/login" render={props => <Login {...props} appStyle={classes} />} />
        <Route path="/logout" exact render={props => <Logout {...props} />} />
        <PrivateRoute path="/home" component={Home} appStyle={classes} />
        <PrivateRoute path="/vms/add" component={Home} appStyle={classes} />
        <PrivateRoute path="/vms" component={VMs} appStyle={classes} />
        <Route path="/" exact component={LandingPage} />
      </Switch>
    </React.Fragment>
  );
}
