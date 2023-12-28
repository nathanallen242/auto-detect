import React, { useState } from 'react';
import { View, Text, Image, SafeAreaView, StyleSheet } from 'react-native';

const DetailScreen = ({ route }) => {
  const { image } = route.params;
  const [details, setDetails] = useState(image.details || []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <Text style={styles.detailsTitle}>Car Details</Text>
      <View style={styles.container}>
        <Image
          source={{ uri: image.imageUri }}
          style={styles.image}
        />
        <Text>{image.prediction}</Text>
        {details.length > 0 ? (
          details.map((detail, index) => (
            <View key={index} style={styles.detailContainer}>
              {Object.entries(detail).map(([key, value]) => (
                <Text key={key} style={styles.detailText}>
                  <Text style={styles.detailKey}>{key}: </Text>
                  <Text style={styles.detailValue}>{value}</Text>
                </Text>
              ))}
            </View>
          ))
        ) : (
          <Text>Loading details...</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#e0e0e0'
  },
  container: {
    flex: 1,
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
    marginTop: 50,
  },
  image: {
    width: 300, 
    height: 300, 
    marginBottom: 10
  },
  // ...
  detailContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginVertical: 5,
  },
  detailText: {
    fontSize: 16,
  },
  detailKey: {
    fontWeight: 'bold',
  },
  detailValue: {
    fontWeight: 'normal',
  },
  detailsTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 50,
  },
  // ...
});

export default DetailScreen;