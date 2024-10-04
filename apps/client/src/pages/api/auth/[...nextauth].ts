import type { NextAuthOptions } from 'next-auth';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GitHubProvider from 'next-auth/providers/github';

export const options: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
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
  ],
  // pages:{
  //     signIn: "/signin"
  // }
};

export default NextAuth(options);
