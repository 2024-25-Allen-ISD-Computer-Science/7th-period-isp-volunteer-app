import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import { firestore, auth } from './firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const LogHoursScreen = ({ route, navigation }) => {
  const [joinedCommunities, setJoinedCommunities] = useState([]);
  const [selectedCommunityId, setSelectedCommunityId] = useState(null);
  const [selectedCommunityName, setSelectedCommunityName] = useState('');
  const [hours, setHours] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDoc = await getDoc(doc(firestore, 'users', auth.currentUser.uid));
        if (userDoc.exists()) {
          setJoinedCommunities(userDoc.data().joinedCommunities || []);
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch user data: ' + error.message);
      }
    };

    fetchUserData();
  }, []);

  // Handle logging hours for the selected community
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
        if (community.communityId === selectedCommunityId) {
          return {
            ...community,
            hoursLogged: community.hoursLogged + parseFloat(hours),  // Update hours locally
          };
        }
        return community;
      });

      // Update the user document in Firestore
      await updateDoc(userDocRef, {
        joinedCommunities: updatedCommunities,
      });

      // Update the local state to reflect new hours
      setJoinedCommunities(updatedCommunities);

      Alert.alert('Success', `You have logged ${hours} hours for ${selectedCommunityName}!`);
      setHours(''); // Reset input field
    } catch (error) {
      Alert.alert('Error', 'Failed to log hours: ' + error.message);
    }
  };

  const renderCommunity = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.communityBox,
        item.communityId === selectedCommunityId && styles.selectedBox,
      ]}
      onPress={() => {
        setSelectedCommunityId(item.communityId);
        setSelectedCommunityName(item.name);  // Set the selected community's name
      }}
    >
      <Text style={styles.communityTitle}>{item.name}</Text>
      <Text>Hours Logged: {item.hoursLogged || 0}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log Hours</Text>
      <FlatList
        data={joinedCommunities}
        keyExtractor={(item) => item.communityId}
        renderItem={renderCommunity}
      />

      {selectedCommunityId && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Enter hours"
            keyboardType="numeric"
            value={hours}
            onChangeText={setHours}
          />

          <TouchableOpacity style={styles.logButton} onPress={handleLogHours}>
            <Text style={styles.logButtonText}>Log Hours</Text>
          </TouchableOpacity>
        </>
      )}
      {!selectedCommunityId && <Text style={styles.selectCommunityText}>Please select a community to log hours.</Text>}
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
    fontWeight: 'bold',
    marginBottom: 10,
  },
  communityBox: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  selectedBox: {
    borderColor: '#443939',
    borderWidth: 2,
  },
  communityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
    width: '100%',
  },
  logButton: {
    backgroundColor: '#443939',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  logButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  selectCommunityText: {
    marginTop: 10,
    color: '#888',
    fontSize: 16,
  },
});

export default LogHoursScreen;
