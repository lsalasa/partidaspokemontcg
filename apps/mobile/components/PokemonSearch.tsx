import React, { useState } from 'react';
import { View, TextInput, FlatList, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PokemonCard } from '@/components/PokemonTCGGame/types';
import PokemonSearchCard from '@/components/PokemonSearchCard';
import Checkbox from 'expo-checkbox'; // Necesitarás instalar este paquete


interface PokemonSearchProps {
  onSelectPokemon: (pokemon: PokemonCard) => void;
  onCloseSearch: () => void;
}

export function PokemonSearch({ onSelectPokemon, onCloseSearch }: PokemonSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<PokemonCard[]>([]);
  const [searchById, setSearchById] = useState(false);

  const searchPokemon = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const searchParam = searchById ? `id:${query}*` : `name:${query}*`;
      const response = await fetch(
        `https://api.pokemontcg.io/v2/cards?q=${searchParam}&pageSize=10`
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
          placeholder={searchById ? "Buscar por ID..." : "Buscar por nombre..."}
          value={searchQuery}
          onChangeText={(text) => {
            setSearchQuery(text);
            searchPokemon(text);
          }}
        />
        <TouchableOpacity onPress={onCloseSearch} style={styles.closeIcon}>
          <Ionicons name="close" size={24} color="#333"/>
        </TouchableOpacity>
      </View>
          <View style={styles.checkboxContainer}>
            <Checkbox
              value={searchById}
              onValueChange={setSearchById}
              style={styles.checkbox}
            />
            <Text style={styles.checkboxLabel}>Buscar por ID</Text>
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
    height: 180, 
    maxHeight: 180,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkbox: {
    marginRight: 8,
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#666',
  },
});

export default PokemonSearch;