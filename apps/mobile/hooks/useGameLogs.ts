import { useState, useCallback } from 'react';
import * as FileSystem from 'expo-file-system';
import type { LogEntry } from '@/components/PokemonTCGGame/types';
import { formatDate } from '@/utils/dateUtils';


export const useGameLogs = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const addLog = useCallback(async (action: string) => {
    const timestamp = formatDate(new Date());
    const logEntry = `${timestamp},${action}\n`;
    
    try {
      const filePath = `${FileSystem.documentDirectory}pokemon_tcg_logs.csv`;
      const existingContent = await FileSystem.readAsStringAsync(filePath).catch(() => '');
      await FileSystem.writeAsStringAsync(filePath, existingContent + logEntry);
      setLogs(prevLogs => [...prevLogs, { timestamp, action }]);
    } catch (error) {
      console.error('Error saving log:', error);
    }
  }, []);

  return { logs, addLog };
};