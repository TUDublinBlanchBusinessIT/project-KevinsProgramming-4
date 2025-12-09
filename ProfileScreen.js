import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ProfileScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>👨‍👩‍👧‍👦 Family Pantry</Text>
      
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Shared Kitchen Tablet</Text>
        <Text style={styles.cardText}>
          This app lives on our kitchen tablet. Everyone in the family can add and remove items.
        </Text>
      </View>
      
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Family Members</Text>
        <Text style={styles.member}>👩 Mom - Shopper</Text>
        <Text style={styles.member}>👨 Dad - Chef</Text>
        <Text style={styles.member}>👧 Paula - Helper</Text>
        <Text style={styles.member}>👦 Henry - Snacks</Text>
      </View>
      
      <Text style={styles.tip}>
        💡 Tip: Scan groceries when you unpack them!
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#2E7D32',
  },
  card: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  cardText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
  member: {
    fontSize: 16,
    marginVertical: 5,
    color: '#444',
  },
  tip: {
    fontSize: 16,
    color: '#FF9800',
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 10,
  },
});

export default ProfileScreen;