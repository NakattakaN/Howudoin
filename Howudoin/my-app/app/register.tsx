import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Button, Alert, Image } from "react-native";
import { useRouter } from "expo-router";
import { Platform } from 'react-native';
const baseURL = Platform.OS === 'ios' ? 'http://localhost:8080' : 'http://10.0.2.2:8080';

export default function Register(){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const router = useRouter();

    const handleRegister = async () => {
        if (!username || !password || !name || !surname) {
          Alert.alert("Error", "Please fill out all fields.");
          return;
        }
      
        try {
          const response = await fetch(`${baseURL}/register`, {
            method: 'POST', 
            headers: {
              'Content-Type': 'application/json', 
            },
            body: JSON.stringify({
              username,
              password,
              name,
              surname,
            }),
          });
      
          if (response.ok) {
            Alert.alert("Success", "Registration completed!");
            router.push('/'); 
          } else {
            const errorData = await response.json(); 
            Alert.alert("Error", errorData.message || "Registration failed. Please try again.");
          }
        } catch (error) {
          console.error("Registration error:", error);
          Alert.alert("Error", "Could not connect to the server. Please check your connection.");
        }
    };



    return (
        <View style={stylesREG.container}>
            <TextInput
                style={stylesREG.login}
                placeholder="Username"
                keyboardType="default"
                value={username}
                onChangeText={(text) => setUsername(text)}
            />
            <TextInput
                style={stylesREG.login}
                placeholder="Password"
                keyboardType="default"
                value={password}
                onChangeText={(text) => setPassword(text)}
            />
            <TextInput
                style={stylesREG.login}
                placeholder="Name"
                keyboardType="default"
                value={name}
                onChangeText={(text) => setName(text)}
            />
            <TextInput
                style={stylesREG.login}
                placeholder="Surname"
                keyboardType="default"
                value={surname}
                onChangeText={(text) => setSurname(text)}
            />
            <View style={stylesREG.registerButton}>
                    <Button title="Register" onPress={handleRegister}/>
            </View>
        
        </View>
    );

}

const stylesREG = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fc86dd',
      },
    login: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        width: '80%',
        paddingHorizontal: 10,
        marginTop: 20,
        backgroundColor: '#fff',
        borderRadius: 5,
      },
      registerButton: {
        marginTop: 20,
        width: '50%',
      }


})