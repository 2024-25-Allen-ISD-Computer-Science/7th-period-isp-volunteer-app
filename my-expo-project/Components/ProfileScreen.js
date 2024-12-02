import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image, Switch, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { firestore, storage } from './firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { auth } from './firebaseConfig';

const ProfileScreen = ({ navigation }) => {
  const [profilePicture, setProfilePicture] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [silentMode, setSilentMode] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    // Fetch user data from Firestore
    const fetchUserData = async () => {
      try {
        const userDocRef = doc(firestore, 'users', auth.currentUser.uid);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          setFirstName(userData.firstName || 'First Name');
          setLastName(userData.lastName || 'Last Name');
          setEmail(userData.email || 'Email not provided');
          setPhoneNumber(userData.phoneNumber || 'Phone not provided');
          setProfilePicture(userData.profilePicture || '');
        } else {
          Alert.alert('Error', 'User data not found!');
        }
      } catch (error) {
        Alert.alert('Error', `Failed to fetch user data: ${error.message}`);
      }
    };

    fetchUserData();
  }, []);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission required', 'You need to grant permission to access the gallery.');
      return;
    }
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!pickerResult.canceled) {
      setProfilePicture(pickerResult.assets[0].uri);
    }
  };

  const uploadProfilePicture = async () => {
    if (!profilePicture) {
      Alert.alert('No image selected', 'Please select an image first.');
      return;
    }
    const response = await fetch(profilePicture);
    const blob = await response.blob();
    const storageRef = ref(storage, `profile_pictures/${auth.currentUser.uid}`);
    const uploadTask = uploadBytesResumable(storageRef, blob);
    uploadTask.on(
      'state_changed',
      () => {},
      (error) => Alert.alert('Upload failed', error.message),
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        const userDocRef = doc(firestore, 'users', auth.currentUser.uid);
        await updateDoc(userDocRef, { profilePicture: downloadURL });
        setProfilePicture(downloadURL);
        Alert.alert('Success', 'Profile picture updated!');
      }
    );
  };

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Yes', onPress: () => navigation.navigate('LoginScreen') },
    ]);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContainer}
      keyboardShouldPersistTaps="handled"
    >
      {/* Back and Help */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <TouchableOpacity>
          <MaterialIcons name="help-outline" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Profile Picture and Status */}
      <View style={styles.profileSection}>
        <TouchableOpacity onPress={pickImage}>
          {profilePicture ? (
            <Image source={{ uri: profilePicture }} style={styles.profileImage} />
          ) : (
            <MaterialIcons name="account-circle" size={100} color="#CCC" />
          )}
        </TouchableOpacity>
        <Text style={styles.profileName}>
          {firstName} {lastName}
        </Text>
        <Text style={styles.profileStatus}>Online</Text>
      </View>

      {/* About Me Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About Me</Text>
        <TouchableOpacity style={styles.row}>
          <MaterialIcons name="person-outline" size={24} color="#FFF" />
          <Text style={styles.rowText}>
            {firstName} {lastName}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.row}>
          <MaterialIcons name="email" size={24} color="#FFF" />
          <Text style={styles.rowText}>{email}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.row}>
          <MaterialIcons name="phone" size={24} color="#FFF" />
          <Text style={styles.rowText}>{phoneNumber}</Text>
        </TouchableOpacity>
      </View>

      {/* Settings Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        <TouchableOpacity style={styles.row}>
          <MaterialIcons name="language" size={24} color="#FFF" />
          <Text style={styles.rowText}>English</Text>
        </TouchableOpacity>
        <View style={styles.row}>
          <MaterialIcons name="notifications-off" size={24} color="#FFF" />
          <Text style={styles.rowText}>Silent Mode</Text>
          <Switch
            value={silentMode}
            onValueChange={setSilentMode}
            thumbColor="#1f91d6"
          />
        </View>
        <View style={styles.row}>
          <MaterialIcons name="dark-mode" size={24} color="#FFF" />
          <Text style={styles.rowText}>Dark Mode</Text>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            thumbColor="#1f91d6"
          />
        </View>
      </View>

      {/* Delete Button */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.row}>
          <MaterialIcons name="delete" size={24} color="red" />
          <Text style={[styles.rowText, { color: 'red' }]}>Delete Account</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={handleSignOut}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
        <Text style={styles.footerText}>Privacy & Policy</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1C',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 20,
    color: '#FFF',
    fontWeight: 'bold',
  },
  profileStatus: {
    color: '#1f91d6',
    fontSize: 16,
  },
  section: {
    padding: 15,
  },
  sectionTitle: {
    color: '#FFF',
    fontSize: 18,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  rowText: {
    color: '#FFF',
    fontSize: 16,
    marginLeft: 10,
    flex: 1,
  },
  footer: {
    alignItems: 'center',
    padding: 20,
  },
  signOutText: {
    color: '#FFF',
    fontSize: 16,
  },
  footerText: {
    color: '#888',
    fontSize: 14,
    marginTop: 5,
  },
});

export default ProfileScreen;
