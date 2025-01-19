interface FriendRequest {
  sending_user: {
    username: string;
  };
  message: string;
}

import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert } from 'react-native';
import { useAuth } from './AuthContext';
import { Platform } from 'react-native';
const baseURL = Platform.OS === 'ios' ? 'http://localhost:8080' : 'http://10.0.2.2:8080';

export default function FriendManagement() {
  const { token } = useAuth(); 
  const [reciver, setReciver] = useState('');
  const [message, setMessage] = useState('');
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]); 
  const [friendsList, setFriendsList] = useState<string[]>([]); 

  
  const sendFriendRequest = async () => {
    if(message==='' || reciver==='')
      {
        Alert.alert('Error', 'Please fill out the request.');
        return;
      }
    try {
      const response = await fetch(
        `${baseURL}/friend/send?reciver=${reciver}&message=${encodeURIComponent(message)}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            sendertoken: token,
          },
        }
      );

      const success = await response.json();
      if (success) {
        Alert.alert('Success', 'Friend request sent successfully!');
        setReciver('');
        setMessage('');
      } else {
        Alert.alert('Error', 'Failed to send friend request.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred while sending the request.');
    }
  };

  // Accept Friend Request
  const acceptFriendRequest = async (request: FriendRequest) => { 
    try {
      const response = await fetch(`${baseURL}/friend/accept`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          sendertoken: token,
        },
      });

      const success = await response.json();
      if (success) {
        Alert.alert('Success', 'Friend request accepted!');
        setFriendRequests((prev) =>
          prev.filter((req) => req.sending_user.username !== request.sending_user.username)
        );
      } else {
        Alert.alert('Error', 'Failed to accept the friend request.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred while accepting the request.');
    }
  };


  const getFriendRequests = async () => {
    try {
      const response = await fetch(`${baseURL}/friendreqlist`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          sendertoken: token,
        },
      });

      const requests: FriendRequest[] = await response.json();
      setFriendRequests(requests);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred while fetching the friend requests.');
    }
  };

  // Fetch Friend List
  const getFriendList = async () => {
    try {
      const response = await fetch(`${baseURL}/friend`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          sendertoken: token,
        },
      });

      const friends: string[] = await response.json(); 
      setFriendsList(friends);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred while fetching the friends list.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Friend Management</Text>

        {/* Friend Request Section */}
        <TextInput
          style={styles.input}
          placeholder="Enter receiver's username"
          value={reciver}
          onChangeText={setReciver}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter a message"
          value={message}
          onChangeText={setMessage}
        />
        <View style={styles.buttonstil}>
        <Button title="Send Friend Request" onPress={sendFriendRequest} />
        </View>
        <View style={styles.buttonstil}>
        <Button title="View Friend Requests" onPress={getFriendRequests} />
        </View>
        {friendRequests.length > 0 && (
          <View>
            <Text style={styles.listTitle}>Friend Requests:</Text>
            {friendRequests.map((req, index) => (
              <View key={index}>
                <Text>
                  {req.sending_user.username}: {req.message}
                </Text>
                <View style={styles.buttonstil}>
                <Button title="Accept" onPress={() => acceptFriendRequest(req)} />
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  buttonstil:{
    fontSize : 31,
    marginBottom : 10,
    backgroundColor : "#FF00FF"
  },
  buttonstil2:{
    backgroundColor : "#A0522D",
    fontSize: 5,
  },
  formContainer: {
    marginVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  friendList: {
    marginTop: 20,
  },
  friendItem: {
    fontSize: 16,
    padding: 10,
    color: '#333',
    marginBottom: 5,
  },
});
