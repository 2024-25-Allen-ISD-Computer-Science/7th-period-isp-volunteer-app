import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert, ScrollView } from 'react-native';
import { DatePickerModal } from 'react-native-paper-dates';
import { MaterialIcons } from '@expo/vector-icons';
import { firestore, auth, functions } from './firebaseConfig';
import { doc, getDoc, collection, addDoc } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { Provider as PaperProvider } from 'react-native-paper';

const LogHoursScreen = ({ navigation }) => {
  const [joinedCommunities, setJoinedCommunities] = useState([]);
  const [selectedCommunities, setSelectedCommunities] = useState([]);
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [activityName, setActivityName] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [contactEmail, setContactEmail] = useState('');
  const [contactName, setContactName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDoc = await getDoc(doc(firestore, 'users', auth.currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setJoinedCommunities(userData.joinedCommunities || []);
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch user data: ' + error.message);
      }
    };
    fetchUserData();
  }, []);

  const toggleCommunitySelection = (community) => {
    setSelectedCommunities((prev) => {
      if (prev.some((c) => c.communityId === community.communityId)) {
        return prev.filter((c) => c.communityId !== community.communityId);
      } else {
        return [...prev, community];
      }
    });
  };

  const handleSubmit = async () => {
    if (selectedCommunities.length === 0 || !activityName || !hours || !minutes || !contactEmail || !contactName) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    try {
      for (const community of selectedCommunities) {
        const newRequest = {
          userId: auth.currentUser.uid,
          communityId: community.communityId,
          communityName: community.communityName,
          activityName,
          hours: parseInt(hours),
          minutes: parseInt(minutes),
          date: date.toISOString(),
          contactEmail,
          contactName,
          description,
          status: 'pending',
          createdAt: new Date(),
        };
        await addDoc(collection(firestore, 'hourRequests'), newRequest);
      }
      Alert.alert('Success', 'Your hours have been submitted for verification.');
      setActivityName('');
      setHours('');
      setMinutes('');
      setContactEmail('');
      setContactName('');
      setDescription('');
      setSelectedCommunities([]);
    } catch (error) {
      Alert.alert('Error', 'Failed to submit hours: ' + error.message);
    }
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Text style={styles.title}>Log Hours & Submit Opportunity</Text>

        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.sectionTitle}>Select Communities</Text>
          <FlatList
            data={joinedCommunities}
            keyExtractor={(item) => item.communityId}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.communityBox, selectedCommunities.some((c) => c.communityId === item.communityId) && styles.selectedBox]}
                onPress={() => toggleCommunitySelection(item)}
              >
                <Text style={styles.communityTitle}>{item.communityName}</Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={<Text style={styles.emptyText}>No communities found.</Text>}
          />

          <Text style={styles.sectionTitle}>Log Hours</Text>
          <View style={styles.timeContainer}>
            <TextInput style={[styles.input, styles.timeInput]} placeholder="Hours" keyboardType="numeric" value={hours} onChangeText={setHours} />
            <TextInput style={[styles.input, styles.timeInput]} placeholder="Minutes" keyboardType="numeric" value={minutes} onChangeText={setMinutes} />
          </View>
          <TextInput style={styles.input} placeholder="Activity Name" value={activityName} onChangeText={setActivityName} />
          <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePickerButton}>
            <Text style={styles.datePickerText}>{date.toDateString()}</Text>
          </TouchableOpacity>
          <DatePickerModal
            locale="en"
            mode="single"
            visible={showDatePicker}
            onDismiss={() => setShowDatePicker(false)}
            date={date}
            onConfirm={(params) => {
              setShowDatePicker(false);
              setDate(params.date);
            }}
          />
          <TextInput style={styles.input} placeholder="Contact Email" value={contactEmail} onChangeText={setContactEmail} />
          <TextInput style={styles.input} placeholder="Contact Name" value={contactName} onChangeText={setContactName} />
          <TextInput style={styles.input} placeholder="Description" multiline value={description} onChangeText={setDescription} />
          <TouchableOpacity style={styles.logButton} onPress={handleSubmit}>
            <Text style={styles.logButtonText}>Submit</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1C1C1C', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#FFF', textAlign: 'center', marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFF', marginBottom: 10 },
  communityBox: { backgroundColor: '#2E2E2E', padding: 15, borderRadius: 10, marginBottom: 10 },
  selectedBox: { borderColor: '#1f91d6', borderWidth: 2 },
  communityTitle: { color: '#FFF', fontSize: 16 },
  input: { backgroundColor: '#000', color: '#FFF', padding: 10, borderRadius: 5, marginBottom: 10 },
  logButton: { backgroundColor: '#1f91d6', padding: 15, borderRadius: 5, alignItems: 'center' },
  logButtonText: { color: '#FFF', fontSize: 16 },
});

export default LogHoursScreen;