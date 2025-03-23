import MatchResults from './MatchResults';
import { useMatches } from '../hooks/useMatches';

export default function SuperMatchesContainer() {
  // Use the custom hook to manage matches data and filtering
  const { 
    filteredMatches: superMatches, 
    isLoading, 
    error
  } = useMatches({ 
    filterSuperMatches: true
  });
  


  if (error) {
    return (
      <div className="bg-white p-6 rounded-md text-center border border-gray-200">
        <p className="text-red-600">Error loading matches: {error}</p>
      </div>
    );
  }

  return (
    <div id="matches-container">
      {isLoading ? (
        <div className="bg-white p-6 rounded-md text-center border border-gray-200">
          <p className="text-gray-700">Loading super matches...</p>
        </div>
      ) : superMatches.length > 0 ? (
        <>
          <MatchResults matches={superMatches} />
        </>
      ) : (
        <div className="bg-white p-6 rounded-md text-center border border-gray-200">
          <p className="text-gray-700">No super matches with level 10 players found at the moment.</p>
        </div>
      )}
    </div>
  );
}