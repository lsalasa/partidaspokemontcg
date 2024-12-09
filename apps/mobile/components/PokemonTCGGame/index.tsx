// components/PokemonTCGGame/index.tsx
import React, { useState } from "react";
import { SafeAreaView, ScrollView, View, StyleSheet } from "react-native";
import { PlayerSection } from "@/components/PlayerSection";
import { PokemonSearch } from "@/components/PokemonSearch";
import { DeckModal } from "@/components/DeckModal";
import { BattleLog } from "@/components/BattleLog";
import { StatusEffectsProvider } from "@/contexts/StatusEffectsContext";
import { usePlayersState } from "@/hooks/usePlayersState";
import { usePokemonActions } from "@/hooks/usePokemonActions";
import { usePokemonDeck } from "@/hooks/usePokemonDeck";
import { useGameLogs } from "@/hooks/useGameLogs";

export function PokemonTCGGame() {
  const {
    players,
    mustChoosePokemon,
    selectedPlayer,
    setSelectedPlayer,
    setMustChoosePokemon,
    handleSelectPokemon,
  } = usePlayersState();

  const { handleModifyHP, handleSelectBenchPokemon } = usePokemonActions(
    setPlayers,
    setMustChoosePokemon
  );

  const { logs } = useGameLogs();
  const { showDeckModal, currentPlayerDeck, openDeck, closeDeck } = usePokemonDeck();

  return (
    <StatusEffectsProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <PlayerSection
            playerId="player1"
            player={players.player1}
            mustChoose={mustChoosePokemon === "player1"}
            onSelectPlayer={setSelectedPlayer}
            onShowDeck={openDeck}
            onModifyHP={handleModifyHP}
            onSelectBenchPokemon={handleSelectBenchPokemon}
          />

          {selectedPlayer && (
            <View style={styles.searchContainer}>
              <PokemonSearch onSelectPokemon={handleSelectPokemon} />
            </View>
          )}

          <PlayerSection
            playerId="player2"
            player={players.player2}
            mustChoose={mustChoosePokemon === "player2"}
            onSelectPlayer={setSelectedPlayer}
            onShowDeck={openDeck}
            onModifyHP={handleModifyHP}
            onSelectBenchPokemon={handleSelectBenchPokemon}
          />

          <BattleLog logs={logs} />
        </ScrollView>

        <DeckModal
          visible={showDeckModal}
          currentPlayerDeck={currentPlayerDeck}
          players={players}
          onClose={closeDeck}
        />
      </SafeAreaView>
    </StatusEffectsProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FF1C1C",
    paddingTop: 20,
    marginBottom: -52,
    marginTop: -30,
    marginLeft: -32,
    marginRight: -32,
  },
  searchContainer: {
    padding: 10,
    backgroundColor: "#FFFFFF",
    margin: 10,
    borderRadius: 15,
  },
});

export default PokemonTCGGame;
