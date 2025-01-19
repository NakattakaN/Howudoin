import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, TextInput, Button } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useAuth } from "../AuthContext";
import { Platform } from 'react-native';
const baseURL = Platform.OS === 'ios' ? 'http://localhost:8080' : 'http://10.0.2.2:8080';



interface User {
  username: string;
}

interface Message {
  message: string;
  messageid: string;
  receiver: User;
  sender: User;
  status: string;
}

const ChatPage = () => {
  const route = useRoute();
  const { username: friendUsername } = route.params as { username: string }; 
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const { token, username: loggedInUsername } = useAuth(); 
 
  const fetchMessages = async () => {
    try {
      const response = await fetch(`${baseURL}/message`, {
        method: 'GET',
        headers: {
          sendertoken: token, 
        },
      });

      if (response.ok) {
        const chatMessages: Message[] = await response.json();

        
        const filteredMessages = chatMessages.filter(
          (msg) =>
            (msg.sender.username === loggedInUsername && msg.receiver.username === friendUsername) ||
            (msg.sender.username === friendUsername && msg.receiver.username === loggedInUsername)
        );

        console.log('Filtered messages:', filteredMessages);
        setMessages(filteredMessages);
      } else {
        const errorText = await response.text();
        console.error('Failed to fetch messages:', errorText);
        Alert.alert('Error', 'Could not fetch messages.');
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      Alert.alert('Error', 'Could not connect to the server.');
    }
  };

 
  const sendMessage = async () => {
    if (!newMessage.trim()) {
      Alert.alert("Error", "Message cannot be empty.");
      return;
    }

    const formData = new URLSearchParams();
    formData.append("reciver", friendUsername); 
    formData.append("message", newMessage);

    try {
      const response = await fetch(`${baseURL}/message/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          sendertoken: token, 
        },
        body: formData.toString(), 
      });

      if (response.ok) {
        setNewMessage(""); 
        fetchMessages(); 
      } else {
        const errorText = await response.text();
        console.error("Failed to send message:", errorText);
        Alert.alert("Error", "Failed to send message.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      Alert.alert("Error", "Could not connect to the server.");
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chat with {friendUsername}</Text>
      <FlatList
        data={messages}
        keyExtractor={(item, index) => `${item.messageid}-${index}`}
        renderItem={({ item }) => (
          <View
            style={
              item.sender.username === loggedInUsername
                ? [styles.messageContainer, styles.myMessage]
                : [styles.messageContainer, styles.friendMessage]
            }
          >
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
        <Button title="Send" onPress={sendMessage} />
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
  friendMessage: {
    backgroundColor: '#f8d7da',
    alignSelf: 'flex-start',
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

export default ChatPage;
