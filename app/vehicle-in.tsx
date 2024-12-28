import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
} from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Vehicle {
  type: string;
  number: string;
  time: string;
}

export default function VehicleInScreen() {
  const [vehicleType, setVehicleType] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const router = useRouter();

  const vehicleTypes = [
    { icon: 'motorcycle', name: 'Motor Bike' },
    { icon: 'taxi', name: 'Three Wheel' },
    { icon: 'car', name: 'Motor Car' },
    { icon: 'truck', name: 'Dual Purpose' },
    { icon: 'bus', name: 'Heavy Vehicle' },
    { icon: 'bicycle', name: 'Foot Bikes' },
  ];

  useEffect(() => {
    const loadVehicles = async () => {
      try {
        const storedVehicles = await AsyncStorage.getItem('vehicles');
        if (storedVehicles) {
          setVehicles(JSON.parse(storedVehicles));
        }
      } catch (error) {
        console.error('Failed to load vehicles:', error);
      }
    };
    loadVehicles();
  }, []);

  const saveVehicles = async (newVehicles: Vehicle[]) => {
    try {
      await AsyncStorage.setItem('vehicles', JSON.stringify(newVehicles));
    } catch (error) {
      console.error('Failed to save vehicles:', error);
    }
  };

  const handleAddVehicle = () => {
    if (!vehicleType) {
      Alert.alert('Error', 'Please select a vehicle type!');
      return;
    }
    if (!vehicleNumber.trim()) {
      Alert.alert('Error', 'Please enter a vehicle number!');
      return;
    }

    const newVehicle: Vehicle = {
      type: vehicleType,
      number: vehicleNumber.trim(),
      time: new Date().toLocaleTimeString(),
    };

    const updatedVehicles = [...vehicles, newVehicle];
    setVehicles(updatedVehicles);
    saveVehicles(updatedVehicles);
    setVehicleNumber('');
    setVehicleType('');
  };

  const renderVehicleType = ({ item }: { item: { icon: string; name: string } }) => (
    <TouchableOpacity
      style={[
        styles.vehicleTypeButton,
        vehicleType === item.name && styles.selectedVehicleType,
      ]}
      onPress={() => setVehicleType(item.name)}
    >
      <FontAwesome5 name={item.icon} size={20} color="#1e90ff" />
      <Text style={styles.vehicleTypeText}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderVehicle = ({ item }: { item: Vehicle }) => (
    <View style={styles.vehicleItem}>
      <Text style={styles.vehicleType}>{item.type}</Text>
      <Text style={styles.vehicleNumber}>{item.number}</Text>
      <Text style={styles.vehicleTime}>{item.time}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.header}>Vehicle In</Text>
        <FlatList
          data={vehicleTypes}
          renderItem={renderVehicleType}
          keyExtractor={(item) => item.name}
          numColumns={3} // Display items in two rows
          columnWrapperStyle={styles.vehicleTypeRow}
          contentContainerStyle={styles.vehicleTypeContainer}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter Vehicle Number"
          value={vehicleNumber}
          onChangeText={setVehicleNumber}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddVehicle}>
          <Text style={styles.addButtonText}>Add Vehicle</Text>
        </TouchableOpacity>
        <FlatList
          data={vehicles}
          renderItem={renderVehicle}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.vehicleList}
        />
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
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  vehicleTypeContainer: {
    marginBottom: 0,
  },
  vehicleTypeRow: {
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  vehicleTypeButton: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
    marginHorizontal: 5,
  },
  selectedVehicleType: {
    borderColor: '#1e90ff',
    backgroundColor: '#eaf4ff',
  },
  vehicleTypeText: {
    fontSize: 12,
    color: '#1e90ff',
    marginTop: 7,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  addButton: {
    backgroundColor: '#1e90ff',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  vehicleList: {
    marginTop: 20,
  },
  vehicleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
  },
  vehicleType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e90ff',
  },
  vehicleNumber: {
    fontSize: 16,
    color: '#333',
  },
  vehicleTime: {
    fontSize: 14,
    color: '#666',
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
