import React, { useContext } from 'react';
import { Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Button, Alert } from 'react-native';
import { AuthContext } from '../contexts/AuthContext';
import { ImageContext } from '../contexts/ImageContext';
import { FIREBASE_DB } from '../config/FireBase';
import { Feather } from '@expo/vector-icons';
import { remove, ref } from 'firebase/database';

const SettingItem = ({ name, iconName, onPress }) => (
  <TouchableOpacity style={styles.settingItem} onPress={onPress}>
    <Feather name={iconName} size={24} color="black" />
    <Text style={styles.settingText}>{name}</Text>
  </TouchableOpacity>
);

const SettingsScreen = ({ navigation }) => {
  const settings = [
    { name: 'Language Selection', iconName: 'globe' },
    { name: 'Clear History', iconName: 'trash-2' },
    { name: 'Dark/Light Mode', iconName: 'moon' },
    // Add more settings as needed
  ];

  const { user, logout } = useContext(AuthContext);
  const { clearImages } = useContext(ImageContext);

  const handleLanguageSelection = () => {
    // Handle language selection: TODO
  };

  const handleClearHistory = () => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to clear your image history?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'OK', onPress: () => {
            if (user) {
              remove(ref(FIREBASE_DB, `users/${user.uid}/images`));
            } else {
              clearImages();
            }
          }
        },
      ],
      { cancelable: true }
    );
  };

  const handleToggleTheme = () => {
    // Handle toggle theme: TODO
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <ScrollView>
        {settings.map((setting, index) => {
          let onPress;
          switch (setting.name) {
            case 'Language Selection':
              onPress = handleLanguageSelection;
              break;
            case 'Clear History':
              onPress = handleClearHistory;
              break;
            case 'Dark/Light Mode':
              onPress = handleToggleTheme;
              break;
          }
          return <SettingItem key={index} {...setting} onPress={onPress} />;
        })}
        {!user ? (
          <>
            <Button title="Login" onPress={() => {
              const unsubscribe = navigation.addListener('blur', () => {
                console.log('Navigated away from SettingsScreen to Login');
              });
              navigation.navigate('Login');
              unsubscribe();
            }}/>

            <Button title="Signup" onPress={() => {
              const unsubscribe = navigation.addListener('blur', () => {
                console.log('Navigated away from SettingsScreen to Signup');
              });
              navigation.navigate('Signup');
              unsubscribe();
            }} />

          </>
        ) : (
          <>
            <Button title="Edit Profile" onPress={() => {
              const unsubscribe = navigation.addListener('blur', () => {
                console.log('Navigated away from SettingsScreen to ProfileScreen');
              });
              navigation.navigate('Profile');
              unsubscribe();
            }} />

            <Button title="Logout" onPress={() => {
              const unsubscribe = navigation.addListener('blur', () => {
                console.log('Navigated away from SettingsScreen after Logout');
              });
              logout();
              unsubscribe();
            }} />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 30,
    marginBottom: 20,
    textAlign: 'center',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
  },
  settingText: {
    marginLeft: 10,
  },
});

export default SettingsScreen;