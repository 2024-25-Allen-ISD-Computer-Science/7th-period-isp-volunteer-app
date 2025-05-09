import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthScreen from './Components/AuthScreen';
import EmailSignUpScreen from './Components/EmailSignUpScreen';
import EmailSignInScreen from './Components/EmailSignInScreen';
import StudentHomePage from './Components/StudentHomePage';
import ProfileScreen from './Components/ProfileScreen';
import { AppRegistry } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import CommunityScreen from './Components/CommunitiesPage';
import LogHoursScreen from './Components/LogHoursScreen';
import OpportunityScreen from './Components/OpportunitiesPage';
import { DefaultTheme } from 'react-native-paper';
import CommunityProgressScreen from './Components/CommunityProgressScreen';
import TeacherHomePage from './Components/Teachers/TeacherHomePage';
const Stack = createNativeStackNavigator();
import ManageCommunities from './Components/Teachers/ManageCommunities';
import CreateOpportunities from './Components/Teachers/CreateOpportunities';
import { ScreenStackHeaderLeftView } from 'react-native-screens';
import TeacherManagePage from './Components/Teachers/TeacherManagePage';
import VerifyHoursPage from './Components/Teachers/VerifyHoursPage';
import ManageOpportunitiesScreen from './Components/Teachers/ManageOpportunitiesPage';
import ViewLoggedHoursScreen from './Components/ViewLoggedHoursScreen';
import StudentMap from './Components/StudentMap';
import StudentProfileScreen from './Components/Teachers/StudentProfileScreen';
import StudentOpportunitiesCalendar from './Components/StudentOpportunitiesCalendar';
import ProfileSetup from './Components/ProfileSetup';
import MobileStudentHomePage from './Components/MobileStudentHomePage';

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
        <Stack.Screen options={{ headerShown: false }} name="ProfileSetup" component={ProfileSetup} />
        <Stack.Screen options={{ headerShown: false }} name="EmailSignUp" component={EmailSignUpScreen} />
        <Stack.Screen options={{ headerShown: false }} name="EmailSignIn" component={EmailSignInScreen} />
        <Stack.Screen options={{ headerShown: false }} name="StudentHomePage" component={StudentHomePage} />
        <Stack.Screen options={{ headerShown: false }} name="ProfileScreen" component={ProfileScreen} />
        <Stack.Screen options={{ headerShown: false }} name="Communities" component={CommunityScreen} />
        <Stack.Screen options={{ headerShown: false }} name="LogHours" component={LogHoursScreen} />
        <Stack.Screen options={{ headerShown: false }} name="TeacherHomePage" component={TeacherHomePage} />
        <Stack.Screen options={{ headerShown: false }} name="Opportunities" component={OpportunityScreen} />
        <Stack.Screen options={{ headerShown: false }} name="Progress" component={CommunityProgressScreen} />
        <Stack.Screen options={{ headerShown: false }} name="ManageCommunities" component={ManageCommunities} />
        <Stack.Screen options={{ headerShown: false }} name="CreateOpportunities" component={CreateOpportunities} />
        <Stack.Screen options={{ headerShown: false }} name="TeacherManagePage" component={TeacherManagePage} />
        <Stack.Screen options={{ headerShown: false }} name="VerifyHours" component={VerifyHoursPage} />
        <Stack.Screen options={{ headerShown: false }} name="ManageOpportunities" component={ManageOpportunitiesScreen} />
        <Stack.Screen options={{ headerShown: false }} name="ViewLoggedHours" component={ViewLoggedHoursScreen} />
        <Stack.Screen options={{ headerShown: false }} name="StudentProfileScreen" component={StudentProfileScreen} />
        <Stack.Screen options={{ headerShown: false }} name="StudentMap" component={StudentMap} />
        <Stack.Screen options={{ headerShown: false }} name="StudentOpportunitiesCalendar" component={StudentOpportunitiesCalendar} />
        <Stack.Screen options={{ headerShown: false }} name="MobileStudent" component={MobileStudentHomePage} />

      </Stack.Navigator>
    </NavigationContainer>
    </PaperProvider>
  );
};

export default App;


