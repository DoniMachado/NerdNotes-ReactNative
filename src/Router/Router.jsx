import { StyleSheet, View, Text } from 'react-native';
import { createDrawerNavigator} from '@react-navigation/drawer';
import {
  Protected, 
  Unprotected, 
  Header, 
  CustomDrawerContent
} 
from '../Componentes/index.js';
import {
  Discover,
  Login, 
  Favorites,
  Rated, 
  Watchlist, 
  Search, 
  Details 
} from  '../Screens/index.js';
import {AuthorizeContext, ThemeContext, LanguageContext } from  '../Contexts/index.js';
import {useContext} from 'react';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
const Drawer = createDrawerNavigator();

export default function Router() {
  const {isAuthorized} = useContext(AuthorizeContext);
  const { colors } = useContext(ThemeContext);
  const { getTranslation} = useContext(LanguageContext);
  
return (
        <Drawer.Navigator
          drawerContent={props => <CustomDrawerContent {...props} />}
          screenOptions={{
            headerStyle: {
              backgroundColor: colors.primary_strong_color,
            },
            drawerStyle: {
              backgroundColor: colors.primary_weak_color, 
            },
            headerTintColor: colors.primary_strong_text_color,        
            headerTitle: () => <Header/>,
            drawerActiveTintColor: colors.primary_strong_text_color,
            drawerActiveBackgroundColor: colors.primary_strong_color,
            drawerInactiveTintColor: colors.primary_weak_text_color,
            drawerInactiveBackgroundColor:  colors.primary_weak_color
          }}
        >
        {
          isAuthorized ?
          (
            <>
              <Drawer.Screen name="discover"
                options={{
                  drawerLabel: getTranslation("Page::Label::Discover"),
                  drawerIcon: ({color, size}) => (
                    <MaterialIcons name="explore" size={size} color={color} />
                  ),
                }}
              >
                {() => <Protected><Discover/></Protected>}
              </Drawer.Screen>
              <Drawer.Screen name="search"
                options={{
                  drawerLabel: getTranslation("Page::Label::Search"),
                  drawerIcon: ({color, size}) => (
                    <MaterialIcons name="search" size={size} color={color} />
                  ),
                }}
              >
                {() => <Protected><Search/></Protected>}
              </Drawer.Screen>
              <Drawer.Screen name="favorites"
                options={{
                  drawerLabel: getTranslation("Page::Label::Favorites"),
                  drawerIcon: ({color, size}) => (
                    <MaterialIcons name="favorite-outline" size={size} color={color} />
                  ),
                }}
              >
                {() => <Protected><Favorites/></Protected>}
              </Drawer.Screen>
              <Drawer.Screen name="watchlist"
                options={{
                  drawerLabel: getTranslation("Page::Label::Watchlist"),
                  drawerIcon: ({color, size}) => (
                    <MaterialIcons name="checklist" size={size} color={color} />
                  ),
                }}
              >
                {() => <Protected><Watchlist/></Protected>}
              </Drawer.Screen>
               <Drawer.Screen name="rated"
                options={{
                  drawerLabel: getTranslation("Page::Label::Rated"),
                  drawerIcon: ({color, size}) => (
                    <MaterialIcons name="star-border" size={size} color={color} />
                  ),
                }}
              >
                {() => <Protected><Rated/></Protected>}
              </Drawer.Screen>
              <Drawer.Screen name="details"
                options={{
                  drawerItemStyle: { display: 'none' },
                  drawerLabel: "Detalhes",
                  drawerIcon: ({color, size}) => (
                    <MaterialIcons name="info-outline" size={size} color={color} />
                  ),
                }}
              >
                {() => <Protected><Details/></Protected>}
              </Drawer.Screen>
            </>
          )
          :
          (
            <>
              <Drawer.Screen name="login" 
              options={{
                drawerLabel: getTranslation('Page::Label::Login'),
                drawerIcon: ({color, size}) => (
                  <MaterialCommunityIcons name="login" size={size} color={color} />
                ),
              }} 
              >
                {() => <Unprotected><Login/></Unprotected>}          
              </Drawer.Screen>
            </>
          )
        }
      </Drawer.Navigator>         
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    padding: 8,
  },
});