import Link from 'next/link';
import { useSession } from 'next-auth/react';
import React from 'react';

type User =
  | {
      name?: string | null | undefined;
      email?: string | null | undefined;
      image?: string | null | undefined;
    }
  | undefined;

export default function NavBar() {
  const { data: session } = useSession({
    required: false,
  });
  const user = session?.user;

  return (
    <nav>
      <ul>
        <li className='flex flex-grow'>
          <Link color='inherit' href='/'>
            Home
          </Link>
        </li>
        <li>
          {!user ? (
            <Link href='/api/auth/signin' className='text-3xl text-red-500'>
              Sign In
            </Link>
          ) : (
            <Link color='inherit' href={'/api/auth/signout'}>
              Sign Out
            </Link>
          )}
        </li>
      </ul>
    </nav>
  );
}
