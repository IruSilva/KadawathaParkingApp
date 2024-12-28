import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import the icon library

export default function IndexScreen() {
  const router = useRouter(); // Use expo-router navigation

  const handleNavigateToLogin = () => {
    router.push('/login'); // Navigate to the Login screen
  };

  return (
    <ImageBackground
      source={require('../assets/images/parking.webp')} // Ensure the path is correct
      style={styles.backgroundImage}
    >
      <View style={styles.captionContainer}>
        <Text style={styles.titleText}>Park & Ride</Text>
        <Text style={styles.captionText}>Enjoy the Travel</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleNavigateToLogin}>
        <Icon name="login" size={28} color="#fff" /> {/* Icon for login */}
      </TouchableOpacity>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'space-between',
  },
  captionContainer: {
    marginTop: 50,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 20,
  },
  titleText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  captionText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginTop: 5,
  },
  button: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
