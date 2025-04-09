import MatchResults from './MatchResults';
import { useMatches } from '../hooks/useMatches';

export default function SuperMatchesContainer() {
  const { 
    matches: superMatches, 
    isLoading, 
    error
  } = useMatches();

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
          <p className="text-gray-700">No super matches found at the moment.</p>
        </div>
      )}
    </div>
  );
}