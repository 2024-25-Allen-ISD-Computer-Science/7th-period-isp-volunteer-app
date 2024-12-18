import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert, TextInput, TouchableOpacity, Image } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { getAuth, signInWithCredential, GoogleAuthProvider } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, firestore } from './firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';

WebBrowser.maybeCompleteAuthSession();

const AuthScreen = ({ navigation }) => {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
        .then(() => navigation.navigate('StudentHomePage'))
        .catch((error) => Alert.alert("Authentication Error", "Failed to sign in with Google."));
    }
  }, [response]);

  const handleGoogleSignIn = () => promptAsync(); // Initiates Google sign-in

  const handleSignIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      Alert.alert('Success', 'User signed in successfully');

      const user = userCredential.user; // Get signed-in user
      const userDocRef = doc(firestore, 'users', user.uid);
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        const accountType = userData.accountType;

        if (accountType === 'teacher') {
          navigation.navigate('TeacherHomePage'); // Navigate to teacher's home page
        } else if (accountType === 'student') {
          navigation.navigate('StudentHomePage'); // Navigate to student's home page
        } else {
          Alert.alert('Error', 'Invalid account type');
        }
      } else {
        Alert.alert('Error', 'User data not found!');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* Illustration Section */}
      <View style={styles.illustrationContainer}>
        <Image 
          source={require('../public/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Login Form Section */}
      <View style={styles.formContainer}>
        <Text style={styles.title}>Email/Login</Text>
        
        {/* Email Input */}
        <TextInput
          placeholder="user@gmail.com"
          placeholderTextColor="#888"
          style={styles.input}
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        {/* Password Input */}
        <TextInput
          placeholder="********"
          placeholderTextColor="#888"
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />

        {/* Login Button */}
        <TouchableOpacity 
            style={styles.loginButton} 
            onPress={handleSignIn}
          >
            <Text style={styles.loginButtonText}>Log In</Text>
          </TouchableOpacity>
        {/* Forgot Password */}
        <TouchableOpacity>
          <Text style={styles.linkText}>Forgot Password?</Text>
        </TouchableOpacity>

        {/* Sign Up Link */}
        <TouchableOpacity onPress={() => navigation.navigate('EmailSignUp')}>
          <Text style={styles.linkText}>Don't Have an Account?</Text>
        </TouchableOpacity>

        {/* Google Sign-In Button */}
        <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignIn}>
          <Text style={styles.googleButtonText}>Sign in with Google</Text>
        </TouchableOpacity>
      </View>

      {/* Footer Section */}
      <Text style={styles.footerText}>www.HelpHive.com (coming soon)</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1C', // Dark background
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
  },
  illustrationContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    flex: 3,
    width: '90%',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    color: '#FFF',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    padding: 15,
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 10,
    color: '#FFF',
    backgroundColor: '#2E2E2E',
    marginBottom: 15,
    fontSize: 16,
  },
  logo: {
    width: 200,
    height: 200,
  },
  loginButton: {
    width: '100%',
    backgroundColor: '#FFF',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  
  loginButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  googleButton: {
    width: '100%',
    backgroundColor: '#1f91d6', 
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  googleButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  linkText: {
    color: '#AAA',
    marginBottom: 10,
    textDecorationLine: 'underline',
    fontSize: 14,
  },
  footerText: {
    color: '#AAA',
    fontSize: 12,
  },
});

export default AuthScreen;
