// components/ActivePokemon/index.tsx
import React from "react";
import { View, StyleSheet } from "react-native";
import { Players, Pokemon } from "@/components/PokemonTCGGame/types";
import HPBar from "@/components/HPbar";
import PokemonInfo from "@/components/PokemonInfo"
import PokemonImage from "@/components/PokemonImage";
import HPControls from "@/components/HPControls";
import StatusEffects from "@/components/StatusEffects";
import AddPokemonButton from "@/components/AddPokemonButton";

interface ActivePokemonProps {
  playerId: keyof Players;
  pokemon: Pokemon | null;
  onAddPokemon: () => void;
  onModifyHP: (playerId: keyof Players, amount: number) => void; // Add this prop
}

export function ActivePokemon({
  playerId,
  pokemon,
  onAddPokemon,
  onModifyHP
}: ActivePokemonProps) {
  if (!pokemon) {
    return <AddPokemonButton onPress={onAddPokemon} />;
  }

  return (
    <View style={styles.pokemonCard}>
      <PokemonInfo pokemon={pokemon} />
      <HPBar 
        currentHp={pokemon.currentHp} 
        maxHp={pokemon.hp} 
      />
      <PokemonImage imageUrl={pokemon.imageUrl} />
      <HPControls 
        playerId={playerId} 
        pokemon={pokemon}
        onModifyHP={(amount) => onModifyHP(playerId, amount)}
      />
      <StatusEffects 
        playerId={playerId}
        pokemon={pokemon}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  pokemonCard: {
    padding: 16,
    backgroundColor: '#F0F0F0',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#000000',
  }
});

export default ActivePokemon;