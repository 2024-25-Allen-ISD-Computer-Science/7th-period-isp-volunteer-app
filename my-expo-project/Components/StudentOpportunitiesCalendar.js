import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, FlatList } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { firestore, auth } from './firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import moment from 'moment';

const StudentOpportunitiesCalendar = () => {
  const [markedDates, setMarkedDates] = useState({});
  const [opportunityDetails, setOpportunityDetails] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [monthCount, setMonthCount] = useState(0);

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
        const currentMonth = moment().format('YYYY-MM');

        let currentMonthCount = 0;

        for (const opportunityId of joinedOpportunities) {
          const opportunityRef = doc(firestore, 'opportunities', opportunityId);
          const opportunitySnapshot = await getDoc(opportunityRef);
          if (opportunitySnapshot.exists()) {
            const { date, name, time, category } = opportunitySnapshot.data();
            if (date) {
              const color = category === 'community' ? '#00c853' : category === 'school' ? '#ffab00' : '#1f91d6';

              if (!opportunityDates[date]) {
                opportunityDates[date] = {
                  marked: true,
                  dotColor: color,
                  selectedColor: '#333',
                };
                details[date] = [];
              }

              details[date].push({ name, time, category });

              if (date.startsWith(currentMonth)) {
                currentMonthCount++;
              }
            }
          }
        }

        setMarkedDates(opportunityDates);
        setOpportunityDetails(details);
        setMonthCount(currentMonthCount);
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

  const renderOpportunityItem = ({ item }) => (
    <View style={styles.opportunityItem}>
      <Text style={styles.opportunityName}>{item.name}</Text>
      {item.time && <Text style={styles.opportunityTime}>🕒 {item.time}</Text>}
      {item.category && <Text style={styles.opportunityCategory}>📌 {item.category}</Text>}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Your Opportunity Calendar</Text>
      <Text style={styles.subText}>
        {monthCount} event{monthCount !== 1 ? 's' : ''} this month
      </Text>
      <Calendar
        markedDates={{
          ...markedDates,
          ...(selectedDate && {
            [selectedDate]: {
              ...markedDates[selectedDate],
              selected: true,
              selectedColor: '#1f91d6',
            },
          }),
        }}
        markingType="dot"
        onDayPress={handleDayPress}
        theme={{
          backgroundColor: '#1C1C1C',
          calendarBackground: '#1C1C1C',
          textSectionTitleColor: '#888',
          selectedDayBackgroundColor: '#1f91d6',
          selectedDayTextColor: '#ffffff',
          todayTextColor: '#00adf5',
          dayTextColor: '#ffffff',
          textDisabledColor: '#555',
          arrowColor: '#1f91d6',
          monthTextColor: '#FFF',
          textDayFontWeight: '500',
          textMonthFontWeight: 'bold',
          textDayHeaderFontWeight: '600',
          textDayFontSize: 16,
          textMonthFontSize: 18,
          textDayHeaderFontSize: 14,
        }}
      />

      {selectedDate && (
        <Modal visible={modalVisible} transparent animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                {moment(selectedDate).format('dddd, MMMM D')}
              </Text>
              <FlatList
                data={opportunityDetails[selectedDate]}
                keyExtractor={(_, index) => index.toString()}
                renderItem={renderOpportunityItem}
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
    fontSize: 22,
    color: '#FFF',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  subText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10,
    width: '85%',
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f91d6',
    marginBottom: 15,
    textAlign: 'center',
  },
  opportunityItem: {
    backgroundColor: '#F5F5F5',
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
  opportunityName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  opportunityTime: {
    fontSize: 14,
    color: '#555',
  },
  opportunityCategory: {
    fontSize: 14,
    color: '#888',
    fontStyle: 'italic',
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: '#1f91d6',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default StudentOpportunitiesCalendar;