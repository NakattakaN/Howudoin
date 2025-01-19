import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, TextInput, Button } from 'react-native';
import { useAuth } from "../AuthContext";
import { useRoute } from '@react-navigation/native';
import { Platform } from 'react-native';
const baseURL = Platform.OS === 'ios' ? 'http://localhost:8080' : 'http://10.0.2.2:8080';


interface User {
  username: string;
}

interface Message {
  message: string;
  messageid: string;
  sender: User;
  status: string;
}

const GroupChatPage = () => {
  const route = useRoute();
  const { groupid2 } = route.params as { groupid2: string }; 
  console.log("GROUPID INSIDE GROUP CHAT",groupid2);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const { token, username: loggedInUsername } = useAuth(); 

  // Fetch messages for the group
  const fetchGroupMessages = async () => {
    try {
      const response = await fetch(`${baseURL}/groups/${groupid2}/messages`, {
        method: 'GET',
        headers: {
          sendertoken: token, // Include the JWT token
        },
      });

      if (response.ok) {
        const groupMessages: Message[] = await response.json();
        console.log('Fetched group messages:', groupMessages);
        setMessages(groupMessages);
      } else {
        const errorText = await response.text();
        console.error('Failed to fetch group messages:', errorText);
        Alert.alert('Error', 'Could not fetch group messages.');
      }
    } catch (error) {
      console.error('Error fetching group messages:', error);
      Alert.alert('Error', 'Could not connect to the server.');
    }
  };

  // Send a message to the group
  const sendGroupMessage = async () => {
    if (!newMessage.trim()) {
      Alert.alert("Error", "Message cannot be empty.");
      return;
    }
  
    try {
      const response = await fetch(`http://10.0.2.2:8080/groups/${groupid2}/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded", 
          sendertoken: token, 
        },
        body: new URLSearchParams({ a: newMessage }).toString(), 
      });
  
      if (response.ok) {
        console.log("Message sent successfully!");
        setNewMessage(''); 
        fetchGroupMessages(); 
      } else {
        const errorText = await response.text();
        console.error("Failed to send group message:", errorText);
        Alert.alert("Error", "Failed to send message.");
      }
    } catch (error) {
      console.error("Error sending group message:", error);
      Alert.alert("Error", "Could not connect to the server.");
    }
  };
  

  useEffect(() => {
    fetchGroupMessages();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item, index) => `${item.messageid}-${index}`}
        renderItem={({ item }) => (
          <View
            style={
              item.sender.username === loggedInUsername
                ? [styles.messageContainer, styles.myMessage]
                : [styles.messageContainer, styles.otherMessage]
            }
          >
            <Text style={styles.senderName}>{item.sender.username}:</Text>
            <Text style={styles.messageText}>{item.message}</Text>
          </View>
        )}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message"
          value={newMessage}
          onChangeText={setNewMessage}
        />
        <Button title="Send" onPress={sendGroupMessage} />
      </View>
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
  messageContainer: {
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    maxWidth: '80%',
  },
  myMessage: {
    backgroundColor: '#d1e7dd',
    alignSelf: 'flex-end',
  },
  otherMessage: {
    backgroundColor: '#f8d7da',
    alignSelf: 'flex-start',
  },
  senderName: {
    fontWeight: 'bold',
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
});

export default GroupChatPage;
