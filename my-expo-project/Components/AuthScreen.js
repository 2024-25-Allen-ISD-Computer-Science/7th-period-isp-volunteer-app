import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { getAuth, signInWithCredential, GoogleAuthProvider } from 'firebase/auth'; // Firebase imports

WebBrowser.maybeCompleteAuthSession();

const AuthScreen = ({ navigation }) => {
  // Google Auth Request setup
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: "677989373634-750v43qulrqqf4t9sr1sj5b8k315qcjc.apps.googleusercontent.com",
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      console.log("Google authentication successful:", authentication);

      // Firebase authentication using Google credentials
      const auth = getAuth(); // Get Firebase auth instance
      const credential = GoogleAuthProvider.credential(authentication.idToken, authentication.accessToken);
      
      signInWithCredential(auth, credential)
        .then((userCredential) => {
          console.log("Firebase user signed in:", userCredential.user);
          // Navigate to home or desired screen
          navigation.navigate('Home');
        })
        .catch((error) => {
          console.error("Error during Firebase sign-in:", error);
          Alert.alert("Authentication Error", "Failed to sign in with Google.");
        });
    }
  }, [response]);

  const handleGoogleSignIn = () => {
    promptAsync(); // Initiates Google sign-in
  };

  const handleEmailSignUp = () => {
    navigation.navigate('EmailSignUp'); // Navigate to the EmailSignUpScreen
  };

  const handleEmailSignIn = () => {
    navigation.navigate('EmailSignIn'); // Navigate to the EmailSignInScreen
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In or Sign Up</Text>
      <TouchableOpacity style={styles.button} onPress={handleGoogleSignIn}>
        <Text style={styles.buttonText}>Sign in with Google</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleEmailSignUp}>
        <Text style={styles.buttonText}>Sign up with Email</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleEmailSignIn}>
        <Text style={styles.buttonText}>Sign In with Email</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#443939',
  },
  title: {
    fontSize: 24,
    color: '#D3D3D3',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#D3D3D3',
    padding: 15,
    borderRadius: 5,
    marginVertical: 10,
    width: '50%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#443939',
    fontSize: 16,
  },
});

export default AuthScreen;
