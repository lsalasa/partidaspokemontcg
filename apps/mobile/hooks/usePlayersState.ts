import { useState } from 'react';
import { Players, PokemonCard, Pokemon } from '@/components/PokemonTCGGame/types';

export function usePlayersState() {
  const [players, setPlayers] = useState<Players>({
    player1: {
      active: null,
      bench: [],
      hand: [],
      deck: [],
      activePokemon: null
    },
    player2: {
      active: null,
      bench: [],
      hand: [],
      deck: [],
      activePokemon: null
    },
  });

  const [mustChoosePokemon, setMustChoosePokemon] = useState<'player1' | 'player2' | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<'player1' | 'player2' | null>(null);

  const handleSelectPokemon = (card: PokemonCard) => {
    if (!selectedPlayer) return;

    const newPokemon = {
      ...card,
      currentHp: card.hp,
      status: [],
    };

    setPlayers(prev => {
      const player = prev[selectedPlayer];
      if (!player.activePokemon) {
        return {
          ...prev,
          [selectedPlayer]: {
            ...player,
            activePokemon: newPokemon,
            deck: [...player.deck, newPokemon],
          },
        };
      }

      if (player.bench.length < 5) {
        return {
          ...prev,
          [selectedPlayer]: {
            ...player,
            bench: [...player.bench, newPokemon],
            deck: [...player.deck, newPokemon],
          },
        };
      }

      return prev;
    });

    setSelectedPlayer(null);
  };

  return {
    players,
    mustChoosePokemon,
    selectedPlayer,
    setSelectedPlayer,
    setMustChoosePokemon,
    handleSelectPokemon,
    setPlayers,
  };
};