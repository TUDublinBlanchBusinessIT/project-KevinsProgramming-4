import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './HomeScreen';          
import DataScreen from './DataScreen';          
import ProfileScreen from './ProfileScreen';   
import Header from './header';                  

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Header />
      <Stack.Navigator 
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#6366F1',
            elevation: 0,
            shadowOpacity: 0,
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: '600',
            fontSize: 18,
          },
          headerBackTitleVisible: false,
          cardStyle: {
            backgroundColor: '#F9FAFB',
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
        <Stack.Screen 
          name="Profile" 
          component={ProfileScreen} 
          options={{ 
            title: 'Profile',
            headerStyle: {
              backgroundColor: '#6366F1',
            }
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}