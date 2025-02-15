import { StyleSheet, View } from 'react-native';
import { 
  DrawerContentScrollView, 
  DrawerItemList,  
  DrawerItem, } 
from '@react-navigation/drawer';
import {AuthorizeContext, ThemeContext, LanguageContext } from  '../../Contexts/index.js';
import {useContext, useState, useEffect} from 'react';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import CountryPicker, { DARK_THEME, DEFAULT_THEME  } from 'react-native-country-picker-modal'
import {Avatar} from "..";

export default function CustomDrawerContent(props) {
  const {isAuthorized, LogOut} = useContext(AuthorizeContext);
  const { colors, toggleTheme, theme} = useContext(ThemeContext);
  const { language, setLanguage,  getTranslation} = useContext(LanguageContext);
  const [countryCode, setCountryCode] = useState(language.split('-')[1]);
  const [translationCode, setTranslationCode] = useState(getTranslationCode(language.split('-')[1]));

  useEffect(()=>{
      setCountryCode(language.split('-')[1]);
      setTranslationCode(getTranslationCode(language.split('-')[1]));
  },[language]);

  function getTranslationCode(code){
    switch(code){
      case 'BR':
        return 'por';        
      case 'US':
        return 'common'; 
      case 'ES':
        return 'spa'; 
    }
  }

  function selectCountry(country){
    const code = country.cca2;
    console.log(code);
    setCountryCode(code);
    setTranslationCode(getTranslationCode(code));
    switch(code){
      case 'BR':
        setLanguage('pt-BR');
        break;
      case 'US':
        setLanguage('en-US');
        break;
      case 'ES':
        setLanguage('es-ES');
        break;
    }

  }
  
  return (
    <DrawerContentScrollView {...props}>       
       {isAuthorized && <Avatar />}       
       <DrawerItem 
          activeTintColor ={colors.primary_strong_text_color}
          activeBackgroundColor={colors.primary_strong_color}
          inactiveTintColor={colors.primary_weak_text_color}
          inactiveBackgroundColor={colors.primary_weak_color}
          label={getTranslation("Common::Label:Theme")} 
          onPress={toggleTheme} 
          icon={({color,size}) => 
                      <FontAwesome6 name={theme !== "dark-theme" ? "sun": "moon"} size={size} color={colors.primary_weak_text_color}
          /> 
        }/>

     	<View  style={styles.countryPicker}>
          <CountryPicker          
          countryCode ={countryCode}
          countryCodes={['ES','BR','US']}
          withFlag={true}          
          withEmoji={false}
          withCountryNameButton={true}
          onSelect={selectCountry}
          translation={translationCode}
          theme={theme === "dark-theme" ? DARK_THEME: DEFAULT_THEME}         
        />
      </View>
      <DrawerItemList {...props} />
     {  isAuthorized ?
        <DrawerItem  
          label="Logout" 
          activeTintColor ={colors.primary_strong_text_color}
          activeBackgroundColor={colors.primary_strong_color}
          inactiveTintColor={colors.primary_weak_text_color}
          inactiveBackgroundColor={colors.primary_weak_color}
          onPress={LogOut} icon={({color,size}) => 
                <SimpleLineIcons name="logout" size={size} color={colors.primary_weak_text_color}
        />
        }/>: null
     }  
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  drawer:{ 
    flex:1,
    height: '100%',  
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: 'blue'
  },
  countryPicker:{
    margin: 10,
  }
})
