import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, FlatList, Text, TouchableOpacity, RefreshControl, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import UserAvatar from 'react-native-user-avatar';

async function getRandomUser(size = 1) {
  const type = 'users';
  const url = new URL(`https://random-data-api.com/api/v2/${type}`);
  let params = new URLSearchParams();
  params.set('size', size);
  params.set('response_type', 'json');
  url.search = params.toString();

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Fetch Error: couldn't get data");
    }
    const userItem = await response.json();
    return Array.isArray(userItem) ? userItem.map(buildUserCard) : [buildUserCard(userItem)];
  } catch (error) {
    // console.warn(error);
    return [];
  }
}

function buildUserCard(userItem) {
  return {
    id: userItem.id.toString(),
    avatar: userItem.avatar,
    first_name: userItem.first_name,
    last_name: userItem.last_name,
  };
}

export default function ActionButton() {
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchInitialUsers = async () => {
      const users = await getRandomUser(10);
      setData(users);
    };
    fetchInitialUsers();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    const newUsers = await getRandomUser(10);
    setData(newUsers);
    setRefreshing(false);
  }, []);

  const addItem = async () => {
    const newUser = await getRandomUser(1);
    if (newUser.length) {
      setData(prevData => [newUser[0], ...prevData]);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.listItem}>
      {Platform.OS === 'android' ? (
        <>
          <UserAvatar size={50} name={`${item.first_name} ${item.last_name}`} src={item.avatar} style={styles.userAvatar} />
          <View style={styles.nameContainer}>
            <Text style={[styles.firstName, { textAlign: 'right' }]}>{item.first_name}</Text>
            <Text style={[styles.lastName, { textAlign: 'right' }]}>{item.last_name}</Text>
          </View>
        </>
      ) : (
        <View style={styles.nameContainer}>
          <Text style={[styles.firstName, { textAlign: 'left' }]}>{item.first_name}</Text>
          <Text style={[styles.lastName, { textAlign: 'left' }]}>{item.last_name}</Text>
        </View>
      )}
      {Platform.OS === 'ios' && (
        <UserAvatar size={50} name={`${item.first_name} ${item.last_name}`} src={item.avatar} style={styles.userAvatar} />
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={addItem}>
        <MaterialIcons name="add" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 40,
    paddingRight: 40,
    borderBottomWidth: 1,
    borderBottomColor: 'grey',
    width: '100%',
    alignItems: 'center',
  },
  userAvatar: {},
  nameContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    flex: 1,
    alignItems: Platform.OS === 'ios' ? 'flex-start' : 'flex-end',
  },
  firstName: {
    fontSize: 20,
    color: 'black',
  },
  lastName: {
    fontSize: 20,
    color: 'black',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#2196F3',
    borderRadius: 30,
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
});