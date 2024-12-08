import { TouchableOpacity, View,Text,StyleSheet } from "react-native";
import { Players } from "./PokemonTCGGame/types";

interface PlayerHeaderProps {
    playerId: keyof Players;
    onShowDeck: () => void;
  }

export function PlayerHeader ({playerId, onShowDeck }: PlayerHeaderProps ) {

    return (
        <View style={styles.headerSection}>
        <Text style={styles.playerTitle}>
          {playerId === 'player1' ? 'Player 1' : 'Player 2'}
        </Text>
        <TouchableOpacity
          style={styles.deckButton}
          onPress={onShowDeck}
        >
          <Text style={styles.deckButtonText}>View Deck</Text>
        </TouchableOpacity>
    </View>
    )};

const styles = StyleSheet.create({
    headerSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
      },
      playerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FF1C1C', // Pokémon red text
      },
      deckButton: {
        backgroundColor: '#6c757d',
        padding: 8,
        borderRadius: 6,
      },
      deckButtonText: {
        color: '#fff',
        fontSize: 14,
      }
  });

  export default PlayerHeader;  