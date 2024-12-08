import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { Players, Pokemon } from "@/components/PokemonTCGGame/types";
import BenchPokemonCard from "@/components/BenchPokemonCard";
import AddBenchButton from "@/components/AddBenchButton";

interface BenchSectionProps {
 playerId: keyof Players;
 player: {
   bench: Pokemon[];
 };
 mustChoose: boolean;
 onSelectPlayer: (playerId: keyof Players) => void;
 onSelectBenchPokemon: (playerId: keyof Players, pokemon: Pokemon, mustChoose: boolean) => void;
}

export function BenchSection({
 playerId,
 player,
 mustChoose,
 onSelectPlayer,
 onSelectBenchPokemon
}: BenchSectionProps) {
 return (
   <View style={styles.benchSection}>
     <Text style={styles.benchTitle}>Bench:</Text>
     <ScrollView 
       horizontal 
       showsHorizontalScrollIndicator={false}
       style={styles.benchScrollView}
     >
       {player.bench.map((benchPokemon, index) => (
         <BenchPokemonCard
           key={index}
           pokemon={benchPokemon}
           onPress={() => onSelectBenchPokemon(playerId, benchPokemon, mustChoose)}
         />
       ))}
     </ScrollView>
     {player.bench.length < 5 && (
       <AddBenchButton onPress={() => onSelectPlayer(playerId)} />
     )}
   </View>
 );
}

const styles = StyleSheet.create({
 benchSection: {
   marginTop: 16,
   backgroundColor: '#f0f0f0',
   borderRadius: 8,
   padding: 10,
 },
 benchTitle: {
   fontSize: 16,
   fontWeight: 'bold',
   marginBottom: 10,
   color: '#333',
 },
 benchScrollView: {
   flexGrow: 0,
   marginBottom: 10,
 },
});

export default BenchSection;