import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

interface AddPokemonButtonProps {
 onPress: () => void;
}

export function AddPokemonButton({ onPress }: AddPokemonButtonProps) {
 return (
   <TouchableOpacity
     style={styles.addButton}
     onPress={onPress}
   >
     <Text style={styles.addButtonText}>Add Pokémon</Text>
   </TouchableOpacity>
 );
}

const styles = StyleSheet.create({
 addButton: {
   backgroundColor: '#007bff',
   padding: 12,
   borderRadius: 8,
   alignItems: 'center',
   justifyContent: 'center',
   margin: 16,
   elevation: 2,
   shadowColor: '#000',
   shadowOffset: { width: 0, height: 2 },
   shadowOpacity: 0.25,
   shadowRadius: 3.84,
 },
 addButtonText: {
   color: '#fff',
   fontSize: 16,
   fontWeight: 'bold',
 },
});

export default AddPokemonButton;