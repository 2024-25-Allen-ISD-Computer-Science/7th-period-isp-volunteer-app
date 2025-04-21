import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { firestore, auth } from './firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { MaterialIcons } from '@expo/vector-icons';
import { Provider as PaperProvider } from 'react-native-paper';

const ViewLoggedHoursScreen = ({ navigation }) => {
  const [loggedHours, setLoggedHours] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLoggedHours = async () => {
      try {
        const hoursQuery = query(
          collection(firestore, 'hourRequests'),
          where('userId', '==', auth.currentUser.uid)
        );
        
        const querySnapshot = await getDocs(hoursQuery);
        const hoursData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          activityName: doc.data().activityName,
          communityName: doc.data().communityName,
          date: doc.data().date,
          hours: doc.data().hours,
          minutes: doc.data().minutes,
          status: doc.data().status,
          description: doc.data().description
        }));
        setLoggedHours(hoursData);
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch logged hours: ' + error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLoggedHours();
  }, []);

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Text style={styles.title}>Logged Hours</Text>
        {loading ? (
          <Text style={styles.loadingText}>Loading...</Text>
        ) : loggedHours.length === 0 ? (
          <Text style={styles.emptyText}>No hours logged yet.</Text>
        ) : (
          <FlatList
            data={loggedHours}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.logBox}>
                <Text style={styles.logText}>Community: {item.communityName}</Text>
                <Text style={styles.logText}>Activity: {item.activityName}</Text>
                <Text style={styles.logText}>Date: {new Date(item.date).toDateString()}</Text>
                <Text style={styles.logText}>Hours: {item.hours}h {item.minutes}m</Text>
                <Text style={styles.logText}>Status: {item.status}</Text>
                <Text style={styles.logText}>Description: {item.description}</Text>
              </View>
            )}
          />
        )}

        {/* Bottom Navigation */}
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
    paddingBottom: 80,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 15,
  },
  loadingText: {
    color: '#FFF',
    textAlign: 'center',
    fontSize: 16,
  },
  emptyText: {
    color: '#FFF',
    textAlign: 'center',
    fontSize: 16,
  },
  logBox: {
    backgroundColor: '#2E2E2E',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  logText: {
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
  },
});

export default ViewLoggedHoursScreen;
