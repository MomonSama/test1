import MatchResults from './MatchResults';
import { useMatches } from '../hooks/useMatches';

export default function SuperMatchesContainer() {
  const { 
    matches: superMatches, 
    isLoading, 
    error,
    lastRefreshed,
    nextRefreshIn
  } = useMatches();

  // Format the last refreshed time
  const formatLastRefreshed = () => {
    if (!lastRefreshed) return 'Never';
    return lastRefreshed.toLocaleTimeString();
  };

  if (error) {
    return (
      <div className="bg-white p-6 rounded-md text-center border border-gray-200">
        <p className="text-red-600">Error loading matches: {error}</p>
      </div>
    );
  }

  return (
    <div id="matches-container">
      <div className="mb-4 flex justify-between items-center text-xs text-gray-500">
        <div>
          {isLoading ? (
            <span className="inline-flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Refreshing...
            </span>
          ) : (
            <span>Last updated: {formatLastRefreshed()}</span>
          )}
        </div>
        <div>
          <span>Next refresh in: {nextRefreshIn}s</span>
        </div>
      </div>

      {isLoading && superMatches.length === 0 ? (
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