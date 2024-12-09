import { useState, useCallback } from 'react';
import type { LogEntry } from '@/components/PokemonTCGGame/types';
import { formatDate } from '@/utils/dateUtils';

export const useGameLogs = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const addLog = useCallback((action: string) => {
    const timestamp = formatDate(new Date());
    setLogs((prevLogs) => [...prevLogs, { timestamp, action }]);
  }, []);

  const getLogs = useCallback(() => {
    return [...logs];
  }, [logs]);

  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  return { logs, addLog, getLogs, clearLogs };
};