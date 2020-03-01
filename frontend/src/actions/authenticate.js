import firebase from 'firebase/app';
import 'firebase/auth';

import {AUTH_PROCESSING, AUTH_LOGIN_USER, AUTH_LOGOUT} from '../config/endpoints-conf';

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

const processing = isProcessing => ({
  type: AUTH_PROCESSING,
  payload: isProcessing,
});

export const logInUser = (email, password, dispatch) =>
  fireBaseApp
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(res => {
      console.log('AUTHENTICATED');
      const user = {
        uid: res.user.uid,
        email: res.user.email,
        displayName: res.user.displayName,
        photoURL: res.user.photoURL,
      };

      dispatch({
        type: AUTH_LOGIN_USER,
        payload: {user},
      });
    });

// firebase sign in account
export const doSignInWithEmailAndPassword = (email, password) => {
  return dispatch => {
    dispatch(processing(true));

    logInUser(email, password, dispatch).catch(err => {
      console.log('ERROR AUTHENTICATED');
      const {message} = err;
      dispatch({
        type: AUTH_LOGIN_USER,
        payload: {message, success: false, user: null},
      });
    });
  };
};

// firebase signout
export const doSignOut = dispatch => {
  fireBaseApp.auth().signOut();
  dispatch({type: AUTH_LOGOUT, payload: null});
};

// get current Auth User
export const getCurrentUserAuth = () => {
  return new Promise((resolve, reject) => {
    fireBaseApp.auth().onAuthStateChanged(user => {
      if (user) {
        resolve(user);
      } else {
        reject(new Error('User not signed in'));
      }
    });
  });
};

export const getUserIdToken = () => getCurrentUserAuth().then(user => user.getIdToken());

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
