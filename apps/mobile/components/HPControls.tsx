import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Players, Pokemon } from "@/components/PokemonTCGGame/types";

interface HPControlsProps {
    playerId: keyof Players;
    pokemon: Pokemon;
    onModifyHP: (amount: number) => void;
  }
  
export function HPControls({ playerId, pokemon, onModifyHP }: HPControlsProps) {
    return (
      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.button, styles.damageButton]}
          onPress={() => onModifyHP(-10)}
        >
          <Text style={styles.buttonText}>-10 HP</Text>
        </TouchableOpacity>
  
        <TouchableOpacity
          style={[styles.button, styles.healButton]}
          onPress={() => onModifyHP(10)}
        >
          <Text style={styles.buttonText}>+10 HP</Text>
        </TouchableOpacity>
      </View>
    );
  }

const styles = StyleSheet.create({
    controls: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: 16,
    },
    button: {
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 8,
      marginHorizontal: 4,
    },
    damageButton: {
      backgroundColor: '#dc3545',
    },
    healButton: {
      backgroundColor: '#28a745',
    },
    buttonText: {
      color: '#fff',
      fontWeight: 'bold',
    },
   });
   
export default HPControls;