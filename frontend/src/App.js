import React from 'react';
import clsx from 'clsx';
import {withStyles} from '@material-ui/core/styles';
import {Route, Switch} from 'react-router-dom';
import PrivateRoute from './utils/PrivateRoute';
import Login from './views/Login';
import {doSignOut} from './actions/authenticate';
import Home from './views/Home';
//import SignUp from './views/SignUp';

function App() {
  return (
    <Switch>
      <Route path="/login" exact component={Login} />
      <Route path="/logout" exact render={props => doSignOut(props)} />
      <PrivateRoute path="/home" component={Home} />
    </Switch>
  );
}

//export default withStyles(homeStyles)(Home);
export default App;
