import { Players } from '@/components/PokemonTCGGame/types';
import { useState, useCallback } from 'react';


export const usePokemonDeck = () => {
  const [showDeckModal, setShowDeckModal] = useState(false);
  const [currentPlayerDeck, setCurrentPlayerDeck] = useState<keyof Players | null>(null);

  const openDeck = useCallback((playerId: keyof Players) => {
    setCurrentPlayerDeck(playerId);
    setShowDeckModal(true);
  }, []);

  const closeDeck = useCallback(() => {
    setShowDeckModal(false);
    setCurrentPlayerDeck(null);
  }, []);

  return {
    showDeckModal,
    currentPlayerDeck,
    openDeck,
    closeDeck
  };
};