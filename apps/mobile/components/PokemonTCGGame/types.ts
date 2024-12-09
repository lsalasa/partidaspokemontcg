// components/PokemonTCGGame/types.ts

export interface Pokemon extends PokemonCard {
  currentHp: number;
  status: StatusEffect[];
}

export interface Players {
  player1: Player;
  player2: Player;
}

export type StatusEffect = 'normal' | 'confused' | 'paralyzed' | 'burned' | 'poisoned' | 'asleep';

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
  attacks?: IAttack[];
  rarity: string;
}

export interface IAttack {
  convertedEnergyCost: number;
  cost: string[];
  damage: string;
  name: string;
  text: string;
}

export interface Player {
  activePokemon: Pokemon | null;
  active: boolean | null;
  hand: Pokemon[];
  bench: Pokemon[];
  deck: Pokemon[];

}

export const StatusIcons: {[key in StatusEffect]: string} = {
  normal: '',
  confused: '😵',
  paralyzed: '⚡',
  burned: '🔥',
  poisoned: '☠️',
  asleep: '😴',
};