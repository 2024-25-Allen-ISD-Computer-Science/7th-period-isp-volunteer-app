import React, { useEffect, useState, useRef } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  Pressable,
  StatusBar,
} from 'react-native';
import { Video } from 'expo-av';
import { auth, firestore } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import logo from '../../assets/logo.png';

const TeacherHomePage = ({ navigation }) => {
  const [userName, setUserName] = useState('');
  const videoRef = useRef(null);
  const { width } = Dimensions.get('window');
  const isMobile = width < 768;

  useEffect(() => {
    const fetchUser = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(firestore, 'users', user.uid));
        setUserName(userDoc.exists() ? userDoc.data().firstName : 'Teacher');
      }
    };
    fetchUser();
  }, []);

  const handleSignOut = () => {
    signOut(auth).then(() => navigation.navigate('Auth')).catch(console.error);
  };

  const navItems = [
    { id: 'Home', label: 'Home', route: 'TeacherHomePage' },
    { id: 'Profile', label: 'Profile', route: 'ProfileScreen' },
    { id: 'ManageCommunities', label: 'Communities', route: 'ManageCommunities' },
    { id: 'TeacherManagePage', label: 'Students', route: 'TeacherManagePage' },
    { id: 'CreateOpportunities', label: 'Create Opportunity', route: 'CreateOpportunities' },
    { id: 'ManageOpportunities', label: 'Manage Opportunities', route: 'ManageOpportunities' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" translucent />
      <View style={styles.container}>
      <Video
          ref={videoRef}
          source={require('../../public/background.mp4')}
          style={StyleSheet.absoluteFillObject}
          resizeMode="cover"
          isMuted
          shouldPlay
          isLooping
        />
        <View style={styles.overlay} />

        <View style={styles.header}>
          <Image source={logo} style={styles.logoImage} />
          {!isMobile ? (
            <View style={styles.navWrapper}>
              <View style={styles.navContainer}>
                {navItems.map((item) => (
                  <Pressable
                    key={item.id}
                    style={styles.navButton}
                    onPress={() => navigation.navigate(item.route)}
                  >
                    <Text style={styles.navButtonText}>{item.label}</Text>
                  </Pressable>
                ))}
              </View>
              <Pressable style={styles.signOutButton} onPress={handleSignOut}>
                <Text style={styles.navButtonText}>Sign Out</Text>
              </Pressable>
            </View>
          ) : (
            <Pressable style={styles.mobileMenuButton} onPress={() => navigation.navigate('MobileMenu')}>
              <Text style={styles.mobileMenuIcon}>☰</Text>
            </Pressable>
          )}
        </View>

        <View style={styles.contentContainer}>
          <Text style={styles.welcomeText} selectable={false}>Welcome,</Text>
          <Text style={styles.nameText} selectable={false}>{userName || '...'}</Text>
          <Text style={styles.subtitleText} selectable={false}>
            How would you like to manage your communities today?
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#1A1446' },
  container: { flex: 1, backgroundColor: '#090426' },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.75)',
    zIndex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    paddingHorizontal: 20,
    backgroundColor: '#1A1446',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
    zIndex: 2,
  },
  logoImage: {
    width: 100,
    height: 36,
    resizeMode: 'contain',
  },
  navWrapper: {
    flex: 1,
    marginLeft: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  navContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  navButtonText: {
    color: '#BBBBCC',
    fontSize: 15,
    fontWeight: '500',
  },
  signOutButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginLeft: 20,
    borderRadius: 4,
  },
  mobileMenuButton: {
    marginLeft: 'auto',
    padding: 10,
  },
  mobileMenuIcon: {
    fontSize: 24,
    color: 'white',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 80,
    zIndex: 2,
  },
  welcomeText: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '600',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    backgroundColor: 'transparent',
  },
  nameText: {
    color: '#FFFFFF',
    fontSize: 44,
    fontWeight: 'bold',
    marginBottom: 35,
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    backgroundColor: 'transparent',
  },
  subtitleText: {
    color: '#CCCCDD',
    fontSize: 20,
    textAlign: 'center',
    lineHeight: 28,
    paddingHorizontal: 10,
    backgroundColor: 'transparent',
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },

});

export default TeacherHomePage;
