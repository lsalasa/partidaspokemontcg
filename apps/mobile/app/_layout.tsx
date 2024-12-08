import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import PokemonTCGGame from '@/components/PokemonTCGGame';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ParallaxScrollView headerBackgroundColor={{ light: '#1A1A1A', dark: '#1A1A1A' }}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.gameContainer}>
          <PokemonTCGGame />
        </View>
      </SafeAreaView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  gameContainer: {
    flex: 1,
    paddingVertical: 20,
  }
});