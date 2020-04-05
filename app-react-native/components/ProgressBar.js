import React from 'react';
import {StyleSheet, View} from 'react-native';
import {ProgressBar} from 'react-native-paper';

import theme from '../config/theme';

export default function({loading}) {
  const {accent} = theme.colors;
  return (
    <View style={{zIndex: 1000}}>
      <ProgressBar indeterminate color={accent} style={styles.progressBar} visible={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  progressBar: {
    position: 'absolute',
    top: 0,
    height: 7,
  },
});
