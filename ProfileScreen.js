import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Switch, Alert } from 'react-native';
import CustomButton from './components/CustomButton';

export default function ProfileScreen() {
  const [user, setUser] = useState({
    name: 'Kevin',
    email: 'kevin@example.com',
    notifications: true
  });
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    if (!user.name || !user.email) {
      Alert.alert('Error', 'Fill all fields');
      return;
    }
    console.log('Saving:', user);
    setIsEditing(false);
    Alert.alert('Saved!', 'Profile updated');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.subtitle}>Manage your settings</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={user.name}
          onChangeText={(text) => setUser({...user, name: text})}
          editable={isEditing}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={user.email}
          onChangeText={(text) => setUser({...user, email: text})}
          editable={isEditing}
          keyboardType="email-address"
        />

        <View style={styles.switchRow}>
          <Text style={styles.label}>Notifications</Text>
          <Switch
            value={user.notifications}
            onValueChange={(value) => setUser({...user, notifications: value})}
            disabled={!isEditing}
          />
        </View>

        {isEditing ? (
          <View>
            <CustomButton title="Save" onPress={handleSave} color="#10B981" />
            <CustomButton title="Cancel" onPress={() => setIsEditing(false)} color="#EF4444" />
          </View>
        ) : (
          <CustomButton title="Edit Profile" onPress={() => setIsEditing(true)} />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#6366F1',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.8)',
    marginTop: 5,
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
});