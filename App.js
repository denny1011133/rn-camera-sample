import React from 'react';
import { StyleSheet, SafeAreaView, StatusBar } from 'react-native';

import TakePic from './TakePic';
import ImagePicker from './ImagePicker';
import CustomCamera from './CustomCamera';
const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <CustomCamera />
      {/* <TakePic /> */}
      {/* <ImagePicker /> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
});

export default App;
