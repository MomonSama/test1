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
  results?: MatchResult[];
  createdAt?: string;
}

export interface MatchResult {
  ascScore: boolean;
  partial: boolean;
  factions: {
    faction1: {
      score: number;
    };
    faction2: {
      score: number;
    };
  };
  disqualified?: any[];
  voteKicked?: any[];
  leavers?: any[];
  afk?: any[];
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
  leader?: string;
  score?: number;
  roster: Player[];
  stats: {
    skillLevel: SkillLevel;
    winProbability?: number;
  };
}

export interface Player {
  nickname: string;
  id: string;
  gameSkillLevel?: number;
  elo: number;
}

export interface SkillLevel {
  average: number;
  range?: {
    min: number;
    max: number;
  };
}
