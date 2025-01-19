import React, { useState } from 'react';
import { Text, View, TextInput, StyleSheet, Button, Alert, Image } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from './AuthContext'; 
import { Platform } from 'react-native';
const baseURL = Platform.OS === 'ios' ? 'http://localhost:8080' : 'http://10.0.2.2:8080';

export default function Index() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { setToken, setUsername: setAuthUsername } = useAuth(); 

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Error", "Please enter both username and password.");
      return;
    }
  
    try {
      const response = await fetch(`${baseURL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });
  
      const responseText = await response.text(); 
  
      if (response.ok && responseText) {
       
        setToken(responseText); 
        setAuthUsername(username); 
        Alert.alert("Success", "Login successful!");
        router.push('/menu'); 
      } else {
        
        Alert.alert("Error", "Invalid username or password. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Error", "Could not connect to the server. Please check your connection.");
    }
  };
  


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Howudoin</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        keyboardType="email-address"
        value={username}
        onChangeText={(text) => setUsername(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      <Button title="Login" onPress={handleLogin} />
      <View style={styles.registerButton}>
        <Button
          title="Don't have an account? Register!"
          onPress={() => router.push('/register')} // Navigate to the register page
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fc86dd',
    padding: 20,
  },
  title: {
    fontSize: 30,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    width: '80%',
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  registerButton: {
    marginTop: 20,
    width: '50%',
  },
  logo: {
    width: 500,
    height: 500, 
    resizeMode: "contain", 
  },
});
