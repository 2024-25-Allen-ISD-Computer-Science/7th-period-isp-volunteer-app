import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { firestore } from '../firebaseConfig';

const VerifyHoursPage = ({ route, navigation }) => {
  const { studentId } = route.params;  // Getting the student ID from navigation params
  const [student, setStudent] = useState(null);
  const [requestedHours, setRequestedHours] = useState([]);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const studentRef = doc(firestore, 'users', studentId);
        const studentDoc = await getDoc(studentRef);
        if (studentDoc.exists()) {
          const studentData = studentDoc.data();
          setStudent(studentData);

          // Fetch the requested verification hours (assuming it's an array of requests)
          setRequestedHours(studentData.requestedVerification || []);
        } else {
          Alert.alert('Error', 'Student not found.');
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch student data.');
      }
    };

    fetchStudentData();
  }, [studentId]);

  const handleVerify = async (hourId) => {
    try {
      const studentRef = doc(firestore, 'users', studentId);
      const studentDoc = await getDoc(studentRef);
      const studentData = studentDoc.data();

      const updatedHours = studentData.requestedVerification.filter(
        (hour) => hour.id !== hourId
      );

      await updateDoc(studentRef, {
        requestedVerification: updatedHours,
      });

      // You can add a verification field here if you'd like to track the status of the hour
      // E.g., verify the hour in a subcollection or update status on the hour object itself.

      Alert.alert('Success', 'Hour verified successfully.');
      setRequestedHours(updatedHours);  // Update the local state
    } catch (error) {
      Alert.alert('Error', 'Failed to verify the hour.');
    }
  };

  const handleReject = async (hourId) => {
    try {
      const studentRef = doc(firestore, 'users', studentId);
      const studentDoc = await getDoc(studentRef);
      const studentData = studentDoc.data();

      const updatedHours = studentData.requestedVerification.filter(
        (hour) => hour.id !== hourId
      );

      await updateDoc(studentRef, {
        requestedVerification: updatedHours,
      });

      // You can also log the rejected hour in a separate subcollection or mark its status.
      
      Alert.alert('Success', 'Hour rejected successfully.');
      setRequestedHours(updatedHours);  // Update the local state
    } catch (error) {
      Alert.alert('Error', 'Failed to reject the hour.');
    }
  };

  return (
    <View style={styles.container}>
      {student ? (
        <>
          <Text style={styles.studentName}>{student.firstName} {student.lastName}</Text>
          <FlatList
            data={requestedHours}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.hourContainer}>
                <Text style={styles.hourDetails}>
                  {item.date} - {item.hours} hours requested
                </Text>
                <TouchableOpacity
                  style={styles.verifyButton}
                  onPress={() => handleVerify(item.id)}
                >
                  <Text style={styles.buttonText}>Verify</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.rejectButton}
                  onPress={() => handleReject(item.id)}
                >
                  <Text style={styles.buttonText}>Reject</Text>
                </TouchableOpacity>
              </View>
            )}
            ListEmptyComponent={<Text style={styles.emptyMessage}>No hours requested for verification.</Text>}
          />
        </>
      ) : (
        <Text style={styles.loadingMessage}>Loading student data...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  studentName: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  hourContainer: {
    padding: 15,
    backgroundColor: '#f1f1f1',
    marginBottom: 10,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hourDetails: {
    fontSize: 16,
  },
  verifyButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
  },
  rejectButton: {
    backgroundColor: '#FF4444',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyMessage: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
  },
  loadingMessage: {
    textAlign: 'center',
    fontSize: 18,
    color: '#888',
  },
});

export default VerifyHoursPage;
