import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from "./AuthContext";
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

const GroupList = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const { token } = useAuth();
  const router = useRouter();

  const fetchUserGroups = async () => {
    try {
      const response = await fetch(`${baseURL}/groups/getusersgroups`, {
        method: 'GET',
        headers: {
          sendertoken: token, 
        },
      });

      if (response.ok) {
        const data: Group[] = await response.json();
        setGroups(data);
      } else {
        const errorText = await response.text();
        Alert.alert('Error', errorText);
      }
    } catch (error) {
      console.error('Error fetching groups:', error);
      Alert.alert('Error', 'Could not connect to the server.');
    }
  };

  useEffect(() => {
    fetchUserGroups();
  }, []);

  const renderGroupItem = ({ item }: { item: Group }) => (
    <View style={styles.groupItem}>
      <Text style={styles.groupName}>{item.groupname}</Text>
      <Button
        title="View Chat"
        onPress={() => {
          const path = `/groups/${item.groupid}` as const;
          router.push(path);
        }}
      />
      <Button
        title="Group Details"
        onPress={() => {
          const path = `/details/${item.groupid}` as const;
          router.push(path);
        }}
      />
      <Button
        title="Add Members"
        onPress={() => {
        const path = `/MemberFolder/${item.groupid}` as const;
        router.push(path);}}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Groups</Text>
      {groups.length === 0 ? (
        <Text style={styles.noGroupsText}>You are not part of any groups yet.</Text>
      ) : (
        <FlatList
          data={groups}
          keyExtractor={(item) => item.groupid.toString()}
          renderItem={renderGroupItem}
        />
      )}
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
  groupItem: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },
  groupName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  groupDesc: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  noGroupsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default GroupList;
