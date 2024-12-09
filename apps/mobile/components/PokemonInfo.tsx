import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Pokemon, StatusEffect } from "@/components/PokemonTCGGame/types";
import { StatusIcons } from "@/components/PokemonTCGGame/types"

interface PokemonInfoProps {
  pokemon: Pokemon;
}

export function PokemonInfo({ pokemon }: PokemonInfoProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.name}>
        {pokemon.name}
      </Text>
      <Text style={styles.hpText}>
        HP: {pokemon.currentHp}/{pokemon.hp}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#FF1C1C',
  },
  hpText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 16,
    color: '#FF1C1C',
  },
  statusIcon: {
    fontSize: 20,
    marginLeft: 5,
  }
});

export default PokemonInfo;