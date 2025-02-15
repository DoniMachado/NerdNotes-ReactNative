import React, { useEffect, createContext, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthorizeContext = createContext();

const API_TOKEN = "SEU_TOKEN_THE_MOVIEDB";

const AuthorizeProvider = ({ children }) => {
  const [token, setToken] = useState(API_TOKEN);
  const [sessionID, setSessionID] = useState(null);
  const [accountID, setAccountID] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() =>{ 
    LoadAuthentication();
  },[]);

  useEffect(() => {     
    const isAuth = ValidateAuthorization();

    setIsAuthorized(isAuth);
  }, [sessionID, accountID]);

  function ValidateAuthorization() {
    let isAuth = false;

    if (
      sessionID != null &&
      sessionID.length > 0 &&
      accountID != null
    )
      isAuth = true;

    return isAuth;
  }

  async function LogIn(sessionID, accountID) {
    await AsyncStorage.setItem("sessionID",sessionID);
    await AsyncStorage.setItem("accountID", accountID.toString());
    setSessionID(sessionID);
    setAccountID(accountID);
  }

  async function LogOut() {
    await AsyncStorage.removeItem("sessionID");
    await AsyncStorage.removeItem("accountID");
    setSessionID(null);
    setAccountID(null);                
  }

 async function LoadAuthentication(){
  let ssID = null;
  let acID = null;

  ssID = await AsyncStorage.getItem('sessionID');
  acID = await AsyncStorage.getItem('accountID');      

  setSessionID(ssID);
  setAccountID(acID != null ? Number(acID): acID); 


  return ssID != null &&
    ssID.length > 0 &&
    acID != null;   
  }

  return (
    <AuthorizeContext.Provider
      value={{
        sessionID,
        accountID,
        isAuthorized,
        token,
        LogOut,
        LogIn,
        LoadAuthentication
      }}
    >
      {children}
    </AuthorizeContext.Provider>
  );
};

export { AuthorizeContext, AuthorizeProvider };
