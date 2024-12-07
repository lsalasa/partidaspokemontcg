// components/PokemonTCGGame/index.tsx
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, StyleSheet, Image, SafeAreaView, FlatList, Alert, Dimensions } from 'react-native';
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
  const [mustChoosePokemon, setMustChoosePokemon] = useState<keyof Players | null>(null);
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

    setPlayers(prev => {
      const player = prev[selectedPlayer];
      
      // If no active Pokémon, make this the active Pokémon
      if (!player.activePokemon) {
        return {
          ...prev,
          [selectedPlayer]: {
            ...player,
            activePokemon: newPokemon,
            deck: [...player.deck, newPokemon]
          }
        };
      }
      
      // If bench is not full (max 5 Pokémon), add to bench
      if (player.bench.length < 5) {
        return {
          ...prev,
          [selectedPlayer]: {
            ...player,
            bench: [...player.bench, newPokemon],
            deck: [...player.deck, newPokemon]
          }
        };
      }
      
      return prev;
    });

    saveLog(`${selectedPlayer} added ${card.name} to ${!players[selectedPlayer].activePokemon ? 'active' : 'bench'}`);
    setSelectedPlayer(null);
  };

  // Modificación de HP
  const modifyHP = (playerId: keyof Players, amount: number) => {
    setPlayers(prev => {
      const player = prev[playerId];
      if (!player.activePokemon) return prev;

      const currentHP = player.activePokemon.currentHp;
      const newHp = Math.min(
        player.activePokemon.hp, // No exceder el HP máximo
        Math.max(0, currentHP + amount) // No bajar de 0
      );
      
      // Si el HP llega a 0, marcar como derrotado
      if (newHp === 0) {
        saveLog(`${player.activePokemon.name} has fainted`);
        
        // Si no hay Pokémon en banca, el juego podría terminar aquí
        if (player.bench.length === 0) {
          Alert.alert('Game Over', `${playerId} has no more Pokémon!`);
          return prev;
        }

        // Preparar para que el jugador elija un nuevo Pokémon activo
        setMustChoosePokemon(playerId);

        // Eliminar el Pokémon derrotado del deck y de la lista de Pokémon
        return {
          ...prev,
          [playerId]: {
            ...player,
            activePokemon: null,
            deck: player.deck.filter(p => p !== player.activePokemon)
          }
        };
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
  const renderLogsSection = () => {
    const logsScrollViewRef = useRef<ScrollView>(null);
  
    useEffect(() => {
      // Scroll to bottom whenever logs change
      logsScrollViewRef.current?.scrollToEnd({ animated: true });
    }, [logs]);
  
    return (
      <View style={styles.logsSection}>
        <Text style={styles.logsTitle}>Battle Log</Text>
        <ScrollView 
          ref={logsScrollViewRef}
          style={styles.logs}
          persistentScrollbar={true}
        >
          {logs.map((log, index) => (
            <Text key={index} style={styles.logEntry}>
              {log.timestamp}: {log.action}
            </Text>
          ))}
        </ScrollView>
      </View>
    );
  };
  // Renderizado de la sección del jugador
  const renderPlayerSection = (playerId: keyof Players) => {
    const player = players[playerId];
    const mustChoose = mustChoosePokemon === playerId;
    
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
        {mustChoose && (
          <View style={styles.mustChooseSection}>
            <Text style={styles.mustChooseText}>
              Choose a new Active Pokémon
            </Text>
          </View>
        )}
        {/* For player 2, show active Pokemon first, then bench */}
      {playerId === 'player2' && (
        <>
          {renderActivePokemonSection(playerId, player)}
          {renderBenchSection(playerId, player, mustChoose)}
        </>
      )}
      
      {/* For player 1, show bench first, then active Pokemon */}
      {playerId === 'player1' && (
        <>
          {renderBenchSection(playerId, player, mustChoose)}
          {renderActivePokemonSection(playerId, player)}
        </>
      )}
    </View>
  );
  };
  const renderActivePokemonSection = (playerId: keyof Players, player: Player) => {
    return !player.activePokemon ? (
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
        <View style={styles.hpBarContainer}>
          <View 
            style={[
              styles.hpBar, 
              { 
                width: `${(player.activePokemon.currentHp / player.activePokemon.hp) * 100}%`,
                backgroundColor: player.activePokemon.currentHp / player.activePokemon.hp > 0.5 
                  ? '#4CAF50'  // Green when HP is high
                  : player.activePokemon.currentHp / player.activePokemon.hp > 0.2 
                    ? '#FFC107'  // Yellow when HP is medium
                    : '#F44336'  // Red when HP is low
              }
            ]}
          />
        </View>
        <View style={styles.imageContainer}>
        <Image 
          source={{ uri: player.activePokemon.imageUrl }} 
          style={searchStyles.cardImage}
        />
      </View>
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
    );
  };
  const renderBenchSection = (playerId: keyof Players, player: Player, mustChoose: boolean) => {
    return player.bench.length >= 0 ? (
      <View style={styles.benchSection}>
        <Text style={styles.benchTitle}>Bench:</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.benchScrollView}
        >
          {player.bench.map((benchPokemon, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.benchPokemonCard}
              onPress={() => {
                if (mustChoose) {
                  setPlayers(prev => ({
                    ...prev,
                    [playerId]: {
                      ...prev[playerId],
                      activePokemon: benchPokemon,
                      bench: prev[playerId].bench.filter(p => p !== benchPokemon)
                    }
                  }));
                  setMustChoosePokemon(null);
                  saveLog(`${playerId} selected new active Pokemon: ${benchPokemon.name}`);
                  return;
                }
                setPlayers(prev => {
                  const currentActive = prev[playerId].activePokemon;
                  return {
                    ...prev,
                    [playerId]: {
                      ...prev[playerId],
                      activePokemon: benchPokemon,
                      bench: currentActive 
                        ? prev[playerId].bench.map(p => 
                            p === benchPokemon ? currentActive : p
                          )
                        : prev[playerId].bench.filter(p => p !== benchPokemon)
                    }
                  };
                });
                saveLog(`${playerId} switched to ${benchPokemon.name}`);
              }}
            >
              <Image 
                source={{ uri: benchPokemon.imageUrl }} 
                style={styles.benchPokemonImage}
              />
              <Text style={styles.benchPokemonName}>{benchPokemon.name}</Text>
              <Text style={styles.benchPokemonHP}>
                HP: {benchPokemon.currentHp}/{benchPokemon.hp}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        {player.bench.length < 5 && (
          <TouchableOpacity
            style={styles.addBenchButton}
            onPress={() => setSelectedPlayer(playerId)}
          >
            <Text style={styles.addBenchButtonText}>+ Add Bench Pokémon</Text>
          </TouchableOpacity>
        )}
      </View>
    ) : null;
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
        <View style={{ padding: 10, backgroundColor: '#FFFFFF', margin: 10, borderRadius: 15 }}>
          <PokemonSearch onSelectPokemon={handleSelectPokemon} />
        </View>
      )}
        
        {renderPlayerSection('player2')}
        
        {renderLogsSection()}
      </ScrollView>
      
      {renderDeckModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FF1C1C', // Pokémon red background
    paddingTop: 20,
    marginBottom: -52,
    marginTop: -30,
    marginLeft: -32,
    marginRight: -32,
  },
  imageContainer: {
    alignItems: 'center', // Centra horizontalmente
    marginBottom: 16, // Espacio debajo de la imagen
  },
  benchSection: {
    marginTop: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 10,
  },
  benchTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  benchScrollView: {
    flexGrow: 0,
  },
  benchPokemonCard: {
    width: 100,
    marginRight: 10,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
  },
  mustChooseSection: {
    backgroundColor: '#fff3cd',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  mustChooseText: {
    color: '#856404',
    fontSize: 16,
    fontWeight: 'bold',
  },
  hpBarContainer: {
    height: 20,
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    overflow: 'hidden',
    marginHorizontal: 16,
    marginBottom: 10,
  },
  benchPokemonImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginBottom: 5,
  },
  benchPokemonName: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 2,
  },
  benchPokemonHP: {
    fontSize: 10,
    color: '#6c757d',
  },
  addBenchButton: {
    marginTop: 10,
    backgroundColor: '#007bff',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  addBenchButtonText: {
    color: '#fff',
    fontSize: 12,
  },
  hpBar: {
    height: '100%',
    backgroundColor: '#4CAF50', // Green gradient for health
  },
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
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
  playerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF1C1C', // Pokémon red text
  },
  pokemonCard: {
    padding: 16,
    backgroundColor: '#F0F0F0', // Light gray background
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#000000',
  },
  pokemonName: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#FF1C1C', 
  },
  hpText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 16,
    color: '#FF1C1C', 
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
  attacksSection: {
    marginTop: 15,
    width: '100%',
  },
  attacksTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  attacksList: {
    gap: 10,
  },
  attackItem: {
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 8,
  },
  attackHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  attackName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  energyCost: {
    flexDirection: 'row',
    gap: 5,
  },
  energyIcon: {
    fontSize: 14,
  },
  attackDamage: {
    fontSize: 14,
    color: '#666',
  },
  attackDescription: {
    fontSize: 14,
    marginTop: 5,
    color: '#444',
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
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 15,
    maxHeight: Dimensions.get('window').height * 0.4,
  },
  logsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  logs: {
    maxHeight: Dimensions.get('window').height * 0.3,
  },
  logEntry: {
    fontSize: 12,
    color: '#333',
    marginBottom: 4,
    backgroundColor: '#F0F0F0',
    padding: 5,
    borderRadius: 4,
  },
});
const searchStyles = StyleSheet.create({
  searchContainer: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  resultsList: {
    minHeight: 180,
    maxHeight: 180,
  },
  cardContainer: {
    marginRight: 15,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 8,
    width: 120,
  },
  cardImage: {
    width: 120,
    height: 160,
    borderRadius: 8,
    marginBottom: 5,
  },
  cardName: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    color: '#333',
  },
});

export default PokemonTCGGame;