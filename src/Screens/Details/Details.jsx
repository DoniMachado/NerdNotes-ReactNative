import { View, Text, StyleSheet, Pressable, Image, Platform  } from "react-native";
import { RatingDialog, Comments } from '../../Componentes/index.js';
import axios from "axios";
import {useState, useContext, useEffect} from 'react';
import {
  CONTENT_TYPE_MOVIE,
  CONTENT_TYPE_TVSERIE,
  IMAGE_DEFAULT,
  getGenres,
} from "../../Utils";
import { 
  LanguageContext, 
  ThemeContext,   
  AuthorizeContext,
  GlobalComponentsContext
} from "../../Contexts/index.js";
import { useNavigation , useRoute } from '@react-navigation/native';
import { Chip, ActivityIndicator } from 'react-native-paper';
import { Rating, AirbnbRating } from 'react-native-ratings';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { WebView } from 'react-native-webview';

export default function DetailsScreen(){
  const { language, getTranslation } = useContext(LanguageContext);
  const { token, sessionID, accountID } = useContext(AuthorizeContext);
  const { showAlert } = useContext(GlobalComponentsContext);
  const { colors, theme, width, height,isPortrait  } = useContext(ThemeContext);

  const navigation = useNavigation();
  const route = useRoute();
  let params = route.params;
  let type = params.type;
  let id = params.id;

  const config = {
    Accept: "application/json",
    headers: { Authorization: `Bearer ${token}` },
  };

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [details, setDetails] = useState(null);
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState(null);
  const [video, setVideo] = useState(null);

  const [favorite, setFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  const [watchlist, setWatchlist] = useState(false);
  const [watchlistLoading, setWatchlistLoading] = useState(false);

  const [rated, setRated] = useState(false);
  const [rating, setRating] = useState(null);
  const [ratingLoading, setRatingLoading] = useState(false);
  const [ratingDialogOpen, setRatingDialogOpen] = useState(false);

  const styleContent = !isPortrait() && width >= 700 ? styles.details_content_landscape : styles.details_content; 

  const styleContentPrincipal = !isPortrait() && width >= 700 ? styles.details_content_principal_landscape : styles.details_content_principal; 

  const styleImage = !isPortrait() && width >= 700 ? styles.details_img_landscape : styles.details_img; 

  function showRatingDialog() {
    setRatingDialogOpen(true);
  }

  function closeRatingDialog() {
    setRatingDialogOpen(false);
  }

  async function ratingDialogConfirmButtonAction(actualRating, oldRating) {
    setRatingLoading(true);
    if (oldRating && !actualRating) {
      await removeRating();
    } else {
      await addRating(actualRating);
    }
    setRatingLoading(false);
    closeRatingDialog();
  }

  async function addRating(actualRating) {
    try {
      const url = `https://api.themoviedb.org/3/${type}/${id}/rating`;

      const queryParams = `?session_id=${encodeURIComponent(sessionID)}`;

      const response = await axios.post(
        url + queryParams,
        {
          value: actualRating,
        },
        config
      );
      const data = response.data;

      console.log("Data", data);
      setRated(true);
      setRating(actualRating);
      setWatchlist(false);
      showAlert("Rating::Label::Rate::Success", "success");
    } catch (error) {
      showAlert("Rating::Label::Rate::Error", "error");
    }
  }


  async function removeRating() {
    try {
      const url = `https://api.themoviedb.org/3/${type}/${id}/rating`;

      const queryParams = `?session_id=${encodeURIComponent(sessionID)}`;

      const response = await axios.delete(url + queryParams, config);
      const data = response.data;

      console.log("Data", data);
      setRated(false);
      setRating(null);
      showAlert("Rating::Label::Remove::Rate::Success", "success");
    } catch (error) {
      showAlert("Rating::Label::Remove::Rate::Error", "error");
    }
  }

  let currentGenreList = getGenres(type);

  function GetGenreLabel(element, index) {
    const item = currentGenreList.find((e) => e.value == element.id);

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
        >
        {getTranslation(item.label)}
        </Chip>
    
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

  useEffect(() => {
    GetDetails();
  }, [language, id, type]);

  async function GetDetails() {
    let url;

    switch (type) {
      case CONTENT_TYPE_MOVIE:
      case CONTENT_TYPE_TVSERIE:
        url = `https://api.themoviedb.org/3/${type}/${id}`;
        break;
      default:
        navigate("/404", { state: { pathname: location.pathname } });
    }

    setIsLoading(true);
    try {
      let queryParams = `?language=${language}&append_to_response=account_states,images,videos`;

      if (sessionID)
        queryParams += `&session_id=${encodeURIComponent(sessionID)}`;

      const response = await axios.get(url + queryParams, config);
      const data = response.data;

      console.log("Data", data);

      setDetails(data);
      setIsLoading(false);
      setErrorMsg(null);
      setImage(data?.poster_path ?? data?.backdrop_path);
      setTitle(
        data?.title ?? data?.original_title ?? data?.name ?? data?.original_name
      );
      setVideo(
        data?.videos?.results?.find(
          (v) =>
            v.type === "Trailer" &&
            v.site === "YouTube" &&
            v.key != null &&
            v.key.length > 0
        )?.key
      );
      setFavorite(data?.account_states?.favorite ?? false);
      setWatchlist(data?.account_states?.watchlist ?? false);
      setRated(data?.account_states?.rated ?? false);
      setRating(data?.account_states?.rated?.value);
    } catch (error) {
      if (
        error?.response?.data?.status_code === 6 ||
        error?.response?.data?.status_code === 34
      )
        navigate("/404", { state: { pathname: location.pathname } });

      let errorMessage =
        error?.response?.data?.status_message ??
        error?.message ??
        getTranslation("Common::Label::Error:Unexpected");

      setIsLoading(false);
      setErrorMsg(errorMessage);
      setDetails(null);
      setImage(null);
      setTitle(null);
      setVideo(null);
      setFavorite(false);
      setWatchlist(false);
      setRated(false);
      setRating(null);
    }
  }

  async function ToggleFavorite() {
    setFavoriteLoading(true);
    const favStatus = !favorite;
    try {
      let url = `https://api.themoviedb.org/3/account/${accountID}/favorite`;

      const queryParams = `?session_id=${encodeURIComponent(sessionID)}`;

      const response = await axios.post(
        url + queryParams,
        {
          media_type: type,
          media_id: id,
          favorite: favStatus,
        },
        config
      );
      const data = response.data;

      console.log("Data", data);
      setFavoriteLoading(false);
      setFavorite(favStatus);
      const sucessMessage = favStatus
        ? "Favorite::Label::Success"
        : "Unfavorite::Label::Success";
      showAlert(sucessMessage, "success");
    } catch (error) {
      const errorMessage = favStatus
        ? "Favorite::Label::Error"
        : "Unfavorite::Label::Error";
      setFavoriteLoading(false);
      showAlert(errorMessage, "error");
    }
  }

  async function ToggleWatchList() {
    setWatchlistLoading(true);
    const watchlistStatus = !watchlist;
    try {
      let url = `https://api.themoviedb.org/3/account/${accountID}/watchlist`;

      const queryParams = `?session_id=${encodeURIComponent(sessionID)}`;

      const response = await axios.post(
        url + queryParams,
        {
          media_type: type,
          media_id: id,
          watchlist: watchlistStatus,
        },
        config
      );
      const data = response.data;

      console.log("Data", data);
      setWatchlistLoading(false);
      setWatchlist(watchlistStatus);
      const sucessMessage = watchlistStatus
        ? "Watchlist::Label::Add::Success"
        : "Watchlist::Label::Remove::Success";
      showAlert(sucessMessage, "success");
    } catch (error) {
      console.log(error);
      const errorMessage = watchlistStatus
        ? "Watchlist::Label::Add::Error"
        : "Watchlist::Label::Remove::Error";
      setWatchlistLoading(false);
      showAlert(errorMessage, "error");
    }
  }


  return (
    <View style={styles.details_container}>
      {
          isLoading ?
        ( 
        <View style={[styles.details_loading, {borderColor: colors.primary_weak_text_color}]}>
          <ActivityIndicator animated={true} color={colors.primary_weak_text_color}/>
          <View style={[styles.text, {color: colors.primary_weak_text_color}]}>{getTranslation("Common::Label::Loading")}</View>
        </View>
        ):  errorMsg != null ? 
        (
       <View style={[styles.details_error, {backgroundColor: colors.error, borderColor: colors.white, shadowColor: colors.error}]}>
        <Text style={[styles.details_error_msg, {color: colors.white}]}>{errorMsg}</Text>
      </View> 
        ): details == null ? 
        (
			<View style={[styles.details_error, {backgroundColor: colors.alert, borderColor: colors.black, shadowColor: colors.alert}]}>
			<Text style={[styles.details_error_msg, {color: colors.black}]}>
			{type === CONTENT_TYPE_MOVIE
            ? getTranslation("Common::Label::Movie::NotFound")
            : getTranslation("Common::Label::Serie::NotFound")}
			</Text>
      </View> 
        ) : (
        <>
          <View style={styleContent}>
            <Image
              style={styleImage}
              alt={title}
              title={title}
              source={
                image != null
                  ? {uri: `https://image.tmdb.org/t/p/w500${image}`}
                  : IMAGE_DEFAULT
              }
            />
            <View style={styleContentPrincipal}>
              <Text style={[styles.details_title, {color: colors.primary_weak_text_color}]}>          
              {title}
              </Text>
              <Text style={[styles.text, {color: colors.primary_weak_text_color}]}>          
              {details.overview}
              </Text>
              <Text style={[styles.text, {color: colors.primary_weak_text_color}]}>          
              {getTranslation("Common::Label::Realise") + ": "}{details.release_date ?? details.first_air_date}
              </Text>
              <Text style={[styles.text, {color: colors.primary_weak_text_color}]}>          
                   {getTranslation("Common::Label::Votes::Count") + ": "} {details.vote_count}
              </Text>
              <Rating 
                type="custom"
                  ratingCount={10}
                  imageSize={30} 
                  startingValue={details.vote_average}  
                  tintColor={colors.primary_weak_color}
                  readonly={true} 
                  style={{ padding: 10 }}
                />
              <Text style={[styles.text, {color: colors.primary_weak_text_color}]}>
                {getTranslation("Common::Label::Popularity") + ": "}{details.popularity}
              </Text>
              <Text style={[styles.text, {color: colors.primary_weak_text_color}]}>
                {getTranslation("Common::Label::Genres") + ": "}{details.genres.map(GetGenreLabel)}
              </Text>
              <View style={[styles.details_actions, {borderColor: colors.primary_weak_text_color}]}>
              {favoriteLoading ? (
                  <ActivityIndicator animated={true} color={colors.primary_weak_text_color}/>
                ) : favorite ? (
                 <Pressable onPress={ToggleFavorite}>
                  <MaterialIcons name="favorite" size={30} color="red" />
                 </Pressable>
                ) : (
                 <Pressable onPress={ToggleFavorite}>
                  <MaterialIcons name="favorite-border" size={30} color="red" />
                 </Pressable>
                )
              }
               {watchlistLoading ? (
                  <ActivityIndicator animated={true} color={colors.primary_weak_text_color}/>
                ) : watchlist ? (
                 <Pressable onPress={ToggleWatchList}>
                  <MaterialIcons name="playlist-remove" size={30} color="black" />
                 </Pressable>
                ) : (
                 <Pressable onPress={ToggleWatchList}>
                  <MaterialIcons name="playlist-add" size={30} color="black" />
                 </Pressable>
                )
              }
              {ratingLoading ? (
                <ActivityIndicator animated={true} color={colors.primary_weak_text_color}/>
              ) : (                
                 <Pressable onPress={showRatingDialog}>
                  <MaterialIcons name="star" size={30} color={rated ? "gold" : "black"} />
                 </Pressable>
              )}
              <MaterialIcons name="bookmark-add" size={24} color="black" />
              </View>
              {video != null && Platform.OS === "web" ? (
                  <iframe src={`https://www.youtube.com/embed/${video}`} height={'100%'} width={'100%'} />
                  ) : null
              }  
            </View>           
            {video != null && Platform.OS !== "web" ? (
                <View style={{width: '100%'}}>       
                  <WebView
                    source={{uri: `https://www.youtube.com/embed/${video}`}}
                    style={styles.details_video_trailer}
                  />
                </View>
                ) : null
            }
            <RatingDialog
              id={id}
              type={type}
              rating={rating}
              ratingDialogOpen={ratingDialogOpen}
              ratingDialogTitle={(type === CONTENT_TYPE_MOVIE
                ? getTranslation("Rating::Label::Movie")
                : getTranslation("Rating::Label::Serie")
              ).replace("{0}", title)}
              ratingDialogCancelButton={getTranslation("Common::Label::Cancel")}
              ratingDialogCancelButtonAction={closeRatingDialog}
              ratingDialogConfirmButton={getTranslation("Rating::Label::Button")}
              ratingDialogConfirmButtonAction={ratingDialogConfirmButtonAction}
              ratingDialogCloseAction={closeRatingDialog}
            />            
          </View>
           <Comments id={id} type={type} />
        </>
        )
      }
    </View>
  );


}


const styles = StyleSheet.create({
details_container:{
  flex: 1,
  width: '100%',
  justifyContent: 'center',
  alignItems: 'center',
  padding: 10,
},
details_content:{
  width: '100%',
  justifyContent: 'space-evenly',
  alignItems: 'center',
  gap: 10,
  padding: 10
},
details_content_landscape:{
  width: '100%',
  flexDirection: 'row',
  justifyContent: 'flex-start',
  flexWrap: 'wrap',
  alignItems: 'stretch',
  gap: 10,
  padding: 10,
},
details_content_principal:{
  width: '100%',
  justifyContent: 'flex-start',
  alignItems: 'center',
  gap: 10,
  padding: 10,
},
details_content_principal_landscape:{
  width: '45%',
  justifyContent: 'flex-start',
  alignItems: 'center',
  gap: 10,
  padding: 10,
},
details_title:{
  fontSize: 25,
  fontWeight: 'bolder',
  textAlign: 'center'
},	
text:{
  fontSize: 15,
  fontWeight: 'bold',
  textAlign: 'justify'
},
details_loading:{
  flexDirection: 'row',
  alignContent: 'center',
  justifyContent: 'center',
  gap: 10,
  width: '100%',
  padding: 10,
  borderRadius: 10,
  borderWidth: 2
},	
details_error:{
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
details_error_msg:{
  fontSize: 25,
  fontWeight: 'bold',
  textTransform: 'uppercase',
},
details_img:{
  width: '100%',           
  aspectRatio: 2/3
},
details_img_landscape:{
  width: '50%',      
  aspectRatio: 2/3
},
details_actions:{
  width: '100%',
  padding: 10,
  gap: 10,
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-around',
  alignItems: 'center',
  borderWidth: 2,
  borderRadius: 10,
},
details_video_trailer: {
  width: '100%',           
  aspectRatio: 2/3
}
});