import React, { useState, useContext } from 'react';
import { View, TextInput, Text, Button, StyleSheet, Alert } from 'react-native';
import { AuthContext } from '../contexts/AuthContext';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, error } = useContext(AuthContext);

  handleError = (error) => {
    switch (error.code) {
      case 'auth/invalid-email':
        Alert.alert('Invalid Email', 'Please enter a valid email.');
        break;
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        Alert.alert('Error', 'Invalid email or password.');
        break;
      default:
        Alert.alert('Error', 'An error occurred. Please try again.');
    }
  };
 
 handleLogin = () => {
   const unsubscribe = navigation.addListener('blur', () => {
     console.log('Navigated away from LoginScreen');
   });
   login(email, password)
     .then(() => {
       navigation.navigate('SettingsHome');
     })
     .catch(this.handleError);
   unsubscribe();
 };
 

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
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
      <Button title="Login" onPress={handleLogin} color="#841584" />
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default LoginScreen;