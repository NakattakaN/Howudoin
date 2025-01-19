import React, { useState, useEffect } from "react";
import { View, Text, Button, FlatList, StyleSheet, Alert } from "react-native";
import { useAuth } from "./AuthContext";
import { useRouter } from "expo-router";
import { Platform } from 'react-native';
const baseURL = Platform.OS === 'ios' ? 'http://localhost:8080' : 'http://10.0.2.2:8080';


export default function FriendList() {
  const { token } = useAuth(); 
  const [friendList, setFriendList] = useState<string[]>([]); 
  const router = useRouter(); 


  const fetchFriendList = async () => {
    try {
      console.log("Fetching friend list...");
      console.log("Token being sent:", token);

      const response = await fetch(`${baseURL}/friend`, {
        method: "GET",
        headers: {
          sendertoken: token, 
        },
      });


      if (response.ok) {
        const rawResponse = await response.text();

        try {
          const friends = JSON.parse(rawResponse); 

          if (Array.isArray(friends)) {
            setFriendList(friends); 
          } else {
            console.error("Invalid response format: not an array");
            Alert.alert("Error", "Invalid response format from server.");
          }
        } catch (error) {
          console.error("Error parsing response:", error);
          Alert.alert("Error", "Failed to parse friend list from server.");
        }
      } else {
        const errorText = await response.text();
        console.error("Failed to fetch friend list:", errorText);
        Alert.alert("Error", "Failed to fetch friend list.");
      }
    } catch (error) {
      console.error("Network or unexpected error:", error);
      Alert.alert("Error", "Could not connect to the server.");
    }
  };

  useEffect(() => {
    fetchFriendList();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Friends</Text>

      {friendList.length === 0 ? (
        <Text style={styles.noFriendsText}>You have no friends yet.</Text>
      ) : (
        <FlatList
          data={friendList}
          keyExtractor={(item) => item} 
          renderItem={({ item }) => (
            <View style={styles.friendItem}>
              <Text style={styles.friendName}>{item}</Text>
              <Button
                title="Chat"
                onPress={() => {
                  router.push(`/chat/${item}`);
                }} 
              />
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  noFriendsText: {
    fontSize: 16,
    color: "gray",
  },
  friendItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  friendName: {
    fontSize: 18,
  },
});
