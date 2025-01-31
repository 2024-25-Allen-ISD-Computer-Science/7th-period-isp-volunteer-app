import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { firestore, auth } from './firebaseConfig';
import { collection, getDocs, doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';

const CommunityScreen = ({ navigation }) => {
  const [communities, setCommunities] = useState([]);
  const [joinedCommunities, setJoinedCommunities] = useState([]);

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, 'communities'));
        const communityList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCommunities(communityList);
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch communities: ' + error.message);
      }
    };

    const fetchUserData = async () => {
      try {
        const userDoc = await getDoc(doc(firestore, 'users', auth.currentUser.uid));
        if (userDoc.exists()) {
          setJoinedCommunities(userDoc.data().joinedCommunities || []);
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch user data: ' + error.message);
      }
    };

    fetchCommunities();
    fetchUserData();
  }, []);

  const joinCommunity = async (communityId, communityName) => {
    try {
      const userDocRef = doc(firestore, 'users', auth.currentUser.uid);
  
      // Check if the user has already joined this community
      if (joinedCommunities.some((c) => c.communityId === communityId)) {
        Alert.alert('Info', 'You have already joined this community.');
        return;
      }
  
      // Update Firestore
      await updateDoc(userDocRef, {
        joinedCommunities: arrayUnion({ communityId, communityName, hoursLogged: 0 }),
      });
  
      Alert.alert('Success', `You have joined ${communityName}!`);
      
      // Update local state to reflect the changes
      setJoinedCommunities((prev) => [...prev, { communityId, communityName: communityName, hoursLogged: 0 }]);
    } catch (error) {
      Alert.alert('Error', 'Failed to join community: ' + error.message);
    }
  };

  const leaveCommunity = async (communityId) => {
    try {
      const userDocRef = doc(firestore, 'users', auth.currentUser.uid);
  
      // Filter out the community the user wants to leave
      const updatedCommunities = joinedCommunities.filter((c) => c.communityId !== communityId);
  
      // Update Firestore
      await updateDoc(userDocRef, {
        joinedCommunities: updatedCommunities,
      });
  
      Alert.alert('Success', 'You have left the community.');
  
      // Update local state
      setJoinedCommunities(updatedCommunities);
    } catch (error) {
      Alert.alert('Error', 'Failed to leave community: ' + error.message);
    }
  };

  const renderCommunity = ({ item }) => {
    const isJoined = joinedCommunities.some((c) => c.communityId === item.id);
  
    return (
      <View style={styles.communityBox}>
        <Text style={styles.communityTitle}>{item.communityName}</Text>
        <Text style={styles.communityDescription}>{item.description}</Text>
        <Text style={styles.communityGoal}>Hour Goal: {item.hourGoal}</Text>
        
        {isJoined ? (
          <TouchableOpacity 
            style={[styles.joinButton, { backgroundColor: 'red' }]} 
            onPress={() => leaveCommunity(item.id)}
          >
            <Text style={styles.joinButtonText}>Leave</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={styles.joinButton} 
            onPress={() => joinCommunity(item.id, item.communityName)}
          >
            <Text style={styles.joinButtonText}>Join</Text>
          </TouchableOpacity>
        )}
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
      <Text style={styles.title}>Communities</Text>
      <FlatList
        data={communities}
        keyExtractor={(item) => item.id}
        renderItem={renderCommunity}
        ListEmptyComponent={<Text style={styles.emptyText}>No communities available at the moment.</Text>}
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
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  communityBox: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    borderColor: '#ccc',
    borderWidth: 1,
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
  communityGoal: {
    fontSize: 14,
    marginBottom: 10,
    color: '#555',
  },
  joinButton: {
    backgroundColor: '#443939',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  joinButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  joinedText: {
    fontSize: 16,
    color: 'green',
    fontWeight: 'bold',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: '#1f91d6',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
  },
});

export default CommunityScreen;
