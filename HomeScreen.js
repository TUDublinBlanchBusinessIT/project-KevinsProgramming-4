import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to MA CA2 App!</Text>
      <Text style={styles.description}>
        This is a React Native mobile app with Firebase integration.
      </Text>
      
      <View style={styles.buttonContainer}>
        <Button
          title="Go to Data Screen"
          onPress={() => navigation.navigate('Data')}
          color="#6366F1"
        />
      </View>
      
      <View style={styles.buttonContainer}>
        <Button
          title="View Profile"
          onPress={() => navigation.navigate('Profile')}
          color="#8B5CF6"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F9FAFB',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    color: '#666',
    lineHeight: 22,
  },
  buttonContainer: {
    marginVertical: 10,
    width: '80%',
  },
});

export default HomeScreen;