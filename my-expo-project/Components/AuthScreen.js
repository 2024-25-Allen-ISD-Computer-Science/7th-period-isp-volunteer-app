import React, { useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button, Text, Surface, useTheme } from 'react-native-paper';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { getAuth, signInWithCredential, GoogleAuthProvider } from 'firebase/auth'; // Firebase imports
import { Card, Avatar  } from 'react-native-paper';

WebBrowser.maybeCompleteAuthSession();

const AuthScreen = ({ navigation }) => {
  const theme = useTheme();
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
    <Surface style={styles.container}>
      <Card style={styles.card}>
        <Card.Title
          title="Welcome"
          subtitle="Choose your sign-in method"
          left={(props) => <Avatar.Icon {...props} icon="account" />}
        />
        <Card.Content>
          <Text variant="headlineSmall" style={styles.title}>Sign In or Sign Up</Text>
          <Button
            mode="contained"
            onPress={handleGoogleSignIn}
            style={styles.button}
            icon="google"
          >
            Sign in with Google
          </Button>

          {/* Button component for email sign-up with icon and outlined style. */} 
          <Button
            mode="outlined"
            onPress={handleEmailSignUp}
            style={styles.button}
            icon="email-plus"
          >
            Sign up with Email
          </Button>
          
          <Button
            mode="text"
            onPress={handleEmailSignIn}
            style={styles.button}
            icon="login"
          >
            Sign In with Email
          </Button>
        </Card.Content>
      </Card>
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#99c5e0',
  },
  card: {
    width: '100%',
    maxWidth: 400,
  },
  title: {
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    marginVertical: 8,
  },
});

export default AuthScreen;