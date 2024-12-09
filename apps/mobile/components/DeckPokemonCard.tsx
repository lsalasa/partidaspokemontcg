// components/DeckPokemonCard/index.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Pokemon } from '@/components/PokemonTCGGame/types';

interface DeckPokemonCardProps {
  pokemon: Pokemon;
}

export function DeckPokemonCard({ pokemon }: DeckPokemonCardProps) {
  return (
    <View style={styles.deckItem}>
      <Text style={styles.pokemonName}>{pokemon.name}</Text>
      <Text style={styles.pokemonHP}>
        HP: {pokemon.currentHp}/{pokemon.hp}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  deckItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pokemonName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  pokemonHP: {
    fontSize: 14,
    color: '#6c757d',
  },
});

export default DeckPokemonCard;