'use client';

import { useSession } from 'next-auth/react';
import { useState } from 'react';

import NavBar from '@/components/NavBar';
import UserProfile from '@/components/UserProfile';
import Link from 'next/link';

export default function Home() {
  const [mode, setMode] = useState(false);
  const { data: session } = useSession({
    required: false,
  });

  return (
    <div>
      <NavBar session={session} />
      <div className='mx-auto flex w-screen flex-col items-center'>
        {session ? (
          <div className='flex flex-col items-center'>
            <UserProfile user={session?.user} />
          </div>
        ) : (
          <div className='flex flex-col items-center'>
            <h1 className='text-5xl'>Not logged In</h1>
          </div>
        )}
        <Link href='myAccount' className='text-2xl text-green-600'>
          My Account
        </Link>
        <div className='mt-12 flex min-h-72 flex-grow items-end'>
          {!mode ? (
            <div>
              <button
                className='mt-32 rounded-lg border border-gray-500 bg-gray-200 px-8 py-2 text-4xl text-sky-600'
                onClick={() => setMode(true)}
              >
                Play
              </button>
            </div>
          ) : (
            <div>
              <button
                className='mt-32 rounded-lg border border-gray-500 bg-gray-200 px-8 py-2 text-4xl text-sky-600'
                onClick={() => setMode(false)}
              >
                2 Player
              </button>
            </div>
          )}
        </div>
      </div>
    <div className='mx-auto flex h-screen w-screen flex-col items-center'>
      <div className='text-center text-[180px] font-semibold text-white'>
        DupMe
      </div>
      {!mode ? (
        <div className='flex h-screen flex-row items-center'>
          <button
            className='shadow-[0_4px_4px_0px_rgba(0, 0, 0, 0.25)] w-500px my-4 mb-36 rounded-full border border-solid border-black bg-[#5B687C] px-32 py-2 text-4xl text-[#FFFFFF] shadow-lg hover:bg-[#8572b5]'
            onClick={() => setMode(true)}
          >
            Play
          </button>
        </div>
      ) : (
        <div>
          <button
            className='shadow-[0_4px_4px_0px_rgba(0, 0, 0, 0.25)] w-500px my-64 rounded-full border border-solid border-black bg-[#5B687C] px-8 py-2 text-4xl text-[#FFFFFF] shadow-lg'
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
