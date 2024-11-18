import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, TextInput } from 'react-native';
import { auth, firestore } from '../firebaseConfig';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const ManageCommunities = ({ navigation }) => {
  const [communities, setCommunities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // New community input fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [hourGoal, setHourGoal] = useState('');

  // Fetch communities
  useEffect(() => {
    const fetchCommunities = async () => {
      const communitiesRef = collection(firestore, 'communities');
      const querySnapshot = await getDocs(communitiesRef);

      const communitiesList = [];
      querySnapshot.forEach((doc) => {
        communitiesList.push({ id: doc.id, ...doc.data() });
      });

      setCommunities(communitiesList);
    };

    fetchCommunities();
  }, []);

  // Logic to create a new community
  const handleCreateCommunity = async () => {
    const user = auth.currentUser;
    if (user) {
      // Validate input
      if (!name || !description || !hourGoal) {
        Alert.alert('Error', 'Please fill in all fields');
        return;
      }

      if (isNaN(hourGoal) || Number(hourGoal) <= 0) {
        Alert.alert('Error', 'Please enter a valid hour goal');
        return;
      }

      try {
        setIsLoading(true);

        // New community data
        const newCommunity = {
          name,
          description,
          hourGoal: Number(hourGoal),
          createdBy: user.uid, // Teacher's UID
        };

        // Add the new community to Firestore
        const docRef = await addDoc(collection(firestore, 'communities'), newCommunity);
        Alert.alert('Success', 'Community created successfully!');
        setIsLoading(false);

        // Clear input fields
        setName('');
        setDescription('');
        setHourGoal('');

        // Navigate to the community settings page
        navigation.navigate('ManageCommunitySettings', { communityId: docRef.id });
      } catch (error) {
        setIsLoading(false);
        Alert.alert('Error', 'Failed to create community.');
        console.error(error);
      }
    }
  };

  // Navigate to the community settings page when a community is clicked
  const handleCommunityClick = (communityId) => {
    navigation.navigate('ManageCommunitySettings', { communityId });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Communities</Text>

      {/* Input fields for creating a community */}
      <TextInput
        style={styles.input}
        placeholder="Community Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Community Description"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Hour Goal"
        keyboardType="numeric"
        value={hourGoal}
        onChangeText={setHourGoal}
      />

      {/* Button to create new community */}
      <TouchableOpacity
        style={styles.createButton}
        onPress={handleCreateCommunity}
        disabled={isLoading}
      >
        <Text style={styles.createButtonText}>{isLoading ? 'Creating...' : 'Create New Community'}</Text>
      </TouchableOpacity>

      {/* List of existing communities */}
      <FlatList
        data={communities}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.communityBox}
            onPress={() => handleCommunityClick(item.id)}
          >
            <Text style={styles.communityName}>{item.name}</Text>
            <Text style={styles.communityDescription}>{item.description}</Text>
            <Text style={styles.communityGoal}>Hour Goal: {item.hourGoal}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.noCommunitiesText}>No communities found.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
  },
  createButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  communityBox: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  communityName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  communityDescription: {
    fontSize: 14,
    color: '#777',
  },
  communityGoal: {
    fontSize: 14,
    color: '#444',
  },
  noCommunitiesText: {
    fontSize: 16,
    color: '#aaa',
    textAlign: 'center',
  },
});

export default ManageCommunities;
