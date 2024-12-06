import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Picker } from 'react-native';
import { firestore, auth } from '../firebaseConfig';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';

const CreateOpportunities = ({ navigation }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [hourValue, setHourValue] = useState('');
  const [maxSignUps, setMaxSignUps] = useState(''); // New state for maximum sign-ups
  const [communities, setCommunities] = useState([]);
  const [selectedCommunity, setSelectedCommunity] = useState('');

  // Fetch communities created by the teacher
  useEffect(() => {
    const fetchCommunities = async () => {
      const user = auth.currentUser;
      if (user) {
        const communitiesRef = collection(firestore, 'communities');
        const q = query(communitiesRef, where('createdBy', '==', user.uid));
        const querySnapshot = await getDocs(q);

        const fetchedCommunities = [];
        querySnapshot.forEach((doc) => {
          fetchedCommunities.push({ id: doc.id, communityName: doc.data().communityName });
        });

        setCommunities(fetchedCommunities);
        if (fetchedCommunities.length > 0) {
          setSelectedCommunity(fetchedCommunities[0].id); // Set default selected community
        }
      }
    };

    fetchCommunities();
  }, []);

  const handleCreateOpportunity = async () => {
    const user = auth.currentUser;

    if (user && selectedCommunity) {
      try {
        const opportunityData = {
          name,
          description,
          date,
          time,
          hourValue: parseInt(hourValue, 10),
          maxSignUps: parseInt(maxSignUps, 10), // Add maxSignUps to the data
          currentSignUps: 0, // Initialize the current sign-ups as 0
          communityId: selectedCommunity,
          createdBy: user.uid,
        };

        await addDoc(collection(firestore, 'opportunities'), opportunityData);
        Alert.alert('Success', 'Opportunity created successfully!');
        navigation.goBack(); // Go back to the previous page
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'Failed to create opportunity.');
      }
    } else {
      Alert.alert('Error', 'Please select a community.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Opportunity</Text>

      {/* Opportunity Name Input */}
      <TextInput
        style={styles.input}
        placeholder="Opportunity Name"
        value={name}
        onChangeText={setName}
      />

      {/* Description Input */}
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />

      {/* Date Input */}
      <TextInput
        style={styles.input}
        placeholder="Date (e.g., 2024-12-31)"
        value={date}
        onChangeText={setDate}
      />

      {/* Time Input */}
      <TextInput
        style={styles.input}
        placeholder="Time (e.g., 10:00-11:00)"
        value={time}
        onChangeText={setTime}
      />

      {/* Hour Value Input */}
      <TextInput
        style={styles.input}
        placeholder="Hour Value"
        value={hourValue}
        keyboardType="numeric"
        onChangeText={setHourValue}
      />

      {/* Max Sign-Ups Input */}
      <TextInput
        style={styles.input}
        placeholder="Maximum Sign-Ups"
        value={maxSignUps}
        keyboardType="numeric"
        onChangeText={setMaxSignUps}
      />

      {/* Community Picker */}
      <Text style={styles.label}>Assign to Community:</Text>
      <Picker
        selectedValue={selectedCommunity}
        onValueChange={(itemValue) => setSelectedCommunity(itemValue)}
        style={styles.picker}
      >
        {communities.map((community) => (
          <Picker.Item key={community.id} label={community.communityName} value={community.id} />
        ))}
      </Picker>

      {/* Create Opportunity Button */}
      <TouchableOpacity style={styles.createButton} onPress={handleCreateOpportunity}>
        <Text style={styles.createButtonText}>Create Opportunity</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f4f4',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  picker: {
    height: 50,
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 15,
    borderRadius: 5,
  },
  createButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default CreateOpportunities;
