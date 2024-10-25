import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const OpportunitiesPage = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Opportunities Page</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default OpportunitiesPage;
