import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Touchable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { auth, firestore } from './firebaseConfig';
import { doc, getDoc } from 'firebase/firestore'; // Firestore functions
import { getAuth, signOut } from "firebase/auth";


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
  

  //Logic behind sign out button
  const handleSignOut = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        // Navigate to the authentication screen after successful sign out
        navigation.navigate('Auth');
      })
      .catch((error) => {
        console.error("Sign-out error:", error);
      });
  };  
  

  return (
    <View style={styles.container}>
      {/* Creating a red Sign Out Button in the top right corner of the page*/}
      <TouchableOpacity
        style={styles.signOutButton}
        onPress={handleSignOut}
      >
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
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

      <TouchableOpacity
        style={styles.box}
        onPress={() => navigation.navigate('Progress')}
      >
        <Text style={styles.boxText}>ProgressBar</Text>
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
  signOutButton: {
    position: 'absolute',
    top: 40,               
    right: 20,            
    backgroundColor: '#ff4c4c',  
    paddingVertical: 10,  
    paddingHorizontal: 20, 
    borderRadius: 5,      
    alignItems: 'center', 
    justifyContent: 'center',
  },
  signOutText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default HomePage;
