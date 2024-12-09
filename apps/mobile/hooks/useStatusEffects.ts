// hooks/useStatusEffects.ts
import { useContext } from 'react';
import { StatusEffectsContext } from '@/contexts/StatusEffectsContext';
import { Pokemon, StatusEffect } from '@/components/PokemonTCGGame/types';

interface StatusEffectsHook {
  toggleStatus: (pokemon: Pokemon, status: StatusEffect) => void;
  getPokemonStatuses: (pokemon: Pokemon) => StatusEffect[];
}

export function useStatusEffects(): StatusEffectsHook {
  const context = useContext(StatusEffectsContext);
  
  if (!context) {
    throw new Error('useStatusEffects must be used within a StatusEffectsProvider');
  }

  return {
    toggleStatus: context.toggleStatus,
    getPokemonStatuses: context.getPokemonStatuses
  };
}