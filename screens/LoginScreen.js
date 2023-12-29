import React, { useState, useContext } from 'react';
import { View, TextInput, Text, Button, StyleSheet, Alert, Image } from 'react-native';
import { AuthContext } from '../contexts/AuthContext';
import Logo from '../assets/icon.png';


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
      <Image source={Logo} style={styles.icon} />
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
      <View style={styles.buttonContainer}>
        <Button title="Login" onPress={handleLogin} color="#FFFFFF" />
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

export default LoginScreen;