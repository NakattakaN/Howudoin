import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from "./AuthContext";
import { Platform } from 'react-native';
const baseURL = Platform.OS === 'ios' ? 'http://localhost:8080' : 'http://10.0.2.2:8080';

const GroupCreation = () => {
  const [groupId, setGroupId] = useState('');
  const [groupName, setGroupName] = useState('');
  const { token, username: loggedInUsername } = useAuth();
  const router = useRouter();

  const createGroup = async () => {
    // Input validation
    if (!groupId.trim() || isNaN(Number(groupId)) || Number(groupId) <= 0) {
      Alert.alert('Invalid Group ID', 'Group ID must be a positive number.');
      return;
    }
    if (!groupName.trim()) {
      Alert.alert('Invalid Group Name', 'Group name cannot be empty.');
      return;
    }

    try {
      const response = await fetch(`${baseURL}/groups/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          sendertoken: token, 
        },
        body: JSON.stringify({
          groupid: Number(groupId),
          groupname: groupName,
        }),
      });

      if (response.ok) {
        Alert.alert('Success', `Group "${groupName}" created successfully!`);
        setGroupId('');
        setGroupName('');
        router.push('/menu'); // navigate back or to a group list page
      } else {
        const errorMessage = await response.text();
        Alert.alert('Error', errorMessage);
      }
    } catch (error) {
      console.error('Error creating group:', error);
      Alert.alert('Error', 'Could not connect to the server.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create a New Group</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter Group ID"
        keyboardType="numeric"
        value={groupId}
        onChangeText={setGroupId}
      />

      <TextInput
        style={styles.input}
        placeholder="Enter Group Name"
        value={groupName}
        onChangeText={setGroupName}
      />

      <Button title="Create Group" onPress={createGroup} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
});

export default GroupCreation;
