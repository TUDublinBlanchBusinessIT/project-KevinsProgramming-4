import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { db } from './Services/FirebaseConfig';
import { collection, onSnapshot } from 'firebase/firestore';
import InfoCard from './components/InfoCard';

const HomeScreen = ({ navigation }) => {
  const [stats, setStats] = useState({ 
    total: 0, 
    expiring: 0, 
    expired: 0,
    moneySaved: 0,
    wasteReduced: 0
  });
  const [recentItems, setRecentItems] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'pantryItems'), (snapshot) => {
      const today = new Date();
      let expiring = 0;
      let expired = 0;
      const items = [];
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        const expiry = new Date(data.expiryDate);
        const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
        
        items.push({ ...data, id: doc.id });
        
        if (diffDays < 0) expired++;
        if (diffDays >= 0 && diffDays <= 3) expiring++;
      });
      
      // Calculate money saved (estimate: $2 per item saved from waste)
      const moneySaved = (snapshot.size * 2).toFixed(2);
      // Calculate waste reduced in kg (estimate: 0.5kg per item)
      const wasteReduced = (snapshot.size * 0.5).toFixed(1);
      
      setStats({
        total: snapshot.size,
        expiring: expiring,
        expired: expired,
        moneySaved: moneySaved,
        wasteReduced: wasteReduced
      });
      
      
      setRecentItems(items
        .sort((a, b) => new Date(b.addedDate) - new Date(a.addedDate))
        .slice(0, 3)
      );
    });
    
    return () => unsubscribe();
  }, []);

  // Calculation of items that are fresh
  const getFreshPercentage = () => {
    if (stats.total === 0) return 100;
    const fresh = stats.total - stats.expired;
    return Math.round((fresh / stats.total) * 100);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🏠 Family Pantry Dashboard</Text>
      
      {/* QUICK STATS ROW */}
      <View style={styles.statsRow}>
        <InfoCard 
          title="Total Items"
          value={stats.total.toString()}
          color="#2196F3"
          icon="📦"
        />
        
        <InfoCard 
          title="Expiring Soon"
          value={stats.expiring.toString()}
          color="#FF9800"
          icon="⏰"
        />
      </View>
      
      {/* ENVIRONMENTAL IMPACT */}
      <View style={styles.impactSection}>
        <Text style={styles.sectionTitle}>🌱 Your Impact</Text>
        
        <View style={styles.impactCard}>
          <Text style={styles.impactIcon}>💰</Text>
          <View style={styles.impactText}>
            <Text style={styles.impactTitle}>Money Saved</Text>
            <Text style={styles.impactValue}>${stats.moneySaved}</Text>
            <Text style={styles.impactSub}>from preventing waste</Text>
          </View>
        </View>
        
        <View style={styles.impactCard}>
          <Text style={styles.impactIcon}>🌍</Text>
          <View style={styles.impactText}>
            <Text style={styles.impactTitle}>Waste Reduced</Text>
            <Text style={styles.impactValue}>{stats.wasteReduced} kg</Text>
            <Text style={styles.impactSub}>food kept from landfills</Text>
          </View>
        </View>
      </View>
      
      {/* QUICK ACTIONS */}
      <View style={styles.actionsSection}>
        <Text style={styles.sectionTitle}>⚡ Quick Actions</Text>
        
        <View style={styles.actionsRow}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('Data')}
          >
            <Text style={styles.actionIcon}>➕</Text>
            <Text style={styles.actionText}>Add Food</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('Data')}
          >
            <Text style={styles.actionIcon}>📋</Text>
            <Text style={styles.actionText}>View All</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => alert('Shopping list coming soon!')}
          >
            <Text style={styles.actionIcon}>🛒</Text>
            <Text style={styles.actionText}>Shopping</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* RECENTLY ADDED */}
      {recentItems.length > 0 && (
        <View style={styles.recentSection}>
          <Text style={styles.sectionTitle}>🕐 Recently Added</Text>
          {recentItems.map(item => (
            <View key={item.id} style={styles.recentItem}>
              <Text style={styles.recentName}>{item.name}</Text>
              <Text style={styles.recentDate}>
                Added: {item.addedDate ? new Date(item.addedDate).toLocaleDateString() : 'Recently'}
              </Text>
            </View>
          ))}
        </View>
      )}
      
      {/* FIREBASE STATUS */}
      <View style={styles.firebaseStatus}>
        <Text style={styles.firebaseText}>✅ All data saved to Firebase 🔥</Text>
        <Text style={styles.firebaseSubtext}>Close and reopen - your data will still be here!</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#2d3436',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#343a40',
  },
  impactSection: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
  },
  impactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 14,
    borderRadius: 8,
    marginBottom: 10,
  },
  impactIcon: {
    fontSize: 32,
    marginRight: 15,
  },
  impactText: {
    flex: 1,
  },
  impactTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  impactValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2d3436',
  },
  impactSub: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  actionsSection: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#e8f5e9',
    borderRadius: 10,
    width: '30%',
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2e7d32',
  },
  recentSection: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
  },
  recentItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  recentName: {
    fontSize: 15,
    fontWeight: '600',
  },
  recentDate: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  firebaseStatus: {
    backgroundColor: '#e3f2fd',
    padding: 14,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#2196f3',
  },
  firebaseText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1976d2',
    textAlign: 'center',
  },
  firebaseSubtext: {
    fontSize: 13,
    color: '#1976d2',
    marginTop: 4,
    opacity: 0.8,
    textAlign: 'center',
  },
});

export default HomeScreen;