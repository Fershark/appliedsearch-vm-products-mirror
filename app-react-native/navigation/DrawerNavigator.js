import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createStackNavigator} from '@react-navigation/stack';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {Button} from 'react-native-paper';

import theme from '../config/theme';
import {Appbar, DrawerContent} from '../components';
import Home from '../screens/Home';
import SignOut from '../screens/SignOut';
import VMs from '../screens/VMs';
import VM from '../screens/VM';
import VMDetail from '../screens/VMDetail';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();
const Tab = createMaterialTopTabNavigator();

function HomeNavigation({navigation}) {
  return (
    <Stack.Navigator
      screenOptions={{
        header: headerProps => <Appbar {...headerProps} />,
      }}>
      <Stack.Screen name="Home" component={Home} options={{title: 'Home'}} />
    </Stack.Navigator>
  );
}

function VMNavigation({navigation}) {
  return (
    <Stack.Navigator
      screenOptions={{
        header: headerProps => <Appbar {...headerProps} />,
      }}>
      <Stack.Screen name="VMs" component={VMs} options={{title: 'Virtual Machines'}} initialParams={{refresh: true}} />
      <Stack.Screen name="VM" component={VM} options={{title: 'Add Virtual Machine'}} />
      <Stack.Screen
        name="VMDetail"
        component={VMDetailNavigation}
        options={({route}) => ({title: route.params.vm.name})}
      />
    </Stack.Navigator>
  );
}

function VMDetailNavigation({route, navigation}) {
  return (
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: 'white',
        labelStyle: {...theme.fonts.medium},
        indicatorStyle: {backgroundColor: theme.colors.accent},
        style: {backgroundColor: theme.colors.primary},
      }}>
      <Tab.Screen name="VM Info" component={VMDetail} initialParams={{...route.params}} />
      <Tab.Screen name="Marketplace" component={Home} initialParams={{...route.params}} />
    </Tab.Navigator>
  );
}

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator drawerContent={props => <DrawerContent {...props} />}>
      <Drawer.Screen name="Virtual Machines" component={VMNavigation} options={{drawerIcon: 'laptop'}} />
      <Drawer.Screen name="Home" component={HomeNavigation} options={{drawerIcon: 'home'}} />
      <Drawer.Screen name="Sign out" component={SignOut} options={{drawerIcon: 'logout'}} />
    </Drawer.Navigator>
  );
}
