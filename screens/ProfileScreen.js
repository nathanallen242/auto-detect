import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { Text, Button } from 'react-native-elements';
import { getDatabase, ref, set, onValue } from "firebase/database";
import { FIREBASE_DB } from '../config/FireBase';
import { AuthContext } from '../contexts/AuthContext';
import * as ImagePicker from 'expo-image-picker';

const ProfileScreen = () => {
  const { user } = useContext(AuthContext);
  const [image, setImage] = useState(null);
  const [email, setEmail] = useState(user ? user.email : '');

  useEffect(() => {
    if (user) {
      setEmail(user.email);
      const db = getDatabase();
      const profileRef = ref(db, 'users/' + user.uid + '/profilePicture');
      onValue(profileRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setImage(data);
        }
      });
    }
  }, [user]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImage(uri);
      if (user) {
        const imageRef = ref(FIREBASE_DB, `users/${user.uid}/profilePicture`);
        await set(imageRef, uri);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text h3 style={styles.title}>Profile</Text>
      {image && (
        <TouchableOpacity onPress={pickImage}>
          <Image 
            source={{ uri: image }} 
            style={styles.profileImage} 
          />
        </TouchableOpacity>
      )}
      <Text style={styles.emailStyle}>{email}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 16,
    marginTop: 70,
  },
  title: {
    marginBottom: 30,
    fontWeight: 'bold',
  },
  profileImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 15,
  },
  emailStyle: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 30,
  },
});

export default ProfileScreen;