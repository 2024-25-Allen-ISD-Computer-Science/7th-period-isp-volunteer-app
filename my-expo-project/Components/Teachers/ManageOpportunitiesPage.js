import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert, ScrollView } from 'react-native';
import { firestore, auth } from '../firebaseConfig';
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';

const ManageOpportunitiesScreen = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [editingOpportunity, setEditingOpportunity] = useState(null);

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const q = query(collection(firestore, 'opportunities'), where('createdBy', '==', auth.currentUser.uid));
        const querySnapshot = await getDocs(q);
        const opportunitiesList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setOpportunities(opportunitiesList);
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch opportunities: ' + error.message);
      }
    };

    fetchOpportunities();
  }, []);

  const handleEdit = (opportunity) => {
    setEditingOpportunity(opportunity);
  };

  const handleSave = async () => {
    try {
      const opportunityRef = doc(firestore, 'opportunities', editingOpportunity.id);
      await updateDoc(opportunityRef, {
        name: editingOpportunity.name,
        date: editingOpportunity.date,
        time: editingOpportunity.time,
        description: editingOpportunity.description,
        hourValue: editingOpportunity.hourValue,
        communityId: editingOpportunity.communityId,
      });

      Alert.alert('Success', 'Opportunity updated successfully.');
      setEditingOpportunity(null);
    } catch (error) {
      Alert.alert('Error', 'Failed to update opportunity: ' + error.message);
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

  return (
    <ScrollView contentContainerStyle={styles.container}>
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
                  value={editingOpportunity.name}
                  onChangeText={(text) => setEditingOpportunity({ ...editingOpportunity, name: text })}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Date"
                  value={editingOpportunity.date}
                  onChangeText={(text) => setEditingOpportunity({ ...editingOpportunity, date: text })}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Time"
                  value={editingOpportunity.time}
                  onChangeText={(text) => setEditingOpportunity({ ...editingOpportunity, time: text })}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Description"
                  value={editingOpportunity.description}
                  onChangeText={(text) => setEditingOpportunity({ ...editingOpportunity, description: text })}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Hour Value"
                  keyboardType="numeric"
                  value={String(editingOpportunity.hourValue)}
                  onChangeText={(text) => setEditingOpportunity({ ...editingOpportunity, hourValue: parseFloat(text) })}
                />
                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                  <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.opportunityTitle}>{item.name}</Text>
                <Text>Date: {item.date}</Text>
                <Text>Time: {item.time}</Text>
                <Text>Description: {item.description}</Text>
                <Text>Hour Value: {item.hourValue}</Text>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(item)}>
                    <Text style={styles.buttonText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
                    <Text style={styles.buttonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        )}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  opportunityBox: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  opportunityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  editButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: '#f44336',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ManageOpportunitiesScreen;
