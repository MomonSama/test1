/**
 * TypeScript interfaces for FACEIT match data
 */

export interface Match {
  id: string;
  game: string;
  region: string;
  status: 'LIVE' | 'UPCOMING' | string;
  tags?: string[];
  teams: {
    faction1: Team;
    faction2: Team;
  };
  results?: MatchResults;
}

export interface MatchResults {
  factions: {
    faction1: {
      score: number;
    };
    faction2: {
      score: number;
    };
  };
}

export interface Team {
  name: string;
  roster: Player[];
  stats: {
    skillLevel: SkillLevel;
  };
}

export interface Player {
  nickname: string;
  elo: number;
}

export interface SkillLevel {
  average: number;
}