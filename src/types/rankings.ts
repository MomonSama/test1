/**
 * TypeScript interfaces for FACEIT rankings data
 */

export interface RankingsResponse {
    items: RankingItem[];
    start: number;
    end: number;
};

export interface RankingItem {
    player_id: string;
    nickname: string;
    country: string;
    position: number;
    faceit_elo: number;
    game_skill_level: number;
}