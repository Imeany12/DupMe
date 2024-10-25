import { IUser } from '@repo/shared-types';
import { DefaultSession } from 'next-auth';

export interface UserResponse extends Response {
  user: IUser;
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
  interface Session {
    user: Omit<IUser, 'password'> & DefaultSession['user'];
  }
}
