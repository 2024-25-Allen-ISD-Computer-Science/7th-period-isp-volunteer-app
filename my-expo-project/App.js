import React from 'react';
import { firebase } from '/firebaseConfig.js';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthScreen from './Components/AuthScreen'; // Import your AuthScreen
import Homepage from './Components/Homepage';
import OpportunitiesPage from './Components/OpportunitiesPage';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Auth"> {/* Change to Auth */}
        <Stack.Screen name="Auth" component={AuthScreen} /> {/* Add AuthScreen */}
        <Stack.Screen name="Home" component={Homepage} />
        <Stack.Screen name="Opportunities" component={OpportunitiesPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
