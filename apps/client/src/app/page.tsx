'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

import NavBar from '@/components/NavBar';
import Snowfall from '@/components/Snowfall';
import { Button } from '@/components/ui/button';
import Konami from '@/lib/Konami';

export default function Home() {
  const [roomId, setRoomId] = useState(0);
  const [joinId, setJoinId] = useState(0);
  const [snowing, setSnowing] = useState(false);
  const [mode, setMode] = useState(false);
  const { data: session } = useSession({
    required: false,
  });

  const setUpGame = () => {
    setRoomId(Math.floor(Math.random() * 1000000));
    setMode(true);
  };

  const handleChangeRoomId = (e: { target: { value: string } }) => {
    const newId = parseInt(e.target.value);
    if (!Number.isNaN(newId)) {
      setJoinId(newId);
    } else {
      setJoinId(0);
    }
    console.log(roomId);
  };

  return (
    <div className='mx-auto flex h-screen w-screen flex-col'>
      <NavBar session={session} />
      <div className='flex w-full flex-col items-center'>
        <Konami triggerSnow={() => setSnowing(true)} />
        {snowing && <Snowfall />}
        <div className='text-center text-[180px] font-semibold text-white drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]'>
          DupMe
        </div>

        <div className='mt-[12%] flex min-h-72 flex-grow items-center justify-between'>
          {!mode ? (
            <div className='my-auto flex flex-row items-center'>
              <button
                className='shadow-[0_4px_4px_0px_rgba(0, 0, 0, 0.25)] rounded-full border border-solid border-black bg-[#5B687C] px-44 py-2 text-4xl text-[#FFFFFF] shadow-lg hover:bg-[#8572b5]'
                onClick={() => {
                  setSnowing(false);
                  setUpGame();
                }}
              >
                Play
              </button>
            </div>
          ) : (
            <div>
              <div className='my-auto flex flex-col items-center gap-6'>
                <Button
                  onClick={() => setMode(false)}
                  className='shadow-[0_4px_4px_0px_rgba(0, 0, 0, 0.25)] w-500px w-full rounded-full border border-solid border-black bg-[#5B687C] px-44 py-6 text-4xl text-[#e6e6e6] shadow-lg'
                >
                  Back
                </Button>
                <Link
                  className='shadow-[0_4px_4px_0px_rgba(0, 0, 0, 0.25)] w-500px w-full rounded-full border border-solid border-black bg-[#5B687C] py-2 text-center text-3xl text-[#FFFFFF] shadow-lg hover:bg-[#8572b5]'
                  href={`/lobby/${roomId}?host=true`}
                >
                  Create Room
                </Link>
                <label className='bg rounded-lg bg-neutral-800 px-24 py-4 text-center text-white'>
                  Or Enter Room ID:
                </label>
                <div className='flex flex-row items-center'>
                  <input
                    type='text'
                    className='shadow-[0_4px_4px_0px_rgba(0, 0, 0, 0.25)] w-500px w-full rounded-full border border-solid border-black bg-[#a0a9b5] py-4 text-center text-2xl text-[#FFFFFF] shadow-lg'
                    value={joinId}
                    onChange={handleChangeRoomId}
                  />
                  <Link
                    className='shadow-[0_4px_4px_0px_rgba(0, 0, 0, 0.25)] w-500px w-40 rounded-full border border-solid border-black bg-[#436290] px-8 text-center text-xl text-[#FFFFFF] shadow-lg hover:bg-[#8572b5]'
                    href={`/lobby/${joinId}?host=false`}
                  >
                    Join Room
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
