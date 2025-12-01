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
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'Home' }}
        />
        <Stack.Screen 
          name="Data" 
          component={DataScreen} 
          options={{ title: 'Data Management' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}