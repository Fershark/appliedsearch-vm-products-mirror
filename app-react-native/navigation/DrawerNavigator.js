import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createStackNavigator} from '@react-navigation/stack';
import {Button} from 'react-native-paper';

import Home from '../screens/Home';
import SignOut from '../screens/SignOut';
import {Appbar, DrawerContent} from '../components';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function HomeNavigation({navigation}) {
  return (
    <Stack.Navigator
      screenOptions={{
        header: Appbar,
      }}>
      <Stack.Screen name="Home" component={Home} options={{title: 'Home'}} />
    </Stack.Navigator>
  );
}

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator drawerContent={props => <DrawerContent {...props} />} initialRouteName="Home">
      <Drawer.Screen name="Home" component={HomeNavigation} options={{drawerIcon: 'home'}}/>
      <Drawer.Screen name="Sign out" component={SignOut} options={{drawerIcon: 'logout'}}/>
    </Drawer.Navigator>
  );
}
