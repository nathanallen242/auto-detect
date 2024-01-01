import React, { useRef } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

const SearchBar = ({ searchQuery, setSearchQuery, handleSearch }) => {
 const inputRef = useRef();

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
         ref={inputRef}
         style={styles.input}
         placeholder="Search..."
         value={searchQuery}
         onChangeText={(text) => {
           setSearchQuery(text);
           handleSearch(text);
         }}
       />
     </View>
   </View>
 );
};

export default SearchBar;


// styles
const styles = StyleSheet.create({
 container: {
  margin: 18,
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
