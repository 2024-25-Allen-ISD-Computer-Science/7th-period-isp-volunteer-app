import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import { firestore, auth } from "./firebaseConfig";
import { collection, getDocs, doc, updateDoc, getDoc } from "firebase/firestore";
import { MAP_API_KEY } from "@env";

const containerStyle = {
  width: "100%",
  height: "500px",
};

const center = {
  lat: 33.087944,
  lng: -96.699483,
};

const StudentMap = ({ navigation }) => {
  const [markers, setMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const fetchOpportunitiesAndGeocode = async () => {
      const userId = auth.currentUser.uid;
      const userRef = doc(firestore, 'users', userId);
      const userSnapshot = await getDoc(userRef);
      const joinedOpportunities = userSnapshot.data()?.joinedOpportunities || [];

      if (userSnapshot.exists()) {
        setUserData(userSnapshot.data());
      }

      const querySnapshot = await getDocs(collection(firestore, "opportunities"));
      const rawOpportunities = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const geocodedMarkers = await Promise.all(
        rawOpportunities.map(async (opportunity) => {
          if (!opportunity.location || !opportunity.location.address) return null; //Skip if no address

          const address = opportunity.location.address;
          try {
            //Requesting geocoded coordinates from Google Maps API
            const response = await fetch(
              `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${MAP_API_KEY}`
            );
            const data = await response.json();
            if (data.status === "OK") {
              const { lat, lng } = data.results[0].geometry.location; //Latitude and longitude to put marker on the map
              return { //Return formatted marker content with all the fields/properties
                id: opportunity.id,
                name: opportunity.name,
                hourValue: opportunity.hourValue,
                description: opportunity.description,
                currentSignUps: opportunity.currentSignUps,
                maxSignUps: opportunity.maxSignUps,
                joined: joinedOpportunities.includes(opportunity.id),
                position: { lat, lng },
              };
            } else {
              console.warn(`Geocoding failed for ${address}: ${data.status}`);
              return null;
            }
          } catch (err) {
            console.error("Geocoding error:", err);
            return null;
          }
        })
      );

      setMarkers(geocodedMarkers.filter((marker) => marker !== null));
    };

    fetchOpportunitiesAndGeocode();
  }, []);

  const handleJoinOpportunity = async (id, currentSignUps, maxSignUps) => {
    const userId = auth.currentUser.uid;
    const userRef = doc(firestore, 'users', userId);

    try {
      const userSnapshot = await getDoc(userRef);
      const userData = userSnapshot.exists() ? userSnapshot.data() : {};
      const joined = userData.joinedOpportunities || [];

      if (joined.includes(id)) {
        Alert.alert("Error", "You have already joined this opportunity.");
        return;
      }

      if (currentSignUps >= maxSignUps) {
        Alert.alert("Error", "This opportunity is full.");
        return;
      }

      const opportunityRef = doc(firestore, "opportunities", id);
      await updateDoc(opportunityRef, {
        currentSignUps: currentSignUps + 1,
      });

      await updateDoc(userRef, {
        joinedOpportunities: [...joined, id],
      });

      setMarkers((prev) =>
        prev.map((marker) =>
          marker.id === id
            ? { ...marker, currentSignUps: marker.currentSignUps + 1, joined: true }
            : marker
        )
      );

      setSelectedMarker((prev) =>
        prev ? { ...prev, currentSignUps: prev.currentSignUps + 1, joined: true } : null
      );

      Alert.alert("Success", "You have joined the opportunity!");
    } catch (error) {
      console.error("Error joining opportunity:", error);
      Alert.alert("Error", "Failed to join the opportunity.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Opportunities Map</Text>

      <LoadScript googleMapsApiKey={MAP_API_KEY}>
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={10}>
          {markers.map((marker) => (
            <Marker
              key={marker.id}
              position={marker.position}
              onClick={() => setSelectedMarker(marker)}
            />
          ))}

          {selectedMarker && (
            <InfoWindow
              position={selectedMarker.position}
              onCloseClick={() => setSelectedMarker(null)}
            >
              <View style={{ maxWidth: 200 }}>
                <Text
                  style={{
                    fontWeight: "bold", fontSize: 15, lineHeight: 15, marginBottom: 10,
                  }}
                >
                  {selectedMarker.name}
                </Text>
                <Text style={{ fontSize: 12, marginBottom: 4 }}>
                  # of hours: {selectedMarker.hourValue}
                </Text>
                <Text style={{ fontSize: 13, marginBottom: 10 }}>
                  {selectedMarker.description}
                </Text>

                {selectedMarker.joined ? (
                  <Text style={{ fontSize: 13, color: "#4CAF50", fontWeight: "bold" }}>
                    You're signed up!
                  </Text>
                ) : selectedMarker.currentSignUps < selectedMarker.maxSignUps ? (
                  <TouchableOpacity
                    onPress={() =>
                      handleJoinOpportunity(
                        selectedMarker.id,
                        selectedMarker.currentSignUps,
                        selectedMarker.maxSignUps
                      )
                    }
                    style={{
                      backgroundColor: "#4CAF50",
                      paddingVertical: 6,
                      paddingHorizontal: 12,
                      borderRadius: 5,
                    }}
                  >
                    <Text style={{ color: "#fff", fontSize: 13 }}>Sign Up</Text>
                  </TouchableOpacity>
                ) : (
                  <Text
                    style={{
                      color: "red",
                      fontSize: 13,
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    Capacity Reached
                  </Text>
                )}
              </View>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate("StudentHomePage")}
      >
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
