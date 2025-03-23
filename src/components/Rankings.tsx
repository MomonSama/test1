import { useState } from 'react';
import { useRankings, FPL_PLAYERS } from '../hooks/useRankings';
import type { RankingItem } from '../types/rankings';
import ReactCountryFlag from 'react-country-flag';

interface RankingsProps {
  region?: string;
  limit?: number;
}

export default function Rankings({ region = 'SA', limit = 100 }: RankingsProps) {
  const { rankings, isLoading, error } = useRankings({ region, limit });
  
  const nonFplPlayersCount: Record<string, number> = {};
  rankings.forEach((item) => {
    if (!FPL_PLAYERS.includes(item.player_id)) {
      nonFplPlayersCount[item.player_id] = (
        Object.keys(nonFplPlayersCount).length + 1
      );
    }
  });

  if (error) {
    return (
      <div className="bg-white p-6 rounded-md text-center border border-gray-200">
        <p className="text-red-600">Error loading rankings: {error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-md overflow-hidden border border-gray-200">
      <div className="px-4 py-3 border-b border-gray-200">
        <h2 className="text-lg font-medium">Top CS2 Players</h2>
      </div>
      
      <div className="p-4">
        <div className="mb-4 p-3 bg-gray-50 rounded-md text-sm text-gray-700 border border-gray-200">
          <p><strong>Note:</strong> Players with <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">FPL</span> tag are fixed players in the FACEIT Pro League with the "Player SA" tag in FACEIT hub.</p>
          <p className="mt-1">Players with <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">TOP 30</span> tag are the top 30 non-FPL players in the rankings.</p>
        </div>
        
        {isLoading ? (
          <div className="text-center py-4">
            <p className="text-gray-500">Loading rankings...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                  <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Player</th>
                  <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ELO</th>
                  <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {rankings.map((item: RankingItem) => (
                  <tr key={item.position} className="hover:bg-gray-50">
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{item.position}</td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                      {item.country && (
                          <ReactCountryFlag 
                            countryCode={item.country} 
                            svg 
                            style={{
                              width: '1.5em',
                              height: '1.5em',
                            }}
                            title={item.country}
                          />
                        )}
                        <div className="flex items-center space-x-1">
                          <a 
                            href={`https://www.faceit.com/en/players/${item.nickname || ''}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium text-gray-900 hover:text-orange-500"
                          >
                            {item.nickname || ''}
                          </a>
                          {FPL_PLAYERS.includes(item.player_id) ? (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800" title="FPL Player">
                              FPL
                            </span>
                          ) : (nonFplPlayersCount[item.player_id] && nonFplPlayersCount[item.player_id] <= 30 && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800" title="Top 30 Non-FPL Player">
                              TOP 30
                            </span>
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {item.faceit_elo}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800`}>
                        {item.game_skill_level}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}