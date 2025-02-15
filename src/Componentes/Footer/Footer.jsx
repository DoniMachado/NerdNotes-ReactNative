import { View, Text, StyleSheet } from "react-native";
import {  ThemeContext } from '../../Contexts/index.js';
import { useContext } from 'react';

export default function Footer() {
  const {colors, isPortrait, width} = useContext(ThemeContext);

  let footerPrincipal = !isPortrait() && width >= 700 ? styles.footer_principal_landscape : styles.footer_principal; 

  return (
    <View style={[
      styles.footer, { color: colors.primary_strong_text_color , backgroundColor: colors.primary_strong_color}
      ]}>
      <View style={footerPrincipal}>
        <Text style={[styles.highlight, { color: colors.primary_strong_text_color}]}>Luiz Felipe D. Machado</Text>
        <Text style={[styles.paragraph, { color: colors.primary_strong_text_color}]}> Infnet, 2024</Text>
        <Text style={[styles.paragraph, { color: colors.primary_strong_text_color}]}> Engenharia de Software</Text>
      </View>
      <Text style={[styles.paragraph, { color: colors.primary_strong_text_color}]}>Projeto de Bloco: Desenvolvimento Front-end com Frameworks [24E3_5]</Text>
    </View>
  );
}



const styles = StyleSheet.create({
  footer: {
    justifyContent: 'flex-start',
    alignItems: 'center', 
  },
  footer_principal: {
    width: '100%',
    alignItems: 'center',
    gap: 10
  },
  footer_principal_landscape: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    gap: 0
  },
  paragraph:{
    fontSize: 15,
    fontWeight: 'bold'
  },
  highlight: {
    fontSize: 25,
    fontWeight: 'bold'
  } 
});