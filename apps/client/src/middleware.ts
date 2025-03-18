// Without a defined matcher, this one line applies next-auth
// to the entire project
import { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const nextAuthUrl = process.env.NEXTAUTH_URL;
  if (!nextAuthUrl) {
    throw new Error(
      'NEXTAUTH_URL is not defined in the environment variables.'
    );
  }
  req.nextUrl.hostname = new URL(nextAuthUrl).hostname;
}

export { default } from 'next-auth/middleware';

// Applies next-auth only to matching routes - can be regex
// Ref: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = { matcher: ['/myAccount', '/dashboard'] };

//need to put this in the root src
//need to install next-auth to root
