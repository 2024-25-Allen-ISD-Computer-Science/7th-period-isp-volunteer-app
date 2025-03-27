import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { DatePickerModal } from 'react-native-paper-dates';
import { firestore, auth } from '../firebaseConfig';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { MaterialIcons } from '@expo/vector-icons';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { MAP_API_KEY } from "@env";

const CreateOpportunities = ({ navigation }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [time, setTime] = useState('');
  const [hourValue, setHourValue] = useState('');
  const [maxSignUps, setMaxSignUps] = useState('');
  const [communities, setCommunities] = useState([]);
  const [selectedCommunity, setSelectedCommunity] = useState('');
  const [location, setLocation] = useState(null);

  useEffect(() => {
    const fetchCommunities = async () => {
      const user = auth.currentUser;
      if (user) {
        const communitiesRef = collection(firestore, 'communities');
        const q = query(communitiesRef, where('createdBy', '==', user.uid));
        const querySnapshot = await getDocs(q);

        const fetchedCommunities = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          communityName: doc.data().communityName,
        }));

        setCommunities(fetchedCommunities);
      }
    };

    fetchCommunities();
  }, []);

  const handleCreateOpportunity = async () => {
    if (!selectedCommunity) {
      Alert.alert('Error', 'Please select a community.');
      return;
    }
  
    if (!location) {
      Alert.alert('Error', 'Please enter a location.');
      return;
    }
  
    const user = auth.currentUser;
    if (user) {
      try {
        const opportunityData = {
          name,
          description,
          date: date.toISOString(),
          time,
          hourValue: parseInt(hourValue, 10),
          maxSignUps: parseInt(maxSignUps, 10),
          currentSignUps: 0,
          communityId: selectedCommunity,
          location: { 
            address: location.address, 
            latitude: location.lat,   
            longitude: location.lng,  
          },
          createdBy: user.uid,
        };
  
        await addDoc(collection(firestore, 'opportunities'), opportunityData);
        Alert.alert('Success', 'Opportunity created successfully!');
        navigation.goBack();
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'Failed to create opportunity.');
      }
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.title}>Create Opportunity</Text>

          <TextInput
            style={styles.input}
            placeholder="Opportunity Name"
            placeholderTextColor="#999"
            value={name}
            onChangeText={setName}
          />

          <TextInput
            style={styles.input}
            placeholder="Description"
            placeholderTextColor="#999"
            value={description}
            onChangeText={setDescription}
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
            placeholder="Time (e.g., 10:00-11:00)"
            placeholderTextColor="#999"
            value={time}
            onChangeText={setTime}
          />

          <TextInput
            style={styles.input}
            placeholder="Hour Value"
            placeholderTextColor="#999"
            keyboardType="numeric"
            value={hourValue}
            onChangeText={setHourValue}
          />

          <TextInput
            style={styles.input}
            placeholder="Maximum Sign-Ups"
            placeholderTextColor="#999"
            keyboardType="numeric"
            value={maxSignUps}
            onChangeText={setMaxSignUps}
          />

          <GooglePlacesAutocomplete
            placeholder="Enter Location"
            listViewDisplayed="auto"
            onPress={(data, details = null) => {
              if (!details) {
                Alert.alert("Error", "Location details could not be retrieved. Try again.");
                return;
              }
              setLocation({
                address: data.description,
                lat: details.geometry.location.lat,
                lng: details.geometry.location.lng,
              });
            }}
            query={{
              key: MAP_API_KEY,
              language: "en",
            }}
            fetchDetails={true}
            styles={{
              container: { marginBottom: 10, zIndex: 1000 }, 
              textInput: styles.input,
              listView: {
                backgroundColor: "#fff",
                zIndex: 1000, 
              },
            }}
            requestUrl={{
              url: "https://thingproxy.freeboard.io/fetch/https://maps.googleapis.com/maps/api",
              useOnPlatform: "web",
            }}
          />

          <Text style={styles.label}>Assign to Community:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedCommunity}
              onValueChange={(itemValue) => setSelectedCommunity(itemValue)}
              style={styles.picker}
              dropdownIconColor="#FFF"
            >
              <Picker.Item label="Select a Community" value="" color="#999" />
              {communities.map((community) => (
                <Picker.Item key={community.id} label={community.communityName} value={community.id} />
              ))}
            </Picker>
          </View>

          <TouchableOpacity style={styles.createButton} onPress={handleCreateOpportunity}>
            <Text style={styles.createButtonText}>Create Opportunity</Text>
          </TouchableOpacity>

        </ScrollView>
      </TouchableWithoutFeedback>

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
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1C',
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 80,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#2E2E2E',
    color: '#FFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  datePickerButton: {
    backgroundColor: '#2E2E2E',
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
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  createButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#2E2E2E',
    paddingVertical: 12,
  },
});

export default CreateOpportunities;