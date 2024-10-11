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
} from '@/env';

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
        const user = { id: '0', name: 'Suntoh', password: 'nextauth' };

        if (
          credentials?.username === user.name &&
          credentials?.password === user.password
        ) {
          return user;
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
      return session;
    },
  },
  pages: {
    signIn: '/auth/signIn',
    newUser: '/auth/signUp',
  },
};

export default NextAuth(options);
