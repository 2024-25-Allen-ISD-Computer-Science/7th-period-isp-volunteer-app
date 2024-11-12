import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthScreen from './Components/AuthScreen';
import EmailSignUpScreen from './Components/EmailSignUpScreen';
import EmailSignInScreen from './Components/EmailSignInScreen';
import HomePage from './Components/HomePage';
import ProfileScreen from './Components/ProfileScreen';
import { AppRegistry } from 'react-native';
import { PaperProvider } from 'react-native-paper';




const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <PaperProvider>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Main">
        <Stack.Screen name="Auth" component={AuthScreen} />
        <Stack.Screen name="EmailSignUp" component={EmailSignUpScreen} />
        <Stack.Screen name="EmailSignIn" component={EmailSignInScreen} />
        <Stack.Screen name="HomePage" component={HomePage} />
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />

      </Stack.Navigator>
    </NavigationContainer>
    </PaperProvider>
  );
};

export default App;


