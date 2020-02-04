import React from 'react';
import {Route} from 'react-router-dom';
import {Redirect} from 'react-router';

// use this route for protected pages
export default ({component: Component, ...rest}) => (
  <Route
    {...rest}
    render={props => 
        JSON.parse(localStorage.getItem('app_user')) ? (
          <Component {...props}/>
        ) : (
          <Redirect to={{pathname: '/login', state: {from: props.location}}} />
        )
    }
  />
);
//<PrivateRoute path='/:filter?/:tag?' component={Home}/>
//<Route path="/logout" exact render={(props) => doSignOut(props)} />
//<Route path="/signup" exact component={SignUp}/>
