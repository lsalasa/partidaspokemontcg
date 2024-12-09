import { useState, useCallback, useEffect } from 'react';
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

  const getLogs = useCallback(async () => {
    try {
      const filePath = `${FileSystem.documentDirectory}pokemon_tcg_logs.csv`;
      const fileContent = await FileSystem.readAsStringAsync(filePath);
      const logEntries = fileContent.split('\n').filter(Boolean).map(line => {
        const [timestamp, action] = line.split(',');
        return { timestamp, action };
      });
      setLogs(logEntries);
    } catch (error) {
      console.error('Error loading logs:', error);
    }
  }, []);

  useEffect(() => {
    getLogs();
  }, [getLogs]);

  return { logs, addLog , getLogs};
};