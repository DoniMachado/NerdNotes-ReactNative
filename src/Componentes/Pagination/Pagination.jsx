import { View, ScrowView ,Text, StyleSheet, Pressable } from "react-native";
import {  ThemeContext, LanguageContext, AuthorizeContext } from '../../Contexts/index.js';
import { useEffect, useState, useContext } from "react";
import AntDesign from '@expo/vector-icons/AntDesign';

export default function Pagination({
      count,
      page,
      onChange
}){

    const {colors, theme} =  useContext(ThemeContext); 

    return (
      <View style={styles.pagination_container}>
        <Pressable disabled={page - 1  <= 1 } 
          style={[
          styles.pagination_item_container,
          {
            backgroundColor: page - 1  <= 1 ? colors.disabled:colors.primary_strong_color, 
            borderColor: page - 1  <= 1 ? colors.disabled: colors.primary_strong_text_color
          }
          ]}
          onPress={() => onChange(page-1)}
          >
          <AntDesign name="stepbackward" size={15} 
          color={page + 1  >= count? colors.disabled: colors.primary_strong_text_color} />
        </Pressable>


          { 
          page - 2 >= 1
          &&
          <Pressable
          style={[
          styles.pagination_item_container,
          {
            backgroundColor:colors.primary_strong_color, 
            borderColor: colors.primary_strong_text_color
          }
          ]}
          onPress={() => onChange(page - 2)}
          >
          <Text style={[styles.pagination_item_text,{color: colors.primary_strong_text_color}]}>{page - 2}</Text>
        </Pressable>
        }

        { 
          page - 1 >= 1
          &&
          <Pressable
          style={[
          styles.pagination_item_container,
          {
            backgroundColor:colors.primary_strong_color, 
            borderColor: colors.primary_strong_text_color
          }
          ]}
          onPress={() => onChange(page - 1)}
          >
          <Text style={[styles.pagination_item_text,{color: colors.primary_strong_text_color}]}>{page - 1}</Text>
        </Pressable>
        }

        <Pressable
          style={[
          styles.pagination_item_container,
          {
            backgroundColor:colors.primary_strong_text_color, 
            borderColor: colors.primary_strong_color
          }
          ]}
          onPress={() => onChange(page)}
          >
          <Text style={[styles.pagination_item_text,{color: colors.primary_strong_color}]}>{page}</Text>
        </Pressable>

          { 
          page + 1 <=  count
          &&
          <Pressable
          style={[
          styles.pagination_item_container,
          {
            backgroundColor:colors.primary_strong_color, 
            borderColor: colors.primary_strong_text_color
          }
          ]}
          onPress={() => onChange(page + 1)}
          >
          <Text style={[styles.pagination_item_text,{color: colors.primary_strong_text_color}]}>{page + 1}</Text>
        </Pressable>
        }

        { 
          page + 2 <=  count
          &&
          <Pressable
          style={[
          styles.pagination_item_container,
          {
            backgroundColor:colors.primary_strong_color, 
            borderColor: colors.primary_strong_text_color
          }
          ]}
          onPress={() => onChange(page + 2)}
          >
          <Text style={[styles.pagination_item_text,{color: colors.primary_strong_text_color}]}>{page + 2}</Text>
        </Pressable>
        }

        <Pressable disabled={page + 1  >= count } style={[
          styles.pagination_item_container,
          {
            backgroundColor: page + 1  >= count? colors.disabled:colors.primary_strong_color, 
            borderColor: page + 1  >= count? colors.disabled: colors.primary_strong_text_color
          }          
          ]}
          onPress={() => onChange(page + 1)}
          >
          <AntDesign name="stepforward" size={15} 
          color={page + 1  >= count? colors.disabled: colors.primary_strong_text_color} />
        </Pressable>
      </View>
    )
}

const styles = StyleSheet.create({
  pagination_container:{
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    gap: 5
  },
  pagination_item_container:{
    padding: 10,
    borderWidth: 2,
    borderRadius: 5,
  },
  pagination_item_text:{
    fontSize: 15,
    fontWeight: 'bolder'
  }
});