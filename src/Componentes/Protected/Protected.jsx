import { AuthorizeContext } from "../../Contexts/index.js";
import { useContext } from "react";
import { useNavigation } from '@react-navigation/native';
import {Layout} from '../index.js';

export default function Protected({children}) {
  const { isAuthorized } = useContext(AuthorizeContext);
   const navigation = useNavigation();
   
  if(!isAuthorized){
    navigation.navigate('login');
  } 

  return <Layout>{children}</Layout> ;
}