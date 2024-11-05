// Components/AuthScreen.js
import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

const AuthScreen = ({ navigation }) => {
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: "677989373634-q2fcqge8cm87q2ctm95e281sehdou3mm.apps.googleusercontent.com", // Replace with your actual client ID
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      console.log("Google authentication successful:", authentication);
      // Handle further Firebase authentication here if needed
    }
  }, [response]);

  const handleGoogleSignIn = () => {
    promptAsync();
  };

  const handleEmailSignUp = () => {
    navigation.navigate('EmailSignUp'); // Navigate to the EmailSignUpScreen
  };

  const handleEmailSignIn = () => {
    navigation.navigate('EmailSignIn'); // Navigate to the EmailSignInScreen
  }

  const handleSignUp = async () => {
    try {
      await signUpWithEmail(email, password);
      navigation.navigate('Home');
    } catch (error) {
      console.error(error);
    }
  };

  const handleSignIn = async () => {
    try {
      await signInWithEmail(email, password);
      navigation.navigate('Home');
    } catch (error) {
      console.error(error);
    }
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

