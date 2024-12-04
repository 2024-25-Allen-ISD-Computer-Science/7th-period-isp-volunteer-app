import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { auth, firestore } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore'; // Firestore functions
import { getAuth, signOut } from "firebase/auth"; // Firebase Auth functions

const TeacherHomePage = ({ navigation }) => {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(firestore, 'users', user.uid); // Reference to the teacher's document in Firestore
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

  // Logic behind sign-out button
  const handleSignOut = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        // Navigate to the authentication screen after successful sign-out
        navigation.navigate('Auth');
      })
      .catch((error) => {
        console.error("Sign-out error:", error);
      });
  };

  return (
    <View style={styles.container}>
      {/* Sign-Out Button */}
      <TouchableOpacity
        style={styles.signOutButton}
        onPress={handleSignOut}
      >
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>

      {/* Greeting Message */}
      <Text style={styles.title}>Welcome, {userName}!</Text>
      <Text style={styles.body}>How would you like to manage your communities today?</Text>

      {/* Teacher-specific buttons */}
      <TouchableOpacity 
        style={styles.box} 
        onPress={() => navigation.navigate('TeacherProfile')}
      >
        <Text style={styles.boxText}>View Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.box}
        onPress={() => navigation.navigate('ManageCommunities')}
      >
        <Text style={styles.boxText}>Manage Communities</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.box}
        onPress={() => navigation.navigate('StudentProgress')}
      >
        <Text style={styles.boxText}>View Student Progress</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.box}
        onPress={() => navigation.navigate('CreateOpportunities')}
      >
        <Text style={styles.boxText}>Create Opportunities</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.box}
        onPress={() => navigation.navigate('EventManagement')}
      >
        <Text style={styles.boxText}>Manage Events</Text>
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

export default TeacherHomePage;