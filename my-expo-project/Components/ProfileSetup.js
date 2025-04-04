import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import { Text } from 'react-native-paper';
import { setDoc, doc } from 'firebase/firestore';
import { firestore } from './firebaseConfig';
import { Picker } from '@react-native-picker/picker';

const ProfileSetup = ({ route, navigation }) => {
  const { uid, name, email, profilePicture } = route.params;

  const [firstName, setFirstName] = useState(name?.split(' ')[0] || '');
  const [lastName, setLastName] = useState(name?.split(' ')[1] || '');
  const [dob, setDob] = useState('');
  const [phone, setPhone] = useState('');
  const [accountType, setAccountType] = useState('student');

  const handleSubmit = async () => {
    if (!firstName || !lastName || !dob || !phone || !accountType) {
      Alert.alert('Missing Fields', 'Please fill out all fields.');
      return;
    }

    // Simple date format check: MM/DD/YYYY
    const dobPattern = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/;
    if (!dobPattern.test(dob)) {
      Alert.alert('Invalid Date Format', 'Please use MM/DD/YYYY format for date of birth.');
      return;
    }

    try {
      await setDoc(doc(firestore, 'users', uid), {
        uid,
        email,
        firstName,
        lastName,
        dateOfBirth: dob,
        phoneNumber: phone,
        accountType,
        profilePicture,
        joinedOpportunities: [],
        createdAt: new Date(),
      });

      navigation.navigate(accountType === 'teacher' ? 'TeacherHomePage' : 'StudentHomePage');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set up your profile</Text>

      <TextInput
        placeholder="First Name"
        placeholderTextColor="#888"
        style={styles.input}
        value={firstName}
        onChangeText={setFirstName}
      />

      <TextInput
        placeholder="Last Name"
        placeholderTextColor="#888"
        style={styles.input}
        value={lastName}
        onChangeText={setLastName}
      />

      <TextInput
        placeholder="Date of Birth (MM/DD/YYYY)"
        placeholderTextColor="#888"
        style={styles.input}
        value={dob}
        onChangeText={setDob}
      />

      <TextInput
        placeholder="Phone Number"
        placeholderTextColor="#888"
        style={styles.input}
        value={phone}
        keyboardType="phone-pad"
        onChangeText={setPhone}
      />

      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={accountType}
          onValueChange={(itemValue) => setAccountType(itemValue)}
          style={styles.picker}
          dropdownIconColor="#FFF"
        >
          <Picker.Item label="Student" value="student" />
          <Picker.Item label="Teacher" value="teacher" />
        </Picker>
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Finish Setup</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1C',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    color: '#FFF',
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#2E2E2E',
    color: '#FFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderColor: '#444',
    borderWidth: 1,
    fontSize: 16,
  },
  pickerWrapper: {
    backgroundColor: '#2E2E2E',
    borderRadius: 10,
    borderColor: '#444',
    borderWidth: 1,
    marginBottom: 20,
    ...Platform.select({
      android: { paddingHorizontal: 10 },
    }),
  },
  picker: {
    color: '#FFF',
    height: 50,
    width: '100%',
  },
  submitButton: {
    width: '100%',
    backgroundColor: '#1f91d6',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ProfileSetup;
