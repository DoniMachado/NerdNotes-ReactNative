import { AuthorizeContext } from "../../Contexts/index.js";
import { useContext } from "react";
import { useNavigation } from '@react-navigation/native';
import {Layout} from '../index.js';

export default function Unprotected({children}) {
  const { isAuthorized } = useContext(AuthorizeContext);
  const navigation = useNavigation();

  if(isAuthorized){
    navigation.navigate('discover');
  } 

  return <Layout>{children}</Layout> ;
}