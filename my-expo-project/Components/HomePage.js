import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { auth, firestore } from './firebaseConfig';
import { doc, getDoc } from 'firebase/firestore'; // Firestore functions

const HomePage = ({ navigation }) => {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(firestore, 'users', user.uid); // Reference to the user's document in Firestore
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserName(`${data.firstName}`); // Set the name as first name
        } else {
          setUserName('Guest');
        }
      }
    };

    fetchUserData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, {userName}!</Text>
      <Text style={styles.body}>How do you want to help your community today?</Text>

      <TouchableOpacity 
        style={styles.box} 
        onPress={() => navigation.navigate('ProfileScreen')}
      >
        <Text style={styles.boxText}>View Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.box}
        onPress={() => navigation.navigate('Opportunities')}
      >
        <Text style={styles.boxText}>Find Opportunities</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.box}
        onPress={() => navigation.navigate('LogHours')}
      >
        <Text style={styles.boxText}>Log Your Hours</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.box}
        onPress={() => navigation.navigate('Communities')}
      >
        <Text style={styles.boxText}>Communities...</Text>
      </TouchableOpacity>

      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#443939',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    color: '#fff',
    fontSize: 32,
    marginBottom: 20,
  },
  body: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 20,
  },
  box: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 20,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  boxText: {
    color: '#443939',
    fontSize: 18,
  },
});

export default HomePage;
