import React, { useEffect, createContext, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dimensions } from 'react-native';
const ThemeContext = createContext();

const getTheme = async () => {
  try{
    const theme = await AsyncStorage.getItem("theme");

    if (!theme) {
      await AsyncStorage.setItem("theme", "light-theme");
      return "light-theme";
    } else {
      return theme;
    }
  }catch(error){
    console.log("getTheme Error: ", error);
    return "light-theme";
  }
};
const communColors = {
  white: '#fffefa',
  black: '#000000',
  disabled: 'gray',
  error: 'rgb(230, 10, 10)',
  alert: 'rgb(247, 224, 22)',
  info : 'rgb(10, 142, 230)',
  sucess: 'rgb(7, 218, 7)'
}

const lightColors = {
  primary_strong_color: '#9706bb',
  primary_strong_text_color: '#fffefa',
  primary_strong_text_hover: '#000000',

  primary_weak_color: '#f0b0ea',
  primary_weak_text_color: '#000000',
  primary_weak_text_hover: '#fffefa',
}

const darkColors = {
  primary_strong_color: '#470657',
  primary_strong_text_color: '#fffefa',
  primary_strong_text_hover: '#000000',

  primary_weak_color: '#94108d',
  primary_weak_text_color: '#fffefa',
  primary_weak_text_hover: '#000000',
}

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light-theme');
  const [colors, setColors] = useState({
        ...communColors,
        ...lightColors
      });

  const [orientation, setOrientation] = useState(
    Dimensions.get('window').height > Dimensions.get('window').width
      ? 'portrait'
      : 'landscape'
  );

  const [height, setHeight] = useState(Dimensions.get('window').height);
  const [width, setWidth] = useState(Dimensions.get('window').width);

  function isPortrait() {
    return orientation === "portrait";
  }

  const handleLayoutChange = () => {
    const { height, width } = Dimensions.get('window');
    setOrientation(height > width ? 'portrait' : 'landscape');
    setHeight(height);
    setWidth(width);
  };

  function toggleTheme() {
    if (theme === "dark-theme") {
      setTheme("light-theme");
    } else {
      setTheme("dark-theme");
    }
  }

  function isDarkTheme() {
    return theme === "dark-theme";
  }

  function changeColors(){
    if (theme === "dark-theme") {
      setColors({
        ...communColors,
        ...darkColors
      });
    } else {
      setColors({
        ...communColors,
        ...lightColors
      });
    }
  }

  useEffect(async () => {
   
    const loadTheme = async () => {
      const savedTheme = await getTheme();
      setTheme(savedTheme); 
    };

    loadTheme();
  }, []);

  useEffect(() => {

    const saveTheme = async () => {
      await AsyncStorage.setItem("theme", theme);
      changeColors();
    };
    
    saveTheme();
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
        isDarkTheme,
        colors,
        orientation,
        isPortrait,
        handleLayoutChange,
        height,
        width
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export { ThemeContext, ThemeProvider };
