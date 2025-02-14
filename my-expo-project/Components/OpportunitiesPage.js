import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Image, TouchableOpacity, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { firestore, auth } from './firebaseConfig';
import { collection, getDocs, doc, updateDoc, getDoc } from 'firebase/firestore';

const OpportunitiesPage = ({ navigation }) => {
  const [opportunities, setOpportunities] = useState([]);
  const [userData, setUserData] = useState({});

  // Fetch opportunities and user data from Firestore
  useEffect(() => {
    const fetchData = async () => {
      try {
        const opportunitiesRef = collection(firestore, 'opportunities');
        const querySnapshot = await getDocs(opportunitiesRef);
        
        const fetchedOpportunities = [];
        querySnapshot.forEach((doc) => {
          fetchedOpportunities.push({ id: doc.id, ...doc.data() });
        });
        setOpportunities(fetchedOpportunities);

        // Fetch user data
        const userId = auth.currentUser.uid;
        const userRef = doc(firestore, 'users', userId);
        const userSnapshot = await getDoc(userRef);
        if (userSnapshot.exists()) {
          setUserData(userSnapshot.data());
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Handle joining an opportunity
  const handleJoinOpportunity = async (opportunityId, currentSignUps, maxSignUps) => {
    const userId = auth.currentUser.uid;
    const userRef = doc(firestore, 'users', userId);

    try {
      // Fetch the user's document
      const userSnapshot = await getDoc(userRef);
      const userData = userSnapshot.exists() ? userSnapshot.data() : {};

      // Check if the joinedOpportunities field exists, and initialize it if not
      const joinedOpportunities = userData?.joinedOpportunities || [];

      // Check if the user has already joined this opportunity
      if (joinedOpportunities.includes(opportunityId)) {
        Alert.alert('Error', 'You have already joined this opportunity.');
        return;
      }

      if (currentSignUps >= maxSignUps) {
        Alert.alert('Error', 'This opportunity is full.');
        return;
      }

      // Update the opportunity's sign-up count
      const opportunityRef = doc(firestore, 'opportunities', opportunityId);
      await updateDoc(opportunityRef, {
        currentSignUps: currentSignUps + 1,
      });

      // Update the user's joinedOpportunities list
      await updateDoc(userRef, {
        joinedOpportunities: [...joinedOpportunities, opportunityId],
      });

      Alert.alert('Success', 'You have joined the opportunity!');

      // Update the state to reflect the changes
      setOpportunities((prev) =>
        prev.map((opp) =>
          opp.id === opportunityId
            ? { ...opp, currentSignUps: opp.currentSignUps + 1 }
            : opp
        )
      );
    } catch (error) {
      console.error('Error joining opportunity:', error);
      Alert.alert('Error', 'Failed to join the opportunity.');
    }
  };

  const handleCancelOpportunity = async (opportunityId, currentSignUps) => {
    const userId = auth.currentUser.uid;
    const userRef = doc(firestore, 'users', userId);
    const opportunityRef = doc(firestore, 'opportunities', opportunityId);
  
    try {
      // Fetch user data
      const userSnapshot = await getDoc(userRef);
      if (!userSnapshot.exists()) return;
  
      let joinedOpportunities = userSnapshot.data().joinedOpportunities || [];
  
      // Ensure the user has joined this opportunity
      if (!joinedOpportunities.includes(opportunityId)) {
        Alert.alert('Error', 'You are not part of this opportunity.');
        return;
      }
  
      // Remove the opportunity from joinedOpportunities
      joinedOpportunities = joinedOpportunities.filter(id => id !== opportunityId);
  
      // Update the user's document
      await updateDoc(userRef, { joinedOpportunities });
  
      // Decrease the current sign-ups count
      await updateDoc(opportunityRef, { currentSignUps: Math.max(0, currentSignUps - 1) });
  
      Alert.alert('Success', 'You have left the opportunity.');
  
      // Update the state
      setOpportunities(prev =>
        prev.map(opp =>
          opp.id === opportunityId ? { ...opp, currentSignUps: Math.max(0, opp.currentSignUps - 1) } : opp
        )
      );
  
      setUserData(prev => ({
        ...prev,
        joinedOpportunities
      }));
    } catch (error) {
      console.error('Error canceling opportunity:', error);
      Alert.alert('Error', 'Failed to cancel the opportunity.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>123 Main Street</Text>
      </View>

      {/* Find Opportunities Section */}
      <View style={styles.topSection}>
        <Text style={styles.title}>Find Opportunities Near You!</Text>
        <Text style={styles.subtitle}>
          Search for opportunities to connect with your community
        </Text>
        <TouchableOpacity style={styles.exploreButton}>
          <Text style={styles.exploreButtonText}>Explore</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchBar}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          placeholderTextColor="#999"
        />
        <MaterialIcons name="search" size={24} color="#999" />
      </View>

 {/* Display each opportunity */}
 <ScrollView contentContainerStyle={styles.content}>
        {opportunities.map((opportunity) => (
          <View key={opportunity.id} style={styles.card}>
            <Image source={require('../public/comingsoon.png')} style={styles.cardImage} />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{opportunity.name}</Text>
              <Text style={styles.cardDescription}>{opportunity.description}</Text>
              <Text style={styles.cardTime}>{opportunity.time}</Text>
              <Text style={styles.cardCommitment}>
                {opportunity.currentSignUps}/{opportunity.maxSignUps} Sign-Ups
              </Text>
              {userData.joinedOpportunities?.includes(opportunity.id) ? (
                <TouchableOpacity
                  style={[styles.joinButton, { backgroundColor: 'red' }]}
                  onPress={() =>
                    handleCancelOpportunity(opportunity.id, opportunity.currentSignUps)
                  }
                >
                  <Text style={styles.joinButtonText}>Cancel</Text>
                </TouchableOpacity>
              ) : opportunity.currentSignUps < opportunity.maxSignUps ? (
                <TouchableOpacity
                  style={styles.joinButton}
                  onPress={() =>
                    handleJoinOpportunity(
                      opportunity.id,
                      opportunity.currentSignUps,
                      opportunity.maxSignUps
                    )
                  }
                >
                  <Text style={styles.joinButtonText}>Join</Text>
                </TouchableOpacity>
              ) : (
                <Text style={styles.fullTag}>Full</Text>
              )}
            </View>
          </View>
        ))}
      </ScrollView>

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
    paddingTop: 40,
    paddingBottom: 0,
  },
  header: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#2E2E2E',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
  },
  headerText: {
    color: '#FFF',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10, //this wasn't here before
  },
  topSection: {
    paddingHorizontal: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#CCC',
    textAlign: 'center',
    marginBottom: 12,
  },
  exploreButton: {
    backgroundColor: '#1f91d6',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
  },
  exploreButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2E2E2E',
    marginHorizontal: 15,
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    color: '#FFF',
  },
  content: {
    paddingHorizontal: 10,
    paddingBottom: 70,
  },
  card: {
    backgroundColor: '#2E2E2E',
    borderRadius: 10,
    marginBottom: 12,
    flexDirection: 'row',
    overflow: 'hidden',
    padding: 10,
  },
  cardImage: {
    width: 80,
    height: 80,
    borderRadius: 5,
  },
  cardContent: {
    flex: 1,
    paddingLeft: 10,
  },
  cardTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardDescription: {
    color: '#CCC',
    fontSize: 12,
    marginBottom: 4,
  },
  cardTime: {
    color: '#FFF',
    fontSize: 12,
    marginBottom: 3,
  },
  cardCommitment: {
    color: '#FFF',
    fontSize: 12,
  },
  joinButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginTop: 6,
    alignSelf: 'flex-start',
  },
  joinButtonText: {
    color: '#FFF',
    fontSize: 12,
  },
  fullTag: {
    color: 'red',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 5,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#2E2E2E',
    paddingVertical: 35, //this was at 10 before
  },
});

export default OpportunitiesPage;
