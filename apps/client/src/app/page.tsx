'use client';

import { useSession } from 'next-auth/react';
import { useState } from 'react';
import Link from 'next/link';

import NavBar from '@/components/NavBar';

export default function Home() {
  const [roomId, setRoomId] = useState(0);
  const [mode, setMode] = useState(false);
  const { data: session } = useSession({
    required: false,
  });

  const setUpGame = () => {
    setRoomId(Math.floor(Math.random() * 1000000));
    setMode(true);
  };

  return (
    <div>
      <NavBar session={session} />
      <div className='mx-auto flex w-screen flex-col items-center'>
        <div className='text-center text-[180px] font-semibold text-white'>
          DupMe
        </div>
        

        <div className='mt-12 flex min-h-72 flex-grow items-end'>
          {!mode ? (
            <div>
              <button
                className='mt-32 rounded-lg border border-gray-500 bg-gray-200 px-8 py-2 text-4xl text-sky-600'
                onClick={setUpGame}
              >
                Play
              </button>
            </div>
          ) : (
            <div>
              <Link
                className='mt-32 rounded-lg border border-gray-500 bg-gray-200 px-8 py-2 text-4xl text-sky-600'
                href={`/lobby/${roomId}`}
              >
                2 Player
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
