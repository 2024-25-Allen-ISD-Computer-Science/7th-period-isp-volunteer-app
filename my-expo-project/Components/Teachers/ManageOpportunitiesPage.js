import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { firestore, auth } from '../firebaseConfig';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore';
import { MaterialIcons } from '@expo/vector-icons';

const ManageOpportunitiesScreen = ({ navigation }) => {
  const [opportunities, setOpportunities] = useState([]);
  const [editingOpportunity, setEditingOpportunity] = useState(null);
  const [joinedStudents, setJoinedStudents] = useState({});

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const q = query(
          collection(firestore, 'opportunities'),
          where('createdBy', '==', auth.currentUser.uid)
        );
        const querySnapshot = await getDocs(q);
        const opportunitiesList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOpportunities(opportunitiesList);
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch opportunities: ' + error.message);
      }
    };

    fetchOpportunities();
  }, []);

  const fetchJoinedStudents = async (opportunityId) => {
    try {
      const usersSnapshot = await getDocs(collection(firestore, 'users'));
      const students = usersSnapshot.docs
        .filter((doc) => doc.data().joinedOpportunities?.includes(opportunityId))
        .map((doc) => ({ id: doc.id, ...doc.data() }));
      setJoinedStudents((prev) => ({ ...prev, [opportunityId]: students }));
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch joined students: ' + error.message);
    }
  };

  const handleEdit = (opportunity) => {
    setEditingOpportunity(opportunity);
    fetchJoinedStudents(opportunity.id);
  };

  const handleSave = async () => {
    const { name, date, time, description, hourValue, communityId, id } = editingOpportunity;
  
    if (!name || !date || !time || !description || !hourValue || !communityId) {
      Alert.alert('Error', 'Please fill in all fields before saving.');
      return;
    }
  
    try {
      const opportunityRef = doc(firestore, 'opportunities', id);
      await updateDoc(opportunityRef, {
        name,
        date,
        time,
        description,
        hourValue,
        communityId,
      });
  
      setOpportunities((prev) =>
        prev.map((opp) => (opp.id === id ? { ...editingOpportunity } : opp))
      );
  
      Alert.alert('Success', 'Opportunity updated successfully.');
      setEditingOpportunity(null);
    } catch (error) {
      Alert.alert('Error', 'Failed to update opportunity: ' + error.message);
      console.error(error);
    }
  };

  const handleDelete = async (opportunityId) => {
    try {
      await deleteDoc(doc(firestore, 'opportunities', opportunityId));
      setOpportunities(opportunities.filter((opportunity) => opportunity.id !== opportunityId));
      Alert.alert('Success', 'Opportunity deleted successfully.');
    } catch (error) {
      Alert.alert('Error', 'Failed to delete opportunity: ' + error.message);
    }
  };

  const handleRemoveStudent = async (studentId, opportunityId) => {
    try {
      const userRef = doc(firestore, 'users', studentId);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const updatedOpportunities = userDoc
          .data()
          .joinedOpportunities.filter((id) => id !== opportunityId);
        await updateDoc(userRef, { joinedOpportunities: updatedOpportunities });

        setJoinedStudents((prev) => ({
          ...prev,
          [opportunityId]: prev[opportunityId].filter((student) => student.id !== studentId),
        }));

        Alert.alert('Success', 'Student removed successfully.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to remove student: ' + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Manage Opportunities</Text>

        <FlatList
          data={opportunities}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.opportunityBox}>
              {editingOpportunity?.id === item.id ? (
                <>
                  <TextInput
                    style={styles.input}
                    placeholder="Name"
                    placeholderTextColor="#888"
                    value={editingOpportunity.name}
                    onChangeText={(text) =>
                      setEditingOpportunity({ ...editingOpportunity, name: text })
                    }
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Date"
                    placeholderTextColor="#888"
                    value={editingOpportunity.date}
                    onChangeText={(text) =>
                      setEditingOpportunity({ ...editingOpportunity, date: text })
                    }
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Time"
                    placeholderTextColor="#888"
                    value={editingOpportunity.time}
                    onChangeText={(text) =>
                      setEditingOpportunity({ ...editingOpportunity, time: text })
                    }
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Description"
                    placeholderTextColor="#888"
                    value={editingOpportunity.description}
                    onChangeText={(text) =>
                      setEditingOpportunity({ ...editingOpportunity, description: text })
                    }
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Hour Value"
                    placeholderTextColor="#888"
                    keyboardType="numeric"
                    value={String(editingOpportunity.hourValue)}
                    onChangeText={(text) =>
                      setEditingOpportunity({
                        ...editingOpportunity,
                        hourValue: parseFloat(text),
                      })
                    }
                  />

                  <Text style={styles.subTitle}>Joined Students:</Text>
                  {joinedStudents[item.id]?.map((student) => (
                    <View key={student.id} style={styles.studentBox}>
                      <Text style={{ color: '#fff' }}>
                        {student.firstName} {student.lastName}
                      </Text>
                      <TouchableOpacity
                        style={styles.removeButton}
                        onPress={() => handleRemoveStudent(student.id, item.id)}
                      >
                        <Text style={styles.buttonText}>Remove</Text>
                      </TouchableOpacity>
                    </View>
                  ))}

                  <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.buttonText}>Save</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Text style={styles.opportunityTitle}>{item.name}</Text>
                  <Text style={styles.opportunityText}>Date: {item.date}</Text>
                  <Text style={styles.opportunityText}>Time: {item.time}</Text>
                  <Text style={styles.opportunityText}>Description: {item.description}</Text>
                  <Text style={styles.opportunityText}>Hour Value: {item.hourValue}</Text>
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(item)}>
                      <Text style={styles.buttonText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleDelete(item.id)}
                    >
                      <Text style={styles.buttonText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          )}
        />
      </ScrollView>

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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1C',
    paddingBottom: 70,
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 10,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginTop: 10,
  },
  opportunityBox: {
    backgroundColor: '#2E2E2E',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderColor: '#444',
    borderWidth: 1,
  },
  opportunityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 6,
  },
  opportunityText: {
    color: '#CCC',
  },
  input: {
    backgroundColor: '#444',
    color: '#FFF',
    padding: 10,
    borderRadius: 5,
    marginVertical: 6,
  },
  studentBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#444',
    padding: 8,
    borderRadius: 5,
    marginVertical: 5,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 10,
  },
  editButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: '#f44336',
    padding: 10,
    borderRadius: 5,
  },
  removeButton: {
    backgroundColor: '#FF5722',
    padding: 6,
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#2E2E2E',
    paddingVertical: 12,
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
});

export default ManageOpportunitiesScreen;
