import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button } from 'react-native';

const DataScreen = () => {
  const [inputText, setInputText] = useState('');
  const [savedData, setSavedData] = useState('');

  const handleSave = () => {
    // TODO: Connect to Firebase tomorrow
    setSavedData(inputText);
    setInputText('');
    alert('Data saved! (Firebase integration tomorrow)');
  };

  const handleRetrieve = () => {
    // TODO: Retrieve from Firebase tomorrow
    alert('Retrieving data from Firebase... (Tomorrow)');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Data Management</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Enter data to save"
        value={inputText}
        onChangeText={setInputText}
      />
      
      <View style={styles.buttonContainer}>
        <Button title="Save to Firebase" onPress={handleSave} />
        <Button title="Retrieve from Firebase" onPress={handleRetrieve} />
      </View>
      
      {savedData ? (
        <Text style={styles.savedText}>Last saved: {savedData}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  savedText: {
    marginTop: 20,
    fontSize: 16,
    color: 'green',
  },
});

export default DataScreen;