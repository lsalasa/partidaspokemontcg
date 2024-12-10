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
          {playerId === 'player1' ? 'Rival' : 'You'}
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
      },
      playerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#2f3ca1', // Pokémon red text
      },
      deckButton: {
        backgroundColor: '#000000',
        padding: 4,
        borderRadius: 6,
      },
      deckButtonText: {
        color: '#ffff',
        fontWeight: 'bold',
        fontSize: 14,
      }
  });

  export default PlayerHeader;  