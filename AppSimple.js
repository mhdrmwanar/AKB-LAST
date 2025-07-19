import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { FeedbackProvider } from './src/context/FeedbackContext';

// Screens
import QuickFeedbackScreen from './src/screens/QuickFeedbackScreen';
import FeedbackResultsScreen from './src/screens/FeedbackResultsScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName="QuickFeedback"
      >
        <Stack.Screen
          name="QuickFeedback"
          component={QuickFeedbackScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="FeedbackResults"
          component={FeedbackResultsScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const App = () => {
  return (
    <FeedbackProvider>
      <StatusBar style="light" backgroundColor="#2196F3" />
      <AppNavigator />
    </FeedbackProvider>
  );
};

export default App;
