import { View, Text, StyleSheet, Pressable } from "react-native";
import { CustomTab, Discover } from '../../Componentes/index.js';
import {useState, useContext} from 'react';
import {
  CONTENT_TYPE_MOVIE,
  CONTENT_TYPE_TVSERIE,
  getGenres,
  getOrders,
} from "../../Utils";
import { LanguageContext, ThemeContext } from "../../Contexts/index.js";

export default function DiscoverScreen(){
  const { language, getTranslation } = useContext(LanguageContext);
  const {colors} = useContext(ThemeContext);
  const [value, setValue] = useState(0);

  const movieColor = value !== 0 ? colors.primary_weak_text_color: colors.primary_weak_text_hover ;

  const serieColor = value !== 1 ? colors.primary_weak_text_color: colors.primary_weak_text_hover;

  return (
      <View style={styles.discover}>
        <View style={styles.discover_tabs}>
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
         <Discover
            title={getTranslation("Common::Label::Discover::Movies")}
            genres={getGenres(CONTENT_TYPE_MOVIE)}
            orders={getOrders(CONTENT_TYPE_MOVIE)}
            initialOrder={getOrders(CONTENT_TYPE_MOVIE).find(
              (o) => o.value === "popularity.desc"
            )}
            type={CONTENT_TYPE_MOVIE}
          />
        </CustomTab>

        <CustomTab value={value} index={1}>
          <Discover
            title={getTranslation("Common::Label::Discover::Series")}
            genres={getGenres(CONTENT_TYPE_TVSERIE)}
            orders={getOrders(CONTENT_TYPE_TVSERIE)}
            initialOrder={getOrders(CONTENT_TYPE_TVSERIE).find(
              (o) => o.value === "popularity.desc"
            )}
            type={CONTENT_TYPE_TVSERIE}
          />
        </CustomTab>
      </View>
    ) 

}


const styles = StyleSheet.create({
  discover:{
    flex: 1,
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 10,
  },
  discover_tabs:{
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