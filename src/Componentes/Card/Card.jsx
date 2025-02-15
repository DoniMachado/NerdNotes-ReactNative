import React, { useEffect, useState, useContext } from "react";
import { LanguageContext, ThemeContext } from "../../Contexts/index.js";
import { useNavigation } from '@react-navigation/native';
import { IMAGE_DEFAULT, getGenres } from "../../Utils";
import { View, Text, StyleSheet, Image, Pressable, Dimensions } from "react-native";
import { Chip } from 'react-native-paper';
import { Rating, AirbnbRating } from 'react-native-ratings';

export default function Card({
  id,
  type,
  image,
  title,
  description,
  release_date,
  genres,
  vote_average,
  vote_count,
  popularity,
  AddGenreFilter,
}){
  const { getTranslation } = useContext(LanguageContext);
  const { colors, theme, isPortrait, width, height } = useContext(ThemeContext);
  const navigation = useNavigation();

  function Navigate() {
    navigation.navigate('details',{type: type, id: id});
  }

  const imgSource = image == null ? IMAGE_DEFAULT : {uri: `https://image.tmdb.org/t/p/w500${image}`} ;

  let currentGenreList = getGenres(type);

  function GetGenreLabel(element, index) {
    const item = currentGenreList.find((e) => e.value == element);

    if (item)
      return (        
        <Chip
          style={{
            backgroundColor: colors.primary_strong_text_color,
           
            borderWidth: 1,
            borderColor: colors.primary_strong_color,
          }}
          textStyle={{
            color: colors.primary_strong_color,
          }}
          key={index}
          onPress={(e) => {
            console.log("chip press");
            if (AddGenreFilter) AddGenreFilter(item.value, item);
          }}
        >{getTranslation(item.label)}</Chip>
    
      );
    else
      return <Chip style={{
            backgroundColor: colors.primary_strong_text_color,
            color: colors.primary_strong_color,
            borderWidth: 1,
            borderColor: colors.primary_strong_color
          }} 
          key={index}
          textStyle={{
            color: colors.primary_strong_color,
          }}
          >
            {"-"}
          </Chip>
  }


  return (
  <View style={[styles.card, {
    borderColor: colors.primary_weak_text_color,
    shadowColor: colors.primary_weak_text_color
  }]}>
    
    <Pressable onPress={Navigate}>
       <Image
        style={styles.card_img}
        alt={title}
        title={title}
        source={imgSource}
      />
    </Pressable>
    <Pressable onPress={Navigate}>
        <Text style={[styles.title, {color: colors.primary_weak_text_color}]}>
          {title}
        </Text>
    </Pressable>
    
    <View style={styles.card_text_content}>
      <Text style={[styles.text, {color: colors.primary_weak_text_color}]}>
        {description}
      </Text>
       <Text style={[styles.text, {color: colors.primary_weak_text_color}]}>
          {getTranslation("Common::Label::Realise") + ": "}{release_date}
      </Text>
       <Text style={[styles.text, {color: colors.primary_weak_text_color}]}>
        {getTranslation("Common::Label::Votes::Count") + ": "}{vote_count}
      </Text>
      <Rating 
        type="custom"
          ratingCount={10}
          imageSize={25} 
          startingValue={vote_average}  
          tintColor={colors.primary_weak_color}
          readonly={true} 
          style={{ padding: 10 }}
        />
      <Text style={[styles.text, {color: colors.primary_weak_text_color}]}>
        {getTranslation("Common::Label::Popularity") + ": "}{popularity}
      </Text>
        <Text style={[styles.text, {color: colors.primary_weak_text_color}]}>
        {getTranslation("Common::Label::Genres") + ": "}{genres.map(GetGenreLabel)}
      </Text>
    </View>
    
  </View>
  );
}


const styles = StyleSheet.create({
  card:{
    flex: 1,
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    padding: 10,
    gap: 20 ,
    borderWidth: 1,
    borderRadius: 10,    
    textAlign: 'justify',
    shadowOffset: 5,
    shadowRadius: 5,
    shadowOpacity: 5,
  },
  card_img:{
    width: '100%',           
    aspectRatio: 2/3
  },
  text:{
    fontSize: 15,
    fontWeight: 'bold'
  },
  title:{
    textAlign: 'center',
    fontSize: 25,
    fontWeight: 'bolder',
  },
  highlight:{
    fontSize: 20,
    fontWeight: 'bolder',
    textTransform: 'uppercase',
  },
  card_text_content:{
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 10,
    width: '100%'
  },
  card_vote_average:{
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10
  },
  card_genres:{
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10
  },
  card_text_content:{
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 10
  }
})