import React, { useState, useContext } from 'react';
import { View, TextInput, Text, Button, StyleSheet, Alert } from 'react-native';
import { AuthContext } from '../contexts/AuthContext';

const LoginScreen = ({ navigation }) => {
 const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');
 const { login, error } = useContext(AuthContext);

 const handleLogin = () => {
   login(email, password);
   if (!error) {
    navigation.navigate('SettingsHome');
  }
 };

 return (
   <View style={styles.container}>
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
     {error && <Text>{error}</Text>}
     <Button title="Login" onPress={handleLogin} />
   </View>
 );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
});

export default LoginScreen;