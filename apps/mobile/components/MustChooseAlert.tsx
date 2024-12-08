import React from "react";
import { View, Text, StyleSheet } from "react-native";

export function MustChooseAlert() {
 return (
   <View style={styles.mustChooseSection}>
     <Text style={styles.mustChooseText}>
       Choose a new Active Pokémon
     </Text>
   </View>
 );
}

const styles = StyleSheet.create({
 mustChooseSection: {
   backgroundColor: '#fff3cd',
   padding: 10,
   borderRadius: 8,
   marginBottom: 10,
   alignItems: 'center',
   borderWidth: 1,
   borderColor: '#ffeeba',
 },
 mustChooseText: {
   color: '#856404',
   fontSize: 16,
   fontWeight: 'bold',
 },
});

export default MustChooseAlert;