import {
  AUTH_SIGNUP_USER,
  API_CREATE_USER,
  AUTH_LOGIN_USER,
  AUTH_PROCESSING,
  API_GET_USER,
} from '../config/endpoints-conf';
//import axios from 'axios';
import {toast} from 'react-toastify';
// import * as firebase from 'firebase';
import firebase from 'firebase/app';
import 'firebase/auth';

// firebase config
const fireBaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_APIKEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTHDOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASEURL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECTID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGEBUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGINGSENDERID,
  appId: process.env.REACT_APP_FIREBASE_APPID,
};

const fireBaseApp = firebase.initializeApp(fireBaseConfig);

// firebase sign in account
export const doSignInWithEmailAndPassword = (email, password) => {
  return dispatch => {
    dispatch({
      type: AUTH_PROCESSING,
      payload: true,
    });

    fireBaseApp
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(res => {
        console.log('AUTHENTICATED');
        const message = 'Successfully signin account';
        dispatch({
          type: AUTH_LOGIN_USER,
          payload: {message, success: true},
        });

        const user = {
          uid: res.user.uid,
          email: res.user.email,
          displayName: res.user.displayName,
          photoURL: res.user.photoURL,
        };

        localStorage.setItem('app_user', JSON.stringify(user));

        dispatch({
          type: AUTH_PROCESSING,
          payload: false,
        });
      })
      .catch(err => {
        console.log('ERROR AUTHENTICATED');
        const {message} = err;
        dispatch({
          type: AUTH_LOGIN_USER,
          payload: {message, success: false},
        });

        dispatch({
          type: AUTH_PROCESSING,
          payload: false,
        });

        toast.error(message);
      });
  };
};

// firebase signout
export const doSignOut = props => {
  fireBaseApp.auth().signOut();
  localStorage.setItem('app_user', null);
  props.history.push('/login');
};

// get current Auth User
export const getCurrentUserAuth = () => {
  return new Promise((resolve, reject) => {
    fireBaseApp.auth().onAuthStateChanged(user => {
      if (user) {
        console.log('user', user);

        resolve({
          displayName: user.displayName,
          email: user.email,
        });
      } else {
        resolve(null);
      }
    });
  });
};

export const getUserIdToken = () => {
  return new Promise((resolve, reject) => {
    fireBaseApp.auth().onAuthStateChanged(user => {
      if (user) {
        fireBaseApp
          .auth()
          .currentUser.getIdToken(true)
          .then(idToken => {
            resolve({idToken});
          })
          .catch(err => {
            reject(err);
          });
      } else {
        resolve(null);
      }
    });
  });
};

// firebase sign up account
/*
export const accountSignUp = (json) =>  {
    return dispatch => {
        dispatch({
            type: AUTH_PROCESSING,
            payload: true
        });

        // call api
        axios.post(API_CREATE_USER, json, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(res => {
            const message = 'Successfully create account. Please login now';
            dispatch({
                type: AUTH_SIGNUP_USER,
                payload: { message, success: true}
            })

            dispatch({
                type: AUTH_PROCESSING ,
                payload: false
            });

            toast.success(message);
        }).catch(err => {
            console.log("ERR: " + err);
            const { message } = err;
            dispatch({
                type: AUTH_SIGNUP_USER,
                payload: { message, success: false}
            })

            dispatch({
                type: AUTH_PROCESSING ,
                payload: false
            });
            
            toast.error(message);
        })
    }
}
*/

/*
export const getUserDetails = (getUserIdToken) => (id) =>  {
    
    return getUserIdToken()
        .then(data => {
            const idToken = data.idToken;
            return axios.get(API_GET_USER + id, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': idToken
                }
            }).then(res => {
                return res.data
            }).catch(err => {
                console.log("ERR: " + err);
            })
        })
}
*/

export default fireBaseApp;
