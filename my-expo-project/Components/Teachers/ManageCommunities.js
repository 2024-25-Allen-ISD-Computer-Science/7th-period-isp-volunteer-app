import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, TextInput, ActivityIndicator } from 'react-native';
import { DatePickerModal } from 'react-native-paper-dates'; // Use the working date picker
import { auth, firestore } from '../firebaseConfig';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { MaterialIcons } from '@expo/vector-icons';
import { Provider as PaperProvider } from 'react-native-paper'; // Required for DatePickerModal

const ManageCommunities = ({ navigation }) => {
  const [communities, setCommunities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Input fields for new community
  const [communityName, setCommunityName] = useState('');
  const [description, setDescription] = useState('');
  const [hourGoal, setHourGoal] = useState('');
  const [endDate, setEndDate] = useState(new Date()); // Default to today
  const [showDatePicker, setShowDatePicker] = useState(false); // Controls date picker visibility

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
      if (!communityName || !description || !hourGoal || !endDate) {
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
          endDate: endDate.toISOString(), // Store as ISO string
        };

        // Add to Firestore
        const docRef = await addDoc(collection(firestore, 'communities'), newCommunity);
        Alert.alert('Success', 'Community created successfully!');
        setIsLoading(false);

        // Clear input fields
        setCommunityName('');
        setDescription('');
        setHourGoal('');
        setEndDate(new Date());

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
    <PaperProvider>
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

        {/* End Date Picker Button */}
        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePickerButton}>
          <Text style={styles.datePickerText}>📅 Select Due Date: {endDate.toDateString()}</Text>
        </TouchableOpacity>

        {/* Date Picker Modal */}
        <DatePickerModal
          locale="en"
          mode="single"
          visible={showDatePicker}
          onDismiss={() => setShowDatePicker(false)} // Close when dismissed
          date={endDate}
          onConfirm={(params) => {
            setShowDatePicker(false);
            setEndDate(params.date);
          }}
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
              <Text style={styles.communityEndDate}>📅 Due: {new Date(item.endDate).toDateString()}</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={<Text style={styles.noCommunitiesText}>No communities found.</Text>}
        />
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1C',
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
  datePickerButton: {
    backgroundColor: '#444',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  datePickerText: {
    color: '#FFF',
    fontSize: 16,
  },
  createButton: {
    backgroundColor: '#1f91d6',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
  },
  communityBox: {
    backgroundColor: '#2E2E2E',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#444',
  },
  communityEndDate: {
    fontSize: 14,
    color: '#FFA500',
    fontWeight: 'bold',
    marginTop: 5,
  },
});

export default ManageCommunities;
