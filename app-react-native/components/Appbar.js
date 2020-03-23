import React from 'react';
import {Appbar} from 'react-native-paper';
import {useSelector} from 'react-redux';

export default function({navigation, scene, previous}) {
  const {user} = useSelector(state => state.auth);
  return (
    <Appbar.Header>
      {previous ? (
        <Appbar.BackAction onPress={() => navigation.goBack()} />
      ) : user && (
        <Appbar.Action icon="menu" onPress={() => navigation.toggleDrawer()} />
      )}
      <Appbar.Content title={scene.descriptor.options.title} />
    </Appbar.Header>
  );
}
