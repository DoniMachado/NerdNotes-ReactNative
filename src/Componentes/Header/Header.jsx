import { View, Text, StyleSheet } from "react-native";
import {  ThemeContext } from '../../Contexts/index.js';
import { useContext } from 'react';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function Header() {
  const {colors} = useContext(ThemeContext);

  return (
      <View style={styles.header}>
        <MaterialCommunityIcons name="notebook-edit-outline" size={24} color={colors.primary_strong_text_color} />
        <Text style={[styles.highlight, {color: colors.primary_strong_text_color}]}>NerdNotes</Text>
      </View>  
  );
}



const styles = StyleSheet.create({
  header: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',  
    gap: 10,   
  },
  highlight: {
    fontSize: 25,
    fontWeight: 'bold'
  } 
});