import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const HomePage = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome,</Text>
      <Text style={styles.body}>How do you want to help your community today?</Text>
      
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
