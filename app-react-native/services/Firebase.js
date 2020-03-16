import firebase from 'firebase/app';
import 'firebase/auth';

import {
  REACT_APP_FIREBASE_APIKEY,
  REACT_APP_FIREBASE_AUTHDOMAIN,
  REACT_APP_FIREBASE_DATABASEURL,
  REACT_APP_FIREBASE_PROJECTID,
  REACT_APP_FIREBASE_STORAGEBUCKET,
  REACT_APP_FIREBASE_MESSAGINGSENDERID,
  REACT_APP_FIREBASE_APPID,
} from 'react-native-dotenv';
//import {saveUser} from '../store/auth';

// firebase config
const fireBaseConfig = {
  apiKey: REACT_APP_FIREBASE_APIKEY,
  authDomain: REACT_APP_FIREBASE_AUTHDOMAIN,
  databaseURL: REACT_APP_FIREBASE_DATABASEURL,
  projectId: REACT_APP_FIREBASE_PROJECTID,
  storageBucket: REACT_APP_FIREBASE_STORAGEBUCKET,
  messagingSenderId: REACT_APP_FIREBASE_MESSAGINGSENDERID,
  appId: REACT_APP_FIREBASE_APPID,
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

      //dispatch(saveUser(user));
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
