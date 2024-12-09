// components/DeckModal/index.tsx
import React from 'react';
import { Modal, View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Players, Pokemon } from '@/components/PokemonTCGGame/types';
import DeckPokemonCard from '@/components/DeckPokemonCard';

interface DeckModalProps {
 visible: boolean;
 currentPlayerDeck: keyof Players | null;
 players: Players;
 onClose: () => void;
}

export function DeckModal({
 visible,
 currentPlayerDeck,
 players,
 onClose
}: DeckModalProps) {
 if (!currentPlayerDeck) return null;

 return (
   <Modal
     visible={visible}
     transparent
     animationType="slide"
     onRequestClose={onClose}
   >
     <View style={styles.modalContainer}>
       <View style={styles.modalContent}>
         <Text style={styles.modalTitle}>
           {currentPlayerDeck === 'player1' ? 'Player 1' : 'Player 2'}'s Deck
         </Text>

         <ScrollView style={styles.deckList}>
           {players[currentPlayerDeck].deck.map((pokemon, index) => (
             <DeckPokemonCard 
               key={`${pokemon.id}-${index}`}
               pokemon={pokemon}
             />
           ))}
         </ScrollView>

         <TouchableOpacity
           style={styles.closeButton}
           onPress={onClose}
         >
           <Text style={styles.closeButtonText}>Close</Text>
         </TouchableOpacity>
       </View>
     </View>
   </Modal>
 );
}

const styles = StyleSheet.create({
 modalContainer: {
   flex: 1,
   backgroundColor: 'rgba(0,0,0,0.5)',
   justifyContent: 'center',
   alignItems: 'center',
 },
 modalContent: {
   backgroundColor: '#fff',
   borderRadius: 12,
   padding: 20,
   width: '90%',
   maxHeight: '80%',
 },
 modalTitle: {
   fontSize: 20,
   fontWeight: 'bold',
   marginBottom: 16,
   color: '#333',
 },
 deckList: {
   maxHeight: 400,
 },
 closeButton: {
   backgroundColor: '#6c757d',
   padding: 12,
   borderRadius: 8,
   alignItems: 'center',
   marginTop: 16,
 },
 closeButtonText: {
   color: '#fff',
   fontWeight: 'bold',
 },
});

export default DeckModal;