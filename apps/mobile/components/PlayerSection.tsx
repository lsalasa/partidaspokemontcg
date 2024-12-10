// PlayerSection.tsx
import React from "react";
import { View, StyleSheet } from "react-native";
import { Player, Players, Pokemon } from "@/components/PokemonTCGGame/types";
import { PlayerHeader } from "@/components/PlayerHeader";
import ActivePokemon from "@/components/ActivePokemon";
import MustChooseAlert from "@/components/MustChooseAlert";
import BenchSection from "@/components/BenchSection";

interface PlayerSectionProps {
  playerId: keyof Players;
  player: Player;
  mustChoose: boolean;
  onSelectPlayer: (playerId: keyof Players) => void;
  onShowDeck: (playerId: keyof Players) => void;
  onModifyHP: (playerId: keyof Players, amount: number) => void;
  onSelectBenchPokemon: (playerId: keyof Players, pokemon: Pokemon, mustChoose: boolean) => void;
  onPlayerAction: (action: string) => void;
}

export function PlayerSection({
  playerId,
  player,
  mustChoose,
  onSelectPlayer,
  onShowDeck,
  onModifyHP,
  onSelectBenchPokemon,
  onPlayerAction, 
}: PlayerSectionProps) {
  function handleSelectBenchPokemon(
    playerId: keyof Players,
    pokemon: Pokemon,
    mustChoose: boolean
  ): void {
    // Implement the function
  }

  return (
    <View style={styles.playerSection}>
      <PlayerHeader playerId={playerId} onShowDeck={() => onShowDeck(playerId)} />

      {mustChoose && <MustChooseAlert />}

      {playerId === 'player2' ? (
        <>
          <ActivePokemon
            playerId={playerId}
            pokemon={player.activePokemon}
            onAddPokemon={() => onSelectPlayer(playerId)}
            onModifyHP={onModifyHP} // Pass through the prop
            onPlayerAction={onPlayerAction}
          />
          <BenchSection
            playerId={playerId}
            player={player}
            mustChoose={mustChoose}
            onSelectPlayer={onSelectPlayer}
            onSelectBenchPokemon={onSelectBenchPokemon}
          />
        </>
      ) : (
        <>
          <BenchSection
            playerId={playerId}
            player={player}
            mustChoose={mustChoose}
            onSelectPlayer={onSelectPlayer}
            onSelectBenchPokemon={onSelectBenchPokemon}
          />
          <ActivePokemon
            playerId={playerId}
            pokemon={player.activePokemon}
            onAddPokemon={() => onSelectPlayer(playerId)}
            onModifyHP={onModifyHP} // Pass through the prop
            onPlayerAction={onPlayerAction}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  playerSection: {
    flex:1,
    gap: 12,
    padding: 16,
    backgroundColor: '#FFDE00',
    margin: 8,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#3b4cca',
    shadowColor: '#2f3ca1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
});

export default PlayerSection;