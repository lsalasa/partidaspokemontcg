import React from 'react';
import {Image, StyleSheet} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stretch: {
    width: 350,
    height: 200,
    resizeMode: 'stretch',
  }
});

const TitleImage = () => (
    <SafeAreaView style={styles.container}>
      <Image
        style={styles.stretch}
        source={require('@/assets/images/Pokemon-logo.png')}
      />
    </SafeAreaView>
);

export default TitleImage;