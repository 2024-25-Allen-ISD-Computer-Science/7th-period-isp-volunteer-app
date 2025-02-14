import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { firestore } from '../firebaseConfig';

const TeacherManagePage = ({ navigation }) => {
  const [communities, setCommunities] = useState([]);
  const [students, setStudents] = useState({});
  const teacherId = "TAiOstXgYeR3DGsOjX4EEXAgsf43"; // Replace with actual logged-in teacher ID

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, 'communities'));
        const communityList = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.createdBy === teacherId) { 
            communityList.push({ id: doc.id, ...data });
          }
        });
        setCommunities(communityList);
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch communities.');
      }
    };

    fetchCommunities();
  }, []);

  const fetchStudentsInCommunity = async (communityId) => {
    try {
      const usersRef = collection(firestore, 'users');
      const querySnapshot = await getDocs(usersRef);

      const studentList = [];
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        if (userData.accountType === 'student' && userData.joinedCommunities) {
          const isInCommunity = userData.joinedCommunities.some(
            (comm) => comm.communityId === communityId
          );
          if (isInCommunity) {
            studentList.push({ id: doc.id, ...userData });
          }
        }
      });

      return studentList;
    } catch (error) {
      console.error('Error fetching students:', error);
      return [];
    }
  };

  useEffect(() => {
    const loadStudents = async () => {
      const communityStudents = {};
      for (const community of communities) {
        communityStudents[community.id] = await fetchStudentsInCommunity(community.id);
      }
      setStudents(communityStudents);
    };

    if (communities.length > 0) {
      loadStudents();
    }
  }, [communities]);

  const handleRemoveStudent = async (communityId, studentId) => {
    try {
      const userRef = doc(firestore, 'users', studentId);
      const userDoc = await getDocs(userRef);
      if (!userDoc.exists()) return;

      const userData = userDoc.data();
      const updatedCommunities = userData.joinedCommunities.filter(
        (comm) => comm.communityId !== communityId
      );

      await updateDoc(userRef, {
        joinedCommunities: updatedCommunities,
      });

      Alert.alert('Success', 'Student removed from the community.');
      setStudents((prev) => ({
        ...prev,
        [communityId]: prev[communityId].filter((s) => s.id !== studentId),
      }));
    } catch (error) {
      Alert.alert('Error', 'Failed to remove student.');
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={communities}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.communityContainer}>
            <Text style={styles.communityName}>{item.communityName}</Text>
            <FlatList
              data={students[item.id] || []}
              keyExtractor={(student) => student.id}
              renderItem={({ item: student }) => (
                <View style={styles.studentContainer}>
                  <Text style={styles.studentName}>{student.firstName} {student.lastName}</Text>
                  <TouchableOpacity
                    style={styles.profileButton}
                    onPress={() => navigation.navigate('StudentProfileScreen', { studentId: student.id })}
                  >
                    <Text style={styles.profileButtonText}>View Profile</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.verifyButton}
                    onPress={() => navigation.navigate('VerifyHours', { studentId: student.id })}
                  >
                    <Text style={styles.verifyButtonText}>Verify Hours</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => handleRemoveStudent(item.id, student.id)}
                  >
                    <Text style={styles.removeButtonText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              )}
              ListEmptyComponent={<Text style={styles.emptyMessage}>No students found in this community.</Text>}
            />
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyMessage}>No communities found.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  communityContainer: {
    padding: 15,
    backgroundColor: '#ddd',
    marginBottom: 10,
    borderRadius: 5,
  },
  communityName: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  studentContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  studentName: {
    fontSize: 16,
  },
  profileButton: {
    backgroundColor: '#3498db',
    padding: 8,
    borderRadius: 5,
  },
  profileButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  verifyButton: {
    backgroundColor: '#4CAF50',
    padding: 8,
    borderRadius: 5,
  },
  verifyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  removeButton: {
    backgroundColor: '#ff4444',
    padding: 8,
    borderRadius: 5,
  },
  removeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyMessage: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: 16,
    color: '#888',
  },
});

export default TeacherManagePage;
