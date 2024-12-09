import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Players, Pokemon } from "@/components/PokemonTCGGame/types";
import BenchPokemonCard from "@/components/BenchPokemonCard";
import AddBenchButton from "@/components/AddBenchButton";

interface BenchSectionProps {
  playerId: keyof Players;
  player: {
    bench: Pokemon[];
  };
  mustChoose: boolean;
  onSelectPlayer: (playerId: keyof Players) => void;
  onSelectBenchPokemon: (playerId: keyof Players, pokemon: Pokemon, mustChoose: boolean) => void;
}

export function BenchSection({
  playerId,
  player,
  mustChoose,
  onSelectPlayer,
  onSelectBenchPokemon,
}: BenchSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleExpansion = () => {
    setIsExpanded((prevState) => !prevState);
  };

  return (
    <View style={[styles.benchSection, !isExpanded && styles.collapsedBenchSection]}>
      <View style={styles.benchHeader}>
        <Text style={styles.benchTitle}>Bench:</Text>
        <TouchableOpacity onPress={toggleExpansion}>
          <Ionicons
            name={isExpanded ? "chevron-up" : "chevron-down"}
            size={24}
            color="#333"
            style={styles.collapseIcon}
          />
        </TouchableOpacity>
      </View>
      {isExpanded && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.benchScrollView}>
          {player.bench.map((benchPokemon, index) => (
            <BenchPokemonCard
              key={index}
              pokemon={benchPokemon}
              onPress={() => onSelectBenchPokemon(playerId, benchPokemon, mustChoose)}
            />
          ))}
        </ScrollView>
      )}
      {isExpanded && player.bench.length < 5 && (
        <AddBenchButton onPress={() => onSelectPlayer(playerId)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  benchSection: {
    marginTop: 16,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    padding: 10,
  },
  collapsedBenchSection: {
    padding: 10,
  },
  benchHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  benchTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  benchScrollView: {
    flexGrow: 0,
    marginBottom: 10,
  },
  collapseIcon: {
    padding: 4,
  },
});

export default BenchSection;