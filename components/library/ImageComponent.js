import React from 'react';
import { Image, StyleSheet } from 'react-native';

export default function ImageComponent({ imageUri }) {
 return (
  <Image source={{ uri: imageUri }} style={styles.image} />
 );
}

const styles = StyleSheet.create({
 image: {
 width: 100,
 height: 100,
 margin: 5, // Add this line to add spacing between images
 },
});
