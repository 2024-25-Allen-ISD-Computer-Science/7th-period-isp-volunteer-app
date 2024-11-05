import firebase from "firebase/app";
import "firebase/auth";
import Constants from 'expo-constants';

const { firebaseApiKey, firebaseAuthDomain, firebaseProjectId, firebaseStorageBucket, firebaseMessagingSenderId, firebaseAppId } = Constants.manifest.extra;

const firebaseConfig = {
  apiKey: firebaseApiKey,
  authDomain: firebaseAuthDomain,
  projectId: firebaseProjectId,
  storageBucket: firebaseStorageBucket,
  messagingSenderId: firebaseMessagingSenderId,
  appId: firebaseAppId,
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export { firebase };

