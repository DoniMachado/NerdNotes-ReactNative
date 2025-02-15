import { View, ScrowView ,Text, StyleSheet, Pressable } from "react-native";
import {  ThemeContext, LanguageContext, AuthorizeContext } from '../../Contexts/index.js';
import { useEffect, useState, useContext } from "react";
import { Card, Pagination } from "../index.js";
import { CONTENT_TYPE_MOVIE, CONTENT_TYPE_TVSERIE } from "../../Utils";
import axios from "axios";
import { ActivityIndicator } from 'react-native-paper';
import { useIsFocused } from "@react-navigation/native";

export default function CustomList({ url, type, title }){
  const isFocused = useIsFocused();
  const {colors, theme, isPortrait, width, height} = useContext(ThemeContext);
  const { token, sessionID } = useContext(AuthorizeContext);
  const { language, getTranslation } = useContext(LanguageContext);

  const [pageIndex, setPageIndex] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const [listMedias, setListMedias] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);


  let itemStyle = !isPortrait() && width >= 700 ? styles.custom_list_media_content_item_landscape : styles.custom_list_media_content_item; 


  useEffect(() => {
    if(isFocused){
      setPageIndex(1);
      GetCustomListMedias(1);
    }
  }, [language, isFocused]);


  async function GetCustomListMedias(page) {

	setIsLoading(true);
    try {
      const config = {
        Accept: "application/json",
        headers: { Authorization: `Bearer ${token}` },
      };

      let queryParams = `?language=${language}&page=${page}&session_id=${sessionID}`;

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
    <View style={styles.custom_list}>
      <Text style={[styles.custom_list_title, {color: colors.primary_weak_text_color}]}>
      {title}
      </Text>
      { isLoading ?
        ( 
        <View style={[styles.custom_list_loading, {borderColor: colors.primary_weak_text_color}]}>
          <ActivityIndicator animated={true} color={colors.primary_weak_text_color}/>
          <View style={[styles.text, {color: colors.primary_weak_text_color}]}>{getTranslation("Common::Label::Loading")}</View>
        </View>
        ):  errorMsg != null ? 
        (
       <View style={[styles.custom_list_error, {backgroundColor: colors.error, borderColor: colors.white, shadowColor: colors.error}]}>
        <Text style={[styles.custom_list_error_msg, {color: colors.white}]}>{errorMsg}</Text>
      </View> 
        ): listMedias === null || listMedias.length === 0 ? 
        (
          <View style={[styles.custom_list_error, {backgroundColor: colors.alert, borderColor: colors.black, shadowColor: colors.alert}]}>
        <Text style={[styles.custom_list_error_msg, {color: colors.black}]}>{getTranslation("Common::Label::EmptyList")}</Text>
      </View> 
        ) 
        : 
        (
          <View style={styles.custom_list_media_content_container}>
            <View style={styles.custom_list_media_content}>
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
                  GetCustomListMedias(page);
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
custom_list:{
  flex: 1,
  width: '100%',
  justifyContent: 'flex-start',
  alignItems: 'center',
  padding: 10,
  gap: 10,
},
custom_list_title:{
  fontSize: 25,
  fontWeight: 'bolder'
},
text:{
  fontSize: 15,
  fontWeight: 'bold',
},
custom_list_loading:{
  flexDirection: 'row',
  alignContent: 'center',
  justifyContent: 'center',
  gap: 10,
  width: '100%',
  padding: 10,
  borderRadius: 10,
  borderWidth: 1
},
custom_list_error:{
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
custom_list_error_msg:{
  fontSize: 25,
  fontWeight: 'bold',
  textTransform: 'uppercase',
},
custom_list_media_content_container:{
  gap: 20,
  alignItems: 'center',
},
custom_list_media_content:{
  flexDirection: 'row',
  justifyContent: 'space-evenly',
  alignItems: 'stretch', 
  flexWrap: 'wrap',
  gap: 20,
},
custom_list_media_content_item:{
  width: '90%',
},
custom_list_media_content_item_landscape:{
  width: '45%',  
},
});