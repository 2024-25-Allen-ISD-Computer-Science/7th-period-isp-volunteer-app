import React, { useState } from 'react';
import { View, Alert, Text, StyleSheet } from 'react-native';
import { auth, firestore } from './firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { Surface, TextInput, Button, Card, SegmentedButtons, useTheme } from 'react-native-paper';



const EmailSignUpScreen = ({ navigation }) => {
  const theme = useTheme();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accountType, setAccountType] = useState('student'); // Default to 'student'

  const handleSignUp = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Email and Password are required.');
      return;
    }
    
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long.');
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;

      // Store additional user details, including account type, in Firestore
      await setDoc(doc(firestore, "users", userId), {
        firstName,
        lastName,
        dob,
        phoneNumber,
        email,
        accountType, // Save the selected account type
      });

      Alert.alert('Success', 'User account created successfully');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <Surface style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title="Email Sign Up" />
        <Card.Content>
          <TextInput
            label="First Name"
            value={firstName}
            onChangeText={setFirstName}
            style={styles.input}
            backgroundColor='#1685c9'
          />
          <TextInput
            label="Last Name"
            value={lastName}
            onChangeText={setLastName}
            style={styles.input}
          />
          <TextInput
            label="Date of Birth"
            value={dob}
            onChangeText={setDob}
            placeholder="YYYY-MM-DD"
            style={styles.input}
          />
          <TextInput
            label="Phone Number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            style={styles.input}
          />
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />
          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />

          <Text style={styles.label}>Account Type:</Text>
          <SegmentedButtons
            value={accountType}
            onValueChange={setAccountType}
            buttons={[
              { value: 'student', label: 'Student'},
              { value: 'teacher', label: 'Teacher' },
            ]}
            style={styles.segmentedButton}
          />

          <Button mode="contained" onPress={handleSignUp} style={styles.button}>
            Sign Up
          </Button>
          <Button mode="outlined" onPress={() => navigation.goBack()} style={styles.button}>
            Back
          </Button>
        </Card.Content>
      </Card>
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    backgroundColor: '#99c5e0',
  },
  card: {
    padding: 16,
  },
  input: {
    marginBottom: 12,
    backgroundColor: '#aacfe6'
  },
  label: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 5,
  },
  segmentedButton: {
    marginBottom: 16,
  },
  button: {
    marginTop: 10,
  },
});

export default EmailSignUpScreen;