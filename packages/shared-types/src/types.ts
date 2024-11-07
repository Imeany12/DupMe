export interface IUser {
  name?: string;
  password?: string;
  email?: string;
  image?: string;
  createdAt?: Date;
  country?: string;
  bio?: string;
  dob?: Date;
  gender?: string;
  games_won?: number;
  games_lost?: number;
  games_draw: number;
  total_score: number;
  matchHistory: IMatch[];
  keybindings?: KeyMapping;
  max_score?: number;
  max_combo?: number;
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
  fallDuration: number;
  longNoteDuration: number;
  isLongNote: boolean;
  delay: number;
}

export interface INotes {
  color: string;
  color2: string;
  nextNoteInd: number;
  notes: INote[];
}

export interface ISong {
  roomId: string | number;
  user: string;
  sheet: { [key: string]: INotes };
}
export interface KeyMapping {
  [key: string]: string;
}
