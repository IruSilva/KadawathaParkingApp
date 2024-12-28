import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface ParkingRate {
  icon: string;
  name: string;
  rate: number;
}

export default function HomeScreen() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [parkingRates, setParkingRates] = useState<ParkingRate[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newRate, setNewRate] = useState('');

  const profilePicture = require('../assets/images/image-removebg-preview.png');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedRates = await AsyncStorage.getItem('parkingRates');
        if (storedRates) {
          setParkingRates(JSON.parse(storedRates));
        } else {
          const defaultRates: ParkingRate[] = [
            { icon: 'motorcycle', name: 'Motor Bike', rate: 20 },
            { icon: 'taxi', name: 'Three Wheel', rate: 30 },
            { icon: 'car', name: 'Motor Car', rate: 50 },
            { icon: 'truck', name: 'Dual Purpose', rate: 70 },
            { icon: 'bus', name: 'Heavy Vehicle', rate: 100 },
            { icon: 'bicycle', name: 'Foot Bikes', rate: 0 },
          ];
          setParkingRates(defaultRates);
          await AsyncStorage.setItem('parkingRates', JSON.stringify(defaultRates));
        }
        const storedUsername = await AsyncStorage.getItem('loggedInUser');
        if (storedUsername) {
          setUsername(storedUsername);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const updateRate = async (index: number) => {
    if (isNaN(Number(newRate)) || Number(newRate) < 0) {
      Alert.alert('Invalid Input', 'Please enter a valid positive number.');
      return;
    }
    const updatedRates = [...parkingRates];
    updatedRates[index].rate = parseFloat(newRate);
    setParkingRates(updatedRates);
    setEditingIndex(null);
    setNewRate('');
    await AsyncStorage.setItem('parkingRates', JSON.stringify(updatedRates));
    Alert.alert('Success', 'Rate updated successfully!');
  };

  const renderItem = ({ item, index }: { item: ParkingRate; index: number }) => (
    <View style={styles.rateRow}>
      <View style={styles.iconContainer}>
        <FontAwesome5 name={item.icon} size={24} color="#1e90ff" />
      </View>
      <Text style={styles.vehicleName}>{item.name}</Text>
      {editingIndex === index ? (
        <View style={styles.editContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter rate"
            keyboardType="numeric"
            value={newRate}
            onChangeText={setNewRate}
          />
          <TouchableOpacity onPress={() => updateRate(index)}>
            <Ionicons name="checkmark-circle" size={24} color="#4caf50" />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.rateDisplay}>
          <Text style={styles.rateText}>Rs. {item.rate.toFixed(2)}</Text>
          <TouchableOpacity onPress={() => setEditingIndex(index)}>
            <Ionicons name="pencil" size={20} color="#1e90ff" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image source={profilePicture} style={styles.profileImage} />
        <Text style={styles.greeting}>Hi, {username || 'Guest'}</Text>
      </View>

      <View style={styles.parkingRatesContainer}>
        <Text style={styles.sectionTitle}>Parking Rates (per hour)</Text>
        <FlatList
          data={parkingRates}
          keyExtractor={(item) => item.name}
          renderItem={renderItem}
        />
      </View>

      {/* Separate section for more than 24-hour parking */}
      <View style={styles.moreThan24HrsContainer}>
        <Text style={styles.moreThan24HrsTitle}>More than 24 hours parking:</Text>
        <Text style={styles.moreThan24HrsText}>24 Hours Rate × Number Of Days</Text>
      </View>

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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e90ff',
    padding: 20,
    paddingTop: 30,
  },
  profileImage: {
    width: 53,
    height: 53,
    borderRadius: 25,
    marginRight: 12,
  },
  greeting: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  parkingRatesContainer: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  rateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
  },
  iconContainer: {
    width: 40,
    alignItems: 'center',
  },
  vehicleName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginLeft: 10,
  },
  rateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e90ff',
    marginRight: 10,
  },
  rateDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 5,
    borderRadius: 5,
    marginRight: 5,
    width: 80,
  },
  editContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moreThan24HrsContainer: {
    padding: 20,
    backgroundColor: '#eaf4ff',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1e90ff',
  },
  moreThan24HrsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e90ff',
    marginBottom: 5,
  },
  moreThan24HrsText: {
    fontSize: 16,
    color: '#333',
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
