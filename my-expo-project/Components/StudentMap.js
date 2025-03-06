import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import { MAP_API_KEY } from "@env";

const containerStyle = {
  width: "100%",
  height: "500px",
};

// Map center is downtown Dallas
const center = {
  lat: 32.7767, 
  lng: -96.7970, 
};

// List of marker locations
const locations = [
  {
    id: 1,
    name: "PB & Joy @ AHS",
    position: { lat: 33.1081, lng: -96.6457 },
  },
  {
    id: 2,
    name: "Plano Lifeguard",
    position: { lat: 33.0198, lng: -96.6997 },
  },
  {
    id: 3,
    name: "Frisco Library Volunteering",
    position: { lat: 33.1507, lng: -96.8236 },
  },
];

const StudentMap = ({ navigation }) => {
  const [selectedMarker, setSelectedMarker] = useState(null);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dallas, TX Map</Text>

      <LoadScript googleMapsApiKey={MAP_API_KEY}>
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={10}>
          {locations.map((location) => (
            <Marker
              key={location.id}
              position={location.position}
              onClick={() => setSelectedMarker(location)}
            />
          ))}

          {selectedMarker && (
            <InfoWindow
              position={selectedMarker.position}
              onCloseClick={() => setSelectedMarker(null)}
            >
              <Text>{selectedMarker.name}</Text>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("StudentHomePage")}>
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

export default StudentMap;
