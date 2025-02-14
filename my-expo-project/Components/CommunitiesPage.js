import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { firestore, auth } from './firebaseConfig';
import { collection, getDocs, doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
import { MaterialIcons } from '@expo/vector-icons';

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
  
      if (joinedCommunities.some((c) => c.communityId === communityId)) {
        Alert.alert('Info', 'You have already joined this community.');
        return;
      }
  
      await updateDoc(userDocRef, {
        joinedCommunities: arrayUnion({ communityId, communityName, hoursLogged: 0 }),
      });
  
      Alert.alert('Success', `You have joined ${communityName}!`);
      setJoinedCommunities((prev) => [...prev, { communityId, communityName: communityName, hoursLogged: 0 }]);
    } catch (error) {
      Alert.alert('Error', 'Failed to join community: ' + error.message);
    }
  };

  const leaveCommunity = async (communityId) => {
    try {
      const userDocRef = doc(firestore, 'users', auth.currentUser.uid);
  
      const updatedCommunities = joinedCommunities.filter((c) => c.communityId !== communityId);
  
      await updateDoc(userDocRef, {
        joinedCommunities: updatedCommunities,
      });
  
      Alert.alert('Success', 'You have left the community.');
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
      <Text style={styles.title}>Communities</Text>
      <FlatList
        data={communities}
        keyExtractor={(item) => item.id}
        renderItem={renderCommunity}
        ListEmptyComponent={<Text style={styles.emptyText}>No communities available at the moment.</Text>}
      />

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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1C',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 70,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 15,
    marginTop: 10, //this was newly added this week
  },
  communityBox: {
    backgroundColor: '#2E2E2E',
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
  },
  communityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 5,
  },
  communityDescription: {
    fontSize: 14,
    color: '#CCC',
    marginBottom: 5,
  },
  communityGoal: {
    fontSize: 14,
    color: '#FFF',
    marginBottom: 10,
  },
  joinButton: {
    backgroundColor: '#1f91d6',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  joinButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
  emptyText: {
    color: '#FFF',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#2E2E2E',
    paddingVertical: 5,
    bottom: -35, //not here before (newly added this week)

  },
});

export default CommunityScreen;
