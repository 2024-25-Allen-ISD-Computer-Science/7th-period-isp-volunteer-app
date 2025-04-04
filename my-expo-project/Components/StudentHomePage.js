import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable, Image, Modal, Dimensions } from 'react-native';
import { Video } from 'expo-av';
import { auth, firestore } from './firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { getAuth, signOut } from 'firebase/auth';
import logo from '../assets/logo.png';
import { Platform, StatusBar } from 'react-native';


const StudentHomePage = ({ navigation }) => {
  const [userName, setUserName] = useState('');
  const [hoveredButton, setHoveredButton] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(firestore, 'users', user.uid);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserName(`${data.firstName}`);
        } else {
          setUserName('Guest');
        }
      }
    };
    fetchUserData();
  }, []);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => navigation.navigate('Auth'))
      .catch((error) => console.error('Sign-out error:', error));
  };

  return (
    <View style={styles.container}> {/* Main container for the screen */}
    {/* Fullscreen background video */}
      <Video 
        ref={videoRef}
        source={require('../public/background.mp4')}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
        isMuted
        shouldPlay
        isLooping
      />
      {/* Dark overlay to improve text readability on top of video */}
      <View style={styles.overlay} />

      {/* Top navbar */}
      <View style={styles.navbar}>   
        {/* Open menu on press */}
        <TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.menuIcon}>
          <Text style={styles.menuText}>☰</Text>
        </TouchableOpacity>
        <Image source={logo} style={styles.logoImage} /> {/* HelpHive logo */}
        <View style={{ width: 30 }} />
      </View>

      {/* Modal that appears when the menu is open */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={menuVisible}
        onRequestClose={() => setMenuVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={() => { setMenuVisible(false); navigation.navigate('ProfileScreen'); }}>
              {/* One of the options on the pop-up */}
              <Text style={styles.navItem}>Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setMenuVisible(false); navigation.navigate('Opportunities'); }}>
              <Text style={styles.navItem}>Opportunities</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setMenuVisible(false); navigation.navigate('LogHours'); }}>
              <Text style={styles.navItem}>Log Hours</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setMenuVisible(false); navigation.navigate('Communities'); }}>
              <Text style={styles.navItem}>Communities</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setMenuVisible(false); handleSignOut(); }}>
              <Text style={styles.navItem}>Sign Out</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setMenuVisible(false)} style={styles.closeButton}>
              <Text style={styles.closeText}>Close Menu</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.centeredContent}>
        <Text style={styles.title}>Welcome, {userName}!</Text>
        <Text style={styles.body}>How do you want to help your community today?</Text>

        <Pressable
          style={[styles.button, hoveredButton === 'viewHours' && styles.hoveredBox]}
          onHoverIn={() => setHoveredButton('viewHours')}
          onHoverOut={() => setHoveredButton(null)}
          onPress={() => navigation.navigate('ViewLoggedHours')}
        >
          <Text style={styles.buttonText}>View Logged Hours</Text>
        </Pressable>

        <Pressable
          style={[styles.button, hoveredButton === 'studentMap' && styles.hoveredBox]}
          onHoverIn={() => setHoveredButton('studentMap')}
          onHoverOut={() => setHoveredButton(null)}
          onPress={() => navigation.navigate('StudentMap')}
        >
          <Text style={styles.buttonText}>View Map</Text>
        </Pressable>

        <Pressable
          style={[styles.button, hoveredButton === 'StudentOpportunitiesCalendar' && styles.hoveredBox]}
          onHoverIn={() => setHoveredButton('StudentOpportunitiesCalendar')}
          onHoverOut={() => setHoveredButton(null)}
          onPress={() => navigation.navigate('StudentOpportunitiesCalendar')}
        >
          <Text style={styles.buttonText}>View Opportunities Calendar</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  navbar: {
    position: 'absolute',
    top: 50,
    
    height: 80,
    backgroundColor: '#1A1446',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    zIndex: 2,
  },
  
  logoImage: {
    width: 120,
    height: 40,
    resizeMode: 'contain',
  },
  menuIcon: {
    padding: 10,
  },
  menuText: {
    fontSize: 28,
    color: 'white',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 30,
    width: '80%',
    alignItems: 'center',
  },
  navItem: {
    fontSize: 18,
    color: '#1A1446',
    marginVertical: 10,
  },
  closeButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#1A1446',
    borderRadius: 8,
  },
  closeText: {
    color: 'white',
    fontWeight: '600',
  },
  centeredContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 100,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  body: {
    color: '#DDDDDD',
    fontSize: 16,
    marginBottom: 30,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#1f91d6',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 30,
    marginVertical: 10,
    minWidth: '80%',
    alignItems: 'center',
  },
  hoveredBox: {
    backgroundColor: '#1177b0',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default StudentHomePage;
