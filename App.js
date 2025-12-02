import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './components/HomeScreen';
import DataScreen from './components/DataScreen';
import Header from './components/Header';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Header />
      <Stack.Navigator 
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#6366F1', // Primary color
            elevation: 0, // Remove shadow on Android
            shadowOpacity: 0, // Remove shadow on iOS
          },
          headerTintColor: '#FFFFFF', // White text for header
          headerTitleStyle: {
            fontWeight: '600',
            fontSize: 18,
          },
          headerBackTitleVisible: false,
          cardStyle: {
            backgroundColor: '#F9FAFB', // Background color
          }
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ 
            title: 'Home',
            headerStyle: {
              backgroundColor: '#6366F1',
            }
          }}
        />
        <Stack.Screen 
          name="Data" 
          component={DataScreen} 
          options={{ 
            title: 'Data Management',
            headerStyle: {
              backgroundColor: '#6366F1',
            }
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}