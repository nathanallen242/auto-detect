import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, SafeAreaView,Modal } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { Camera } from 'expo-camera';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import { Platform } from 'react-native';
import { Image } from 'react-native';
import { Audio } from 'expo-av';
import { Animated } from 'react-native';
import { useContext } from 'react';
import { ImageContext } from '../contexts/ImageContext';

const ScanScreen = ({ navigation }) => {
  // Existing states
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.off);
  const [zoom, setZoom] = useState(0);
  const [capturedImage, setCapturedImage] = useState(null);
  const [opacity, setOpacity] = useState(new Animated.Value(0));
  const [modalVisible, setModalVisible] = useState(false);
  const cameraRef = useRef(null);

  const { addImage } = useContext(ImageContext);

  
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      console.log('Camera permission status: ', status);
      setHasPermission(status === 'granted');
    })();
  }, []);

  
  const flipCamera = () => {
    setType(
      type === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  };

  const toggleFlash = () => {
    setFlashMode(
      flashMode === Camera.Constants.FlashMode.off
        ? Camera.Constants.FlashMode.on
        : Camera.Constants.FlashMode.off
    );
  };

  const nav = useNavigation();

  const handleCapture = async () => {
    console.log('Capturing...');
    if (cameraRef.current) {
      let photo = await cameraRef.current.takePictureAsync();
      setCapturedImage(photo.uri); // Save the captured image URI
      setModalVisible(true); // Show the modal
   
      // Play a sound
      const soundObject = new Audio.Sound();
      try {
        await soundObject.loadAsync(require('../sounds/success.mp3'));
        await soundObject.playAsync();
      } catch (error) {
        console.log('Error playing sound: ', error);
      }
    }
   };
   
   const handleRetake = () => {
    setModalVisible(false);
    setCapturedImage(null);
    };

    const handleSend = async () => {
      const formData = new FormData();
      formData.append('file', {
        uri: capturedImage,
        name: 'capturedImage.jpg',
        type: 'image/jpeg',
      });

      try {
        const response = await axios.post('http://10.5.1.234:6080/predict', formData, {
          headers: {
            'Content-Type':'multipart/form-data',
          },
        });
      
      if (response.status === 200) {
        const prediction = response.data.prediction;
        addImage(capturedImage, prediction)
        nav.navigate('Library');
        setModalVisible(false);
        setCapturedImage(null); // TODO: Remove this line to keep the image in the library
      }
    } catch (error) {
      console.log('Error sending file: ', error);
      setCapturedImage(null); //
      setModalVisible(false);
    }
  };



  const getFlashIconStyle = () => {
    return flashMode === Camera.Constants.FlashMode.off
      ? { name: "flash", color: "grey" }
      : { name: "flash", color: "white" };
  };

  const onPinch = useCallback(
    (event) => {
      const velocity = event.velocity / 20;
      let newZoom =
          velocity > 0
              ? zoom + event.scale * velocity * (Platform.OS === 'ios' ? 0.01 : 25) // prettier-ignore
              : zoom - event.scale * Math.abs(velocity) * (Platform.OS === 'ios' ? 0.02 : 50); // prettier-ignore

      newZoom = Math.max(0, Math.min(newZoom, 1)); // Ensure newZoom is between 0 and 1
      setZoom(newZoom);
    },
    [zoom, setZoom]
  );

  const pinchGesture = useMemo(
    () => Gesture.Pinch().onUpdate(onPinch),
    [onPinch]
  );

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const { name, color } = getFlashIconStyle();


  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaView style={styles.container}>
          <GestureDetector gesture={pinchGesture}>
              <View style={styles.wrapper}>
              <Camera style={styles.preview} type={type} flashMode={flashMode} zoom={zoom} ref={cameraRef}>
                  <View style={styles.topBar}>
                  <TouchableOpacity style={styles.flashButton} onPress={toggleFlash}>
                      <FontAwesome name={name} size={35} color={color} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.flipButton} onPress={flipCamera}>
                      <FontAwesome name="refresh" size={35} color="#FFF" />
                  </TouchableOpacity>
                  </View>
                  <TouchableOpacity style={styles.captureButton} onPress={handleCapture}>
                      <FontAwesome name="circle-o" size={65} color="#FFF" />
                  </TouchableOpacity>
              </Camera>
              </View>
          </GestureDetector>
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              >
              <View style={styles.modalContainer}>
                <Image
                style={styles.capturedImage}
                source={{ uri: capturedImage }}
                />
                <TouchableOpacity onPress={handleRetake} style={styles.button}>
                  <Text style={styles.buttonText}>Retake</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSend} style={styles.button}>
                  <Text style={styles.buttonText}>Predict</Text>
                </TouchableOpacity>
                </View>
          </Modal>
          </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  wrapper: {
    flex: 1,
  },
  preview: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  flipButton: {
    alignSelf: 'flex-end',
  },
  flashButton: {
    alignSelf: 'flex-start',
  },
  captureButton: {
    marginBottom: 30,
  },
  zoomSlider: {
    alignSelf: 'stretch',
  },
  capturedImage: {
    width: '70%', // Adjust as needed
    height: '50%', // Adjust as needed
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
   },
   capturedImageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
   },
   modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
   },
   button: {
    backgroundColor: '#4CAF50',
    padding: 10,
    margin: 10,
    borderRadius: 5,
    width: '80%',
   },
   buttonText: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
   },
});

export default ScanScreen;
