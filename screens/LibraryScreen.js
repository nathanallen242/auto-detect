import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, RefreshControl, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-virtualized-view';
import { Image } from 'react-native';
import SearchBar from '../components/library/SearchBar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ImageContext } from '../contexts/ImageContext';
import { AuthContext } from '../contexts/AuthContext';
import { FIREBASE_DB } from '../config/FireBase';
import { ref, onValue } from "firebase/database";

export default function LibraryScreen({ navigation }) {

  const [query, setQuery] = useState('');
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const [filteredImages, setFilteredImages] = useState([]);
  
  const { images } = useContext(ImageContext);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      // User is logged in, fetch images from Firebase
      const imagesRef = ref(FIREBASE_DB, `users/${user.uid}/images`);
      onValue(imagesRef, (snapshot) => {
        const firebaseImages = snapshot.val();
        if (firebaseImages) {
          const imagesArray = Object.keys(firebaseImages).map((key) => firebaseImages[key]);
          setFilteredImages(imagesArray);
        } else {
          // No images exist for the user
          setFilteredImages([]);
        }
      });
    } else {
      // User is not logged in, load images from AsyncStorage
      setFilteredImages(images);
    }
  }, [user, images]);

  const onRefresh = () => {
    setRefreshing(true);
    if (user) {
      // User is logged in, fetch images from Firebase
      const imagesRef = ref(FIREBASE_DB, `users/${user.uid}/images`);
      onValue(imagesRef, (snapshot) => {
        const firebaseImages = snapshot.val();
        if (firebaseImages) {
          const imagesArray = Object.keys(firebaseImages).map((key) => firebaseImages[key]);
          setFilteredImages(imagesArray);
        } else {
          // No images exist for the user
          setFilteredImages([]);
        }
      });
    } else {
      // User is not logged in, load images from AsyncStorage
      setFilteredImages(images);
    }
    setRefreshing(false);
  };

  const handleSearch = (text) => {
    setQuery(text);
    const filtered = images.filter(image =>
      image.prediction.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredImages(filtered);
   };

   return (
    <>
      <SearchBar 
        searchQuery={query} 
        setSearchQuery={setQuery} 
        handleSearch={handleSearch}
      />
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
          {/* <Text style={styles.title}>Garage</Text> */}
          <View style={styles.separator} />
          <ScrollView 
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl 
                refreshing={refreshing} 
                onRefresh={onRefresh} 
              />
            }
            keyboardShouldPersistTaps='always'
          >
            {filteredImages.length === 0 ? (
              <Text style={styles.noImagesText}>No images found. Start scanning to add images.</Text>
            ) : (
              <View style={styles.imageContainer}>
                <FlatList
                  data={filteredImages}
                  renderItem={({ item }) => (
                   <TouchableOpacity onPress={() => navigation.navigate('Details', { image: item })}>
                     <View style={{ alignItems: 'center', marginBottom: 30 }}>
                       <Image
                         source={{ uri: item.imageUri }}
                         style={{ width: 200, height: 200, marginBottom: 10, borderRadius: 20, }}
                       />
                       <Text style={{ marginTop: 5, fontWeight: 'bold', fontSize: 13 }}>{item.prediction}</Text>
                     </View>
                   </TouchableOpacity>
                  )}
                  keyExtractor={(item, index) => index.toString()}
                  showsVerticalScrollIndicator={false}
                />
              </View>
            )}
          </ScrollView>
        </View>
      </SafeAreaView>
    </>
   );
}

const styles = StyleSheet.create({
 safeArea: {
    flex: 1,
    backgroundColor: 'f5f5f5'
 },
 container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center'
 },
 title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10, // Adjust this value to move the title further upwards
 },
 separator: {
    height: 1,
    backgroundColor: '#ff0000', // Change this value to change the color of the separator line
    marginVertical: 10,
 },
 imageContainer: {
    paddingRight: 30, // Add this line to create space on the right side of the FlatList
 },
 loadingIndicator: {
    alignItems: 'center',
    padding: 20,
 },
 noImagesText: {
  textAlign: 'center',
  marginTop: 20,
  fontSize: 16,
  color: 'grey',
},
 });
