import React, { useContext, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import ScanScreen from './screens/ScanScreen';
import LibraryScreen from './screens/LibraryScreen';
import SettingsScreen from './screens/SettingsScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import DetailScreen from './screens/DetailScreen';
import ProfileScreen from './screens/ProfileScreen';
import { AuthProvider } from './contexts/AuthContext';
import { ImageProvider } from './contexts/ImageContext';
import { AuthContext } from './contexts/AuthContext';
import * as SplashScreen from 'expo-splash-screen';
import registerNNPushToken from 'native-notify';
import { EXPO_APP_ID, EXPO_APP_TOKEN } from '@env';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const LibraryStack = () => {
  return (
    <Stack.Navigator screenOptions={{  }}>
      <Stack.Screen name="Garage" component={LibraryScreen} options = {{ headerShown: true, headerStyle: {backgroundColor: '#f5f5f5'}}} />
      <Stack.Screen name="Details" component={DetailScreen} options = {{ title: 'Car Details', headerShown: false}} />
    </Stack.Navigator>
  );
}

const SettingsStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SettingsHome" component={SettingsScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}


export default function App() {
  // Register for push notifications
  const authContext = useContext(AuthContext);
  const user = authContext ? authContext.user : null;
  const notificationsEnabled = authContext ? authContext.notificationsEnabled : false;

  useEffect(() => {
    if (user && notificationsEnabled) {
      registerNNPushToken(EXPO_APP_ID, EXPO_APP_TOKEN);
    } else if (user && !notificationsEnabled) {
      unregisterIndieDevice(user.uid);
    }
  }
  , [user, notificationsEnabled]);

  // Prevent native splash screen from autohiding
  SplashScreen.preventAutoHideAsync();
  setTimeout(SplashScreen.hideAsync, 2000);

  return (
    <AuthProvider>
      <ImageProvider>
        <NavigationContainer>
          <Tab.Navigator
            initialRouteName="Scan" 
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName;

                if (route.name === 'Scan') {
                  iconName = focused ? 'camera-retro' : 'camera-retro';
                } else if (route.name === 'Library') {
                  iconName = focused ? 'folder-o' : 'folder-o';
                }
                  else {
                    iconName = focused ? 'gear': 'gear';
                }

                return <FontAwesome name={iconName} size={size} color={color} />;
              },
              headerShown: false,
              tabBarActiveTintColor: 'blue',
              tabBarInactiveTintColor: 'gray',
            })}
          >
            <Tab.Screen name="Scan" component={ScanScreen} />
            <Tab.Screen name="Library" component={LibraryStack} />
            <Tab.Screen name="Settings" component={SettingsStack} />
          </Tab.Navigator>
          <StatusBar style="auto" />
        </NavigationContainer>
      </ImageProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
