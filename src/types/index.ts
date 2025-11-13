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
  leaderboard_data?: LeaderboardData; // Full leaderboard data including top 10
  end_date?: string; // End date for fetching historical data if needed
}

export interface CountdownData {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  endDate: Date;
}
