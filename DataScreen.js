import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, Button, FlatList, StyleSheet, 
  ScrollView, RefreshControl 
} from 'react-native';
import { db } from './Services/FirebaseConfig';
import { collection, addDoc, deleteDoc, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import DataCard from './components/DataCard';

const DataScreen = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [newFood, setNewFood] = useState({ name: '', expiry: '' });
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ name: '', expiry: '' });
  const [refreshing, setRefreshing] = useState(false);
  const [firebaseConnected, setFirebaseConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'pantryItems'),
      (snapshot) => {
        const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setFoodItems(items);
        setFirebaseConnected(true);
      },
      (error) => {
        console.error("Firebase error:", error);
        setFirebaseConnected(false);
      }
    );
    return unsubscribe;
  }, []);

  const getExpiryInfo = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { color: '#ff4444', label: 'EXPIRED' };
    if (diffDays <= 3) return { color: '#ff9800', label: diffDays === 0 ? 'TODAY' : `IN ${diffDays} DAYS` };
    return { color: '#4CAF50', label: 'FRESH' };
  };

  const getUrgentItems = () => {
    return foodItems.filter(item => {
      const expiry = new Date(item.expiryDate);
      const today = new Date();
      const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= 3;
    });
  };

  const getFilteredItems = () => {
    if (!search.trim()) return foodItems;
    return foodItems.filter(item => 
      item.name.toLowerCase().includes(search.toLowerCase())
    );
  };

  const handleAdd = async () => {
    if (!newFood.name.trim() || !newFood.expiry.trim()) {
      alert('Please enter food name and expiry date');
      return;
    }
    
    try {
      await addDoc(collection(db, 'pantryItems'), {
        name: newFood.name,
        expiryDate: newFood.expiry,
        addedDate: new Date().toISOString()
      });
      setNewFood({ name: '', expiry: '' });
    } catch (error) {
      alert('Error adding item: ' + error.message);
      setFirebaseConnected(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'pantryItems', id));
    } catch (error) {
      alert('Error deleting: ' + error.message);
      setFirebaseConnected(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!editData.name.trim() || !editData.expiry.trim()) {
      alert('Please enter valid values');
      return;
    }
    
    try {
      await updateDoc(doc(db, 'pantryItems', editingId), {
        name: editData.name,
        expiryDate: editData.expiry
      });
      setEditingId(null);
    } catch (error) {
      alert('Error updating: ' + error.message);
      setFirebaseConnected(false);
    }
  };

  const renderUrgentSection = () => {
    const urgentItems = getUrgentItems();
    if (urgentItems.length === 0) return null;

    return (
      <View style={styles.urgentSection}>
        <Text style={styles.urgentTitle}>⚠️ Use Up First ({urgentItems.length})</Text>
        {urgentItems.slice(0, 3).map(item => {
          const expiry = getExpiryInfo(item.expiryDate);
          return (
            <View key={item.id} style={styles.urgentCard}>
              <Text style={styles.urgentName}>{item.name}</Text>
              <Text style={styles.urgentDate}>Expires: {item.expiryDate}</Text>
              <View style={[styles.statusBadge, { backgroundColor: expiry.color }]}>
                <Text style={styles.statusText}>{expiry.label}</Text>
              </View>
            </View>
          );
        })}
      </View>
    );
  };

  const renderItem = ({ item }) => {
    if (editingId === item.id) {
      return (
        <View style={styles.editCard}>
          <TextInput
            value={editData.name}
            onChangeText={(text) => setEditData({...editData, name: text})}
            style={styles.input}
            placeholder="Food name"
          />
          <TextInput
            value={editData.expiry}
            onChangeText={(text) => setEditData({...editData, expiry: text})}
            style={styles.input}
            placeholder="YYYY-MM-DD"
          />
          <View style={styles.editButtons}>
            <Button title="Save" onPress={handleSaveEdit} color="#4CAF50" />
            <Button title="Cancel" onPress={() => setEditingId(null)} color="#666" />
          </View>
        </View>
      );
    }

    const expiry = getExpiryInfo(item.expiryDate);
    return (
      <DataCard
        title={item.name}
        subtitle={`Expires: ${item.expiryDate}`}
        status={expiry.label}
        statusColor={expiry.color}
        onDelete={() => handleDelete(item.id)}
        onEdit={() => {
          setEditingId(item.id);
          setEditData({ name: item.name, expiry: item.expiryDate });
        }}
      />
    );
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => setRefreshing(false)}
          colors={['#4CAF50']}
        />
      }
    >
      <Text style={styles.header}>Family Pantry</Text>
      
      <TextInput
        placeholder="🔍 Search items..."
        value={search}
        onChangeText={setSearch}
        style={styles.search}
      />

      <View style={styles.addSection}>
        <TextInput
          placeholder="Food name"
          value={newFood.name}
          onChangeText={(text) => setNewFood({...newFood, name: text})}
          style={styles.input}
        />
        <TextInput
          placeholder="Expiry (YYYY-MM-DD)"
          value={newFood.expiry}
          onChangeText={(text) => setNewFood({...newFood, expiry: text})}
          style={styles.input}
        />
        <Button title="Add Item" onPress={handleAdd} color="#4CAF50" />
      </View>

      {renderUrgentSection()}

      <Text style={styles.sectionTitle}>
        All Items ({getFilteredItems().length})
      </Text>

      {getFilteredItems().length === 0 ? (
        <Text style={styles.empty}>
          {search ? 'No items found' : 'Your pantry is empty. Add some items!'}
        </Text>
      ) : (
        <FlatList
          data={getFilteredItems()}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          renderItem={renderItem}
        />
      )}

      <View style={styles.firebaseStatus}>
        <View>
          <Text style={styles.firebaseText}>
            Connected to Firebase 🔥
          </Text>
          <Text style={styles.firebaseSubtext}>
            {foodItems.length} items • {getUrgentItems().length} need attention
          </Text>
        </View>
        <Text style={styles.firebaseIcon}>
          {firebaseConnected ? '✅' : '⚠️'}
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f8f9fa' },
  header: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginVertical: 16, color: '#2d3436' },
  search: { backgroundColor: 'white', padding: 12, borderRadius: 8, marginBottom: 12, borderWidth: 1, borderColor: '#ddd' },
  addSection: { backgroundColor: 'white', padding: 16, borderRadius: 10, marginBottom: 16, elevation: 2 },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 10, borderRadius: 6, marginBottom: 10, fontSize: 16 },
  urgentSection: { backgroundColor: '#fff3cd', padding: 14, borderRadius: 10, marginBottom: 16, borderWidth: 1, borderColor: '#ffc107' },
  urgentTitle: { fontSize: 16, fontWeight: 'bold', color: '#856404', marginBottom: 8 },
  urgentCard: { backgroundColor: 'white', padding: 10, marginBottom: 6, borderRadius: 6 },
  urgentName: { fontSize: 15, fontWeight: '600' },
  urgentDate: { fontSize: 13, color: '#666' },
  statusBadge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10, marginTop: 4 },
  statusText: { color: 'white', fontSize: 11, fontWeight: 'bold' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginVertical: 12, color: '#343a40' },
  empty: { textAlign: 'center', color: '#6c757d', fontStyle: 'italic', padding: 20 },
  editCard: { backgroundColor: '#e8f5e9', padding: 12, marginVertical: 4, borderRadius: 8 },
  editButtons: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 8 },
  firebaseStatus: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#e3f2fd',
    padding: 16,
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#2196f3',
  },
  firebaseIcon: {
    fontSize: 24,
  },
  firebaseText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1976d2',
  },
  firebaseSubtext: {
    fontSize: 14,
    color: '#1976d2',
    marginTop: 4,
    opacity: 0.8,
  },
});

export default DataScreen;