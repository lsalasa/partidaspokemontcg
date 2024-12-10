// components/StatusEffects/index.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Players, Pokemon, StatusEffect } from "@/components/PokemonTCGGame/types";
import { useStatusEffects } from "@/hooks/useStatusEffects";

interface StatusEffectsProps {
  playerId: keyof Players;
  pokemon: Pokemon;
  onPlayerAction?: (action: string) => void;
}

const STATUS_EFFECTS: StatusEffect[] = [
  'confused',
  'paralyzed',
  'burned',
  'poisoned',
  'asleep'
];

export function StatusEffects({ playerId, pokemon, onPlayerAction }: StatusEffectsProps) {
  const { toggleStatus, getPokemonStatuses } = useStatusEffects();
  const currentStatuses = getPokemonStatuses(pokemon);

  const handleStatusToggle = (status: StatusEffect) => {
    toggleStatus(pokemon, status);
    if (onPlayerAction) {
      const hasStatus = currentStatuses.includes(status);
      const action = hasStatus 
        ? `${pokemon.name} is no longer ${status}`
        : `${pokemon.name} is now ${status}`;
      onPlayerAction(`${playerId}: ${action}`);
    }
  };

  return (
    <View style={styles.statusSection}>
      <Text style={styles.statusTitle}>Status Effects:</Text>
      <View style={styles.statusButtons}>
        {STATUS_EFFECTS.map((status) => {
          const hasStatus = currentStatuses.includes(status);
          return (
            <TouchableOpacity
              key={status}
              style={[
                styles.statusButton,
                hasStatus && styles.statusActive
              ]}
              onPress={() => handleStatusToggle(status)}
            >
              <Text style={[
                styles.statusButtonText,
                hasStatus && styles.statusActiveText
              ]}>
                {status}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
 statusSection: {
   marginTop: 16,
 },
 statusTitle: {
   fontSize: 16,
   fontWeight: 'bold',
   marginBottom: 8,
   color: '#333',
 },
 statusButtons: {
   flexDirection: 'row',
   flexWrap: 'wrap',
   justifyContent: 'center',
   gap: 8,
 },
 statusButton: {
   backgroundColor: '#e9ecef',
   paddingHorizontal: 12,
   paddingVertical: 6,
   borderRadius: 16,
   minWidth: 80,
   alignItems: 'center',
 },
 statusActive: {
   backgroundColor: '#007bff',
 },
 statusButtonText: {
   fontSize: 12,
   color: '#666',
   textTransform: 'capitalize',
 },
 statusActiveText: {
   color: '#fff',
 },
});

export default StatusEffects;