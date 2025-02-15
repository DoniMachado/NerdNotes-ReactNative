import { View, ScrowView ,Text, StyleSheet, Pressable } from "react-native";
import {  ThemeContext, LanguageContext, AuthorizeContext } from '../../Contexts/index.js';
import { useEffect, useState, useContext } from "react";
import { Card, Pagination } from "../index.js";
import { CONTENT_TYPE_MOVIE, CONTENT_TYPE_TVSERIE } from "../../Utils";
import axios from "axios";
import { Checkbox, ActivityIndicator } from 'react-native-paper';
import SelectBox from 'react-native-multi-selectbox'
import { xorBy } from 'lodash'
import { useIsFocused } from "@react-navigation/native";

export default function Discover({
  title,
  genres,
  orders,
  initialOrder,
  type,
}){  
  const isFocused = useIsFocused();
  const {colors, theme, isPortrait, width, height} = useContext(ThemeContext);
  const { token } = useContext(AuthorizeContext);
  const { language, getTranslation } = useContext(LanguageContext);

  const [pageIndex, setPageIndex] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const [includeAdult, setIncludeAdult] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);

  const [listMedias, setListMedias] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const [selectedGenre, setSelectedGenre] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState({});


let selectStyle = !isPortrait() && width >= 700 ? styles.discover_select_landscape : styles.discover_select; 

let filterStyle = !isPortrait() && width >= 700 ? styles.discover_filter_landscape : styles.discover_filter; 

let itemStyle = !isPortrait() && width >= 700 ? styles.discover_media_content_item_landscape : styles.discover_media_content_item; 

  function onMultiChange() {
    return (item) => setSelectedGenre(xorBy(selectedGenre, [item], 'id'))
  }

  function onChange() {
    return (val) => setSelectedOrder(val)
  }

  useEffect(() => {  
    if(isFocused){
      setPageIndex(1);
      GetDiscoveryMedias(1);
    }    
  }, [language, isFocused]);

  function AddGenreFilter(idGenre, genreToFilter) {
    const convertedG =  {
            item: getTranslation(genreToFilter.label),
            id: genreToFilter.value,
          }

    const genre = selectedGenre?.find((element) => element.id === idGenre);

    if (!genre) {
      setSelectedGenre([...selectedGenre, convertedG]);
      setPageIndex(1);
      GetDiscoveryMedias( 1);
    }
  }

  async function GetDiscoveryMedias(page) {

    setIsLoading(true);
    try {
      const config = {
        Accept: "application/json",
        headers: { Authorization: `Bearer ${token}` },
      };

      let queryParams = `?language=${language}&include_adult=${includeAdult}&page=${page}`;

      if(selectedOrder != null && selectedOrder['id'] != null){
        queryParams += `&sort_by=${selectedOrder['id']}`;
      }

      if (selectedStartDate != null && selectedStartDate.length > 0) {
        if (type == CONTENT_TYPE_MOVIE)
          queryParams += `&primary_release_date.gte=${selectedStartDate}`;
        else queryParams += `&first_air_date.gte=${selectedStartDate}`;
      }

      if (selectedEndDate != null && selectedEndDate.length > 0) {
        if (type == CONTENT_TYPE_MOVIE)
          queryParams += `&primary_release_date.lte=${selectedEndDate}`;
        else queryParams += `&first_air_date.lte=${selectedEndDate}`;
      }

      if (selectedGenre != null && selectedGenre.length > 0)
        queryParams += `&with_genres=${encodeURIComponent(
          selectedGenre.map(g => g.id).join(",")
        )}`;

      const url = `https://api.themoviedb.org/3/discover/${type}`;
      

      const response = await axios.get(url + queryParams, config);
      const data = response.data;

      setListMedias(data.results);
      setIsLoading(false);
      setErrorMsg(null);
      setTotalPages(data.total_pages);
    } catch (error) {
      let errorMessage =
        error?.response?.data?.status_message ??
        error?.message ??
        getTranslation("Common::Label::Error:Unexpected");

      setIsLoading(false);
      setErrorMsg(errorMessage);
      setPageIndex(1);
      setTotalPages(0);
      setListMedias(null);
    }
  }

  return (
    <View style={styles.discover}>
      <Text style={[styles.discover_title, {color: colors.primary_weak_text_color}]}>
      {title}
      </Text>

      <View style={filterStyle}>

      
      <SelectBox
        label={getTranslation("Common::Label::Select::Genre")}
        inputPlaceholder={getTranslation("Common::Label::Select::Genre")}
        options={genres.map(g => {
          return {
            item: getTranslation(g.label),
            id: g.value,
          }
        })}
        selectedValues={selectedGenre}
        onMultiSelect={onMultiChange()}
        onTapClose={onMultiChange()}
        isMulti
      />


'      <SelectBox
        label={getTranslation("Common::Label::Select::Order")}
        inputPlaceholder={getTranslation("Common::Label::Select::Order")}
        options={orders.map(o => {
          return {
            item: getTranslation(o.label),
            id: o.value,
          }
        })}
        value={selectedOrder}
        onChange={onChange()}
      />'



        <Checkbox.Item 
          label={type === CONTENT_TYPE_MOVIE
          ? getTranslation("Common::Label::Include::Adult::Movies")
          : getTranslation("Common::Label::Include::Adult::Series")}          
          status={includeAdult ? 'checked' : 'unchecked'}
          onPress={() => setIncludeAdult((state) => !state)}
          color={theme === "dark-theme" ? colors.primary_strong_text_color : colors.primary_strong_color}
          uncheckedColor={theme === "dark-theme" ? colors.primary_strong_text_color : colors.primary_strong_color}
          labelStyle={{
            color: (theme === "dark-theme" ? colors.primary_strong_text_color : colors.primary_strong_color)
          }}
        />

        <Pressable 
        disabled={isLoading}
        onPress={() => {
          setPageIndex(1);
          GetDiscoveryMedias(1);
        }}
        style={[styles.discover_filter_button, {          
            backgroundColor:colors.primary_strong_color,
            borderColor: colors.primary_strong_text_color,
          }]}
        >
          <Text style={[styles.text, {color: colors.primary_strong_text_color}]}>
          {getTranslation("Common::Label::Search")}
          </Text>
        </Pressable>
      </View>

      { isLoading ?
        ( 
        <View style={[styles.discover_loading, {borderColor: colors.primary_weak_text_color}]}>
          <ActivityIndicator animated={true} color={colors.primary_weak_text_color}/>
          <View style={[styles.text, {color: colors.primary_weak_text_color}]}>{getTranslation("Common::Label::Loading")}</View>
        </View>
        ):  errorMsg != null ? 
        (
       <View style={[styles.dicovery_error, {backgroundColor: colors.error, borderColor: colors.white, shadowColor: colors.error}]}>
        <Text style={[styles.dicovery_error_msg, {color: colors.white}]}>{errorMsg}</Text>
      </View> 
        ): listMedias === null || listMedias.length === 0 ? 
        (
          <View style={[styles.dicovery_error, {backgroundColor: colors.alert, borderColor: colors.black, shadowColor: colors.alert}]}>
        <Text style={[styles.dicovery_error_msg, {color: colors.black}]}>{getTranslation("Common::Label::EmptyList")}</Text>
      </View> 
        ) 
        : 
        (
          <View style={styles.discover_media_content_container}>
            <View style={styles.discover_media_content}>
             {listMedias.map((element) => (
               <View style={itemStyle}>
                 <Card
                  key={element.id}
                  type={type}
                  id={element.id}
                  title={
                    element.title ??
                    element.original_title ??
                    element.name ??
                    element.original_name
                  }
                  description={element.overview}
                  release_date={element.release_date ?? element.first_air_date}
                  vote_average={element.vote_average}
                  vote_count={element.vote_count}
                  image={element.poster_path ?? element.backdrop_path}
                  genres={element.genre_ids}
                  popularity={element.popularity}
                  AddGenreFilter={AddGenreFilter}
                />
               </View>
            ))}
          </View>
          <View >
            {totalPages != null && totalPages > 1 ? (
              <Pagination
                count={totalPages}
                page={pageIndex}
                onChange={(page) => {
                  setPageIndex(page);
                  GetDiscoveryMedias(page);
                }}
              />
            ) : null}
          </View>
          </View>
        )
      }

    </View>
  );
  
}

const styles = StyleSheet.create({
discover:{
  flex: 1,
  width: '100%',
  justifyContent: 'flex-start',
  alignItems: 'center',
  padding: 10,
  gap: 10,
},
discover_title:{
  fontSize: 25,
  fontWeight: 'bolder'
},
discover_filter:{
  width: '100%',
  alignItems: 'center',
  justifyContent: 'space-evenly',
  gap: 20,
  marginVertical: 20,
},
discover_filter_landscape:{
  width: '100%',
  flexDirection: 'row',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'space-evenly',
  gap: 20,
  marginVertical: 20,
},
discover_filter_button:{
  padding: 10,
  borderWidth: 1,
  borderRadius: 10,
  width: '80%',
  maxWidth: 200,
  justifyContent: 'center',
  alignItems: 'center'
},
text:{
  fontSize: 15,
  fontWeight: 'bold',
},
discover_loading:{
  flexDirection: 'row',
  alignContent: 'center',
  justifyContent: 'center',
  gap: 10,
  width: '100%',
  padding: 10,
  borderRadius: 10,
  borderWidth: 1
},
dicovery_error:{
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  borderWidth: 2,
  borderRadius: 10,
  shadowOffset: 2,
  shadowOpacity: 2,
  shadowRadius: 2,
  padding: 10
},
dicovery_error_msg:{
  fontSize: 25,
  fontWeight: 'bold',
  textTransform: 'uppercase',
},
discover_media_content_container:{
  gap: 20,
  alignItems: 'center',
},
discover_media_content:{
  flexDirection: 'row',
  justifyContent: 'space-evenly',
  alignItems: 'stretch', 
  flexWrap: 'wrap',
  gap: 20,
},
discover_media_content_item:{
  width: '90%',
},
discover_media_content_item_landscape:{
  width: '45%',  
},
discover_select:{
  width: '100%',  
},
discover_select_landscape:{
  width: '45%',
}
});