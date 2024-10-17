'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

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
            <div className='my-auto flex flex-row items-center'>
              <button
                className='shadow-[0_4px_4px_0px_rgba(0, 0, 0, 0.25)] w-500px rounded-full border border-solid border-black bg-[#5B687C] px-32 py-2 text-4xl text-[#FFFFFF] shadow-lg hover:bg-[#8572b5]'
                onClick={() => setUpGame()}
              >
                Play
              </button>
            </div>
          ) : (
            <div className='my-auto flex flex-row items-center'>
              <Link
                className='shadow-[0_4px_4px_0px_rgba(0, 0, 0, 0.25)] w-500px rounded-full border border-solid border-black bg-[#5B687C] px-32 py-2 text-4xl text-[#FFFFFF] shadow-lg'
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
