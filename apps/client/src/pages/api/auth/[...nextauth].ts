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
        if (res.status === 200) {
          return { id: credentials.username, name: credentials.username };
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
    async session({ session }) {
      const res = await fetch(`${SERVER_URL}/user/${session.user.name}`);
      const { user } = (await res.json()) as GetUserResponse;
      session.user = {
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
        games_draw: user.games_draw,
        total_score: user.total_score,
        matchHistory: user.matchHistory,
        keybindings: user.keybindings,
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
