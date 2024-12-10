// components/PokemonTCGGame/index.tsx
import React, { useEffect, useState } from "react";
import { SafeAreaView, ScrollView, View, StyleSheet, TouchableOpacity ,Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { PlayerSection } from "@/components/PlayerSection";
import { PokemonSearch } from "@/components/PokemonSearch";
import { DeckModal } from "@/components/DeckModal";
import { BattleLogModal } from "@/components/BattleLogModal";
import { StatusEffectsProvider } from "@/contexts/StatusEffectsContext";
import { usePlayersState } from "@/hooks/usePlayersState";
import { usePokemonActions } from "@/hooks/usePokemonActions";
import { usePokemonDeck } from "@/hooks/usePokemonDeck";
import { useGameLogs } from "@/hooks/useGameLogs";
import TitleImage from "../TitleImage";

export function PokemonTCGGame() {
  const {
    players,
    mustChoosePokemon,
    selectedPlayer,
    setSelectedPlayer,
    setMustChoosePokemon,
    handleSelectPokemon,
    setPlayers,
  } = usePlayersState();

  const [showPokemonSearch, setShowPokemonSearch] = useState(false);

  const handleCloseSearch = () => {
    setShowPokemonSearch(false);
    setSelectedPlayer(null); 
  };
  
  const { logs, addLog, getLogs, clearLogs } = useGameLogs();
  
  const { handleModifyHP, handleSelectBenchPokemon } = usePokemonActions(
    players,
    setPlayers,
    setMustChoosePokemon,
    addLog
  );

  
  const { showDeckModal, currentPlayerDeck, openDeck, closeDeck } = usePokemonDeck();
  const [showBattleLogModal, setShowBattleLogModal] = useState(false);

  const toggleBattleLogModal = () => {
    setShowBattleLogModal(!showBattleLogModal);
  };

  useEffect(() => {
    getLogs();
  }, [getLogs]);

  return (
    <StatusEffectsProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <TitleImage></TitleImage>
          <View  style={styles.playerSectionContainer}>
            <PlayerSection
              playerId="player1"
              player={players.player1}
              mustChoose={mustChoosePokemon === "player1"}
              onSelectPlayer={setSelectedPlayer}
              onShowDeck={openDeck}
              onModifyHP={handleModifyHP}
              onSelectBenchPokemon={handleSelectBenchPokemon}
              onPlayerAction={addLog}
            />

            {selectedPlayer && (
              <View style={styles.searchContainer}>
                <PokemonSearch 
                onSelectPokemon={handleSelectPokemon}
                onCloseSearch={handleCloseSearch} />
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
              onPlayerAction={addLog}
            />
          </View >

          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity onPress={toggleBattleLogModal}>
              <Ionicons name="list-outline" size={24} color="#333" />
            </TouchableOpacity>
          </View>
        </ScrollView>

        <DeckModal
          visible={showDeckModal}
          currentPlayerDeck={currentPlayerDeck}
          players={players}
          onClose={closeDeck}
        />
      </SafeAreaView>

      <BattleLogModal
          visible={showBattleLogModal}
          logs={logs}
          onClose={toggleBattleLogModal}
        />
    </StatusEffectsProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FF1C1C",
    marginBottom: -52,
    marginTop: -30,
    marginLeft: -32,
    marginRight: -32,
  },
  playerSectionContainer: {
    flex: 1,
    marginHorizontal:12,
    marginVertical: 88,
  },
  searchContainer: {
    padding: 10,
    backgroundColor: "#FFFFFF",
    margin: 10,
    borderRadius: 15,
  },
  actionButtonsContainer: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#fff",
    borderRadius: 25,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default PokemonTCGGame;