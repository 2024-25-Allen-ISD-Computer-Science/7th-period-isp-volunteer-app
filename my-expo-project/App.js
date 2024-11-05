// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthScreen from './Components/AuthScreen'; // Ensure the path is correct
import EmailSignUpScreen from './Components/EmailSignUpScreen'; // Import the SignUp screen
import EmailSignInScreen from './Components/EmailSignInScreen'; // Import the SignIn Screen
import HomePage from './Components/HomePage'; // Import the HomePage

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Auth">
        <Stack.Screen name="Auth" component={AuthScreen} />
        <Stack.Screen name="EmailSignUp" component={EmailSignUpScreen} />
        <Stack.Screen name="EmailSignIn" component={EmailSignInScreen} />
        <Stack.Screen name="HomePage" component={HomePage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;


