import { useState, useEffect } from 'react';
import type { Match } from '../types';

interface MatchResultsProps {
  matches: Match[];
}

interface MatchWithResults extends Match {
  filtered?: boolean;
}

export default function MatchResults({ matches }: MatchResultsProps) {
  const [matchesWithResults, setMatchesWithResults] = useState<MatchWithResults[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    // Function to fetch results for a single match
    const fetchMatchResult = async (match: Match): Promise<MatchWithResults> => {
      try {
        // Extract match ID
        const matchId = match.id || '1-946d859c-f0ec-499a-b256-d1fda3446f25';
        const response = await fetch(`https://live-faceit-match-result.maliagapacheco.workers.dev/${matchId}`);
        const resultsData = await response.json();
        
        if (resultsData && resultsData.length > 0) {
          // Create a new match object with results
          return {
            ...match,
            results: {
              factions: {
                faction1: {
                  score: resultsData[0].factions.faction1.score || 0
                },
                faction2: {
                  score: resultsData[0].factions.faction2.score || 0
                }
              }
            }
          };
        }
        return match;
      } catch (error) {
        console.error(`Error fetching results for match:`, error);
        return match; // Return original match on error
      }
    };
    
    // Fetch results for new matches only
    const fetchNewMatchResults = async () => {
      setIsLoading(true);
      try {
        // Instead of adding to existing matches, we'll completely replace the state
        // with the current matches from props, ensuring no duplicates
        
        // Create a map of existing matches with results for quick lookup
        const existingMatchesMap = new Map(
          matchesWithResults.map(match => [match.id, match])
        );
        
        // Process all matches from props
        const allMatchesToProcess = [...matches];
        const matchesToFetch = [];
        
        // Identify which matches need results fetched
        for (const match of allMatchesToProcess) {
          if (!existingMatchesMap.has(match.id)) {
            matchesToFetch.push(match);
          }
        }
        
        // Fetch results only for matches that don't have them yet
        if (matchesToFetch.length > 0) {
          const newMatchesWithResults = await Promise.all(matchesToFetch.map(fetchMatchResult));
          
          // Update the map with new results
          for (const match of newMatchesWithResults) {
            existingMatchesMap.set(match.id, match);
          }
        }
        
        // Create a new array with only the matches from the current props
        // This ensures we only show what's currently needed
        const updatedMatches = matches.map(match => 
          existingMatchesMap.get(match.id) || match
        );
        
        // Replace the state completely
        setMatchesWithResults(updatedMatches);
      } catch (error) {
        console.error('Error fetching match results:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchNewMatchResults();
    
    // No need to listen for localStorage changes here as the parent component
    // (SuperMatchesContainer) will re-render with new filtered matches when the filter changes
  }, [matches]); // Removed matchesWithResults from dependencies to prevent infinite loop
  
  return (
    <div>
      {isLoading ? (
        <div className="text-center py-4">
          <p className="text-gray-500">Loading match results...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {matchesWithResults.map((match) => (
            <div key={match.id} className="bg-white rounded-md overflow-hidden hover:bg-gray-100 transition-all duration-300 border border-gray-200">
              <div className="px-4 py-3 flex justify-between items-center border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <span className="text-black font-medium text-sm">{match.game.toUpperCase()}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-black bg-opacity-30"></span>
                  <span className="text-gray-600 text-sm">{match.region}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <a 
                    href={`https://www.faceit.com/en/cs2/room/${match.id}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-2 py-1 bg-orange-500 hover:bg-orange-600 text-white text-xs rounded flex items-center transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Open
                  </a>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${match.status === 'LIVE' ? 'bg-black text-white' : 'bg-gray-200 text-black'}`}>
                    {match.status}
                  </span>
                </div>
              </div>
              
              <div className="p-4">
                <details className="group [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex justify-between items-center cursor-pointer list-none">
                    <div className="flex items-center space-x-4">
                      <div className="text-black font-medium">{match.teams.faction1.name}</div>
                      {match.results ? (
                        <div className="flex items-center space-x-2">
                          <span className="text-black font-medium">{match.results.factions.faction1.score}</span>
                          <span className="text-gray-500">-</span>
                          <span className="text-black font-medium">{match.results.factions.faction2.score}</span>
                        </div>
                      ) : (
                        <div className="text-gray-500">vs</div>
                      )}
                      <div className="text-black font-medium">{match.teams.faction2.name}</div>
                    </div>
                    <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </summary>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-2 gap-4">
                      {/* Team 1 */}
                      <div data-team="1">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-black text-sm font-medium">{match.teams.faction1.name}</span>
                          <span className="text-xs text-gray-600">Avg: {match.teams.faction1.stats.skillLevel.average}</span>
                        </div>
                        
                        <ul className="space-y-1.5">
                          {match.teams.faction1.roster.map((player, idx) => (
                            <li key={idx} className="flex justify-between items-center">
                              <span className="text-gray-700 text-sm">{player.nickname}</span>
                              <span className="text-xs text-gray-600">
                                {player.elo}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {/* Team 2 */}
                      <div data-team="2">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-black text-sm font-medium">{match.teams.faction2.name}</span>
                          <span className="text-xs text-gray-600">Avg: {match.teams.faction2.stats.skillLevel.average}</span>
                        </div>
                        
                        <ul className="space-y-1.5">
                          {match.teams.faction2.roster.map((player, idx) => (
                            <li key={idx} className="flex justify-between items-center">
                              <span className="text-gray-700 text-sm">{player.nickname}</span>
                              <span className="text-xs text-gray-600">
                                {player.elo}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </details>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}