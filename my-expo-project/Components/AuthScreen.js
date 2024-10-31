// components/AuthComponent.js
import React, { useState } from "react";
import { View, Button, TextInput, StyleSheet } from "react-native";
import { signUpWithEmail, signInWithEmail, signInWithGoogle } from "../auth"; // Adjust the import path

const AuthScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button title="Sign Up" onPress={() => signUpWithEmail(email, password)} />
      <Button title="Sign In" onPress={() => signInWithEmail(email, password)} />
      <Button title="Sign In with Google" onPress={signInWithGoogle} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    marginBottom: 10,
    borderBottomWidth: 1,
  },
});

export default AuthScreen;
