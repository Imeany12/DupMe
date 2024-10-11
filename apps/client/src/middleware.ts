// Without a defined matcher, this one line applies next-auth
// to the entire project
export { default } from 'next-auth/middleware';

// Applies next-auth only to matching routes - can be regex
// Ref: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = { matcher: ['/myAccount', '/dashboard'] };

//need to put this in the root src
//need to install next-auth to root
