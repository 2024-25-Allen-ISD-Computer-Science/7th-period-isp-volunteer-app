import React from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Image, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const opportunities = [
  {
    image: require('../public/comingsoon.png'),
    title: "Dog Park Helpout!",
    description: "Join us for a dog park volunteer day, where we'll pick up trash, maintain, and beautify the park for our furry friends and their owners.",
    timeCommitment: "2-4 hrs",
    isPopular: false,
  },
  {
    image: require('../public/comingsoon.png'),
    title: "Wildlife Conservation",
    description: "Spend a day with a supporting local wildlife conservation agency, helping remove invasive plants.",
    timeCommitment: "3-5 hrs",
    isPopular: false,
  },
  {
    image: require('../public/comingsoon.png'),
    title: "Allen ISD FB Concessions",
    description: "Visit the Allen ISD stadium to help serve food to people attending home & away football games!",
    timeCommitment: "2-4 hrs",
    isPopular: true,
  },
];

const OpportunitiesPage = ({ navigation }) => {
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

      {/* Cards Section */}
      <ScrollView contentContainerStyle={styles.content}>
        {opportunities.map((opportunity, index) => (
          <View key={index} style={styles.card}>
            <Image source={opportunity.image} style={styles.cardImage} />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{opportunity.title}</Text>
              <Text style={styles.cardDescription}>{opportunity.description}</Text>
              <Text style={styles.cardTime}>{opportunity.timeCommitment}</Text>
              {opportunity.isPopular && <Text style={styles.popularTag}>Popular right now!</Text>}
              <TouchableOpacity style={styles.exploreButtonSmall}>
                <Text style={styles.exploreButtonTextSmall}>Explore</Text>
              </TouchableOpacity>
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
  popularTag: {
    color: 'red',
    fontSize: 12,
    fontWeight: 'bold',
  },
  exploreButtonSmall: {
    backgroundColor: '#1f91d6',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignSelf: 'flex-start',
    marginTop: 5,
  },
  exploreButtonTextSmall: {
    color: '#FFF',
    fontSize: 12,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#2E2E2E',
    paddingVertical: 10,
  },
});

export default OpportunitiesPage;
