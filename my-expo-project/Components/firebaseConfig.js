// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Import the authentication module

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBgjCXVcfUcInJ3u3jUYrpBR_rGd3uVi-c",
  authDomain: "helphive-a462e.firebaseapp.com",
  projectId: "helphive-a462e",
  storageBucket: "helphive-a462e.appspot.com",
  messagingSenderId: "677989373634",
  appId: "1:677989373634:web:3eb81eea21118cd3fa8d5b",
  measurementId: "G-7484DRXG0Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth(app); 

export { auth };

