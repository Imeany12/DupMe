export interface IUser {
  username: string;
  password: string;
  email?: string;
  image?: string;
  createdAt: Date;
  games_won: number;
  games_lost: number;
}

export interface IMsgDataTypes {
  roomId: string | number;
  user: string;
  msg: string;
  time: string;
}