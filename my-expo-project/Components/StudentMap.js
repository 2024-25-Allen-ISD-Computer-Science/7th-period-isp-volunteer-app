import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { GoogleMap, LoadScript } from "@react-google-maps/api";
import { MAP_API_KEY } from "@env";

const containerStyle = {
  width: "100%",
  height: "500px",
};

const center = {
  lat: 32.7767, // Dallas, TX Latitude
  lng: -96.7970, // Dallas, TX Longitude
};

const MapScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dallas, TX Map</Text>
      
      <LoadScript googleMapsApiKey={MAP_API_KEY}>
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={12} />
      </LoadScript>

      {/* Back Button to Home */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("Home")}>
        <Text style={styles.backButtonText}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1C1C1C",
    alignItems: "center",
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 10,
  },
  backButton: {
    backgroundColor: "#1f91d6",
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },
  backButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default MapScreen;
