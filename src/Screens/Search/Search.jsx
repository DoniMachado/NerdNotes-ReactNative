import { View, Text, StyleSheet, Pressable } from "react-native";
import { CustomTab, Search } from '../../Componentes/index.js';
import {useState, useContext} from 'react';
import {
  CONTENT_TYPE_MOVIE,
  CONTENT_TYPE_TVSERIE
} from "../../Utils";
import { LanguageContext, ThemeContext, AuthorizeContext } from "../../Contexts/index.js";

export default function SearchScreen(){
  const { language, getTranslation } = useContext(LanguageContext);
  const {colors} = useContext(ThemeContext);
  const { accountID } = useContext(AuthorizeContext);
  const [value, setValue] = useState(0);

  const movieColor = value !== 0 ? colors.primary_weak_text_color: colors.primary_weak_text_hover ;

  const serieColor = value !== 1 ? colors.primary_weak_text_color: colors.primary_weak_text_hover;

  return (
      <View style={styles.search}>
        <View style={styles.search_tabs}>
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
          <Search
            title={getTranslation("Common::Label::Search::Movies")}
            type={CONTENT_TYPE_MOVIE}
          />
        </CustomTab>

        <CustomTab value={value} index={1}>
          <Search
            title={getTranslation("Common::Label::Search::Series")}
            type={CONTENT_TYPE_TVSERIE}
          />
        </CustomTab>
      </View>
    ) 

}


const styles = StyleSheet.create({
  search:{
    flex: 1,
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 10,
  },
  search_tabs:{
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