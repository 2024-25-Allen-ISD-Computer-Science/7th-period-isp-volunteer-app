import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import { firestore, auth } from './firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const LogHoursScreen = ({ route, navigation }) => {
  const [joinedCommunities, setJoinedCommunities] = useState([]);
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [hours, setHours] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDoc = await getDoc(doc(firestore, 'users', auth.currentUser.uid));
        if (userDoc.exists()) {
          setJoinedCommunities(userDoc.data().joinedCommunities || []);
        } else {
          Alert.alert('Error', 'No communities found.');
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
        if (community.communityId === selectedCommunity.communityId) {
          return {
            ...community,
            hoursLogged: (community.hoursLogged || 0) + parseFloat(hours),
          };
        }
        return community;
      });

      await updateDoc(userDocRef, {
        joinedCommunities: updatedCommunities,
      });

      setJoinedCommunities(updatedCommunities);

      Alert.alert('Success', `You have logged ${hours} hours for ${selectedCommunity.communityName}!`);
      setHours(''); 
    } catch (error) {
      Alert.alert('Error', 'Failed to log hours: ' + error.message);
    }
  };

  const renderCommunity = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.communityBox,
        item.communityId === selectedCommunity?.communityId && styles.selectedBox,
      ]}
      onPress={() => {
        setSelectedCommunity(item);  // Set the entire community object as selected
      }}
    >
      <Text style={styles.communityTitle}>{item.communityName}</Text> 
      <Text>Hours Logged: {item.hoursLogged || 0}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log Hours</Text>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate('HomePage')}
      >
        <Text style={styles.buttonText}>Back to Home</Text>
      </TouchableOpacity>

      <FlatList
        data={joinedCommunities}
        keyExtractor={(item) => item.communityId}
        renderItem={renderCommunity}
        ListEmptyComponent={<Text>No communities found.</Text>}
      />

      {selectedCommunity ? (
        <>
          <Text style={styles.selectedCommunityText}>
            Logging hours for: {selectedCommunity.communityName}
          </Text>
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
      ) : (
        <Text style={styles.selectCommunityText}>Select a community.</Text>
      )}
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
  selectedCommunityText: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
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
  backButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: '#1f91d6',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
});

export default LogHoursScreen;
