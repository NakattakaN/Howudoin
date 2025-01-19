import React from 'react';
import { View, Button, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from './AuthContext';
import { Platform } from 'react-native';

export default function Menu() {
  const router = useRouter();
  const { setToken } = useAuth();

  const handleLogout = () => {
    setToken(null); 
    Alert.alert("Logged out", "You have been logged out.");
    router.push('/'); 
  };

  return (
    <View style={styles.container}>

        <View style={styles.button}>
            <Button
            title="Friend Requests"
            onPress={() => router.push('/friend-requests')}
            />
        </View>
        <View style={styles.button}>
            <Button
            title="Friends"
            onPress={() => router.push('/friend-list')}
            />
        </View>
        <View style={styles.button}>
            <Button
            title="Create Groups"
            onPress={() => router.push('/group-creation')}
            />
        </View>
        <View style={styles.button}>
            <Button
            title="Your Groups"
            onPress={() => router.push('/group-list')}
            />
        </View>
        <View style={styles.button}>
            <Button
            title="Logout"
            onPress={handleLogout}
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
    padding: 20,
    backgroundColor: '#fc86dd',
  },
  button: {
    marginVertical: 10,
    width: '80%',
  },
});
