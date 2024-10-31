import { firebase } from "./firebaseConfig"; // Adjust the path if needed
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

// Sign-Up Function
export const signUpWithEmail = async (email, password) => {
  try {
    await firebase.auth().createUserWithEmailAndPassword(email, password);
    console.log("User registered successfully!");
  } catch (error) {
    console.error("Error registering user: ", error);
  }
};

// Sign-In Function
export const signInWithEmail = async (email, password) => {
  try {
    await firebase.auth().signInWithEmailAndPassword(email, password);
    console.log("User signed in successfully!");
  } catch (error) {
    console.error("Error signing in: ", error);
  }
};

// Google Sign-In Function
export const signInWithGoogle = async () => {
  try {
    const redirectUri = AuthSession.makeRedirectUri({
      useProxy: true, // Set to true if you are testing on Expo Go
    });

    const result = await AuthSession.startAsync({
      authUrl: `https://accounts.google.com/o/oauth2/auth?` +
        `client_id=${process.env.GOOGLE_CLIENT_ID}&` +
        `redirect_uri=${redirectUri}&` +
        `response_type=token&` +
        `scope=profile email`,
    });

    if (result.type === "success") {
      const { access_token } = result.params;

      const credential = firebase.auth.GoogleAuthProvider.credential(access_token);
      await firebase.auth().signInWithCredential(credential);
      console.log("User signed in with Google!");
    } else {
      console.log("Google sign-in cancelled or failed");
    }
  } catch (error) {
    console.error("Error signing in with Google: ", error);
  }
};

// Sign-Out Function
export const signOut = async () => {
  try {
    await firebase.auth().signOut();
    console.log("User signed out successfully!");
  } catch (error) {
    console.error("Error signing out: ", error);
  }
};
