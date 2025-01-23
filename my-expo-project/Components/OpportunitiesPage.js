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
              {opportunity.currentSignUps < opportunity.maxSignUps &&
              !userData.joinedOpportunities?.includes(opportunity.id) ? (
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
                <Text style={styles.fullTag}>
                  {opportunity.currentSignUps >= opportunity.maxSignUps
                    ? 'Full'
                    : 'Already Joined'}
                </Text>
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
  },
  header: {
    padding: 15,
    backgroundColor: '#2E2E2E',
  },
  headerText: {
    color: '#FFF',
    fontSize: 18,
    textAlign: 'center',
  },
  topSection: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#CCC',
    textAlign: 'center',
    marginBottom: 15,
  },
  exploreButton: {
    backgroundColor: '#1f91d6',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  exploreButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2E2E2E',
    margin: 10,
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    padding: 10,
    color: '#FFF',
  },
  content: {
    padding: 10,
  },
  card: {
    backgroundColor: '#2E2E2E',
    borderRadius: 10,
    marginBottom: 15,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  cardImage: {
    width: 100,
    height: 100,
  },
  cardContent: {
    flex: 1,
    padding: 10,
  },
  cardTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardDescription: {
    color: '#CCC',
    fontSize: 14,
    marginVertical: 5,
  },
  cardTime: {
    color: '#FFF',
    fontSize: 14,
    marginBottom: 5,
  },
  cardCommitment: {
    color: '#FFF',
    fontSize: 14,
  },
  joinButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginTop: 5,
  },
  joinButtonText: {
    color: '#FFF',
    fontSize: 14,
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
    paddingVertical: 10,
  },
});

export default OpportunitiesPage;
