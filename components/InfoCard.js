import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const InfoCard = ({ title, value, color = '#2196F3', icon = '📊' }) => {
  return (
    <View style={[styles.card, { borderLeftColor: color }]}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 10,
    borderLeftWidth: 5,
    width: '48%',
    alignItems: 'center',
    elevation: 2,
  },
  icon: {
    fontSize: 24,
    marginBottom: 8,
  },
  value: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  title: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default InfoCard;