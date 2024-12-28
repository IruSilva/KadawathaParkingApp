import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';

export default function UserProfileScreen() {
  const router = useRouter();
  const [username, setUsername] = useState('User');
  const [totalRevenue, setTotalRevenue] = useState<number>(0);

  const fetchUserData = async () => {
    try {
      const storedUsername = await AsyncStorage.getItem('loggedInUser');
      if (storedUsername) setUsername(storedUsername);

      const storedRevenue = await AsyncStorage.getItem('totalRevenue');
      if (storedRevenue) setTotalRevenue(parseFloat(storedRevenue));
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUserData();
    }, [])
  );

  const resetRevenue = async () => {
    Alert.alert(
      'Confirm Reset',
      'Are you sure you want to reset the total revenue for the day?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Reset',
          onPress: async () => {
            try {
              await AsyncStorage.setItem('totalRevenue', '0');
              setTotalRevenue(0);
              Alert.alert('Success', 'Total revenue has been reset.');
            } catch (error) {
              console.error('Error resetting revenue:', error);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <Image
          source={require('../assets/images/image-removebg-preview.png')}
          style={styles.profileImage}
          defaultSource={require('../assets/images/default.png')} // Fallback image
        />
        <Text style={styles.greeting}>
          Hi {username}, you have earned Rs. {totalRevenue.toFixed(2)} at Park and Ride Kadawatha today.
        </Text>
      </View>

      <TouchableOpacity style={styles.resetButton} onPress={resetRevenue}>
        <Text style={styles.resetButtonText}>Reset Daily Revenue</Text>
      </TouchableOpacity>

      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/home')}>
          <Ionicons name="home" size={24} color="#1e90ff" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/vehicle-in')}>
          <Ionicons name="car" size={24} color="#1e90ff" />
          <Text style={styles.navText}>In</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/vehicle-out')}>
          <Ionicons name="exit" size={24} color="#1e90ff" />
          <Text style={styles.navText}>Out</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/user-profile')}>
          <Ionicons name="person" size={24} color="#1e90ff" />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  profileContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  greeting: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginHorizontal: 10,
  },
  resetButton: {
    backgroundColor: '#ff4d4d',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
    marginHorizontal: 20,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    color: '#1e90ff',
    marginTop: 5,
  },
});
