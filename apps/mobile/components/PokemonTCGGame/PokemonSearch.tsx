// components/PokemonTCGGame/PokemonSearch.tsx
import React, { useState } from 'react';
import { View, TextInput, FlatList, Image, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { searchPokemonCards } from './api';
import type { PokemonCard } from './types';

interface PokemonSearchProps {
  onSelectPokemon: (pokemon: PokemonCard) => void;
}

const PokemonSearch: React.FC<PokemonSearchProps> = ({ onSelectPokemon }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<PokemonCard[]>([]);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length > 2) {
      const results = await searchPokemonCards(query);
      setSearchResults(results);
    }
  };

  return (
    <View style={searchStyles.searchContainer}>
      <TextInput
        style={searchStyles.searchInput}
        value={searchQuery}
        onChangeText={handleSearch}
        placeholder="Search Pokémon..."
        placeholderTextColor="#666"
      />
      <FlatList
        data={searchResults}
        horizontal
        keyExtractor={(item) => item.id}
        style={searchStyles.resultsList}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={searchStyles.cardContainer}
            onPress={() => onSelectPokemon(item)}
          >
            <Image 
              source={{ uri: item.imageUrl }} 
              style={searchStyles.cardImage}
            />
            <Text style={searchStyles.cardName}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const searchStyles = StyleSheet.create({
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
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  resultsList: {
    minHeight: 180,
    maxHeight: 180,
  },
  cardContainer: {
    marginRight: 15,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 8,
    width: 120,
  },
  cardImage: {
    width: 100,
    height: 140,
    borderRadius: 8,
    marginBottom: 5,
  },
  cardName: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    color: '#333',
  }
});

export default PokemonSearch;