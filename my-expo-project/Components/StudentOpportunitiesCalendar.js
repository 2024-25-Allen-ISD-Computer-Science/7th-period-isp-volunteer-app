import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { firestore, auth } from './firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

const StudentOpportunitiesCalendar = () => {
  const [markedDates, setMarkedDates] = useState({});

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

        for (const opportunityId of joinedOpportunities) {
          const opportunityRef = doc(firestore, 'opportunities', opportunityId);
          const opportunitySnapshot = await getDoc(opportunityRef);
          if (opportunitySnapshot.exists()) {
            const { date } = opportunitySnapshot.data(); // Assuming date is stored in YYYY-MM-DD format
            if (date) {
              opportunityDates[date] = {
                marked: true,
                dotColor: 'blue',
                selectedColor: '#1f91d6',
              };
            }
          }
        }

        setMarkedDates(opportunityDates);
      } catch (error) {
        console.error('Error fetching opportunities:', error);
      }
    };

    fetchJoinedOpportunities();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Your Opportunity Calendar</Text>
      <Calendar
        markedDates={markedDates}
        markingType={'dot'}
      />
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
});

export default StudentOpportunitiesCalendar;