import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ImageContext = createContext();

export const ImageProvider = ({ children }) => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    // Load images from AsyncStorage when the component mounts
    AsyncStorage.getItem('images').then(storedImages => {
      if (storedImages) {
        setImages(JSON.parse(storedImages));
      }
    });
  }, []);

  const addImage = (imageUri, prediction) => {
    const newImages = [...images, { imageUri, prediction }];
    setImages(newImages);
    // Store the images in AsyncStorage
    AsyncStorage.setItem('images', JSON.stringify(newImages));
  };

  const clearImages = () => {
    setImages([]);
    // Remove the images from AsyncStorage
    AsyncStorage.removeItem('images');
  };

  return (
    <ImageContext.Provider value={{ images, addImage, clearImages }}>
      {children}
    </ImageContext.Provider>
  );
};