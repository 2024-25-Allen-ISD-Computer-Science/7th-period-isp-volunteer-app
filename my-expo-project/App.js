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
import CommunityScreen from './Components/CommunitiesPage';
import OpportunityScreen from './Components/OpportunitiesPage';
import { DefaultTheme } from 'react-native-paper';

const Stack = createNativeStackNavigator();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#1f91d6',
  },
};


const App = () => {
  return (
    <PaperProvider theme = {theme}>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Main">
        <Stack.Screen options={{ headerShown: false }} name="Auth" component={AuthScreen} />
        <Stack.Screen options={{ headerShown: false }} name="EmailSignUp" component={EmailSignUpScreen} />
        <Stack.Screen options={{ headerShown: false }} name="EmailSignIn" component={EmailSignInScreen} />
        <Stack.Screen options={{ headerShown: false }} name="HomePage" component={HomePage} />
        <Stack.Screen options={{ headerShown: false }} name="ProfileScreen" component={ProfileScreen} />
        <Stack.Screen options={{ headerShown: false }} name="Communities" component={CommunityScreen} />
        <Stack.Screen options={{ headerShown: false }} name="Opportunities" component={OpportunityScreen} />

        
      </Stack.Navigator>
    </NavigationContainer>
    </PaperProvider>
  );
};

export default App;


