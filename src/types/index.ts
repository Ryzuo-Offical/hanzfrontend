export interface LeaderboardEntry {
  rank: number;
  username: string;
  userId: string;
  wagered: number;
  prize: number;
  avatarUrl?: string;
  isHidden?: boolean;
}

export interface LeaderboardData {
  topThree: LeaderboardEntry[];
  challengers: LeaderboardEntry[];
  history: HistoricalLeaderboard[];
}

export interface HistoricalLeaderboard {
  id: string;
  period: string;
  date: string;
  winner: {
    username: string;
    totalWagered: number;
    prize: number;
  };
}

export interface CountdownData {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  endDate: Date;
}
