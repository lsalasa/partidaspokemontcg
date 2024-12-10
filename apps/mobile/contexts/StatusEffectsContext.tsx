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
    const currentStatuses = pokemon.status || [];
    const hasStatus = currentStatuses.includes(status);
    
    if (hasStatus) {
      pokemon.status = currentStatuses.filter(s => s !== status);
    } else {
      pokemon.status = [...currentStatuses, status];
    }

    setStatusEffects(prev => {
      const newMap = new Map(prev);
      newMap.set(pokemon.id, pokemon.status);
      return newMap;
    });
  };

  const getPokemonStatuses = (pokemon: Pokemon): StatusEffect[] => {
    return pokemon.status || [];
  };

  return (
    <StatusEffectsContext.Provider value={{ toggleStatus, getPokemonStatuses }}>
      {children}
    </StatusEffectsContext.Provider>
  );
}