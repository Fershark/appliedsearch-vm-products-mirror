import firebase from 'firebase/app';
import 'firebase/auth';

import {saveUser} from '../store/auth';

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

      dispatch(saveUser(user));
    });

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

export default fireBaseApp;
