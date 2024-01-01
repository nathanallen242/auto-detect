import React, { useState } from 'react';
import { View, Text, Image, SafeAreaView, StyleSheet, ScrollView, RefreshControl } from 'react-native';


const DetailScreen = ({ route }) => {
  const { image } = route.params;
  const [details, setDetails] = useState(image.details || {});
  const [refreshing, setRefreshing] = useState(false);

  // Remove unwanted details
  const { city_mpg, combination_mpg, displacement, highway_mpg, ...filteredDetails } = details;

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Refresh data here...
    setRefreshing(false);
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <Text style={styles.detailsTitle}>Car Details</Text>
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
        <Image
          source={{ uri: image.imageUri }}
          style={styles.image}
        />
        <Text style={styles.prediction}>{image.prediction}</Text>
        {filteredDetails && Object.entries(filteredDetails).map(([key, value], index) => (
          <View key={index} style={styles.detailContainer}>
            <Text style={styles.detailText}>
              <Text style={styles.detailKey}>{key.charAt(0).toUpperCase() + key.slice(1)}: </Text>
              <Text style={styles.detailValue}>{value}</Text>
            </Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fffff'
  },
  detailsTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 50,
  },
  container: {
    flex: 1,
    backgroundColor: '#fffff',
  },
  image: {
    width: 300, 
    height: 300, 
    marginTop: 20,
    marginBottom: 10,
    alignSelf: 'center',
  },
  prediction: {
    marginTop: 10,
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  detailContainer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    width: '80%',
    marginVertical: 5,
    alignSelf: 'center',
  },
  detailText: {
    fontSize: 16,
    textAlign: 'center',
  },
  detailKey: {
    fontWeight: 'bold',
  },
  detailValue: {
    fontWeight: 'normal',
  },
});

export default DetailScreen;