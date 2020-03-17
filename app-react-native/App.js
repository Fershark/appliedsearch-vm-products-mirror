import 'react-native-gesture-handler';
import React from 'react';
import {AppRegistry} from 'react-native';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {Provider as PaperProvider} from 'react-native-paper';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {useSelector} from 'react-redux';

import configureStore from './store';
import SignIn from './screens/SignIn';
import DrawerNavigator from './navigation/DrawerNavigator';

const Stack = createStackNavigator();

function Navigation() {
  const {user} = useSelector(state => state.auth);
  return (
    <>
      {user == null ? (
        <Stack.Navigator>
          <Stack.Screen name="SignIn" component={SignIn} options={{title: 'Sign In'}} />
        </Stack.Navigator>
      ) : (
        <DrawerNavigator />
      )}
    </>
  );
}

export default function App() {
  let {store, persistor} = configureStore();

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <PaperProvider>
          <NavigationContainer>
            <Navigation />
          </NavigationContainer>
        </PaperProvider>
      </PersistGate>
    </Provider>
  );
}

AppRegistry.registerComponent('main', () => Main);
