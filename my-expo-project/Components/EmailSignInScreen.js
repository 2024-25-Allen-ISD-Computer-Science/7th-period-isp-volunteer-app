import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, TouchableOpacity, Text } from 'react-native';
import { auth } from './firebaseConfig'; // Ensure this path is correct

const EmailSignInScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

const handleSignIn = async () => {
  console.log("Attempting to sign in...");
  try {
    console.log("Email:", email);
    console.log("Password:", password);
    
    await auth.signInWithEmailAndPassword(email, password);
    
    Alert.alert('Success', 'User signed in successfully');
    navigation.navigate('HomePage'); // Navigate to HomePage after sign-in
  } catch (error) {
    console.log("Sign-in error:", error.message);
    Alert.alert('Error', error.message);
  }
};


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleSignIn}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.goBack()} // Navigate back to AuthScreen
      >
        <Text style={styles.buttonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#443939',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: '#D3D3D3',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    color: '#D3D3D3',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
  },
  button: {
    backgroundColor: '#D3D3D3',
    padding: 15,
    borderRadius: 5,
    marginVertical: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#443939',
    fontSize: 16,
  },
});

export default EmailSignInScreen;
