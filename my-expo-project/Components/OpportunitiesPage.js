import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

const opportunities = [
  {
    title: "Community Garden Volunteer",
    description: "Help maintain a local community garden by planting, weeding, and harvesting fresh produce.",
    location: "Downtown Community Garden",
    timeCommitment: "Saturdays from 9 AM to 12 PM",
    contact: "gardening@community.org",
  },
  {
    title: "Food Bank Assistant",
    description: "Assist in sorting and packing food items for distribution to families in need.",
    location: "City Food Bank",
    timeCommitment: "Wednesdays and Fridays from 2 PM to 5 PM",
    contact: "volunteer@foodbank.org",
  },
  {
    title: "Tutoring Program Mentor",
    description: "Provide academic support to underprivileged students in subjects like math, reading, and science.",
    location: "Local High School",
    timeCommitment: "Mondays and Thursdays from 4 PM to 6 PM",
    contact: "tutoring@schools.org",
  },
  {
    title: "Animal Shelter Volunteer",
    description: "Help care for animals in the shelter, including feeding, walking, and socializing pets.",
    location: "City Animal Shelter",
    timeCommitment: "Tuesdays and Saturdays from 10 AM to 2 PM",
    contact: "shelter@animals.org",
  },
];

const OpportunitiesPage = ({navigation}) => {
  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate('HomePage')}      
        >
        <Text style={styles.buttonText}>Back to Home</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Volunteering Opportunities</Text>
      {opportunities.map((opportunity, index) => (
        <View key={index} style={styles.opportunity}>
          <Text style={styles.opportunityTitle}>{opportunity.title}</Text>
          <Text>{opportunity.description}</Text>
          <Text>
            <Text style={styles.boldText}>Location:</Text> {opportunity.location}
          </Text>
          <Text>
            <Text style={styles.boldText}>Time Commitment:</Text> {opportunity.timeCommitment}
          </Text>
          <Text>
            <Text style={styles.boldText}>Contact:</Text> {opportunity.contact}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  opportunity: {
    marginBottom: 20,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    top: 50,
  },
  opportunityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  boldText: {
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
});

export default OpportunitiesPage;
