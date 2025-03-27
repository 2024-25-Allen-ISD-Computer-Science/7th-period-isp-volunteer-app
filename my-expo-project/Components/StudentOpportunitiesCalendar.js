import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, FlatList } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { firestore, auth } from './firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

const StudentOpportunitiesCalendar = () => {
  const [markedDates, setMarkedDates] = useState({});
  const [opportunityDetails, setOpportunityDetails] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchJoinedOpportunities = async () => {
      try {
        const userId = auth.currentUser?.uid;
        if (!userId) return;

        const userRef = doc(firestore, 'users', userId);
        const userSnapshot = await getDoc(userRef);
        if (!userSnapshot.exists()) return;

        const { joinedOpportunities = [] } = userSnapshot.data();
        const opportunityDates = {};
        const details = {};

        for (const opportunityId of joinedOpportunities) {
          const opportunityRef = doc(firestore, 'opportunities', opportunityId);
          const opportunitySnapshot = await getDoc(opportunityRef);
          if (opportunitySnapshot.exists()) {
            const { date, name } = opportunitySnapshot.data(); // Assuming 'name' exists
            if (date) {
              if (!opportunityDates[date]) {
                opportunityDates[date] = {
                  marked: true,
                  dotColor: 'blue',
                  selectedColor: '#1f91d6',
                };
                details[date] = [];
              }
              details[date].push(name);
            }
          }
        }

        setMarkedDates(opportunityDates);
        setOpportunityDetails(details);
      } catch (error) {
        console.error('Error fetching opportunities:', error);
      }
    };

    fetchJoinedOpportunities();
  }, []);

  const handleDayPress = (day) => {
    if (opportunityDetails[day.dateString]) {
      setSelectedDate(day.dateString);
      setModalVisible(true);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Your Opportunity Calendar</Text>
      <Calendar
        markedDates={markedDates}
        markingType={'dot'}
        onDayPress={handleDayPress}
      />
      {selectedDate && (
        <Modal visible={modalVisible} transparent animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Opportunities on {selectedDate}</Text>
              <FlatList
                data={opportunityDetails[selectedDate]}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => <Text style={styles.opportunityText}>{item}</Text>}
              />
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1C',
    paddingTop: 50,
    paddingHorizontal: 15,
  },
  headerText: {
    fontSize: 20,
    color: '#FFF',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  opportunityText: {
    fontSize: 16,
    marginBottom: 5,
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: '#1f91d6',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});

export default StudentOpportunitiesCalendar;
