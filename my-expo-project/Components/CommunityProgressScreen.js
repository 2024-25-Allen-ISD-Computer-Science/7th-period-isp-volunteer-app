import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { firestore, auth } from './firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import * as Progress from 'react-native-progress'; 

const CommunityProgressScreen = ({ navigation }) => {
  const [joinedCommunities, setJoinedCommunities] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDoc = await getDoc(doc(firestore, 'users', auth.currentUser.uid));
        if (userDoc.exists()) {
          setJoinedCommunities(userDoc.data().joinedCommunities || []);
        } else {
          Alert.alert('Error', 'No communities found.');
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch user data: ' + error.message);
      }
    };

    fetchUserData();
  }, []);

  // Function to calculate progress percentage
  const calculateProgress = (hoursLogged, hourGoal) => {
    return (hoursLogged / hourGoal) > 1 ? 1 : (hoursLogged / hourGoal);
  };

  const renderCommunity = ({ item }) => {
    const progress = calculateProgress(item.hoursLogged || 0, item.hourGoal);

    return (
      <View style={styles.communityBox}>
        <Text style={styles.communityTitle}>{item.name}</Text>
        <Text style={styles.communityDescription}>Goal: {item.hourGoal} hours</Text>
        <Text style={styles.communityProgress}>
          {item.hoursLogged || 0} / {item.hourGoal} hours logged
        </Text>
        <Progress.Bar
          progress={progress}
          width={null} // Auto adjust to parent width
          height={20}
          color="#443939"
          borderWidth={0}
          style={styles.progressBar}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate('StudentHomePage')}
      >
        <Text style={styles.buttonText}>Back to Home</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Community Progress</Text>

      <FlatList
        data={joinedCommunities}
        keyExtractor={(item) => item.communityId}
        renderItem={renderCommunity}
        ListEmptyComponent={<Text style={styles.emptyText}>No communities found.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  communityBox: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  communityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  communityDescription: {
    fontSize: 14,
    marginBottom: 5,
  },
  communityProgress: {
    fontSize: 14,
    marginBottom: 10,
    color: '#555',
  },
  progressBar: {
    marginBottom: 10,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: '#1f91d6',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
  },
});

export default CommunityProgressScreen;
