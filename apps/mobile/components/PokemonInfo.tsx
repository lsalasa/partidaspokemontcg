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
      <View style={styles.nameContainer}>
      <Text style={styles.name}>
        {pokemon.name}
      </Text>
      <View style={styles.statusContainer}>
          {pokemon.status.map((status) => (
            <View key={status} style={styles.statusIconWrapper}>
              <Text style={styles.statusIcon}>
                {StatusIcons[status]}
              </Text>
            </View>
          ))}
        </View>
      </View>
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
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#333',
  },
  hpText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 16,
    color: '#333',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIconWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusText: {
    fontSize: 12,
    color: '#666',
    textTransform: 'capitalize',
  },
  statusIcon: {
    fontSize: 20,
    marginLeft: 5,
  }
});

export default PokemonInfo;