import React, { useState } from 'react';
import { View, TextInput, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PokemonCard } from '@/components/PokemonTCGGame/types';
import PokemonSearchCard from '@/components/PokemonSearchCard';

interface PokemonSearchProps {
  onSelectPokemon: (pokemon: PokemonCard) => void;
  onCloseSearch: () => void;
}

export function PokemonSearch({ onSelectPokemon, onCloseSearch }: PokemonSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<PokemonCard[]>([]);

  const searchPokemon = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await fetch(
        `https://api.pokemontcg.io/v2/cards?q=name:${query}*&pageSize=10`
      );
      const data = await response.json();

      const formattedResults: PokemonCard[] = data.data.map((card: any) => ({
        id: card.id,
        name: card.name,
        hp: parseInt(card.hp || '100'),
        imageUrl: card.images.small,
      }));

      setSearchResults(formattedResults);
    } catch (error) {
      console.error('Error searching Pokemon:', error);
      setSearchResults([]);
    }
  };

  return (
    <View style={styles.searchContainer}>
      <View style={styles.header}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for a Pokémon..."
          value={searchQuery}
          onChangeText={(text) => {
            setSearchQuery(text);
            searchPokemon(text);
          }}
        />
        <TouchableOpacity onPress={onCloseSearch}>
          <Ionicons name="close" size={24} color="#333" style={styles.closeIcon} />
        </TouchableOpacity>
      </View>

      <FlatList
        horizontal
        data={searchResults}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PokemonSearchCard pokemon={item} onSelect={() => onSelectPokemon(item)} />
        )}
        style={styles.resultsList}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  closeIcon: {
    padding: 4,
    marginLeft: 8,
  },
  resultsList: {
    minHeight: 180,
    maxHeight: 180,
  },
});

export default PokemonSearch;