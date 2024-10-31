import React from 'react';
import Homepage from './Components/Homepage';
import AuthScreen from './Components/AuthScreen';

const App = () => {
  return (
    <View style={{ flex: 1 }}> {/* This ensures the components take up the full screen */}
      <Homepage />
      <AuthScreen />
    </View>
  );
};

export default App;
