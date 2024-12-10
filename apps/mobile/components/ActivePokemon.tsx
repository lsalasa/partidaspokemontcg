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
  onPlayerAction: (action: string) => void;
}

export function ActivePokemon({
  playerId,
  pokemon,
  onAddPokemon,
  onModifyHP,
  onPlayerAction,
}: ActivePokemonProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleExpansion = () => {
    setIsExpanded((prevState) => !prevState);
  };

  if (!pokemon) {
    return <AddPokemonButton onPress={onAddPokemon} />;
  }

  return (
    <View
      style={[styles.pokemonCard, !isExpanded && styles.collapsedPokemonCard]}
    >
      <View style={styles.header}>
        <View style={styles.placeholderContainer} />
        <View style={styles.pokemonInfoContainer}>
          <PokemonInfo pokemon={pokemon} />
        </View>
        <TouchableOpacity
          onPress={toggleExpansion}
          style={styles.collapseIconContainer}
        >
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
          <StatusEffects
            playerId={playerId}
            pokemon={pokemon}
            onPlayerAction={onPlayerAction}
          />
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
    width: "100%",
  },
  pokemonInfoContainer: {
    flex: 1,
    marginRight: 10,
  },
  collapseIconContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 4,
    width: 40,
    height: 40,
  },
  collapseIcon: {
    padding: 4,
  },
  placeholderContainer: {
    width: 40,
    height: 40,
  },
});

export default ActivePokemon;
