import React from 'react';
import { TouchableOpacity, Image, Text, StyleSheet } from 'react-native';
import { PokemonCard } from '@/components/PokemonTCGGame/types';

interface PokemonSearchCardProps {
  pokemon: PokemonCard;
  onSelect: () => void;
}

export function PokemonSearchCard({ pokemon, onSelect }: PokemonSearchCardProps) {
  return (
    <TouchableOpacity 
      style={styles.cardContainer}
      onPress={onSelect}
    >
      <Image 
        source={{ uri: pokemon.imageUrl }} 
        style={styles.cardImage}
      />
      <Text style={styles.cardName}>
        {pokemon.name}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    marginRight: 15,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 8,
    width: 120,
  },
  cardImage: {
    width: 120,
    height: 160,
    borderRadius: 8,
    marginBottom: 5,
  },
  cardName: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    color: '#333',
  },
});

export default PokemonSearchCard;