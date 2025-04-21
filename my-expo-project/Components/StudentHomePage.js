import React, { useEffect, useState, useRef } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  Platform,
  StatusBar,
  Pressable,
} from 'react-native';
import { Video } from 'expo-av';
import { auth, firestore } from './firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import logo from '../assets/logo.png';

const StudentHomePage = ({ navigation }) => {
  const [userName, setUserName] = useState('');
  const [activeButton, setActiveButton] = useState('Home');
  const [showLogHoursDropdown, setShowLogHoursDropdown] = useState(false);
  const videoRef = useRef(null);
  const { width } = Dimensions.get('window');
  const isMobile = width < 768;

  useEffect(() => {
    const { width } = Dimensions.get('window');
    if (width < 768) {
      navigation.replace('MobileStudent');
      return;
    }
    (async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = doc(firestore, 'users', user.uid);
        const snap = await getDoc(userDoc);
        setUserName(snap.exists() ? snap.data().firstName : 'Student');
      }
    })();
  }, []);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => navigation.navigate('Auth'))
      .catch(console.error);
  };

  const navItems = [
    { id: 'Home', label: 'Home', route: 'Home' },
    { id: 'Profile', label: 'Profile', route: 'ProfileScreen' },
    { id: 'Opportunities', label: 'Opportunities', route: 'Opportunities' },
    { id: 'Communities', label: 'Communities', route: 'Communities' },
    { id: 'ViewMap', label: 'View Map', route: 'StudentMap' },
    { id: 'Calendar', label: 'Calendar', route: 'StudentOpportunitiesCalendar' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" translucent />
      <View style={styles.container}>

        {/* Background video & overlay */}
        <Video
          ref={videoRef}
          source={require('../public/background.mp4')}
          style={StyleSheet.absoluteFillObject}
          resizeMode="cover"
          isMuted
          shouldPlay
          isLooping
        />
        <View style={styles.overlay} />

        {/* Navbar */}
        <View style={styles.header}>
          <Image source={logo} style={styles.logoImage} />

          {!isMobile && (
            <View style={styles.navWrapper}>
              <View style={styles.navContainer}>
                {navItems.map(item => (
                  <Pressable
                    key={item.id}
                    style={[
                      styles.navButton,
                      activeButton === item.id && styles.activeNavButton,
                    ]}
                    onPress={() => {
                      setActiveButton(item.id);
                      navigation.navigate(item.route);
                      setShowLogHoursDropdown(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.navButtonText,
                        activeButton === item.id && styles.activeNavText,
                      ]}
                    >
                      {item.label}
                    </Text>
                  </Pressable>
                ))}

              
                <View
                  style={styles.navItemContainer}
                  onMouseEnter={() => setShowLogHoursDropdown(true)}
                  onMouseLeave={() => setShowLogHoursDropdown(false)}
                >
                  <Pressable
                    onPress={() => {
                      setActiveButton('LogHours');
                      setShowLogHoursDropdown(prev => !prev);
                    }}
                  >
                    <View style={[styles.navButton, showLogHoursDropdown && styles.activeNavButton]}>
                      <Text style={[styles.navButtonText, showLogHoursDropdown && styles.activeNavText]}>
                        Log Hours
                      </Text>
                    </View>
                  </Pressable>

                  {showLogHoursDropdown && (
                    <View style={styles.dropdownMenu}>
                      <Pressable
                        style={styles.dropdownItem}
                        onPress={() => {
                          navigation.navigate('LogHours');
                          setTimeout(() => setShowLogHoursDropdown(false), 100);
                        }}
                      >
                        <Text style={styles.dropdownItemText}>Log Hours</Text>
                      </Pressable>
                      <Pressable
                        style={styles.dropdownItem}
                        onPress={() => {
                          navigation.navigate('ViewLoggedHours');
                          setTimeout(() => setShowLogHoursDropdown(false), 100);
                        }}
                      >
                        <Text style={styles.dropdownItemText}>View Logged Hours</Text>
                      </Pressable>
                    </View>
                  )}
                </View>
              </View>

              <Pressable style={styles.signOutButton} onPress={handleSignOut}>
                <Text style={styles.navButtonText}>Sign Out</Text>
              </Pressable>
            </View>
          )}

          {isMobile && (
            <Pressable style={styles.mobileMenuButton} onPress={() => navigation.navigate('MobileMenu')}>
              <Text style={styles.mobileMenuIcon}>☰</Text>
            </Pressable>
          )}
        </View>

        {/* Main content */}
        <View style={styles.contentContainer} removeClippedSubviews={true}>
        <Text
            key={`welcome-${userName}`}
            style={[styles.welcomeText]}
            selectable={false}
          >
            Welcome,
          </Text>
          <Text selectable={false} style={styles.nameText}>{userName}</Text>
          <Text selectable={false} style={styles.subtitleText}>
            How do you want to help your community today?
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    paddingHorizontal: 20,
    backgroundColor: '#1A1446',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
    zIndex: 10,
  },
  logoImage: { width: 100, height: 36, resizeMode: 'contain' },
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
  navItemContainer: {
    position: 'relative',
    marginHorizontal: 4,
  },
  navButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  activeNavButton: { backgroundColor: 'rgba(255,255,255,0.1)' },
  navButtonText: { color: '#BBBBCC', fontSize: 15, fontWeight: '500' },
  activeNavText: { color: 'white', fontWeight: '600' },
  dropdownMenu: {
    position: 'absolute',
    top: '100%',
    left: 0,
    backgroundColor: '#1A1446',
    borderRadius: 4,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 20,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  dropdownItemText: { color: '#BBBBCC', fontSize: 15, fontWeight: '500' },
  signOutButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginLeft: 20,
    borderRadius: 4,
  },
  mobileMenuButton: { marginLeft: 'auto', padding: 10 },
  mobileMenuIcon: { fontSize: 24, color: 'white' },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 80, // slight shift down to center better visually
    zIndex: 2,
  },
  welcomeText: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '600',
    marginBottom: 4, // slight space under "Welcome,"
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
    includeFontPadding: false,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  
});

export default StudentHomePage;
