import firebase from 'firebase';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DB_URL,
  projectId: process.env.REACT_APP_PRO_ID,
  storageBucket: process.env.REACT_APP_STORAGE,
  appId: process.env.REACT_APP_APP_ID,
};
// Initialize Firebase
try {
  firebase.initializeApp(firebaseConfig);
} catch (err) {
  if (!/already exists/.test(err.message)) {
    console.error('Firebase initialization error', err.stack);
  }
}
const firebaseApp = firebase;
const storage = firebase.storage();

export { storage, firebaseApp as default };
