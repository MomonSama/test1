import { useState, useEffect } from 'react';
import type { Match } from '../types';

interface UseMatchesOptions {
  filterSuperMatches?: boolean;
}

interface UseMatchesResult {
  matches: Match[];
  filteredMatches: Match[];
  isLoading: boolean;
  error: string | null;
}

/**
 * Custom hook to fetch and manage matches data
 */
export function useMatches(options: UseMatchesOptions = {}): UseMatchesResult {
  const { filterSuperMatches = true } = options;
  
  const [matches, setMatches] = useState<Match[]>([]);
  const [filteredMatches, setFilteredMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch matches data
  const fetchMatches = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch(`https://rough-rice-35b5.maliagapacheco.workers.dev/`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch matches: ${response.status}`);
      }
      
      const data = await response.json() as Match[];
      
      // Update matches state
      setMatches(data);
      applyFilters(data);
    } catch (err) {
      console.error('Error fetching matches:', err);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchMatches();
  }, [filterSuperMatches]);

  // Apply filters when matches change
  useEffect(() => {
    applyFilters(matches);
  }, [matches]);

  // Helper function to apply all filters
  const applyFilters = (data: Match[]) => {
    let filtered = [...data];
    
    // Filter for super matches if enabled
    if (filterSuperMatches) {
      filtered = filtered.filter(match => 
        match.tags && match.tags.some(tag => tag === 'super')
      );
    }
    
    // Filter for matches with at least one level 10 player
    filtered = filtered.filter(match => {
      // Check if either team has at least one level 10 player
      const hasLevel10Player = (
        // Check if team 1 has level 10 average
        match.teams.faction1.stats.skillLevel.average === 10 ||
        // Check if team 2 has level 10 average
        match.teams.faction2.stats.skillLevel.average === 10
      );
      
      return hasLevel10Player;
    });
    
    setFilteredMatches(filtered);
  };

  return {
    matches,
    filteredMatches,
    isLoading,
    error
  };
}