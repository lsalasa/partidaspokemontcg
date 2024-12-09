// usePokemonActions.ts
import { useCallback } from 'react';
import { Players, Pokemon } from '@/components/PokemonTCGGame/types';
import { useGameLogs } from './useGameLogs';

export const usePokemonActions = (
  players: Players,
  setPlayers: React.Dispatch<React.SetStateAction<Players>>,
  setMustChoosePokemon: (player: keyof Players | null) => void
) => {
  const { addLog } = useGameLogs();

  const handleModifyHP = useCallback(
    async (playerId: keyof Players, amount: number) => {
      setPlayers((prev) => {
        const player = prev[playerId];
        if (!player.activePokemon) return prev;

        const currentHP = player.activePokemon.currentHp;
        const newHp = Math.min(player.activePokemon.hp, Math.max(0, currentHP + amount));

        if (newHp === 0) {
          addLog(`${player.activePokemon.name} has fainted`);

          if (player.bench.length === 0) {
            alert('Game Over!');
            return prev;
          }

          setMustChoosePokemon(playerId);

          return {
            ...prev,
            [playerId]: {
              ...player,
              activePokemon: null,
              deck: player.deck.filter((p) => p !== player.activePokemon),
            },
          };
        }

        return {
          ...prev,
          [playerId]: {
            ...player,
            activePokemon: {
              ...player.activePokemon,
              currentHp: newHp,
            },
          },
        };
      });

      addLog(`${playerId}'s Pokemon HP changed by ${amount}`);
    },
    [setPlayers, setMustChoosePokemon, addLog]
  );

  const handleSelectBenchPokemon = useCallback(
    async (playerId: keyof Players, pokemon: Pokemon, mustChoose: boolean) => {
      if (mustChoose) {
        setPlayers((prev) => ({
          ...prev,
          [playerId]: {
            ...prev[playerId],
            activePokemon: pokemon,
            bench: prev[playerId].bench.filter((p) => p !== pokemon),
          },
        }));
        setMustChoosePokemon(null);
        addLog(`${playerId} selected new active Pokemon: ${pokemon.name}`);
        return;
      }

      setPlayers((prev) => {
        const currentActive = prev[playerId].activePokemon;
        return {
          ...prev,
          [playerId]: {
            ...prev[playerId],
            activePokemon: pokemon,
            bench: currentActive
              ? prev[playerId].bench.map((p) => (p === pokemon ? currentActive : p))
              : prev[playerId].bench.filter((p) => p !== pokemon),
          },
        };
      });
      addLog(`${playerId} switched to ${pokemon.name}`);
    },
    [setPlayers, setMustChoosePokemon, addLog]
  );

  return {
    handleModifyHP,
    handleSelectBenchPokemon,
  };
};