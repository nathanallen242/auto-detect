import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Alert, Modal, TouchableWithoutFeedback } from 'react-native';
import { Text, Button, Switch, Icon } from 'react-native-elements';
import { getDatabase, ref, set, onValue } from "firebase/database";
import { FIREBASE_DB } from '../config/FireBase';
import { AuthContext } from '../contexts/AuthContext';
import * as ImagePicker from 'expo-image-picker';
import { TextInput } from 'react-native-gesture-handler';

const ProfileScreen = () => {
  const { user, updatePassword, notificationsEnabled, setNotificationsEnabled } = useContext(AuthContext);
  const [image, setImage] = useState(null);
  const [email, setEmail] = useState(user ? user.email : '');
  const [modalVisible, setModalVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert('New passwords do not match!');
      return;
    }
    // Call updatePassword from AuthContext
    try {
      await updatePassword(currentPassword, newPassword);
      setNewPassword('');
      setConfirmPassword('');
      setCurrentPassword('');
      setModalVisible(false);
      Alert.alert('Password updated successfully!');
    } catch (error) {
      // An error occurred
      Alert.alert(error.message);
    }
  };

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
      <Button title="Change Password" onPress={() => setModalVisible(true)} />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.closeButtonContainer}>
              <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                <Icon name='close' type='material' color='#517fa4' />
              </TouchableWithoutFeedback>
            </View>
            <Text h4 style={styles.modalText}>Submit New Password</Text>
            <TextInput
              style={styles.input}
              value={currentPassword}
              onChangeText={setCurrentPassword}
              placeholder="Current Password"
              placeholderTextColor="#808080"
              secureTextEntry={true}
            />
            <TextInput
              style={styles.input}
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="New Password"
              placeholderTextColor="#808080"
              secureTextEntry={true}
            />
            <TextInput
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm New Password"
              placeholderTextColor="#808080"
              secureTextEntry={true}
            />
            <Button title="Submit" onPress={handlePasswordChange} />
          </View>
        </View>
      </Modal>
      <View style={styles.switchContainer}>
        <Text>Enable Push Notifications</Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
          trackColor={{ false: '#767577', true: 'green' }}
          thumbColor={notificationsEnabled ? 'white' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
        />
      </View>
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
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  closeButtonContainer: {
    position: 'absolute',
    top: 10,
    right: 10
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontWeight: 'bold',
    fontSize: 20,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: 200,
  }
});

export default ProfileScreen;