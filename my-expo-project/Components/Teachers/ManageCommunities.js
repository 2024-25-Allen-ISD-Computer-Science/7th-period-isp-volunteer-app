import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, TextInput, ActivityIndicator } from 'react-native';
import { auth, firestore } from '../firebaseConfig';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { MaterialIcons } from '@expo/vector-icons';

const ManageCommunities = ({ navigation }) => {
  const [communities, setCommunities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Input fields for new community
  const [communityName, setCommunityName] = useState('');
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

  // Create a new community
  const handleCreateCommunity = async () => {
    const user = auth.currentUser;
    if (user) {
      if (!communityName || !description || !hourGoal) {
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
          communityName,
          description,
          hourGoal: Number(hourGoal),
          createdBy: user.uid,
        };

        // Add to Firestore
        const docRef = await addDoc(collection(firestore, 'communities'), newCommunity);
        Alert.alert('Success', 'Community created successfully!');
        setIsLoading(false);

        // Clear input fields
        setCommunityName('');
        setDescription('');
        setHourGoal('');

        // Navigate to settings
        navigation.navigate('ManageCommunitySettings', { communityId: docRef.id });
      } catch (error) {
        setIsLoading(false);
        Alert.alert('Error', 'Failed to create community.');
        console.error(error);
      }
    }
  };

  // Navigate to community settings
  const handleCommunityClick = (communityId) => {
    navigation.navigate('ManageCommunitySettings', { communityId });
  };

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Manage Communities</Text>

      {/* Input fields */}
      <TextInput
        style={styles.input}
        placeholder="Community Name"
        placeholderTextColor="#888"
        value={communityName}
        onChangeText={setCommunityName}
      />
      <TextInput
        style={styles.input}
        placeholder="Community Description"
        placeholderTextColor="#888"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Hour Goal"
        placeholderTextColor="#888"
        keyboardType="numeric"
        value={hourGoal}
        onChangeText={setHourGoal}
      />

      {/* Create Button */}
      <TouchableOpacity
        style={[styles.createButton, isLoading && styles.disabledButton]}
        onPress={handleCreateCommunity}
        disabled={isLoading}
      >
        {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.createButtonText}>Create Community</Text>}
      </TouchableOpacity>

      {/* List of Communities */}
      <FlatList
        data={communities}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.communityBox}
            onPress={() => handleCommunityClick(item.id)}
          >
            <View style={styles.communityHeader}>
              <Text style={styles.communityName}>{item.communityName}</Text>
              <MaterialIcons name="arrow-forward-ios" size={18} color="#bbb" />
            </View>
            <Text style={styles.communityDescription}>{item.description}</Text>
            <Text style={styles.communityGoal}>🎯 Goal: {item.hourGoal} hours</Text>
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
    backgroundColor: '#1C1C1C', // Dark background
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#333',
    color: '#FFF',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#555',
    marginBottom: 10,
  },
  createButton: {
    backgroundColor: '#1f91d6',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#555',
  },
  communityBox: {
    backgroundColor: '#2E2E2E',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#444',
  },
  communityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  communityName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  communityDescription: {
    fontSize: 14,
    color: '#CCC',
    marginBottom: 5,
  },
  communityGoal: {
    fontSize: 14,
    color: '#1f91d6',
    fontWeight: 'bold',
  },
  noCommunitiesText: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default ManageCommunities;