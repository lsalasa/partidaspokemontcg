// components/BenchPokemonCard/index.tsx
import React from "react";
import { TouchableOpacity, Image, Text, StyleSheet } from "react-native";
import { Pokemon } from "@/components/PokemonTCGGame/types";

interface BenchPokemonCardProps {
  pokemon: Pokemon;
  onPress: () => void;
}

export function BenchPokemonCard({ pokemon, onPress }: BenchPokemonCardProps) {
  return (
    <TouchableOpacity 
      style={styles.benchPokemonCard}
      onPress={onPress}
    >
      <Image 
        source={{ uri: pokemon.imageUrl }} 
        style={styles.benchPokemonImage}
      />
      <Text style={styles.benchPokemonName}>
        {pokemon.name}
      </Text>
      <Text style={styles.benchPokemonHP}>
        HP: {pokemon.currentHp}/{pokemon.hp}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  benchPokemonCard: {
    width: 100,
    marginRight: 10,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  benchPokemonImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginBottom: 5,
  },
  benchPokemonName: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 2,
  },
  benchPokemonHP: {
    fontSize: 10,
    color: '#6c757d',
  },
});

export default BenchPokemonCard;