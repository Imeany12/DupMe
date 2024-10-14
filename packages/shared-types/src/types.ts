export interface IUser {
  username: string;
  password: string;
  email?: string;
  image?: string;
  createdAt: Date;
  games_won: number;
  games_lost: number;
    games_draw: number;
    total_score: number;
    matchHistory: IMatch[]; 
}

export interface IMatch {
    opponent: string;
    outcome: 'win' | 'lose' | 'draw';
    roundsWon: number; 
    roundsLost: number;
    dateTime: Date;
  }
