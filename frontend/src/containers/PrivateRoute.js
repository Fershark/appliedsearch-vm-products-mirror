import React from 'react';
import {Route} from 'react-router-dom';
import {Redirect} from 'react-router';
import store from '../store';

// use this route for protected pages
export default ({component: Component, appStyle: AppStyle, ...rest}) => (
  <Route
    {...rest}
    render={props =>
      store.getState().auth.user === null ? (
        <Redirect to={{pathname: '/login', state: {from: props.location}}} />
      ) : (
        <Component {...props} appStyle={AppStyle} />
      )
    }
  />
);
//<PrivateRoute path='/:filter?/:tag?' component={Home}/>
//<Route path="/logout" exact render={(props) => doSignOut(props)} />
//<Route path="/signup" exact component={SignUp}/>
