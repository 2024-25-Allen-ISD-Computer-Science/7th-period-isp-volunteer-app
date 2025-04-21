import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DatePickerModal } from 'react-native-paper-dates';
import { firestore, auth, functions } from './firebaseConfig';
import { doc, getDoc, collection, addDoc } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { Provider as PaperProvider } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

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
    if (
      selectedCommunities.length === 0 ||
      !activityName ||
      !hours ||
      !minutes ||
      !contactEmail ||
      !contactName
    ) {
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

      const sendEmail = httpsCallable(functions, 'sendEmail');
      await sendEmail({
        to: contactEmail,
        subject: 'Hour Submission Verification',
        message: `Hello ${contactName},\n\n${auth.currentUser.displayName} has submitted volunteer hours for verification. Please review.`,
      });

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
      <SafeAreaView style={styles.safeArea} edges={['top']}> {/* Only apply safe area padding to the top (e.g. notch, status bar */}
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Log Hours & Submit Opportunity</Text>

          <Text style={styles.sectionTitle}>Select Communities</Text>
          <View style={styles.communityList}>
            {joinedCommunities.length === 0 ? (
              <Text style={styles.emptyText}>No communities found.</Text>
            ) : (
              joinedCommunities.map((item) => (
                <TouchableOpacity
                  key={item.communityId}
                  style={[
                    styles.communityBox,
                    selectedCommunities.some((c) => c.communityId === item.communityId) && styles.selectedBox,
                  ]}
                  onPress={() => toggleCommunitySelection(item)}
                >
                  <Text style={styles.communityTitle}>{item.communityName}</Text>
                </TouchableOpacity>
              ))
            )}
          </View>

          <Text style={styles.sectionTitle}>Log Hours</Text>
          <View style={styles.timeContainer}>
            <TextInput
              style={[styles.input, styles.timeInput]}
              placeholder="Hours"
              keyboardType="numeric"
              value={hours}
              onChangeText={setHours}
              placeholderTextColor="#888"
            />
            <TextInput
              style={[styles.input, styles.timeInput]}
              placeholder="Minutes"
              keyboardType="numeric"
              value={minutes}
              onChangeText={setMinutes}
              placeholderTextColor="#888"
            />
          </View>
          <TextInput
            style={styles.input}
            placeholder="Activity Name"
            value={activityName}
            onChangeText={setActivityName}
            placeholderTextColor="#888"
          />
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
          <TextInput
            style={styles.input}
            placeholder="Contact Email"
            value={contactEmail}
            onChangeText={setContactEmail}
            placeholderTextColor="#888"
          />
          <TextInput
            style={styles.input}
            placeholder="Contact Name"
            value={contactName}
            onChangeText={setContactName}
            placeholderTextColor="#888"
          />
          <TextInput
            style={styles.input}
            placeholder="Description"
            multiline
            value={description}
            onChangeText={setDescription}
            placeholderTextColor="#888"
          />
          <TouchableOpacity style={styles.logButton} onPress={handleSubmit}>
            <Text style={styles.logButtonText}>Submit</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => navigation.navigate('StudentHomePage')}>
          <MaterialIcons name="home" size={30} color="white" />
        </TouchableOpacity>
        <TouchableOpacity>
          <MaterialIcons name="search" size={30} color="white" />
        </TouchableOpacity>
        <TouchableOpacity>
          <MaterialIcons name="favorite" size={30} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('ProfileScreen')}>
          <MaterialIcons name="person" size={30} color="white" />
        </TouchableOpacity>
      </View>
          </PaperProvider>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1C1C1C',
  },
  container: {
    padding: 20,
    paddingBottom: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 10,
  },
  communityList: {
    marginBottom: 20,
  },
  communityBox: {
    backgroundColor: '#2E2E2E',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  selectedBox: {
    borderColor: '#1f91d6',
    borderWidth: 2,
  },
  communityTitle: {
    color: '#FFF',
    fontSize: 16,
  },
  emptyText: {
    color: '#999',
    fontStyle: 'italic',
  },
  input: {
    backgroundColor: '#000',
    color: '#FFF',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  timeContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  timeInput: {
    flex: 1,
  },
  datePickerButton: {
    backgroundColor: '#2E2E2E',
    padding: 12,
    borderRadius: 5,
    marginBottom: 10,
  },
  datePickerText: {
    color: '#FFF',
  },
  logButton: {
    backgroundColor: '#1f91d6',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  logButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#2E2E2E',
    paddingVertical: 10,
    zIndex: 100,
  }
});

export default LogHoursScreen;
