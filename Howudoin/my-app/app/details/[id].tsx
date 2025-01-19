import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useAuth } from "../AuthContext";
import { Platform } from 'react-native';
const baseURL = Platform.OS === 'ios' ? 'http://localhost:8080' : 'http://10.0.2.2:8080';

interface UserInfo {
  username: string;
}

interface Group {
  groupid: number;
  groupname: string;
  groupdesc: string;
  users: UserInfo[];
}

const GroupDetails = () => {
  const [group, setGroup] = useState<Group | null>(null);
  const { token } = useAuth(); 
  const route = useRoute();
  const { id } = route.params as { id: string };

  const fetchGroupDetails = async () => {
    try {
      const response = await fetch(`${baseURL}/groups/getusersgroups`, {
        method: 'GET',
        headers: {
          sendertoken: token, 
        },
      });

      if (response.ok) {
        const data: Group[] = await response.json();
        
        
        const selectedGroup = data.find((group) => group.groupid.toString() === id);
        if (selectedGroup) {
          setGroup(selectedGroup);
        } else {
          Alert.alert('Error', 'Group not found.');
        }
      } else {
        const errorText = await response.text();
        Alert.alert('Error', errorText);
      }
    } catch (error) {
      console.error('Error fetching group details:', error);
      Alert.alert('Error', 'Could not connect to the server.');
    }
  };

  useEffect(() => {
    fetchGroupDetails();
  }, []);

  if (!group) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading group details...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{group.groupname}</Text>
      <Text style={styles.description}>{group.groupdesc}</Text>

      <Text style={styles.sectionTitle}>Members:</Text>
      <FlatList
        data={group.users}
        keyExtractor={(item) => item.username}
        renderItem={({ item }) => (
          <Text style={styles.memberName}>{item.username}</Text>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#666',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  memberName: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default GroupDetails;
