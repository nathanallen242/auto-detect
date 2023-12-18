import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { Feather } from '@expo/vector-icons';

const SettingItem = ({ name, iconName }) => (
  <TouchableOpacity style={styles.settingItem}>
    <Feather name={iconName} size={24} color="black" />
    <Text style={styles.settingText}>{name}</Text>
  </TouchableOpacity>
);

const SettingsScreen = () => {
  const settings = [
    { name: 'Setting 1', iconName: 'user' },
    { name: 'Setting 2', iconName: 'lock' },
    // Add more settings as needed
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <ScrollView>
        {settings.map((setting, index) => (
          <SettingItem key={index} {...setting} />
        ))}
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