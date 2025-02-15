import {SafeAreaView,ScrollView , View, Text, StyleSheet } from "react-native";
import { Footer } from "../index.js";
import React, { useContext }  from 'react';
import {  ThemeContext } from '../../Contexts/index.js';

export default function Layout({children}) {
  const {colors, handleLayoutChange,width} = useContext(ThemeContext);

  return (
    <SafeAreaView style={[styles.layout_container, {minWidth: width}]} onLayout={handleLayoutChange}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }} >
          <View style={[styles.layout_main_content, { backgroundColor: colors.primary_weak_color, color: colors.primary_weak_text_color }]}>
          {children}
          </View>
          <Footer />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  layout_container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
  layout_scrollview_container:{
  flex: 1,
  },
  layout_main_content: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 10,
  }
});
