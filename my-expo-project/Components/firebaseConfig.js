import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth'; 

const firebaseConfig = {
  apiKey: "AIzaSyBgjCXVcfUcInJ3u3jUYrpBR_rGd3uVi-c",
  authDomain: "helphive-a462e.firebaseapp.com",
  projectId: "helphive-a462e",
  storageBucket: "helphive-a462e.appspot.com",
  messagingSenderId: "677989373634",
  appId: "1:677989373634:web:3eb81eea21118cd3fa8d5b",
  measurementId: "G-7484DRXG0Y"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);

export { auth };
