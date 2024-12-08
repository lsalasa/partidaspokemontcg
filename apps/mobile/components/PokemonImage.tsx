import React from "react";
import { View, Image, StyleSheet } from "react-native";

interface PokemonImageProps {
  imageUrl: string;
}

export function PokemonImage({ imageUrl }: PokemonImageProps) {
  return (
    <View style={styles.imageContainer}>
      <Image 
        source={{ uri: imageUrl }} 
        style={styles.image}
        resizeMode="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  image: {
    width: 120,
    height: 160,
    borderRadius: 8,
  },
});

export default PokemonImage;