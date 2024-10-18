'use client';

import { useSession } from 'next-auth/react';
import { useState } from 'react';

import NavBar from '@/components/NavBar';
import Snowfall from '@/components/Snowfall';
import Konami from '@/lib/Konami';

export default function Home() {
  const [snowing, setSnowing] = useState(false);
  const [mode, setMode] = useState(false);
  const { data: session } = useSession({
    required: false,
  });

  return (
    <div>
      <NavBar session={session} />
      <div className='mx-auto flex h-screen w-screen flex-col items-center'>
        <Konami triggerSnow={() => setSnowing(true)} />
        {snowing && <Snowfall />}
        <div className='text-center text-[180px] font-semibold text-white'>
          DupMe
        </div>

        {!mode ? (
          <div className='flex h-screen flex-row items-end'>
            <button
              className='my-64 rounded-lg border border-gray-500 bg-gray-200 px-8 py-2 text-4xl text-sky-600'
              onClick={() => {
                setMode(true);
                setSnowing(false);
              }}
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
