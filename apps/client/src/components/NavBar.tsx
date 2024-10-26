import Link from 'next/link';
import { Session } from 'next-auth';
import React from 'react';
import { IoMdSettings } from 'react-icons/io';

import { User } from '@/interfaces/user/user';

export default function NavBar({ session }: { session: Session | null }) {
  const user: User = session?.user;

  return (
    <nav>
      <ul className='flex flex-grow py-4'>
        {/* <li className='ml-4'>
          <Link href='/' className='items-start text-3xl text-white'>
            <FiHome />
          </Link>
        </li> */}
        <li className='ml-4'>
          <Link href='/set' className='text-3xl text-white'>
            <IoMdSettings />
          </Link>
        </li>
        <li className='mr-10 flex w-full flex-col items-end'>
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
