import React, { useRef, useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  Dimensions,
  TouchableOpacity
} from 'react-native';
import { LogEntry } from '@/components/PokemonTCGGame/types';
import { Ionicons } from '@expo/vector-icons';

interface BattleLogProps {
  logs: LogEntry[];
  onClearLogs?: () => void;
}

export function BattleLog({ logs, onClearLogs }: BattleLogProps) {
  const scrollViewRef = useRef<ScrollView>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  useEffect(() => {
    if (autoScroll) {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }
  }, [logs, autoScroll]);

  return (
    <View style={styles.logsSection}>
      <View style={styles.header}>
        <Text style={styles.logsTitle}>Battle Log</Text>
        <View style={styles.controls}>
          <TouchableOpacity 
            style={styles.controlButton}
            onPress={() => setAutoScroll(!autoScroll)}
          >
            <Ionicons 
              name={autoScroll ? "pause-circle-outline" : "play-circle-outline"} 
              size={20} 
              color="#666"
            />
          </TouchableOpacity>
          {onClearLogs && (
            <TouchableOpacity 
              style={styles.controlButton}
              onPress={onClearLogs}
            >
              <Ionicons name="trash-outline" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView 
        ref={scrollViewRef}
        style={styles.logs}
        persistentScrollbar={true}
        onScrollBeginDrag={() => setAutoScroll(false)}
      >
        {logs.map((log, index) => (
          <View 
            key={index} 
            style={[
              styles.logEntry,
              index % 2 === 0 ? styles.logEntryEven : styles.logEntryOdd,
              index === logs.length - 1 && styles.lastLogEntry
            ]}
          >
            <Text style={styles.logTimestamp}>{log.timestamp}</Text>
            <Text style={styles.logText}>{log.action}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  logsSection: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 15,
    maxHeight: Dimensions.get('window').height * 0.4,
    marginTop: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  logsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  controls: {
    flexDirection: 'row',
    gap: 8,
  },
  controlButton: {
    padding: 4,
  },
  logs: {
    maxHeight: Dimensions.get('window').height * 0.3,
  },
  logEntry: {
    padding: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
  logEntryEven: {
    backgroundColor: '#f8f9fa',
  },
  logEntryOdd: {
    backgroundColor: '#e9ecef',
  },
  lastLogEntry: {
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  logTimestamp: {
    fontSize: 10,
    color: '#666',
    marginBottom: 2,
  },
  logText: {
    fontSize: 12,
    color: '#333',
  },
});

export default BattleLog;