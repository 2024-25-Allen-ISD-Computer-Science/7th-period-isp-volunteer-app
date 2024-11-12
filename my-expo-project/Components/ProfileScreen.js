import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker'; // Import ImagePicker
import { firestore, storage } from './firebaseConfig'; // Import firestore and storage
import { doc, getDoc, updateDoc } from 'firebase/firestore'; // Import firestore methods
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'; // Firebase storage functions
import { auth } from './firebaseConfig'; // Import auth

const ProfileScreen = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [profilePicture, setProfilePicture] = useState(null); // State for storing image URI

  useEffect(() => {
    // Fetch user data from Firestore
    const fetchUserData = async () => {
      const userDocRef = doc(firestore, 'users', auth.currentUser.uid);
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        setFirstName(userData.firstName);
        setLastName(userData.lastName);
        setPhoneNumber(userData.phoneNumber);
        setEmail(userData.email);
        if (userData.profilePicture) {
          setProfilePicture(userData.profilePicture); // Set profile picture from Firestore
        }
      } else {
        Alert.alert('Error', 'User data not found!');
      }
    };

    fetchUserData();
  }, []);

  const pickImage = async () => {
    try {
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
    } catch (error) {
      Alert.alert('Error', `Failed to pick image: ${error.message}`);
    }
  };

  const uploadProfilePicture = async () => {
    if (!profilePicture) {
      Alert.alert('No image selected', 'Please select an image first.');
      return;
    }
  
    try {
      const response = await fetch(profilePicture);
      const blob = await response.blob();
  
      const storageRef = ref(storage, `profile_pictures/${auth.currentUser.uid}`);
      const uploadTask = uploadBytesResumable(storageRef, blob);
  
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          Alert.alert('Upload failed', error.message);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          updateProfilePictureURL(downloadURL); // Firestore Update
        }
      );
    } catch (error) {
      Alert.alert('Error', `Image upload failed: ${error.message}`);
    }
  };
  

  const updateProfilePictureURL = async (url) => {
    try {
      const userDocRef = doc(firestore, 'users', auth.currentUser.uid);
      await updateDoc(userDocRef, { profilePicture: url }); // Update Firestore with the new image URL
      Alert.alert('Success', 'Profile picture updated!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile picture: ' + error.message);
    }
  };

  const handleSaveChanges = async () => {
    try {
      const userDocRef = doc(firestore, 'users', auth.currentUser.uid);
      await updateDoc(userDocRef, {
        firstName: firstName,
        lastName: lastName,
        phoneNumber: phoneNumber,
      });

      Alert.alert('Success', 'Profile updated successfully!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile: ' + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate('HomePage')}      
        >
        <Text style={styles.buttonText}>Back to Home</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Profile</Text>

      <View style={styles.profileImageContainer}>
        {profilePicture ? (
          <Image source={{ uri: profilePicture }} style={styles.profileImage} />
        ) : (
          <Text style={styles.profileImageText}>No profile picture</Text>
        )}
      </View>

      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>Pick a Profile Picture</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={uploadProfilePicture}>
        <Text style={styles.buttonText}>Upload Profile Picture</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
      />

      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
      />

      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        editable={false} 
      />

      <TouchableOpacity style={styles.button} onPress={handleSaveChanges}>
        <Text style={styles.buttonText}>Save Changes</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  profileImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    marginBottom: 20,
    alignSelf: 'center',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  profileImageText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#aaa',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#443939',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  backButton: {
    position: 'absolute',
    top: 40,               
    right: 20,            
    backgroundColor: '#1f91d6',  
    paddingVertical: 10,  
    paddingHorizontal: 20, 
    borderRadius: 5,      
    alignItems: 'center', 
    justifyContent: 'center',
  },


});

export default ProfileScreen;
