'use client';

import './homepage.css';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

import NavBar from '@/components/NavBar';

export default function Home() {
  const [mode, setMode] = useState(false);
  const { data: session } = useSession({
    required: false,
  });

  return (
    <div>
      <NavBar session={session} />
      <div className='mx-auto flex h-screen w-screen flex-col items-center'>
        {session ? (
          <div className='flex flex-col items-center'>
            <Link
              href='/api/auth/signout?callbackUrl=/'
              className='text-3xl text-violet-500'
            >
              Sign Out
            </Link>
          </div>
        ) : (
          <div className='flex flex-col items-center'>
            <h1 className='text-5xl'>Not logged In</h1>
            <Link href='/api/auth/signin' className='text-3xl text-red-500'>
              Sign In
            </Link>
          </div>
        )}
        <Link href='myAccount' className='text-2xl text-green-600'>
          My Account
        </Link>
        {!mode ? (
          <div className='flex h-screen flex-row items-end'>
            <button
              className='my-64 rounded-lg border border-gray-500 bg-gray-200 px-8 py-2 text-4xl text-sky-600'
              onClick={() => setMode(true)}
            >
              Play
            </button>
          </div>
        ) : (
          <div>
            <button
              className='my-64 rounded-lg border border-gray-500 bg-gray-200 px-8 py-2 text-4xl text-sky-600'
              onClick={() => setMode(false)}
            >
              2 Player
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
