import { useState, useEffect } from 'react';
import type { Match } from '../types';

interface UseMatchesResult {
  matches: Match[];
  isLoading: boolean;
  error: string | null;
}

export function useMatches(): UseMatchesResult {
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMatches = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch(`https://super-matches-api.maliagapacheco.workers.dev/`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch matches: ${response.status}`);
      }
      
      const data = await response.json() as Match[];
      
      setMatches(data);
    } catch (err) {
      console.error('Error fetching matches:', err);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
        const intervalId = setInterval(fetchMatches, 60000);
    
    return () => clearInterval(intervalId);
  }, []);

  return {
    matches,
    isLoading,
    error
  };
}