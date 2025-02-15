import {
  ThemeProvider,
  AuthorizeProvider,
  LanguageProvider,
  GlobalComponentsProvider,
} from './src/Contexts';
import { NavigationContainer } from '@react-navigation/native';
import { Portal } from 'react-native-paper';
import Router from './src/Router/Router.jsx';

export default function App() {
  return (
    <NavigationContainer>
      <LanguageProvider>
        <AuthorizeProvider>
          <ThemeProvider>
           <Portal.Host>
              <GlobalComponentsProvider>
                <Router />
              </GlobalComponentsProvider>
            </Portal.Host>
          </ThemeProvider>
        </AuthorizeProvider>
      </LanguageProvider>
    </NavigationContainer>
  );
}
