import React, { createContext, useState } from 'react';
import { Pokemon, StatusEffect } from '@/components/PokemonTCGGame/types';

interface StatusEffectsContextType {
  toggleStatus: (pokemon: Pokemon, status: StatusEffect) => void;
  getPokemonStatuses: (pokemon: Pokemon) => StatusEffect[];
}

export const StatusEffectsContext = createContext<StatusEffectsContextType | undefined>(undefined);

export function StatusEffectsProvider({ children }: { children: React.ReactNode }) {
  const [statusEffects, setStatusEffects] = useState<Map<string, StatusEffect[]>>(new Map());

  const toggleStatus = (pokemon: Pokemon, status: StatusEffect) => {
    setStatusEffects(prev => {
      const newMap = new Map(prev);
      const currentStatuses = newMap.get(pokemon.id) || [];
      const hasStatus = currentStatuses.includes(status);

      newMap.set(pokemon.id, hasStatus 
        ? currentStatuses.filter(s => s !== status)
        : [...currentStatuses, status]
      );

      return newMap;
    });
  };

  const getPokemonStatuses = (pokemon: Pokemon): StatusEffect[] => {
    return statusEffects.get(pokemon.id) || [];
  };

  return (
    <StatusEffectsContext.Provider value={{ toggleStatus, getPokemonStatuses }}>
      {children}
    </StatusEffectsContext.Provider>
  );
}