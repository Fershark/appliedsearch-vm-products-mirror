import React from 'react';
import {View, StyleSheet, Platform} from 'react-native';
import {Drawer, withTheme, Colors} from 'react-native-paper';
import {CommonActions, DrawerActions} from '@react-navigation/native';

function DrawerContent({theme, state, navigation, descriptors, progress}) {
  const {colors} = theme;

  //console.log({theme, state, navigation, descriptors, progress});

  return (
    <View style={[styles.drawerContent, {backgroundColor: colors.surface}]}>
      <Drawer.Section title="MyVirtualAutomation">
        {state.routes.map(({name, key, params}, index) => (
          <Drawer.Item
            label={name}
            key={key}
            active={state.index === index}
            icon={descriptors[key].options.drawerIcon}
            onPress={() => {
              navigation.dispatch({
                ...(state.index === index ? DrawerActions.closeDrawer() : CommonActions.navigate(name)),
                target: state.key,
              });
            }}
          />
        ))}
      </Drawer.Section>
    </View>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 25 : 22,
  },
});

export default withTheme(DrawerContent);
