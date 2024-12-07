// components/PokemonTCGGame/types.ts

export interface Pokemon extends PokemonCard {
  currentHp: number;
  status: StatusEffect[];
}

export interface Players {
  player1: Player;
  player2: Player;
}

export type StatusEffect = 'confused' | 'paralyzed' | 'burned' | 'poisoned' | 'asleep';

export interface LogEntry {
  timestamp: string;
  action: string;
}

export interface PokemonCard {
  id: string;
  name: string;
  hp: number;
  imageUrl: string;
  types?: string[];
  isActive: boolean;
  isFainted: boolean;
}

export interface Player {
  activePokemon: Pokemon | null;
  bench: Pokemon[];
  deck: Pokemon[];
}