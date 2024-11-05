import React from 'react';
import { firebase } from '/firebaseConfig.js';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthScreen from './Components/AuthScreen'; 
import OpportunitiesPage from './Components/OpportunitiesPage';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Auth">
        <Stack.Screen name="Auth" component={AuthScreen} />
        <Stack.Screen name="Home" component={Homepage} />
        <Stack.Screen name="Opportunities" component={OpportunitiesPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
