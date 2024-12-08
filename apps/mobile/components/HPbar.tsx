import React from 'react';
import { View, StyleSheet } from 'react-native';

interface HPBarProps {
  currentHp: number;
  maxHp: number;
}


export function HPBar ({ currentHp, maxHp }: HPBarProps ) {
  const percentage = (currentHp / maxHp) * 100;
  const color = 
    percentage > 50 ? '#4CAF50' :  // Green
    percentage > 20 ? '#FFC107' :  // Yellow
    '#F44336';                     // Red

  return (
    <View style={styles.hpBarContainer}>
      <View 
        style={[
          styles.hpBar, 
          { 
            width: `${percentage}%`,
            backgroundColor: color
          }
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  hpBarContainer: {
    height: 20,
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    overflow: 'hidden',
    marginHorizontal: 16,
    marginBottom: 10,
  },
  hpBar: {
    height: '100%',
    borderRadius: 10,
  },
});

export default HPBar;