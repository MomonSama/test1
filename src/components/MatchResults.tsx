import { useState } from 'react';
import type { Match } from '../types';

interface MatchResultsProps {
  matches: Match[];
}

export default function MatchResults({ matches }: MatchResultsProps) {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {matches.map((match) => (
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
                    {match.results && match.results.length > 0 ? (
                      <div className="flex items-center space-x-2">
                        <span className="text-black font-medium">{match.results[0].factions.faction1.score}</span>
                        <span className="text-gray-500">-</span>
                        <span className="text-black font-medium">{match.results[0].factions.faction2.score}</span>
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
                        <span className="text-xs text-gray-600">Avg ELO: {Math.round(match.teams.faction1.roster.reduce((sum, player) => sum + player.elo, 0) / match.teams.faction1.roster.length)}</span>
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
                        <span className="text-xs text-gray-600">Avg ELO: {Math.round(match.teams.faction2.roster.reduce((sum, player) => sum + player.elo, 0) / match.teams.faction2.roster.length)}</span>
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
    </div>
  );
}