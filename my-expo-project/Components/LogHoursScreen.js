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
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [activityName, setActivityName] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [contactEmail, setContactEmail] = useState('');
  const [contactName, setContactName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);

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
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const sendVerificationEmail = async () => {
    if (!contactEmail || !contactName || !selectedCommunity || !activityName) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    const emailFunction = httpsCallable(functions, 'sendEmail');

    try {
      const response = await emailFunction({
        to: contactEmail,
        subject: `Verify Hours for ${activityName}`,
        message: `Hello ${contactName},\n\nPlease verify the hours for the student participating in ${activityName} within the ${selectedCommunity.communityName} community.\n\nThank you!`,
      });

      if (response.data.success) {
        Alert.alert('Success', 'Verification email sent successfully.');
      } else {
        Alert.alert('Error', 'Failed to send verification email.');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      Alert.alert('Error', 'An error occurred while sending the email.');
    }
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Text style={styles.title}>Log Hours & Submit Opportunity</Text>

        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Community</Text>
            <FlatList
              data={joinedCommunities}
              keyExtractor={(item) => item.communityId}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.communityBox, selectedCommunity?.communityId === item.communityId && styles.selectedBox]}
                  onPress={() => setSelectedCommunity(item)}
                >
                  <Text style={styles.communityTitle}>{item.communityName}</Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={<Text style={styles.emptyText}>No communities found.</Text>}
            />
          </View>

          {selectedCommunity && (
            <View style={styles.section}>
              <Text style={styles.selectedCommunityText}>Selected Community: {selectedCommunity.communityName}</Text>
              <Text style={[styles.sectionTitle, styles.enhancedTitle]}>Log Hours</Text>
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
              <TouchableOpacity style={styles.logButton} onPress={sendVerificationEmail}>
                <Text style={styles.logButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>

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
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 10,
  },
  enhancedTitle: {
    color: '#1f91d6',
  },
  selectedCommunityText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 10,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#2E2E2E',
    paddingVertical: 10,
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
  input: {
    backgroundColor: '#000',
    color: '#FFF',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  datePickerButton: {
    backgroundColor: '#000',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  datePickerText: {
    color: '#FFF',
    fontSize: 16,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeInput: {
    flex: 1,
    marginHorizontal: 5,
  },
  logButton: {
    backgroundColor: '#1f91d6',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  logButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
});

export default LogHoursScreen;
