import { PokemonCard } from "./types";

const API_BASE_URL = 'https://api.pokemontcg.io/v2';

export const searchPokemonCards = async (query: string): Promise<PokemonCard[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/cards?q=name:${query}*`);
    const data = await response.json();
    
    return data.data.map((card: any) => ({
      id: card.id,
      name: card.name,
      hp: parseInt(card.hp || '0'),
      imageUrl: card.images.small,
      types: card.types,
    }));
  } catch (error) {
    console.error('Error fetching Pokemon cards:', error);
    return [];
  }
};