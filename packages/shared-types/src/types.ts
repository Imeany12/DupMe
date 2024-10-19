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
}

export interface INote {
  fallDuration: number,
  longNoteDuration: number,
  isLongNute: boolean,
  delay: number,
}

export interface INotes {
  color: string,
  nextNoteInd: number,
  notes: INote[]
}

export interface ISong {
  sheet: INotes[]
}