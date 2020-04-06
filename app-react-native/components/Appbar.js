import React from 'react';
import {Appbar} from 'react-native-paper';
import {useSelector} from 'react-redux';

export default function({navigation, scene, previous}) {
  const {user} = useSelector(state => state.auth);
  return (
    <Appbar.Header
      style={{
        elevation: 0, // remove shadow on Android
        shadowOpacity: 0, // remove shadow on iOS
      }}>
      {previous ? (
        <Appbar.BackAction onPress={() => navigation.goBack()} />
      ) : (
        user && <Appbar.Action icon="menu" onPress={() => navigation.toggleDrawer()} />
      )}
      <Appbar.Content title={scene.descriptor.options.title} />
    </Appbar.Header>
  );
}
