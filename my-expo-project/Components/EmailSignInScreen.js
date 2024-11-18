import React, { useState } from 'react';
import { View, Alert, StyleSheet } from 'react-native';
import { TextInput, Button, Paragraph, Appbar, Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import { auth, firestore } from './firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useFonts } from 'expo-font'; // For loading fonts
import AppLoading from 'expo-app-loading'; // For loading screen while fonts are loading

const EmailSignInScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Load custom fonts
  let [fontsLoaded] = useFonts({
    'Roboto-Regular': require('../assets/fonts/Roboto-Regular.ttf'),
    'Roboto-Medium': require('../assets/fonts/Roboto-Medium.ttf'),
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  const handleSignIn = async () => {
    if (!auth) {
      Alert.alert('Error', 'Firebase auth not initialized.');
      return;
    }

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
    <PaperProvider theme={darkTheme}>
      <View style={styles.container}>
        <Appbar.Header style={styles.appbar}>
          <Appbar.Content title="Sign In" titleStyle={styles.appbarTitle} />
          <Appbar.Action icon="arrow-left" onPress={() => navigation.goBack()} />
        </Appbar.Header>
        <View style={styles.content}>
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
            mode="outlined"
            theme={{ colors: { primary: '#1f91d6' } }}
          />
          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
            mode="outlined"
            theme={{ colors: { primary: '#1f91d6' } }}
          />
          <Button
            mode="contained"
            onPress={handleSignIn}
            style={styles.button}
          >
            Sign In
          </Button>
          <Paragraph style={styles.paragraph} onPress={() => navigation.goBack()}>
            Back
          </Paragraph>
        </View>
      </View>
    </PaperProvider>
  );
};

// Dark theme implementation
const darkTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#1f91d6', 
    background: '#121212', 
    surface: '#1F1F1F',
    text: '#FFFFFF',
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  appbar: {
    backgroundColor: '#1F1F1F',
  },
  appbarTitle: {
    color: '#D3D3D3',
    fontFamily: 'Roboto-Medium', 
  },
  content: {
    padding: 20,
    justifyContent: 'center',
    flex: 1,
  },
  input: {
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
    color: '#000000', 
    fontFamily: 'Roboto-Regular',
  },
  button: {
    marginVertical: 10,
  },
  paragraph: {
    textAlign: 'center',
    color: '#D3D3D3',
    marginTop: 20,
    fontFamily: 'Roboto-Regular',
  },
});

export default EmailSignInScreen;
