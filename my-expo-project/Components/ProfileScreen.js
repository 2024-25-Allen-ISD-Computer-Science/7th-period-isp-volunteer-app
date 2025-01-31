import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Alert, Image, Switch, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { firestore, storage } from './firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { auth } from './firebaseConfig';
import { getAuth, signOut } from "firebase/auth";


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
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('Permission Required', 'Please allow access to your media library.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        setProfilePicture(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', `Failed to pick image: ${error.message}`);
    }
  };

  const convertUriToBlob = async (uri) => {
    const response = await fetch(uri);
    return await response.blob();
  };

  const updateFirestoreProfilePicture = async (url) => {
    try {
      const userDocRef = doc(firestore, 'users', auth.currentUser.uid);
      await updateDoc(userDocRef, { profilePicture: url });
    } catch (error) {
      Alert.alert('Error', `Failed to update profile picture in Firestore: ${error.message}`);
    }
  };

  const handleImageUpload = async () => {
    if (!profilePicture) {
      Alert.alert('No Image Selected', 'Please select an image to upload.');
      return;
    }

    try {
      const blob = await convertUriToBlob(profilePicture);
      const storageRef = ref(storage, `profile_pictures/${auth.currentUser.uid}`);
      const uploadTask = uploadBytesResumable(storageRef, blob);

      uploadTask.on(
        'state_changed',
        null,
        (error) => {
          Alert.alert('Upload Failed', error.message);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          await updateFirestoreProfilePicture(downloadURL);
          setProfilePicture(downloadURL);
          Alert.alert('Success', 'Profile picture updated successfully!');
        }
      );
    } catch (error) {
      Alert.alert('Error', `Image upload failed: ${error.message}`);
    }
  };

  const handleSignOut = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        // Navigate to the authentication screen after successful sign out
        navigation.navigate('Auth');
      })
      .catch((error) => {
        console.error("Sign-out error:", error);
      });
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
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={handleImageUpload}
        >
          <Text style={styles.uploadButtonText}>Upload Profile Picture</Text>
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
          <TextInput style={styles.rowText} value={firstName}
            onChangeText={(value) => {
            setFirstName(value);
            handleFieldUpdate('firstName', value); // Auto-save functionality (first name and last name are separate text fields)
          }}/>
          <TextInput
            style={styles.rowText}
            value={lastName}
            onChangeText={(value) => {
              setLastName(value); //Can change by clicking into it (the value is temporarily and then permanently stored)
              handleFieldUpdate('lastName', value); // Auto-save functionality
            }}
          />
        
        </TouchableOpacity>
        <TouchableOpacity style={styles.row}>
          <MaterialIcons name="email" size={24} color="#FFF" />
          <TextInput
            style={styles.rowText}
            value={email}
            onChangeText={(value) => {
              setEmail(value); //Can change by clicking into it (the value is temporarily and then permanently stored)
              handleFieldUpdate('email', value); // Auto-save functionality
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.row}>
          <MaterialIcons name="phone" size={24} color="#FFF" />
          <TextInput
            style={styles.rowText}
            value={phoneNumber}
            keyboardType="phone-pad"
            onChangeText={(value) => {
              setPhoneNumber(value); //Can change by clicking into it (the value is temporarily and then permanently stored)
              handleFieldUpdate('phoneNumber', value); // Auto-save functionality
            }}
          />
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
