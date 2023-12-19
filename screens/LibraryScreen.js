import { useContext } from 'react';
import { ImageContext } from '../contexts/ImageContext';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, SafeAreaView } from 'react-native';
import { ScrollView } from 'react-native-virtualized-view';
import { Image } from 'react-native';
import SearchBar from '../components/library/SearchBar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import cars from '../constants/cars'
import FilterModal from '../components/library/FilterModal';

export default function LibraryScreen() {
 
 const [page, setPage] = useState(1);
 const [filteredImages, setFilteredImages] = useState([]);
 const [loading, setLoading] = useState(false);
 const [query, setQuery] = useState('');
 const [filter, setFilter] = useState({ make: '', model: '', year: '' });
 const insets = useSafeAreaInsets();
 const [refreshing, setRefreshing] = useState(false); 
 const [filterModalVisible, setFilterModalVisible] = useState(false);
 
 const { images } = useContext(ImageContext);

 const onRefresh = () => {
    setRefreshing(true);
    // Fetch new data here... TODO
    setRefreshing(false);
 };

 const loadMoreImages = () => {
    setLoading(true);
    setPage(prevPage => prevPage + 1);
    setLoading(false);
 };

 const handleSearch = (text) => {
    setQuery(text);
    const filtered = cars.filter(car =>
      car.make.toLowerCase().includes(text.toLowerCase()) ||
      car.model.toLowerCase().includes(text.toLowerCase()) ||
      car.year.toString().includes(text)
    );
    setFilteredImages(filtered);
   };
   

 useEffect(() => {
  setFilteredImages(cars); // Load initial images when component mounts
 }, []);
 

 const handleFilter = (newFilter) => {
    setFilter(newFilter);
};

 const filteredCars = cars.filter(car =>
    car.make.includes(filter.make) &&
    car.model.includes(filter.model) &&
    car.year.toString().includes(filter.year)
);

 const LoadingIndicator = () => {
 return (
 <View style={styles.loadingIndicator}>
    <ActivityIndicator size="large" color="#0000ff" />
    <Text>Loading...</Text>
 </View>
 );
 };

 const handleFilterIconPress = () => {
  setFilterModalVisible(true);
 };

 return (
 <SafeAreaView style={styles.safeArea}>
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
    <Text style={styles.title}>Library</Text>
    <View style={styles.separator} />
    <ScrollView showsVerticalScrollIndicator={false}>
    <SearchBar 
            searchQuery={query} 
            setSearchQuery={setQuery} 
            handleSearch={handleSearch}
            onFilterIconPress={handleFilterIconPress}
        />
    <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        onApply={() => {
            // Handle apply filter here
            setFilterModalVisible(false);
        }}
        />
        <View style={styles.imageContainer}>
         <FlatList
            data={images}
            renderItem={({ item }) => (
               <View style={{ alignItems: 'center', marginBottom: 30 }}>
               <Image
                  source={{ uri: item.imageUri }}
                  style={{ width: 300, height: 300, marginBottom: 10 }}
               />
               <Text style={{ marginTop: 5 }}>{item.prediction}</Text>
               </View>
            )}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
         />
        </View>
    </ScrollView>
    </View>
 </SafeAreaView>
 );
}

const styles = StyleSheet.create({
 safeArea: {
    flex: 1,
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
 });
