import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert, ScrollView } from 'react-native';
import { firestore, auth } from './firebaseConfig';
import { doc, getDoc, collection, addDoc } from 'firebase/firestore';

const LogHoursScreen = ({ route, navigation }) => {
  const [joinedCommunities, setJoinedCommunities] = useState([]);
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [hours, setHours] = useState('');
  const [activityName, setActivityName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactName, setContactName] = useState('');
  const [description, setDescription] = useState('');

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

  const handleRequestApproval = async () => {
    if (!hours || isNaN(hours) || Number(hours) <= 0 || !activityName || !date || !time || !contactEmail || !contactName || !description) {
      Alert.alert('Invalid input', 'Please fill in all fields with valid information.');
      return;
    }

    try {
      const hourRequest = {
        userId: auth.currentUser.uid,
        communityId: selectedCommunity.communityId,
        communityName: selectedCommunity.communityName,
        activityName,
        date,
        time,
        hours: parseFloat(hours),
        contactEmail,
        contactName,
        description,
        status: 'Pending',
      };

      await addDoc(collection(firestore, 'hourRequests'), hourRequest);

      Alert.alert('Success', 'Your hour log request has been submitted for approval.');
      setHours('');
      setActivityName('');
      setDate('');
      setTime('');
      setContactEmail('');
      setContactName('');
      setDescription('');
    } catch (error) {
      Alert.alert('Error', 'Failed to submit hour log request: ' + error.message);
    }
  };

  const renderCommunity = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.communityBox,
        item.communityId === selectedCommunity?.communityId && styles.selectedBox,
      ]}
      onPress={() => setSelectedCommunity(item)}
    >
      <Text style={styles.communityTitle}>{item.communityName}</Text>
      <Text>Hours Logged: {item.hoursLogged || 0}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Log Hours Request</Text>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate('StudentHomePage')}
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
            Requesting hours for: {selectedCommunity.communityName}
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Activity Name"
            value={activityName}
            onChangeText={setActivityName}
          />
          <TextInput
            style={styles.input}
            placeholder="Date (YYYY-MM-DD)"
            value={date}
            onChangeText={setDate}
          />
          <TextInput
            style={styles.input}
            placeholder="Time (HH:MM)"
            value={time}
            onChangeText={setTime}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter hours"
            keyboardType="numeric"
            value={hours}
            onChangeText={setHours}
          />
          <TextInput
            style={styles.input}
            placeholder="Contact Verification Email"
            value={contactEmail}
            onChangeText={setContactEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Contact Verification Name"
            value={contactName}
            onChangeText={setContactName}
          />
          <TextInput
            style={styles.input}
            placeholder="Description of Activity"
            multiline
            value={description}
            onChangeText={setDescription}
          />
          <TouchableOpacity style={styles.logButton} onPress={handleRequestApproval}>
            <Text style={styles.logButtonText}>Request Approval</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text style={styles.selectCommunityText}>Select a community.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
