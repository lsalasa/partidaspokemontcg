// components/ActivePokemon/index.tsx
import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Players, Pokemon } from "@/components/PokemonTCGGame/types";
import HPBar from "@/components/HPbar";
import PokemonInfo from "@/components/PokemonInfo";
import PokemonImage from "@/components/PokemonImage";
import HPControls from "@/components/HPControls";
import StatusEffects from "@/components/StatusEffects";
import AddPokemonButton from "@/components/AddPokemonButton";

interface ActivePokemonProps {
  playerId: keyof Players;
  pokemon: Pokemon | null;
  onAddPokemon: () => void;
  onModifyHP: (playerId: keyof Players, amount: number) => void;
}

export function ActivePokemon({
  playerId,
  pokemon,
  onAddPokemon,
  onModifyHP,
}: ActivePokemonProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleExpansion = () => {
    setIsExpanded((prevState) => !prevState);
  };

  if (!pokemon) {
    return <AddPokemonButton onPress={onAddPokemon} />;
  }

  return (
    <View style={[styles.pokemonCard, !isExpanded && styles.collapsedPokemonCard]}>
      <View style={styles.header}>
        <PokemonInfo pokemon={pokemon} />
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
        <View>
          <HPBar currentHp={pokemon.currentHp} maxHp={pokemon.hp} />
          <PokemonImage imageUrl={pokemon.imageUrl} />
          <HPControls
            playerId={playerId}
            pokemon={pokemon}
            onModifyHP={(amount) => onModifyHP(playerId, amount)}
          />
          <StatusEffects playerId={playerId} pokemon={pokemon} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  pokemonCard: {
    padding: 16,
    backgroundColor: "#F0F0F0",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#000000",
  },
  collapsedPokemonCard: {
    padding: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  collapseIcon: {
    padding: 4,
  },
});

export default ActivePokemon;