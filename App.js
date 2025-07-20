import React from 'react';
import { StatusBar, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { FeedbackProvider } from './src/context/FeedbackContext';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import TestUserDashboard from './src/screens/TestUserDashboard';
import TestAdminDashboard from './src/screens/TestAdminDashboard';
import ResultsScreen from './src/screens/ResultsScreen';

const Stack = createStackNavigator();

// Fallback component jika ada error
const FallbackComponent = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Loading Component...</Text>
  </View>
);

export default function App() {
  try {
    return (
      <FeedbackProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
              headerStyle: {
                backgroundColor: '#2196F3',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
          >
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="UserDashboard"
              component={TestUserDashboard}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="AdminDashboard"
              component={TestAdminDashboard}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="TestAdminDashboard"
              component={TestAdminDashboard}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Results"
              component={ResultsScreen}
              options={{ title: 'Live Results' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </FeedbackProvider>
    );
  } catch (error) {
    console.error('App Error:', error);
    return FallbackComponent();
  }
}
