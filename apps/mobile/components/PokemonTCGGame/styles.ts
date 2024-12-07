// components/PokemonTCGGame/styles.ts
import { StyleSheet, ViewStyle, TextStyle, ImageStyle } from 'react-native';

interface Styles {
  container: ViewStyle;
  searchContainer: ViewStyle;
  searchInput: TextStyle;
  cardContainer: ViewStyle;
  cardImage: ImageStyle;
  cardName: TextStyle;
  playerSection: ViewStyle;
  playerTitle: TextStyle;
  pokemonCard: ViewStyle;
  pokemonName: TextStyle;
  hpText: TextStyle;
  controls: ViewStyle;
  button: ViewStyle;
  damageButton: ViewStyle;
  healButton: ViewStyle;
  buttonText: TextStyle;
  addButton: ViewStyle;
  addButtonText: TextStyle;
  statusSection: ViewStyle;
  statusTitle: TextStyle;
  statusButtons: ViewStyle;
  statusButton: ViewStyle;
  statusActive: ViewStyle;
  statusButtonText: TextStyle;
  logsSection: ViewStyle;
  logsTitle: TextStyle;
  logEntry: TextStyle;
}

export const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    marginBottom: 20,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },
  cardContainer: {
    marginRight: 10,
    alignItems: 'center',
  },
  cardImage: {
    width: 100,
    height: 140,
    borderRadius: 8,
  },
  cardName: {
    marginTop: 4,
    fontSize: 12,
  },
  playerSection: {
    marginBottom: 20,
  },
  playerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  pokemonCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  pokemonName: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  hpText: {
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 8,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 8,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  damageButton: {
    backgroundColor: '#ff4444',
  },
  healButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  statusSection: {
    marginTop: 12,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  statusButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statusButton: {
    backgroundColor: '#e0e0e0',
    padding: 8,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  statusActive: {
    backgroundColor: '#9c27b0',
  },
  statusButtonText: {
    fontSize: 12,
    color: '#000',
  },
  logsSection: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  logsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  logEntry: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
});