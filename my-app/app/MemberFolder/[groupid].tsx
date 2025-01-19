import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { useAuth } from "../AuthContext";
import { useRoute } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { Platform } from 'react-native';
const baseURL = Platform.OS === 'ios' ? 'http://localhost:8080' : 'http://10.0.2.2:8080';

const AddMember = () => {
  const [username, setUsername] = useState('');
  const { token } = useAuth(); 
  const route = useRoute();
  const router = useRouter();
  const { groupid } = route.params as { groupid: string };
  const UsernameData = new URLSearchParams();
  UsernameData.append('username', username);
  

  const addMemberToGroup = async () => {
    try {
      const response = await fetch(`${baseURL}/groups/${groupid}/add-member`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          sendertoken: token,
        },
        body: UsernameData.toString()
      });

      if (response.ok) {
        Alert.alert('Success', `Member added to group`);
        setUsername('');
        router.push('/group-list'); 
      } else {
        const errorMessage = await response.text();
        Alert.alert('Error', errorMessage);
      }
    } catch (error) {
      console.error('Error adding member to group:', error);
      Alert.alert('Error', 'Could not connect to the server.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Member to Group</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter user to add"
        value={username}
        onChangeText={setUsername}
      />

      <Button title="Add Member" onPress={addMemberToGroup} />
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

export default AddMember;
