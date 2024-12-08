import React from "react";

import { View , StyleSheet} from "react-native";
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
  }

export function PlayerSection ({   
    playerId,
    player,
    mustChoose,
    onSelectPlayer,
    onShowDeck }: PlayerSectionProps ) {

    function handleSelectBenchPokemon(playerId: keyof Players, pokemon: Pokemon, mustChoose: boolean): void {
      throw new Error("Function not implemented.");
    }

    return (
      
      <View style={styles.playerSection}>
    <PlayerHeader 
      playerId={playerId} 
      onShowDeck={() => onShowDeck(playerId)} 
    />
    
    {mustChoose && <MustChooseAlert />}
    
    {playerId === 'player2' ? (
      <>
        <ActivePokemon
          playerId={playerId}
          pokemon={player.activePokemon}
          onAddPokemon={() => onSelectPlayer(playerId)}
        />
        <BenchSection
          playerId={playerId}
          player={player}
          mustChoose={mustChoose}
          onSelectPlayer={onSelectPlayer}
          onSelectBenchPokemon={handleSelectBenchPokemon}
        />
      </>
    ) : (
      <>
        <BenchSection
          playerId={playerId}
          player={player}
          mustChoose={mustChoose}
          onSelectPlayer={onSelectPlayer}
          onSelectBenchPokemon={handleSelectBenchPokemon}
        />
        <ActivePokemon
          playerId={playerId}
          pokemon={player.activePokemon}
          onAddPokemon={() => onSelectPlayer(playerId)}
        />
      </>
    )}
  </View>
)};

const styles = StyleSheet.create({
  playerSection: {
    padding: 16,
    backgroundColor: '#FFFFFF', // White background
    margin: 8,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: '#000000', // Black border
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
})

export default PlayerSection;