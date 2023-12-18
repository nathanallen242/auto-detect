import React, { useState } from 'react';
import { View, TextInput, Keyboard, Button, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const SearchBar = ({ searchQuery, setSearchQuery, handleSearch, onFilterIconPress }) => {
  return (
   <View style={styles.container}>
     <View style={styles.searchBar__unclicked}>
       <Feather
         name="search"
         size={20}
         color="black"
         style={{ marginLeft: 1 }}
       />
       <TextInput
         style={styles.input}
         placeholder="Search..."
         value={searchQuery}
         onChangeText={(text) => {
           setSearchQuery(text);
           handleSearch(text);
         }}
       />
       <FontAwesome
         name="sliders"
         size={30}
         color="gray"
         style={{ marginLeft: 20 }}
         onPress={onFilterIconPress}
       />
     </View>
   </View>
  );
 };


export default SearchBar;

// styles
const styles = StyleSheet.create({
 container: {
  margin: 15,
  justifyContent: "flex-start",
  alignItems: "center",
  flexDirection: "row",
  width: "90%",
 },
 searchBar__unclicked: {
  padding: 10,
  flexDirection: "row",
  width: "95%",
  backgroundColor: "#d9dbda",
  borderRadius: 15,
  alignItems: "center",
 },
 searchBar__clicked: {
  padding: 10,
  flexDirection: "row",
  width: "80%",
  backgroundColor: "#d9dbda",
  borderRadius: 15,
  alignItems: "center",
  justifyContent: "space-evenly",
 },
 input: {
  fontSize: 20,
  marginLeft: 10,
  width: "90%",
 },
});
