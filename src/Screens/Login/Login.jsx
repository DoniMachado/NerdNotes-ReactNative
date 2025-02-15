import {Pressable, View, Text, StyleSheet } from "react-native";
import { useState, useContext, useEffect } from "react";
import axios from "axios";
import {
  LanguageContext,
  AuthorizeContext,
  GlobalComponentsContext,
  ThemeContext
} from "../../Contexts";
import { TextInput, HelperText, ActivityIndicator } from 'react-native-paper';

export default function LoginScreen() {
  const { language, getTranslation } = useContext(LanguageContext);
  const { token, LogIn } = useContext(AuthorizeContext);
  const { showAlert } = useContext(GlobalComponentsContext);
  const {colors} = useContext(ThemeContext);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [authenticationInfo, setAuthenticationInfo] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [userInfo, setUserInfo] = useState({
    user: "",
    password: "",
  });
  const [userInfoErrors, setUserInfoErrors] = useState({
    userError: false,
    passwordError: false,
  });

  const config = {
    Accept: "application/json",
    headers: { Authorization: `Bearer ${token}` },
  };

  useEffect(() => {
    GetRequestToken();
    showAlert("Login::Tooltip::Credentials");
  }, [language]);

  async function GetRequestToken() {
    let success;
    setIsLoading(true);
    try {
      const url = "https://api.themoviedb.org/3/authentication/token/new";
      const response = await axios.get(url, config);

      const data = response.data;
      //console.log(data);

      setIsLoading(false);
      setErrorMsg(null);
      setAuthenticationInfo(data);
      success = true;
    } catch (error) {
      let errorMessage =
        error?.response?.data?.status_message ??
        error?.message ??
        getTranslation("Common::Label::Error:Unexpected");

      setIsLoading(false);
      setErrorMsg(errorMessage);
      setAuthenticationInfo(null);
      success = false;
    }
    return success;
  }

  async function Authenticate() {

    if (
      authenticationInfo == null ||
      authenticationInfo.request_token == null ||
      authenticationInfo.request_token.length === 0 ||
      new Date(authenticationInfo.expires_at) <= new Date()
    ) {
      let success = await GetRequestToken();
      if (!success) return;
    }

    if (!Validate()) return;

    setIsLoading(true);
    try {
      const url =
        "https://api.themoviedb.org/3/authentication/token/validate_with_login";
      const response = await axios.post(
        url,
        {
          username: userInfo.user,
          password: userInfo.password,
          request_token: authenticationInfo.request_token,
        },
        config
      );

      const data = response.data;
      //console.log(data);

      setIsLoading(false);
      setErrorMsg(null);

      await Login(data.request_token);
    } catch (error) {
      let errorMessage =
        error?.response?.data?.status_message ??
        error?.message ??
        getTranslation("Common::Label::Error:Unexpected");

      setIsLoading(false);
      setErrorMsg(errorMessage);
    }
  }

  async function Login(token) {
    setIsLoading(true);
    try {
      const url = "https://api.themoviedb.org/3/authentication/session/new";
      const response = await axios.post(
        url,
        {
          request_token: token,
        },
        config
      );

      const data = response.data;
      //console.log(data);

      setIsLoading(false);
      setErrorMsg(null);

      await AccountInfos(data.session_id);
    } catch (error) {
      let errorMessage =
        error?.response?.data?.status_message ??
        error?.message ??
        getTranslation("Common::Label::Error:Unexpected");

      setIsLoading(false);
      setErrorMsg(errorMessage);
    }
  }

  async function AccountInfos(session_id) {
    setIsLoading(true);
    try {
      const url = "https://api.themoviedb.org/3/account";
      const queryParams = `?session_id=${encodeURIComponent(session_id)}`;

      const response = await axios.get(url + queryParams, config);

      const data = response.data;
      //console.log(data);

      setIsLoading(false);
      setErrorMsg(null);
      LogIn(session_id, data.id);
    } catch (error) {
      let errorMessage =
        error?.response?.data?.status_message ??
        error?.message ??
        getTranslation("Common::Label::Error:Unexpected");

      setIsLoading(false);
      setErrorMsg(errorMessage);
    }
  }

  function Validate() {
    let valid = true;
    const temp = {
      userError: false,
      passwordError: false,
    };
    setErrorMsg(null);

    //console.log(userInfo);

    if (
      userInfo == null ||
      userInfo.user == null ||
      userInfo.user.length === 0
    ) {
      temp.userError = true;
      valid = false;
    }

    if (
      userInfo == null ||
      userInfo.password == null ||
      userInfo.password.length === 0
    ) {
      temp.passwordError = true;
      valid = false;
    }

    if (
      authenticationInfo == null ||
      authenticationInfo.request_token == null ||
      authenticationInfo.request_token.length === 0
    ) {
      valid = false;
      setErrorMsg(getTranslation("Common::Label::RequestToken::Invalid"));
    }

    setUserInfoErrors(temp);
    return valid;
  }

  function toggleShowPassword() {
    setShowPassword(!showPassword);
  }

  return (
    <View style={styles.login}>
      <View style={[styles.login_content, {backgroundColor: colors.primary_weak_color, borderColor: colors.primary_weak_text_color, shadowColor:colors.primary_weak_text_color }]} >

        <View style={styles.login_input_container}>
          <TextInput 
          mode="outlined"
          label={getTranslation("Common::Label::User")}
          value={userInfo.user}
          onChangeText={(text) =>
                setUserInfo({ ...userInfo, user: text })}
          style={styles.login_input}
          />
          <HelperText type="error" visible={userInfoErrors.userError}>
            {getTranslation("Common::Label::User::Error")}
          </HelperText>
        </View>


        <View style={styles.login_input_container}>
          <TextInput       
          style={styles.login_input}
          mode="outlined"
          label={getTranslation("Common::Label::Password")}
          value={userInfo.password}
          secureTextEntry={showPassword ? false : true}
          right={<TextInput.Icon icon={ showPassword ? "eye": "eye-off"} onPress={toggleShowPassword}/>}
          onChangeText={(text) =>
                setUserInfo({ ...userInfo, password: text })}
          />
          <HelperText type="error" visible={userInfoErrors.passwordError}>
            {getTranslation("Common::Label::Password::Error")}
          </HelperText>
        </View>

        <Pressable disabled={isLoading} style={[styles.login_button, {
          backgroundColor: colors.primary_strong_color,
          borderColor: colors.primary_strong_text_color
        }]} onPress={Authenticate} >
          {isLoading ? (
            <>
              <ActivityIndicator animating={true}  />
              <Text style={[styles.paragraph,{color:colors.primary_strong_text_color}]}>{getTranslation("Common::Label::Loading")}</Text>
            </>
          ) : (
            <Text style={[styles.paragraph,{color:colors.primary_strong_text_color}]}>{getTranslation("Common::Label::Login::Button")}</Text>
          )}
      </Pressable>

     </View>
      {
        errorMsg != null ? 
        <View style={[styles.login_error, {backgroundColor: colors.error, borderColor: colors.white, shadowColor: colors.error}]}>
        <Text style={[styles.login_error_msg, {color: colors.white}]}>{errorMsg}</Text>
      </View> 
      : null
    }
    </View>
  );
}

const styles = StyleSheet.create({
  login:{
    flex: 1,
    justifyContent: 'center',    
    alignItems: 'center',
    gap: 20,
    width: '100%',
  },
  login_content:{   
    justifyContent: 'center',    
    alignItems: 'space-evenly',   
    width: '100%',
    gap: 10,
    padding: 10,
    borderWidth: 2,
    borderRadius: 10,
    shadowOffset: 2,
    shadowOpacity: 2,
    shadowRadius: 2
  },
  login_input_container:{
    width: '100%',
    alignItems: 'center',
  },
  login_input:{
    padding: 10,
    minHeight: 30,
    width: '100%'
  },
  login_error:{
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
  login_error_msg:{
    fontSize: 25,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  login_button:{
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10
  },
  paragraph: {
    fontSize: 20,
    fontWeight: 'bold'
  }
});
