import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBgjCXVcfUcInJ3u3jUYrpBR_rGd3uVi-c",
  authDomain: "helphive-a462e.firebaseapp.com",
  projectId: "helphive-a462e",
  storageBucket: "helphive-a462e.appspot.com",
  messagingSenderId: "677989373634",
  appId: "1:677989373634:web:3eb81eea21118cd3fa8d5b",
  measurementId: "G-7484DRXG0Y"
};

// Initialize the Firebase app
const app = initializeApp(firebaseConfig);

// Use Firebase Web SDK for Auth with persistence
const auth = getAuth(app);

const firestore = getFirestore(app);
const storage = getStorage(app);

export { auth, firestore, storage };