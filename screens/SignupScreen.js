import React, { useState, useContext } from 'react';
import { View, TextInput, Text, Button, StyleSheet, Alert, Image } from 'react-native';
import Logo from '../assets/icon.png';
import Icon from 'react-native-vector-icons/FontAwesome';
import { AuthContext } from '../contexts/AuthContext';

const SignupScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register, error } = useContext(AuthContext);

  const handleSignup = async (e) => {
    e.preventDefault();
    const unsubscribe = navigation.addListener('blur', () => {
      console.log('Navigated away from SignupScreen');
    });
    try {
      await register(email, password);
      navigation.navigate('SettingsHome');
    } catch (error) {
      switch (error.code) {
        case 'auth/email-already-in-use':
          Alert.alert('Email Already in Use', 'Please use a different email.');
          break;
        case 'auth/invalid-email':
          Alert.alert('Invalid Email', 'Please enter a valid email.');
          break;
        case 'auth/weak-password':
          Alert.alert('Weak Password', 'Please enter a stronger password.');
          break;
        default:
          Alert.alert('Error', 'An error occurred. Please try again.');
      }
    }
    unsubscribe();
  };

  return (
    <View style={styles.container}>
      <Image source={Logo} style={styles.icon} />
      <Text style={styles.title}>Signup</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <View style={styles.buttonContainer}>
        <Button title="Signup" onPress={handleSignup} color="#FFFFFF" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  icon: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 20,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#841584',
    marginTop: 20,
  }
});

export default SignupScreen;