const admin = require("firebase-admin");
const firebase = require("firebase");
const { 
  FIREBASE_SERVICE_ACCOUNT_JSON, FIREBASE_DATABASE_URL,
  FIREBASE_API_KEY, FIREBASE_AUTH_DOMAIN, FIRE_BASE_PROJECT_ID,
  FIREBASE_STORAGEBUCKET, FIREBASE_MESSAGING_SENDER_ID, FIREBASE_APP_ID
} = require("../config");
var serviceAccount = require(FIREBASE_SERVICE_ACCOUNT_JSON);

// initiali FIREBASE ADMIN
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: FIREBASE_DATABASE_URL
});

var firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  databaseURL: FIREBASE_DATABASE_URL,
  projectId: FIRE_BASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGEBUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// connect firestore
const firebaseDB = admin.firestore();

module.exports = {
  firebaseAdmin: admin,
  firebase: firebase,
  firebaseDB: firebaseDB
}


