import { IMatch, IUser, KeyMapping } from '@repo/shared-types';
import { DefaultSession } from 'next-auth';

export interface UserResponse extends Response {
  message: string;
  user: IUser & { id: string };
  token: string;
}

export type GetUserResponse = UserResponse;

export type User =
  | {
      name?: string | null | undefined;
      email?: string | null | undefined;
      image?: string | null | undefined;
      user?: IUser | null | undefined;
    }
  | undefined;

declare module 'next-auth' {
  interface User {
    username?: string;
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
  }

  interface Session {
    user: Omit<IUser, 'password'> & DefaultSession['user'];
    token: string;
  }
}
