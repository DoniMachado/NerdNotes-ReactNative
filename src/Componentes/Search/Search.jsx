import { View, ScrowView ,Text, StyleSheet, Pressable } from "react-native";
import {  ThemeContext, LanguageContext, AuthorizeContext } from '../../Contexts/index.js';
import { useEffect, useState, useContext } from "react";
import { Card, Pagination } from "../index.js";
import { CONTENT_TYPE_MOVIE, CONTENT_TYPE_TVSERIE } from "../../Utils";
import axios from "axios";
import {TextInput, HelperText, Checkbox, ActivityIndicator } from 'react-native-paper';

export default function Search({ title, type }){
  const {colors, theme, isPortrait, width, height} = useContext(ThemeContext);
  const { token, sessionID } = useContext(AuthorizeContext);
  const { language, getTranslation } = useContext(LanguageContext);

  const [pageIndex, setPageIndex] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  
  const [includeAdult, setIncludeAdult] = useState(false);
  const [query, setQuery] = useState("");
  const [hasQueryError, setHasQueryError] = useState(false);
  const [firstRender, setFirstRender] = useState(true);

  const [listMedias, setListMedias] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  let inputStyle = !isPortrait() && width >= 700 ? styles.search_input_container_landscape : styles.search_input_container;

  let filterStyle = !isPortrait() && width >= 700 ? styles.search_filter_landscape : styles.search_filter; 

  let itemStyle = !isPortrait() && width >= 700 ? styles.search_media_content_item_landscape : styles.search_media_content_item; 


  useEffect(() => {
    setPageIndex(1);
    GetSearchMedias(1);
  }, [language]);


  async function GetSearchMedias( page) {

    if (firstRender) {
      setFirstRender(false);
      return;
    } else if (query == null || query.length === 0) {
      setHasQueryError(true);
      return;
    } else {
      setHasQueryError(false);
    }

    setIsLoading(true);
    try {
      const config = {
        Accept: "application/json",
        headers: { Authorization: `Bearer ${token}` },
      };

      let queryParams = `?language=${language}&include_adult=${includeAdult}&page=${page}`;

      if (query != null && query.length > 0)
        queryParams += `&query=${encodeURIComponent(query)}`;

      const url = `https://api.themoviedb.org/3/search/${type}`;
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
    <View style={styles.search}>
      <Text style={[styles.search_title, {color: colors.primary_weak_text_color}]}>
      {title}
      </Text>

      <View style={filterStyle}>

        <View style={inputStyle}>
          <TextInput 
          mode="outlined"
          label={getTranslation("Common::Label::Title")}
          value={query}
          onChangeText={(text) =>
                setQuery(text)}
          style={styles.search_input}
          />
          <HelperText type="error" visible={hasQueryError}>
             {getTranslation("Common::Label::Title::Error")}
          </HelperText>
        </View>

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
          GetSearchMedias(1);
        }}
        style={[styles.search_filter_button, {          
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
        <View style={[styles.search_loading, {borderColor: colors.primary_weak_text_color}]}>
          <ActivityIndicator animated={true} color={colors.primary_weak_text_color}/>
          <View style={[styles.text, {color: colors.primary_weak_text_color}]}>{getTranslation("Common::Label::Loading")}</View>
        </View>
        ):  errorMsg != null ? 
        (
       <View style={[styles.search_error, {backgroundColor: colors.error, borderColor: colors.white, shadowColor: colors.error}]}>
        <Text style={[styles.search_error_msg, {color: colors.white}]}>{errorMsg}</Text>
      </View> 
        ): listMedias === null ? 
        (
          <View></View>
        )
        : listMedias.length === 0 ? 
        (
          <View style={[styles.search_error, {backgroundColor: colors.alert, borderColor: colors.black, shadowColor: colors.alert}]}>
        <Text style={[styles.search_error_msg, {color: colors.black}]}>{getTranslation("Common::Label::EmptyList")}</Text>
      </View> 
        ) 
        : 
        (
          <View style={styles.search_media_content_container}>
            <View style={styles.search_media_content}>
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
                  GetSearchMedias(page);
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
search:{
  flex: 1,
  width: '100%',
  justifyContent: 'flex-start',
  alignItems: 'center',
  padding: 10,
  gap: 10,
},
search_title:{
  fontSize: 25,
  fontWeight: 'bolder'
},
text:{
  fontSize: 15,
  fontWeight: 'bold',
},
search_loading:{
  flexDirection: 'row',
  alignContent: 'center',
  justifyContent: 'center',
  gap: 10,
  width: '100%',
  padding: 10,
  borderRadius: 10,
  borderWidth: 1
},
search_error:{
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
search_error_msg:{
  fontSize: 25,
  fontWeight: 'bold',
  textTransform: 'uppercase',
},
search_media_content_container:{
  gap: 20,
  alignItems: 'center',
},
search_media_content:{
  flexDirection: 'row',
  justifyContent: 'space-evenly',
  alignItems: 'stretch', 
  flexWrap: 'wrap',
  gap: 20,
},
search_media_content_item:{
  width: '90%',
},
search_media_content_item_landscape:{
  width: '45%',  
},
search_filter:{
  width: '100%',
  alignItems: 'center',
  justifyContent: 'space-evenly',
  gap: 20,
  marginVertical: 20,
},
search_filter_landscape:{
  width: '100%',
  flexDirection: 'row',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'space-evenly',
  gap: 20,
  marginVertical: 20,
},
search_filter_button:{
  padding: 10,
  borderWidth: 1,
  borderRadius: 10,
  width: '80%',
  maxWidth: 200,
  justifyContent: 'center',
  alignItems: 'center'
},
search_input_container:{
  width: '100%',
},
search_input_container_landscape:{
  width: '45%',
},
search_input:{
  padding: 10,
  minHeight: 30,
  width: '100%'
},
});