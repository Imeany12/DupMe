import Link from 'next/link';
import React from 'react';
import { FiHome } from 'react-icons/fi';

type User =
  | {
      name?: string | null | undefined;
      email?: string | null | undefined;
      image?: string | null | undefined;
    }
  | undefined;

export default function NavBar({ session }: { session: any }) {
  const user: User = session?.user;

  return (
    <nav>
      <ul className='flex flex-grow py-4'>
        <li className='ml-4'>
          <Link href='/' className='items-start text-3xl text-white'>
            <FiHome />
          </Link>
        </li>
        <li className='mr-6 flex w-full flex-col items-end'>
          {!user ? (
            <div className='flex items-center gap-4'>
              <Link
                href='/api/auth/signin'
                className='rounded-lg border bg-neutral-300 px-2 text-xl font-semibold text-neutral-700'
              >
                Sign In
              </Link>
              <Link
                href='/auth/signUp'
                className='rounded-lg border bg-neutral-800 px-2 text-xl font-semibold text-white'
              >
                register
              </Link>
            </div>
          ) : (
            <Link
              href={'/api/auth/signout'}
              className='rounded-lg border bg-neutral-300 px-2 text-xl font-semibold text-neutral-700'
            >
              Sign Out
            </Link>
          )}
        </li>
      </ul>
    </nav>
  );
}
