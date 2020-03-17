import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createStackNavigator} from '@react-navigation/stack';
import {Button} from 'react-native-paper';

import Home from '../screens/Home';
import SignOut from '../screens/SignOut';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function HomeNavigation({navigation}) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerLeft: () => <Button icon="menu" onPress={() => navigation.toggleDrawer()} />,
      }}>
      <Stack.Screen name="Home" component={Home} options={{title: 'Home'}} />
    </Stack.Navigator>
  );
}

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen name="Home" component={HomeNavigation} />
      <Drawer.Screen name="Sign out" component={SignOut} />
    </Drawer.Navigator>
  );
}
