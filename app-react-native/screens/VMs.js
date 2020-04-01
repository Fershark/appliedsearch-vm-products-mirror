import React from 'react';
import {View, StyleSheet} from 'react-native';
import {FAB} from 'react-native-paper';

export default function VMs({navigation}) {
  return (
    <View style={{flex: 1}}>
      <FAB style={styles.fab} small icon="plus" onPress={() => navigation.navigate('VM')} />
    </View>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
