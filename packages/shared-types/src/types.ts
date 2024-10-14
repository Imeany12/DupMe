export interface IUser {
  username?: string;
  password?: string;
  email?: string;
  image?: string;
  createdAt?: Date;
  games_won?: number;
  games_lost?: number;
  games_draw: number;
  total_score: number;
  matchHistory: IMatch[]; 
}

export interface IMatch {
    score: number;
    opponent: string;
    outcome: 'win' | 'lose' | 'draw';
    roundsWon: number; 
    roundsLost: number;
    dateTime: Date;
  }

export interface IMsgDataTypes {
  roomId: string | number;
  user: string;
  msg: string;
  time: string;
}export interface IUser {
    username?: string ;
    email?: string ;
    image?: string ;
    password?: string; 
    createdAt?: Date ;
    dob?: Date ;
    gender?: string;
    bio?: string;
    games_won?: number; 
    games_lost?: number;
} 