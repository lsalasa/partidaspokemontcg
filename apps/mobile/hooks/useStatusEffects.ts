// hooks/useStatusEffects.ts
import { useContext } from 'react';
import { StatusEffectsContext } from '@/contexts/StatusEffectsContext';
import { Pokemon, StatusEffect } from '@/components/PokemonTCGGame/types';

export function useStatusEffects() {
  const context = useContext(StatusEffectsContext);
  if (!context) {
    throw new Error('useStatusEffects must be used within a StatusEffectsProvider');
  }
  return context;
}