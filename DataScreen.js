import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  Button, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView 
} from 'react-native';
import { FirebaseService } from './Services/firebaseConfig';

const DataScreen = ({ navigation }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('Connecting to Firebase...');

  // Initialize Firebase when screen loads
  useEffect(() => {
    initializeFirebase();
  }, []);

  const initializeFirebase = async () => {
    try {
      setStatus('Initializing Firebase...');
      await FirebaseService.initialize();
      setStatus('✅ Firebase connected! Loading data...');
      
      // Load existing data
      await loadData();
      
    } catch (error) {
      setStatus(`❌ Error: ${error.message}`);
      Alert.alert('Firebase Error', error.message);
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const fetchedItems = await FirebaseService.getData("maCA2Data");
      setItems(fetchedItems);
      setStatus(`✅ Loaded ${fetchedItems.length} items`);
    } catch (error) {
      Alert.alert('Load Error', error.message);
      setStatus('❌ Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const addSampleData = async () => {
    try {
      const sampleItems = [
        {
          name: 'Pizza Margherita',
          price: 12.99,
          category: 'Italian',
          description: 'Classic pizza with tomato and mozzarella',
          inStock: true
        },
        {
          name: 'Burger',
          price: 9.99,
          category: 'American',
          description: 'Beef burger with cheese and lettuce',
          inStock: true
        },
        {
          name: 'Sushi Platter',
          price: 18.50,
          category: 'Japanese',
          description: 'Assorted sushi selection',
          inStock: false
        }
      ];

      for (const item of sampleItems) {
        await FirebaseService.saveData("maCA2Data", {
          ...item,
          timestamp: new Date().toLocaleString(),
          addedBy: 'Demo User'
        });
      }
      
      await loadData();
      Alert.alert('Success', 'Sample data added to Firebase!');
      
    } catch (error) {
      Alert.alert('Save Error', error.message);
    }
  };

  const addCustomItem = async () => {
    Alert.prompt(
      'Add New Item',
      'Enter item name:',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Add', 
          onPress: async (name) => {
            if (name) {
              const newItem = {
                name: name,
                price: (Math.random() * 20 + 5).toFixed(2),
                category: ['Italian', 'Mexican', 'Chinese', 'Indian', 'American'][Math.floor(Math.random() * 5)],
                description: 'Custom added item',
                inStock: true,
                timestamp: new Date().toLocaleString(),
                addedBy: 'Demo User'
              };
              
              try {
                await FirebaseService.saveData("maCA2Data", newItem);
                await loadData();
                Alert.alert('Success', `Added "${name}" to Firebase!`);
              } catch (error) {
                Alert.alert('Error', error.message);
              }
            }
          }
        }
      ]
    );
  };

  const deleteAllItems = async () => {
    Alert.alert(
      'Delete All Items',
      'Are you sure? This will remove all data from Firebase.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete All', 
          style: 'destructive',
          onPress: async () => {
            try {
              // Note: In production, you'd batch delete. For demo, we'll just clear UI.
              setItems([]);
              setStatus('All items cleared from display');
              Alert.alert('Cleared', 'Display cleared (demo mode)');
            } catch (error) {
              Alert.alert('Error', error.message);
            }
          }
        }
      ]
    );
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.itemCard, { borderLeftColor: item.inStock ? '#10B981' : '#EF4444' }]}
      onPress={() => Alert.alert(
        'Item Details',
        `Name: ${item.name}\nPrice: €${item.price}\nCategory: ${item.category}\nStatus: ${item.inStock ? 'In Stock' : 'Out of Stock'}\nAdded: ${item.timestamp}\nBy: ${item.addedBy || 'Unknown'}`
      )}
    >
      <View style={styles.itemHeader}>
        <Text style={styles.itemName}>{item.name}</Text>
        <View style={styles.priceContainer}>
          <Text style={styles.itemPrice}>€{item.price}</Text>
          <View style={[styles.stockBadge, { backgroundColor: item.inStock ? '#D1FAE5' : '#FEE2E2' }]}>
            <Text style={[styles.stockText, { color: item.inStock ? '#065F46' : '#991B1B' }]}>
              {item.inStock ? 'IN STOCK' : 'OUT OF STOCK'}
            </Text>
          </View>
        </View>
      </View>
      <Text style={styles.itemCategory}>{item.category}</Text>
      <Text style={styles.itemTimestamp}>{item.timestamp}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📊 Firebase Data Demo</Text>
        <Text style={styles.subtitle}>{status}</Text>
      </View>

      <View style={styles.statsCard}>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>{items.length}</Text>
          <Text style={styles.statLabel}>Total Items</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>
            {items.filter(item => item.inStock).length}
          </Text>
          <Text style={styles.statLabel}>In Stock</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>
            €{items.reduce((sum, item) => sum + parseFloat(item.price || 0), 0).toFixed(2)}
          </Text>
          <Text style={styles.statLabel}>Total Value</Text>
        </View>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity style={styles.controlButton} onPress={addCustomItem}>
          <Text style={styles.controlButtonText}>➕ Add Item</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.controlButton, { backgroundColor: '#8B5CF6' }]} onPress={addSampleData}>
          <Text style={styles.controlButtonText}>📥 Add Sample Data</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.controlButton, { backgroundColor: '#F59E0B' }]} onPress={loadData}>
          <Text style={styles.controlButtonText}>🔄 Refresh</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.controlButton, { backgroundColor: '#EF4444' }]} onPress={deleteAllItems}>
          <Text style={styles.controlButtonText}>🗑️ Clear All</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6366F1" />
          <Text style={styles.loadingText}>Loading from Firebase...</Text>
        </View>
      ) : (
        <>
          <Text style={styles.sectionTitle}>
            Data from Firebase ({items.length} items)
          </Text>
          
          {items.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No data yet</Text>
              <Text style={styles.emptyText}>Tap "Add Sample Data" to populate Firebase</Text>
              <Text style={styles.emptyHint}>💡 Check Firebase Console to see data in real-time</Text>
            </View>
          ) : (
            <FlatList
              data={items}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              contentContainerStyle={styles.list}
            />
          )}
        </>
      )}

      <View style={styles.demoInstructions}>
        <Text style={styles.instructionsTitle}>🎯 Demo Instructions:</Text>
        <Text style={styles.instruction}>1. Tap "Add Sample Data" to populate Firebase</Text>
        <Text style={styles.instruction}>2. Open Firebase Console to see data appear</Text>
        <Text style={styles.instruction}>3. Add custom items with "Add Item"</Text>
        <Text style={styles.instruction}>4. Show real-time sync between app and console</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#6366F1',
    padding: 24,
    paddingTop: 40,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#E0E7FF',
    marginBottom: 12,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: -20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  controls: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    marginTop: 20,
    gap: 10,
  },
  controlButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
  },
  controlButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#6B7280',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginHorizontal: 20,
    marginTop: 30,
    marginBottom: 16,
  },
  emptyState: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    padding: 40,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6B7280',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 12,
  },
  emptyHint: {
    fontSize: 14,
    color: '#6366F1',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  itemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  itemName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
    marginRight: 10,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  itemPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#10B981',
    marginBottom: 6,
  },
  stockBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  stockText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  itemCategory: {
    fontSize: 14,
    color: '#6366F1',
    fontWeight: '500',
    marginBottom: 4,
  },
  itemTimestamp: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  demoInstructions: {
    backgroundColor: '#FEF3C7',
    marginHorizontal: 20,
    marginBottom: 30,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#92400E',
    marginBottom: 8,
  },
  instruction: {
    fontSize: 14,
    color: '#92400E',
    marginBottom: 4,
    paddingLeft: 8,
  },
});

export default DataScreen;