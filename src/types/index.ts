/**
 * TypeScript interfaces for FACEIT match data
 */

export interface Match {
  game: string;
  region: string;
  status: 'LIVE' | 'UPCOMING' | string;
  tags?: string[];
  teams: {
    faction1: Team;
    faction2: Team;
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