import * as AuthSession from 'expo-auth-session';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert, TextInput, TouchableOpacity, Image } from 'react-native';
import { Text } from 'react-native-paper';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { signInWithCredential, GoogleAuthProvider, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, firestore } from './firebaseConfig';

WebBrowser.maybeCompleteAuthSession();

const AuthScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: '677989373634-qs2pjr7u09pm8astpscq9nehr5s8sat2.apps.googleusercontent.com',
  });

  useEffect(() => {
    const uri = AuthSession.makeRedirectUri({ useProxy: true });
    console.log("Redirect URI:", uri);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDocRef = doc(firestore, 'users', user.uid);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          const accountType = userData.accountType;

          navigation.navigate(accountType === 'teacher' ? 'TeacherHomePage' : 'StudentHomePage');
        } else {
          Alert.alert('Error', 'User data not found!');
        }
      }
    });

    return () => unsubscribe();
  }, [navigation]);

  useEffect(() => {
    const signInWithGoogle = async () => {
      if (response?.type === 'success' && response.authentication) {
        const { idToken, accessToken } = response.authentication;
        const credential = GoogleAuthProvider.credential(idToken, accessToken);

        try {
          const result = await signInWithCredential(auth, credential);
          const user = result.user;

          const userDocRef = doc(firestore, 'users', user.uid);
          const docSnap = await getDoc(userDocRef);

          if (!docSnap.exists()) {
            // First-time login — redirect to profile setup
            navigation.navigate('ProfileSetup', {
              uid: user.uid,
              name: user.displayName,
              email: user.email,
              profilePicture: user.photoURL,
            });
          } else {
            const userData = docSnap.data();
            const accountType = userData.accountType;

            navigation.navigate(accountType === 'teacher' ? 'TeacherHomePage' : 'StudentHomePage');
          }
        } catch (error) {
          console.log('Google Sign-In Error:', error);
          Alert.alert('Authentication Error', error.message);
        }
      }
    };

    signInWithGoogle();
  }, [response]);

  const handleGoogleSignIn = () => promptAsync();

  const handleSignIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const userDocRef = doc(firestore, 'users', user.uid);
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        const accountType = userData.accountType;

        navigation.navigate(accountType === 'teacher' ? 'TeacherHomePage' : 'StudentHomePage');
      } else {
        Alert.alert('Error', 'User data not found!');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.illustrationContainer}>
        <Image 
          source={require('../public/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.title}>Email/Login</Text>
        
        <TextInput
          placeholder="user@gmail.com"
          placeholderTextColor="#888"
          style={styles.input}
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          placeholder="********"
          placeholderTextColor="#888"
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity 
          style={styles.loginButton} 
          onPress={handleSignIn}
        >
          <Text style={styles.loginButtonText}>Log In</Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Text style={styles.linkText}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('EmailSignUp')}>
          <Text style={styles.linkText}>Don't Have an Account?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignIn}>
          <Text style={styles.googleButtonText}>Sign in with Google</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footerText}>www.HelpHive.com (coming soon)</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1C',
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
