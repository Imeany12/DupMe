import { IUser } from '@repo/shared-types';
import type { NextAuthOptions } from 'next-auth';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import TwitterProvider from 'next-auth/providers/twitter';

import {
  CLIENT_GITHUB_ID,
  CLIENT_GITHUB_SECRET,
  CLIENT_GOOGLE_ID,
  CLIENT_GOOGLE_SECRET,
  CLIENT_TWITTER_ID,
  CLIENT_TWITTER_SECRET,
  SERVER_URL,
} from '@/env';
import { GetUserResponse } from '@/interfaces/user/user';

// .env.local later be add(change secret key)

export const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: {
          label: 'Username : ',
          type: 'text',
          placeholder: 'your-username',
        },
        password: {
          label: 'Password : ',
          type: 'password',
          placeholder: 'your-password',
        },
      },
      async authorize(credentials) {
        //get info from database
        //Docs : https://next-auth.js.org/configuration/providers/credentials
        if (!credentials) return null;
        const res = await fetch(`${SERVER_URL}/user/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(credentials),
        });
        const { user } = (await res.json()) as GetUserResponse;
        if (res.status === 200) {
          return {
            id: user.id,
            name: credentials.username,
            username: user.username,
            email: user.email,
            image: user.image,
            createdAt: user.createdAt,
            country: user.country,
            bio: user.bio,
            dob: user.dob,
            gender: user.gender,
            games_won: user.games_won,
            games_lost: user.games_lost,
            games_draw: user.games_draw ?? 0,
            total_score: user.total_score ?? 0,
            matchHistory: user.matchHistory ?? [],
            keybindings: user.keybindings,
          };
        } else {
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: CLIENT_GOOGLE_ID,
      clientSecret: CLIENT_GOOGLE_SECRET,
    }),
    GitHubProvider({
      clientId: CLIENT_GITHUB_ID,
      clientSecret: CLIENT_GITHUB_SECRET,
    }),
    TwitterProvider({
      clientId: CLIENT_TWITTER_ID,
      clientSecret: CLIENT_TWITTER_SECRET,
      version: '2.0',
    }),
  ],
  callbacks: {
    // Using the `...rest` parameter to be able to narrow down the type based on `trigger`
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      // Attach the user data to the session
      session.user = token.user as Omit<IUser, 'password'> & {
        name?: string | null;
        email?: string | null;
        image?: string | null;
      };
      return session;
    },
  },
  pages: {
    signIn: '/auth/signIn',
    newUser: '/auth/signUp',
  },
};

export default NextAuth(options);
