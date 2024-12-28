import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

interface Vehicle {
  type: string;
  number: string;
  time: string;
}

interface ParkingRate {
  name: string;
  rate: number;
}

export default function VehicleOutScreen() {
  const router = useRouter();
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [vehicleDetails, setVehicleDetails] = useState<Vehicle | null>(null);
  const [leavingTime, setLeavingTime] = useState('');
  const [totalCharge, setTotalCharge] = useState<string | null>(null);
  const [parkingRates, setParkingRates] = useState<ParkingRate[]>([]);

  useEffect(() => {
    const loadParkingRates = async () => {
      try {
        const rates = await AsyncStorage.getItem('parkingRates');
        if (rates) setParkingRates(JSON.parse(rates));
      } catch (error) {
        console.error('Error loading parking rates:', error);
      }
    };
    loadParkingRates();
  }, []);

  const searchVehicle = async () => {
    try {
      const storedVehicles = await AsyncStorage.getItem('vehicles');
      if (storedVehicles) {
        const vehicles: Vehicle[] = JSON.parse(storedVehicles);
        const vehicle = vehicles.find((v) => v.number === vehicleNumber.trim());
        if (vehicle) {
          setVehicleDetails(vehicle);
        } else {
          Alert.alert('Not Found', 'Vehicle not found.');
        }
      }
    } catch (error) {
      console.error('Error searching for vehicle:', error);
    }
  };

  const calculateCharge = () => {
    if (!vehicleDetails || !leavingTime) {
      Alert.alert('Error', 'Please provide all required details.');
      return;
    }

    const entryTimeParts = vehicleDetails.time.split(':').map(Number);
    const leavingTimeParts = leavingTime.split(':').map(Number);

    const entryMinutes = entryTimeParts[0] * 60 + entryTimeParts[1];
    const leavingMinutes = leavingTimeParts[0] * 60 + leavingTimeParts[1];
    const durationMinutes = Math.max(0, leavingMinutes - entryMinutes);

    const rate = parkingRates.find((r) => r.name === vehicleDetails.type)?.rate || 0;
    const totalAmount = (rate * (durationMinutes / 60)).toFixed(2);

    Alert.alert('Parking Charge', `Total charge: Rs. ${totalAmount}`, [
      {
        text: 'OK',
        onPress: () => setTotalCharge(`Rs. ${totalAmount}`),
      },
    ]);
  };

  const clearData = async () => {
    try {
      if (totalCharge) {
        const currentRevenue = await AsyncStorage.getItem('totalRevenue');
        const updatedRevenue =
          (currentRevenue ? parseFloat(currentRevenue) : 0) + parseFloat(totalCharge.replace('Rs. ', ''));
        await AsyncStorage.setItem('totalRevenue', updatedRevenue.toString());
      }

      const storedVehicles = await AsyncStorage.getItem('vehicles');
      if (storedVehicles) {
        const vehicles: Vehicle[] = JSON.parse(storedVehicles);
        const updatedVehicles = vehicles.filter((v) => v.number !== vehicleDetails?.number);
        await AsyncStorage.setItem('vehicles', JSON.stringify(updatedVehicles));
        setVehicleDetails(null);
        setVehicleNumber('');
        setLeavingTime('');
        setTotalCharge(null);
        Alert.alert('Success', 'Vehicle data cleared.');
      }
    } catch (error) {
      console.error('Error clearing vehicle data:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.header}>Vehicle Out</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Vehicle Number"
          value={vehicleNumber}
          onChangeText={setVehicleNumber}
        />
        <TouchableOpacity style={styles.button} onPress={searchVehicle}>
          <Text style={styles.buttonText}>Search Vehicle</Text>
        </TouchableOpacity>

        {vehicleDetails && (
          <>
            <View style={styles.vehicleInfo}>
              <Text style={styles.vehicleDetail}>Vehicle Type: {vehicleDetails.type}</Text>
              <Text style={styles.vehicleDetail}>Entry Time: {vehicleDetails.time}</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Enter Leaving Time (HH:mm)"
              value={leavingTime}
              onChangeText={setLeavingTime}
            />
            <TouchableOpacity style={styles.button} onPress={calculateCharge}>
              <Text style={styles.buttonText}>Calculate Charge</Text>
            </TouchableOpacity>
            {totalCharge && (
              <View style={styles.chargeContainer}>
                <Text style={styles.chargeText}>Total Charge: {totalCharge}</Text>
              </View>
            )}
            <TouchableOpacity style={styles.clearButton} onPress={clearData}>
              <Text style={styles.clearButtonText}>Clear Data</Text>
            </TouchableOpacity>
          </>
        )}
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
    </View>
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
    marginBottom: 20,
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
  button: {
    backgroundColor: '#1e90ff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  vehicleInfo: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#eaf4ff',
    borderRadius: 8,
  },
  vehicleDetail: {
    fontSize: 16,
    marginBottom: 5,
  },
  chargeContainer: {
    padding: 10,
    backgroundColor: '#eaf4ff',
    borderRadius: 8,
    marginBottom: 20,
  },
  chargeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e90ff',
  },
  clearButton: {
    backgroundColor: '#ff4d4d',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  clearButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
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
