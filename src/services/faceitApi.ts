/**
 * FACEIT API Service
 * Handles all requests to the FACEIT API
 */

const FACEIT_API_URL = 'https://open.faceit.com/data/v4';
const API_KEY = '31a0f009-6cde-4e0d-98ce-4c10b21e2714';

const headers = {
  'Authorization': `Bearer ${API_KEY}`,
  'Accept': 'application/json',
};

/**
 * Fetches top CS2 players rankings for a specific region
 * @param region Region code (e.g., 'SA' for South America)
 * @param offset Pagination offset
 * @param limit Number of results to return
 */
export async function fetchTopRankings(region = 'SA', offset = 0, limit = 100) {
  try {
    
    const response = await fetch(
      `${FACEIT_API_URL}/rankings/games/cs2/regions/${region}?offset=${offset}&limit=${limit}`,
      { headers }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch rankings: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching FACEIT rankings:', error);
    throw error;
  }
}
