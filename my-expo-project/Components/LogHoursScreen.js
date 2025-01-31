import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert, ScrollView } from 'react-native';
import { firestore, auth } from './firebaseConfig';
import { doc, getDoc, collection, addDoc, query, where, getDocs } from 'firebase/firestore';

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
  const [opportunities, setOpportunities] = useState([]);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDoc = await getDoc(doc(firestore, 'users', auth.currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setJoinedCommunities(userData.joinedCommunities || []);
          
          // Fetch opportunities for the selected community
          if (userData.joinedCommunities?.length) {
            const opportunitiesQuery = query(
              collection(firestore, 'opportunities'),
              where('communityId', 'in', userData.joinedCommunities.map((community) => community.communityId))
            );
            const opportunitySnapshot = await getDocs(opportunitiesQuery);
            const opportunitiesList = opportunitySnapshot.docs.map((doc) => doc.data());
            setOpportunities(opportunitiesList);
          }
        } else {
          Alert.alert('Error', 'No communities found.');
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch user data: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleCommunitySelect = (community) => {
    if (selectedCommunity?.communityId === community.communityId) {
      setSelectedCommunity(null);
    } else {
      setSelectedCommunity(community);
    }
  };

  const handleOpportunitySelect = (opportunity) => {
    if (selectedOpportunity?.name === opportunity.name) {
      setSelectedOpportunity(null);
    } else {
      setSelectedOpportunity(opportunity);
    }
  };

  const handleSubmitOpportunity = async () => {
    if (!activityName || !date || !time || !contactEmail || !contactName || !description) {
      Alert.alert('Invalid input', 'Please fill in all fields with valid information.');
      return;
    }

    try {
      const opportunityData = {
        communityId: selectedCommunity.communityId,
        createdBy: auth.currentUser.uid,
        date,
        description,
        hourValue: parseFloat(hours),
        name: activityName,
        time,
      };

      await addDoc(collection(firestore, 'opportunities'), opportunityData);

      Alert.alert('Success', 'Opportunity submitted successfully.');
      setActivityName('');
      setDate('');
      setTime('');
      setContactEmail('');
      setContactName('');
      setDescription('');
    } catch (error) {
      Alert.alert('Error', 'Failed to submit opportunity: ' + error.message);
    }
  };

  const handleLogHours = async () => {
    if (!hours || isNaN(hours) || Number(hours) <= 0) {
      Alert.alert('Invalid input', 'Please enter a valid number of hours.');
      return;
    }

    try {
      const logData = {
        opportunityId: selectedOpportunity.name,  // use name as ID or set your own unique ID
        userId: auth.currentUser.uid,
        hours: parseFloat(hours),
        date: new Date().toISOString(),
        status: 'Pending',  // pending approval by teacher
      };

      await addDoc(collection(firestore, 'hourRequests'), logData);  // Storing the request in a separate collection

      Alert.alert('Success', 'Your hour log has been submitted for approval.');
      setHours('');
      setSelectedOpportunity(null);
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
      onPress={() => handleCommunitySelect(item)}
    >
      <Text style={styles.communityTitle}>{item.communityName}</Text>
      <Text>Hours Logged: {item.hoursLogged || 0}</Text>
    </TouchableOpacity>
  );

  const renderOpportunity = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.communityBox,
        item.name === selectedOpportunity?.name && styles.selectedBox,
      ]}
      onPress={() => handleOpportunitySelect(item)}
    >
      <Text style={styles.communityTitle}>{item.name}</Text>
      <Text>Date: {item.date}</Text>
      <Text>Time: {item.time}</Text>
      <Text>Description: {item.description}</Text>
      <Text>Hour Value: {item.hourValue}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading data...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Log Hours & Submit Opportunity</Text>
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

          {/* Opportunities Section */}
          <FlatList
            data={opportunities}
            keyExtractor={(item) => item.name}
            renderItem={renderOpportunity}
            ListEmptyComponent={<Text>No opportunities found for this community.</Text>}
          />

          {selectedOpportunity ? (
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
          ) : (
            <>
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
              <TouchableOpacity style={styles.logButton} onPress={handleSubmitOpportunity}>
                <Text style={styles.logButtonText}>Submit Opportunity</Text>
              </TouchableOpacity>
            </>
          )}
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