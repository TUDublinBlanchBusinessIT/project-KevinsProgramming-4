import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';

const Header = () => {
  return (
    <>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor="#6366F1" 
      />
      <View style={styles.header}>
        <Text style={styles.logo}>📱 MA CA2</Text>
        <Text style={styles.subtitle}>Mobile Application</Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#6366F1', // Primary color
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#4F46E5', // Primary dark
  },
  logo: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#E0E7FF', // Light version of primary
  },
});

export default Header;