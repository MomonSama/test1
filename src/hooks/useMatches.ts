import { useState, useEffect } from 'react';
import type { Match } from '../types';

interface UseMatchesResult {
  matches: Match[];
  isLoading: boolean;
  error: string | null;
  lastRefreshed: Date | null;
  nextRefreshIn: number;
}

export function useMatches(): UseMatchesResult {
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);
  const [nextRefreshIn, setNextRefreshIn] = useState<number>(120);
  
  const refreshInterval = 120;

  const fetchMatches = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch(`https://super-matches-api.maliagapacheco.workers.dev/`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch matches: ${response.status}`);
      }
      
      const data = await response.json() as Match[];
      
      setMatches(data);
      setLastRefreshed(new Date());
      setNextRefreshIn(refreshInterval);
    } catch (err) {
      console.error('Error fetching matches:', err);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (nextRefreshIn <= 0) return;
    
    const timer = setInterval(() => {
      setNextRefreshIn(prev => Math.max(0, prev - 1));
    }, 1000);
    
    return () => clearInterval(timer);
  }, [nextRefreshIn]);

  useEffect(() => {
    fetchMatches();
    
    const intervalId = setInterval(fetchMatches, refreshInterval * 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  return {
    matches,
    isLoading,
    error,
    lastRefreshed,
    nextRefreshIn
  };
}
