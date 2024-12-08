// components/AddBenchButton/index.tsx
import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

interface AddBenchButtonProps {
  onPress: () => void;
}

export function AddBenchButton({ onPress }: AddBenchButtonProps) {
  return (
    <TouchableOpacity
      style={styles.addBenchButton}
      onPress={onPress}
    >
      <Text style={styles.addBenchButtonText}>+ Add Bench Pokémon</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  addBenchButton: {
    backgroundColor: '#007bff',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  addBenchButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
});

export default AddBenchButton;