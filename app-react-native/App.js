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
import Home from './screens/Home';

const Stack = createStackNavigator();

function Navigation() {
  const {user} = useSelector(state => state.auth);
  return (
    <Stack.Navigator>
      {user == null ? (
        <Stack.Screen name="SignIn" component={SignIn} options={{title: 'Sign In'}} />
      ) : (
        <Stack.Screen name="Home" component={Home} options={{title: 'Home'}} />
      )}
    </Stack.Navigator>
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
