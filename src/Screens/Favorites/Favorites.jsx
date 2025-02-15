import { View, Text, StyleSheet, Pressable } from "react-native";
import { CustomTab, CustomList } from '../../Componentes/index.js';
import {useState, useContext} from 'react';
import {
  CONTENT_TYPE_MOVIE,
  CONTENT_TYPE_TVSERIE
} from "../../Utils";
import { LanguageContext, ThemeContext, AuthorizeContext } from "../../Contexts/index.js";

export default function FavoritesScreen(){  
  const { language, getTranslation } = useContext(LanguageContext);
  const {colors} = useContext(ThemeContext);
  const { accountID } = useContext(AuthorizeContext);
  const [value, setValue] = useState(0);

  const movieColor = value !== 0 ? colors.primary_weak_text_color: colors.primary_weak_text_hover ;

  const serieColor = value !== 1 ? colors.primary_weak_text_color: colors.primary_weak_text_hover;

  return (
      <View style={styles.favorites}>
        <View style={styles.favorites_tabs}>
          <Pressable onPress={() => setValue(0)}>
            <Text style={[styles.text, 
              {color: movieColor}
            ]}          
            >
            {getTranslation("Common::Label::Movies")}
            </Text>
          </Pressable>
           <Pressable onPress={() => setValue(1)}>
            <Text  style={[styles.text, 
              {color:  serieColor}
            ]}>{getTranslation("Common::Label::Series")}</Text>
          </Pressable>
        </View>

        <CustomTab value={value} index={0}>
         <CustomList
          url={`https://api.themoviedb.org/3/account/${accountID}/favorite/movies`}
          title={getTranslation("Common::Label::Favorites::Movies")}
          type={CONTENT_TYPE_MOVIE}
        />
        </CustomTab>

        <CustomTab value={value} index={1}>
          <CustomList
            url={`https://api.themoviedb.org/3/account/${accountID}/favorite/tv`}
            title={getTranslation("Common::Label::Favorites::Series")}
            type={CONTENT_TYPE_TVSERIE}
          />
        </CustomTab>
      </View>
    ) 

}


const styles = StyleSheet.create({
  favorites:{
    flex: 1,
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 10,
  },
  favorites_tabs:{
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    padding: 10,
  },
  text:{
    fontSize: 20,
    fontWeight: 'bolder'
  }
});