// components/PokemonTCGGame/index.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, StyleSheet, Image, SafeAreaView } from 'react-native';
import * as FileSystem from 'expo-file-system';
import type { Pokemon, Player, Players, LogEntry, StatusEffect, PokemonCard } from './types';
import PokemonSearch from './PokemonSearch';

const formatDate = (date: Date): string => {
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
};

const PokemonTCGGame: React.FC = () => {
  // Estados principales
  const [players, setPlayers] = useState<Players>({
    player1: { 
      activePokemon: null, 
      bench: [],
      deck: []
    },
    player2: { 
      activePokemon: null, 
      bench: [],
      deck: []
    }
  });
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<keyof Players | null>(null);
  const [showDeckModal, setShowDeckModal] = useState(false);
  const [currentPlayerDeck, setCurrentPlayerDeck] = useState<keyof Players | null>(null);

  // Manejo de logs
  const saveLog = async (action: string) => {
    const timestamp = formatDate(new Date());
    const logEntry = `${timestamp},${action}\n`;
    
    try {
      const filePath = `${FileSystem.documentDirectory}pokemon_tcg_logs.csv`;
      const existingContent = await FileSystem.readAsStringAsync(filePath).catch(() => '');
      await FileSystem.writeAsStringAsync(filePath, existingContent + logEntry);
      setLogs(prevLogs => [...prevLogs, { timestamp, action }]);
    } catch (error) {
      console.error('Error saving log:', error);
    }
  };

  // Manejo de selección de Pokémon
  const handleSelectPokemon = (card: PokemonCard) => {
    if (!selectedPlayer) return;

    const newPokemon: Pokemon = {
      ...card,
      currentHp: card.hp,
      status: []
    };

    setPlayers(prev => ({
      ...prev,
      [selectedPlayer]: {
        ...prev[selectedPlayer],
        activePokemon: newPokemon,
        deck: [...prev[selectedPlayer].deck, newPokemon]
      }
    }));

    saveLog(`${selectedPlayer} selected ${card.name}`);
    setSelectedPlayer(null);
  };

  // Modificación de HP
  const modifyHP = (playerId: keyof Players, amount: number) => {
    setPlayers(prev => {
      const player = prev[playerId];
      if (!player.activePokemon) return prev;

      const newHp = Math.max(0, player.activePokemon.currentHp + amount);
      
      // Si el HP llega a 0, marcar como derrotado
      if (newHp === 0) {
        saveLog(`${player.activePokemon.name} has fainted`);
      }

      return {
        ...prev,
        [playerId]: {
          ...player,
          activePokemon: {
            ...player.activePokemon,
            currentHp: newHp
          }
        }
      };
    });

    saveLog(`${playerId}'s Pokemon HP changed by ${amount}`);
  };

  // Manejo de estados alterados
  const toggleStatus = (playerId: keyof Players, status: StatusEffect) => {
    setPlayers(prev => {
      const player = prev[playerId];
      if (!player.activePokemon) return prev;

      const hasStatus = player.activePokemon.status.includes(status);
      const newStatus = hasStatus
        ? player.activePokemon.status.filter(s => s !== status)
        : [...player.activePokemon.status, status];

      return {
        ...prev,
        [playerId]: {
          ...player,
          activePokemon: {
            ...player.activePokemon,
            status: newStatus
          }
        }
      };
    });

    saveLog(`${playerId}'s Pokemon ${status} status toggled`);
  };

  // Renderizado de la sección del jugador
  const renderPlayerSection = (playerId: keyof Players) => {
    const player = players[playerId];
    
    return (
      <View style={styles.playerSection}>
        <View style={styles.headerSection}>
          <Text style={styles.playerTitle}>
            {playerId === 'player1' ? 'Player 1' : 'Player 2'}
          </Text>
          <TouchableOpacity
            style={styles.deckButton}
            onPress={() => {
              setCurrentPlayerDeck(playerId);
              setShowDeckModal(true);
            }}
          >
            <Text style={styles.deckButtonText}>View Deck</Text>
          </TouchableOpacity>
        </View>
        
        {!player.activePokemon ? (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setSelectedPlayer(playerId)}
          >
            <Text style={styles.addButtonText}>Add Pokémon</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.pokemonCard}>
            <Text style={styles.pokemonName}>
              {player.activePokemon.name}
            </Text>
            <Text style={styles.hpText}>
              HP: {player.activePokemon.currentHp}/{player.activePokemon.hp}
            </Text>
            
            <View style={styles.controls}>
              <TouchableOpacity
                style={[styles.button, styles.damageButton]}
                onPress={() => modifyHP(playerId, -10)}
              >
                <Text style={styles.buttonText}>-10 HP</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.healButton]}
                onPress={() => modifyHP(playerId, 10)}
              >
                <Text style={styles.buttonText}>+10 HP</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.statusSection}>
              <Text style={styles.statusTitle}>Status Effects:</Text>
              <View style={styles.statusButtons}>
                {(['confused', 'paralyzed', 'burned', 'poisoned', 'asleep'] as StatusEffect[]).map((status) => {
                  const hasStatus = player.activePokemon?.status.includes(status) ?? false;
                  return (
                    <TouchableOpacity
                      key={status}
                      style={[
                        styles.statusButton,
                        hasStatus && styles.statusActive
                      ]}
                      onPress={() => toggleStatus(playerId, status)}
                    >
                      <Text style={styles.statusButtonText}>
                        {status}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>
        )}
      </View>
    );
  };

  // Modal del Deck
  const renderDeckModal = () => (
    <Modal
      visible={showDeckModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowDeckModal(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            {currentPlayerDeck === 'player1' ? 'Player 1' : 'Player 2'}'s Deck
          </Text>
          <ScrollView style={styles.deckList}>
            {currentPlayerDeck && players[currentPlayerDeck].deck.map((pokemon, index) => (
              <View key={index} style={styles.deckItem}>
                <Text style={styles.deckPokemonName}>{pokemon.name}</Text>
                <Text style={styles.deckPokemonHP}>
                  HP: {pokemon.currentHp}/{pokemon.hp}
                </Text>
              </View>
            ))}
          </ScrollView>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowDeckModal(false)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {renderPlayerSection('player1')}
        
        {selectedPlayer && (
          <View style={styles.searchSection}>
            <PokemonSearch onSelectPokemon={handleSelectPokemon} />
          </View>
        )}
        
        {renderPlayerSection('player2')}
        
        <View style={styles.logsSection}>
          <Text style={styles.logsTitle}>Battle Log</Text>
          <ScrollView style={styles.logs}>
            {logs.map((log, index) => (
              <Text key={index} style={styles.logEntry}>
                {log.timestamp}: {log.action}
              </Text>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
      
      {renderDeckModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  playerSection: {
    padding: 16,
    backgroundColor: '#fff',
    margin: 8,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  playerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  pokemonCard: {
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  pokemonName: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  hpText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 16,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  damageButton: {
    backgroundColor: '#dc3545',
  },
  healButton: {
    backgroundColor: '#28a745',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  statusSection: {
    marginTop: 16,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  statusButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  statusButton: {
    backgroundColor: '#e9ecef',
    padding: 8,
    borderRadius: 16,
    margin: 4,
  },
  statusActive: {
    backgroundColor: '#007bff',
  },
  statusButtonText: {
    fontSize: 12,
  },
  addButton: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  searchSection: {
    padding: 16,
  },
  deckButton: {
    backgroundColor: '#6c757d',
    padding: 8,
    borderRadius: 6,
  },
  deckButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  deckList: {
    maxHeight: 400,
  },
  deckItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
  },
  deckPokemonName: {
    fontSize: 16,
    fontWeight: '500',
  },
  deckPokemonHP: {
    fontSize: 14,
    color: '#6c757d',
  },
  closeButton: {
    backgroundColor: '#6c757d',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  logsSection: {
    margin: 8,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  logsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  logs: {
    maxHeight: 200,
  },
  logEntry: {
    fontSize: 12,
    color: '#6c757d',
    marginBottom: 4,
  },
});

export default PokemonTCGGame;