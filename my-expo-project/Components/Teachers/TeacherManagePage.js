import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { firestore } from '../firebaseConfig';

const TeacherManagePage = ({ navigation }) => {
  const [communities, setCommunities] = useState([]);
  const [students, setStudents] = useState({});
  const teacherId = "TAiOstXgYeR3DGsOjX4EEXAgsf43";

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

      await updateDoc(userRef, { joinedCommunities: updatedCommunities });

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
                {/* Ensure buttons are aligned in columns */}
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={[styles.button, styles.profileButton]}
                    onPress={() => navigation.navigate('StudentProfileScreen', { studentId: student.id })}
                  >
                    <Text style={styles.buttonText}>View Profile</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.button, styles.verifyButton]}
                    onPress={() => navigation.navigate('VerifyHours', { studentId: student.id })}
                  >
                    <Text style={styles.buttonText}>Verify Hours</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.button, styles.removeButton]}
                    onPress={() => handleRemoveStudent(item.id, student.id)}
                  >
                    <Text style={styles.buttonText}>Remove</Text>
                  </TouchableOpacity>
                </View>
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
  communityContainer: {
    padding: 15,
    backgroundColor: '#2E2E2E',
    marginBottom: 10,
    borderRadius: 10,
  },
  communityName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 5,
  },
  studentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 5,
  },
  studentName: {
    fontSize: 16,
    color: '#FFF',
    flex: 1, // Names take only necessary space
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 300, // Proper alignment across all students
  },
  button: {
    width: 100, // Equal width for all buttons
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileButton: {
    backgroundColor: '#1f91d6',
  },
  verifyButton: {
    backgroundColor: '#4CAF50',
  },
  removeButton: {
    backgroundColor: '#ff4444',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});

export default TeacherManagePage;
