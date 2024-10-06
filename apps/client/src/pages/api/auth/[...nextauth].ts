import type { NextAuthOptions } from 'next-auth';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import TwitterProvider from 'next-auth/providers/twitter';

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
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    TwitterProvider({
      clientId: process.env.TWITTER_ID as string,
      clientSecret: process.env.TWITTER_SECRET as string,
      version: '2.0',
    }),
  ],
  callbacks: {
    // Using the `...rest` parameter to be able to narrow down the type based on `trigger`
    async session({ session, user, token }) {
      return session;
    },
  },
  // pages:{
  //     signIn: "/signin"
  // }
};

export default NextAuth(options);
