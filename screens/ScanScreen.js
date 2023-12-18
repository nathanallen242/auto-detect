import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, SafeAreaView,Modal } from 'react-native';
import { Camera } from 'expo-camera';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import { Platform } from 'react-native';
import { Image } from 'react-native';
import { Audio } from 'expo-av';
import { Animated } from 'react-native';


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

  const handleCapture = async () => {
    console.log('Capturing...');
    if (cameraRef.current) {
      let photo = await cameraRef.current.takePictureAsync();
      setCapturedImage(photo.uri); // Save the captured image URI
      setModalVisible(true); // Show the modal
   
      // Animation to fade captured photo out of screen
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 1000, useNativeDriver: false }),
        Animated.timing(opacity, { toValue: 0, duration: 1000, useNativeDriver: false }),
      ]).start(() => {
        setCapturedImage(null);
        setModalVisible(false); // Hide the modal
      });
   
      // Play a sound
      const soundObject = new Audio.Sound();
      try {
        await soundObject.loadAsync(require('../sounds/shutter.mp3'));
        await soundObject.playAsync();
      } catch (error) {
        console.log('Error playing sound: ', error);
      }
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
          <Animated.View style={[styles.capturedImage, { opacity }]}>
            <Image
              source={{ uri: capturedImage }}
              style={styles.capturedImage}
            />
          </Animated.View>
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
});

export default ScanScreen;
