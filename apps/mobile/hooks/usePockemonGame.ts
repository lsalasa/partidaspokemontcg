import { useState, useCallback } from 'react';
import type { Players, LogEntry, StatusEffect, PokemonCard } from '@/components/PokemonTCGGame/types';
import { useGameLogs } from './useGameLogs';
import { Alert } from 'react-native';

export const usePokemonGame = () => {
  const [players, setPlayers] = useState<Players>({
    player1: {
      activePokemon: null,
      bench: [],
      deck: [],
      active: null,
      hand: []
    },
    player2: {
      activePokemon: null,
      bench: [],
      deck: [],
      active: null,
      hand: []
    }
  });
  const [mustChoosePokemon, setMustChoosePokemon] = useState<keyof Players | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<keyof Players | null>(null);
  const [showDeckModal, setShowDeckModal] = useState(false);
  const [currentPlayerDeck, setCurrentPlayerDeck] = useState<keyof Players | null>(null);

  const { logs, addLog } = useGameLogs();

  const handleSelectPokemon = useCallback((card: PokemonCard) => {
    if (!selectedPlayer) return;

    const newPokemon = {
      ...card,
      currentHp: card.hp,
      statuses: []
    };

    setPlayers(prev => {
      const player = prev[selectedPlayer];
      
      if (!player.activePokemon) {
        addLog(`${selectedPlayer} added ${card.name} as active Pokemon`);
        return {
          ...prev,
          [selectedPlayer]: {
            ...player,
            activePokemon: newPokemon,
            deck: [...player.deck, newPokemon]
          }
        };
      }
      
      if (player.bench.length < 5) {
        addLog(`${selectedPlayer} added ${card.name} to bench`);
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

    setSelectedPlayer(null);
  }, [selectedPlayer, addLog]);

  const modifyHP = useCallback((playerId: keyof Players, amount: number) => {
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
            addLog(`${player.activePokemon.name} has fainted`);
          
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
    addLog(`${playerId}'s Pokemon HP changed by ${amount}`);
  }, [addLog]);

  const toggleStatus = useCallback((playerId: keyof Players, statuses: StatusEffect) => {
    setPlayers(prev => {
        const player = prev[playerId];
        if (!player.activePokemon) return prev;
  
        const hasStatus = player.activePokemon.status.includes(statuses);
        const newStatus = hasStatus
          ? player.activePokemon.status.filter(s => s !== statuses)
          : [...player.activePokemon.status, statuses];
  
        return {
          ...prev,
          [playerId]: {
            ...player,
            activePokemon: {
              ...player.activePokemon,
              statuses: newStatus
            }
          }
        };
      });
    addLog(`${playerId}'s Pokemon ${statuses} status toggled`);
  }, [addLog]);

  return {
    players,
    mustChoosePokemon,
    selectedPlayer,
    showDeckModal,
    currentPlayerDeck,
    logs,
    handleSelectPokemon,
    modifyHP,
    toggleStatus,
    setSelectedPlayer,
    setShowDeckModal,
    setCurrentPlayerDeck,
    setMustChoosePokemon
  };
};