import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Redirect } from 'react-router';
import reducers from './reducers';
import Login from './views/Login';
import { doSignOut } from './actions/authenticate';
//import SignUp from './views/SignUp';

// use this route for protected pages
const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route 
      {...rest} 
      render={props => {
        if (JSON.parse(localStorage.getItem("app_user"))) {
          var test_if_home = /^blog\/$|^video\/$|^subscription\/$/.test(props.location.pathname.slice(1));
          /*return (
            <Bootstrap>
                {test_if_home ? (<Home {...props}/>) 
                : (props.location.pathname.slice(1) ? <Component {...props} /> 
                : <Redirect to="/blog/"/>)}
            </Bootstrap>
          )*/
          return <Redirect to={{pathname: '/login', state: { from: props.location }}} />
        } else {
          return <Redirect to={{pathname: '/login', state: { from: props.location }}} />
        }
      }}
    />
  );
  //<PrivateRoute path='/:filter?/:tag?' component={Home}/>
  //<Route path="/logout" exact render={(props) => doSignOut(props)} />
  //<Route path="/signup" exact component={SignUp}/>

ReactDOM.render((
    <Provider store={reducers}>
        <BrowserRouter>
            <Switch>
                <Route path="/login" exact component={Login}/>
                <Route path="/logout" exact render={(props) => doSignOut(props)} />
            </Switch>
          </BrowserRouter>
    </Provider>
), document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
