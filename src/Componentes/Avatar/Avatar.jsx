import { StyleSheet, View, Pressable } from 'react-native';
import { Avatar } from 'react-native-paper';
import imgDefault from "../../Imagens/imagem-default.png";
import {AuthorizeContext, ThemeContext, LanguageContext } from  '../../Contexts/index.js';
import {useContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function AvatarComponent(){
  const {isAuthorized, LogOut} = useContext(AuthorizeContext);
  const { colors, toggleTheme, theme} = useContext(ThemeContext);
  const { language, setLanguage,  getTranslation} = useContext(LanguageContext);

  const [selectedImage, setSelectedImage] = useState(null);
  const [cameraStatus, requestCameraPermission] = ImagePicker.useCameraPermissions();
  const [mediaLibraryStatus, requestMediaLibraryPermission] = ImagePicker.useMediaLibraryPermissions();

  async function getStoredImage(){
    const storedImage =  await AsyncStorage.getItem('selectedImage');
    //console.log("storedImage",storedImage);
    setSelectedImage(storedImage);
  }

  async function setStoredImage(image){
    await AsyncStorage.setItem('selectedImage',image);
    setSelectedImage(image);
  }

  async function getCamera(){
    //console.log(cameraStatus);

    if(cameraStatus.status === ImagePicker.PermissionStatus.UNDETERMINED || (cameraStatus.status === ImagePicker.PermissionStatus.DENIED && cameraStatus.canAskAgain) ){
      
    const permission = await requestCameraPermission();    
    if (permission.granted)
      await handleLaunchCamera();

    }else if (cameraStatus.status === ImagePicker.PermissionStatus.DENIED){
      alert("O aplicativo não possui permissão de acesso a galeria de imagens");
    }else{
      await handleLaunchCamera();
    }

  }

  async function handleLaunchCamera(){
    //console.log('handleLaunchCamera');

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1
    });

    if (!result.canceled) {
      const imageURI = result.assets[0].uri;
      console.log(imageURI);
      setStoredImage(imageURI);
    }
  }

  async function getImageLibrary(){
    //console.log(mediaLibraryStatus);

    if(mediaLibraryStatus.status === ImagePicker.PermissionStatus.UNDETERMINED || (mediaLibraryStatus.status === ImagePicker.PermissionStatus.DENIED && mediaLibraryStatus.canAskAgain) ){

    const permission = await requestMediaLibraryPermission();    
    if (permission.granted)
      await handleLaunchImageLibrary();

    }else if (mediaLibraryStatus.status === ImagePicker.PermissionStatus.DENIED){
      alert("O aplicativo não possui permissão de acesso a galeria de imagens");
    }else{
      await handleLaunchImageLibrary();
    }
  }

  async function handleLaunchImageLibrary(){
    //console.log('handleLaunchImageLibrary');

    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1
    });

    if (!result.canceled) {
      const imageURI = result.assets[0].uri;
      console.log(imageURI);
      setStoredImage(imageURI);
    }
  }

  useEffect(() => {
    getStoredImage();
  },[])


  return ( 
      <View style={styles.avatar}>     

        <Pressable><FontAwesome name="camera" size={20} color={colors.primary_weak_text_color} onPress={getCamera}/></Pressable>

           <Avatar.Image size={40} source={selectedImage ? {uri: selectedImage} : imgDefault} />

        <Pressable><MaterialIcons name="photo-library" size={20} color={colors.primary_weak_text_color} onPress={getImageLibrary}/></Pressable>
       </View>
      )
}

const styles = StyleSheet.create({  
  avatar:{
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    padding: 10
  }
})