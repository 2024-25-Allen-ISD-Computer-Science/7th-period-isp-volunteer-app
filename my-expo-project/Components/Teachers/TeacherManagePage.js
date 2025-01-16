import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { firestore } from '../firebaseConfig';

const TeacherManagePage = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, 'users'));
        const studentsList = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.accountType === 'student') {
            studentsList.push({ id: doc.id, ...data });
          }
        });
        setStudents(studentsList);
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch students.');
      }
    };

    fetchStudents();
  }, []);

  const handleApproveHours = async (studentId, communityIndex) => {
    try {
      const studentDocRef = doc(firestore, 'users', studentId);
      const studentDoc = await getDoc(studentDocRef);
      if (studentDoc.exists()) {
        const studentData = studentDoc.data();
        const updatedCommunities = [...studentData.joinedCommunities];
        updatedCommunities[communityIndex].approved = true;

        await updateDoc(studentDocRef, { joinedCommunities: updatedCommunities });
        Alert.alert('Success', 'Hours approved successfully!');
      } else {
        Alert.alert('Error', 'Student data not found!');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to approve hours.');
    }
  };

  const renderStudent = ({ item }) => (
    <View style={styles.studentContainer}>
      <Text style={styles.studentName}>{item.firstName} {item.lastName}</Text>
      <FlatList
        data={item.joinedCommunities}
        keyExtractor={(community, index) => index.toString()}
        renderItem={({ item: community, index }) => (
          <View style={styles.communityContainer}>
            <Text style={styles.communityName}>{community.communityName}</Text>
            <Text style={styles.hoursLogged}>Hours Logged: {community.hoursLogged}</Text>
            <TouchableOpacity
              style={styles.approveButton}
              onPress={() => handleApproveHours(item.id, index)}
              disabled={community.approved}
            >
              <Text style={styles.approveButtonText}>
                {community.approved ? 'Approved' : 'Approve'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={students}
        keyExtractor={(student) => student.id}
        renderItem={renderStudent}
        ListEmptyComponent={<Text style={styles.emptyMessage}>No students found.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  studentContainer: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  studentName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  communityContainer: {
    marginBottom: 10,
  },
  communityName: {
    fontSize: 16,
  },
  hoursLogged: {
    fontSize: 14,
  },
  approveButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  approveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyMessage: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#888',
  },
});

export default TeacherManagePage;