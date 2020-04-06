import React from 'react';
import {StyleSheet} from 'react-native';
import {Caption} from 'react-native-paper';

export default function(props) {
  return <Caption {...props} style={[styles.caption, props.style]} />;
}

const styles = StyleSheet.create({
  caption: {
    fontSize: 14,
  },
});
