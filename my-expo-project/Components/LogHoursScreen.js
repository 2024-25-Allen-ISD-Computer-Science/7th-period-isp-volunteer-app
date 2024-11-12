import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { firestore, auth } from './firebaseConfig'; // Import firestore and auth from Firebase
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const LogHoursScreen = ({ route, navigation }) => {
  const { communityId, communityName } = route.params;  // Get community info passed from previous screen
  const [hours, setHours] = useState('');
  const [userData, setUserData] = useState(null);

  // Fetch user data (hours logged in communities) when screen loads
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDocRef = doc(firestore, 'users', auth.currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch user data: ' + error.message);
      }
    };
    
    fetchUserData();
  }, []);

  const handleLogHours = async () => {
    if (!hours || isNaN(hours) || Number(hours) <= 0) {
      Alert.alert('Invalid input', 'Please enter a valid number of hours');
      return;
    }

    try {
      const userDocRef = doc(firestore, 'users', auth.currentUser.uid);
      const userDoc = await getDoc(userDocRef);
      const userData = userDoc.data();
      
      const updatedCommunities = userData.joinedCommunities.map((community) => {
        if (community.communityId === communityId) {
          return {
            ...community,
            hoursLogged: community.hoursLogged + parseFloat(hours),  // Add logged hours to the community
          };
        }
        return community;
      });

      // Update the user document with the new logged hours
      await updateDoc(userDocRef, {
        joinedCommunities: updatedCommunities,
      });

      Alert.alert('Success', `You have logged ${hours} hours for ${communityName}!`);
      navigation.goBack(); // Navigate back after success
    } catch (error) {
      Alert.alert('Error', 'Failed to log hours: ' + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log Hours for {communityName}</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Enter hours worked"
        keyboardType="numeric"
        value={hours}
        onChangeText={setHours}
      />
      
      <TouchableOpacity style={styles.button} onPress={handleLogHours}>
        <Text style={styles.buttonText}>Log Hours</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    width: '80%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#443939',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default LogHoursScreen;
