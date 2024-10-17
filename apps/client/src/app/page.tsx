'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

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

        <div className='flex min-h-72 flex-grow items-center mt-10 justify-between '>
          {!mode ? (
            <div className='my-auto flex flex-row items-center'>
              <button
                className='shadow-[0_4px_4px_0px_rgba(0, 0, 0, 0.25)] rounded-full border border-solid border-black bg-[#5B687C]  py-2 w-full px-32 text-4xl text-[#FFFFFF] shadow-lg hover:bg-[#8572b5]'
                onClick={() => setUpGame()}
                >
                Play
              </button>
            </div>
          ) : (
            <div>
            <div className='my-auto flex flex-col items-center gap-8'>
            <Button onClick={()=>setMode(false)}
              className='w-full shadow-[0_4px_4px_0px_rgba(0, 0, 0, 0.25)] w-500px rounded-full border border-solid border-black bg-[#5B687C] px-32 py-6 text-4xl text-[#FFFFFF] shadow-lg'>
              Back
            </Button>
              <Link
                className='shadow-[0_4px_4px_0px_rgba(0, 0, 0, 0.25)] w-500px rounded-full border border-solid border-black bg-[#5B687C] w-full text-center py-2 text-4xl text-[#FFFFFF] shadow-lg hover:bg-[#8572b5]'
                href={`/lobby/${roomId}`}
                >
                2 Player
              </Link>
            </div>
                </div>
          )}
        </div>
      </div>
    </div>
  );
}
