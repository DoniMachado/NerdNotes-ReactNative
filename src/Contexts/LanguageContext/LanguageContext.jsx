import React, { useEffect, createContext, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import translationPTBR from "./languages/language_pt_BR.js";
import translationENUS from "./languages/language_en_US.js";
import translationESES from "./languages/language_es_ES.js";

const LanguageContext = createContext();

//pt-BR
//es-ES
//en-US

const getLanguage = async () => {
  const language = await AsyncStorage.getItem("language");
  if (!language) {
    await AsyncStorage.setItem("pt-BR", "language");
    return "pt-BR";
  } else {
    return language;
  }
};

const loadTranslations = (lang) => {
  let translations = null;
  switch (lang) {
    case "en-US":
      translations = translationENUS;
      break;

    case "es-ES":
      translations = translationESES;
      break;

    case "pt-BR":
    default:
      translations = translationPTBR;
      break;
  }

  return new Map(Object.entries(translations));
};

const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("pt-BR");
  const [translations, setTranslations] = useState(null);

  function getTranslation(key) {
    if (translations && translations.has(key)) return translations.get(key);
    else return key;
  }

  useEffect(() => {
    const loadLanguage = async() =>{
      const savedLanguage = await getLanguage()
      setLanguage(savedLanguage);
    }

    loadLanguage();
  }, []);

  useEffect(() => {
    const saveLanguage = async() =>{
      await AsyncStorage.setItem("language", language);
      setTranslations(loadTranslations(language));
    } 

    saveLanguage();
  }, [language]);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        getTranslation,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export { LanguageContext, LanguageProvider };
