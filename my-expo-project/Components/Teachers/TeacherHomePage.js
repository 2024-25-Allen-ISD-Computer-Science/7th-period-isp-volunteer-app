import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { auth, firestore } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore'; // Firestore functions
import { getAuth, signOut } from "firebase/auth";

const TeacherHomePage = ({ navigation }) => {
  const [userName, setUserName] = useState('');
  const [hoveredButton, setHoveredButton] = useState(null);

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
      <Pressable
        style={[styles.box, hoveredButton === 'profile' && styles.hoveredBox]}
        onHoverIn={() => setHoveredButton('profile')}
        onHoverOut={() => setHoveredButton(null)}
        onPress={() => navigation.navigate('ProfileScreen')}
      >
        <Text style={styles.boxText}>View Profile</Text>
      </Pressable>

      <Pressable
        style={[styles.box, hoveredButton === 'communities' && styles.hoveredBox]}
        onHoverIn={() => setHoveredButton('communities')}
        onHoverOut={() => setHoveredButton(null)}
        onPress={() => navigation.navigate('ManageCommunities')}
      >
        <Text style={styles.boxText}>Manage Communities</Text>
      </Pressable>

      <Pressable
        style={[styles.box, hoveredButton === 'students' && styles.hoveredBox]}
        onHoverIn={() => setHoveredButton('students')}
        onHoverOut={() => setHoveredButton(null)}
        onPress={() => navigation.navigate('TeacherManagePage')}
      >
        <Text style={styles.boxText}>Manage Students</Text>
      </Pressable>

      <Pressable
        style={[styles.box, hoveredButton === 'opportunities' && styles.hoveredBox]}
        onHoverIn={() => setHoveredButton('opportunities')}
        onHoverOut={() => setHoveredButton(null)}
        onPress={() => navigation.navigate('CreateOpportunities')}
      >
        <Text style={styles.boxText}>Create Opportunities</Text>
      </Pressable>

      <Pressable
        style={[styles.box, hoveredButton === 'events' && styles.hoveredBox]}
        onHoverIn={() => setHoveredButton('events')}
        onHoverOut={() => setHoveredButton(null)}
        onPress={() => navigation.navigate('ManageOpportunities')}
      >
        <Text style={styles.boxText}>Manage Opportunities</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1C',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  body: {
    color: '#CCCCCC',
    fontSize: 18,
    marginBottom: 30,
    textAlign: 'center',
    lineHeight: 24,
  },
  box: {
    backgroundColor: '#2E2E2E',
    borderRadius: 10,
    paddingVertical: 15,
    marginBottom: 15,
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    transitionProperty: 'background-color',
    transitionDuration: '200ms',
  },
  hoveredBox: {
    backgroundColor: '#1f91d6',
  },
  boxText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  signOutButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: '#E63946',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  signOutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default TeacherHomePage;
