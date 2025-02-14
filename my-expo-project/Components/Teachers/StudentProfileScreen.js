import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../firebaseConfig';

const StudentProfileScreen = ({ route }) => {
  const { studentId } = route.params;
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const fetchStudentData = async () => {
      if (!studentId) return;

      try {
        const studentRef = doc(firestore, 'users', studentId);
        const studentSnap = await getDoc(studentRef);

        if (studentSnap.exists()) {
          setStudent(studentSnap.data());
        } else {
          console.error('Student not found');
        }
      } catch (error) {
        console.error('Error fetching student data:', error);
      }
    };

    fetchStudentData();
  }, [studentId]);

  if (!student) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading student profile...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{student.firstName} {student.lastName}</Text>
      <Text style={styles.info}><Text style={styles.label}>Email:</Text> {student.email}</Text>
      <Text style={styles.info}><Text style={styles.label}>Date of Birth:</Text> {student.dob}</Text>
      <Text style={styles.info}><Text style={styles.label}>Phone Number:</Text> {student.phoneNumber}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1C',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  info: {
    fontSize: 18,
    color: '#CCCCCC',
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  loadingText: {
    fontSize: 18,
    color: '#CCCCCC',
    textAlign: 'center',
  },
});

export default StudentProfileScreen;
