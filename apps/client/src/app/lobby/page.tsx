'use client';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import React, { useState } from 'react';

export default function LobbyPage() {
  const { data: session } = useSession({
    required: false,
  });
  const [ready, setReady] = useState(false);

  const user = session?.user;
  return (
    <div className='flex justify-center'>
      <div className='mx-12 mt-6 flex max-w-[990px] flex-col items-center rounded-lg border-2 border-gray-600 bg-white pb-80'>
        <div className='mt-2 flex w-full flex-col items-center gap-2 py-2 text-2xl'>
          <div className='flex w-full items-center justify-between gap-20 px-20 pb-10 pt-4 text-3xl font-bold'>
            <h1 className='w-full'>Lobby </h1>
            <p className='w-full'>
              Room ID: <b>{roomId}</b>
            </p>
          </div>
          {session ? (
            <div className='mx-6 flex items-center justify-center gap-3 rounded-lg border-2 border-slate-400 px-64'>
              <Image
                className='mx-auto mb-2 mt-2 flex rounded-full border-2 border-black shadow-black drop-shadow-xl dark:border-slate-500'
                src={session?.user?.image ?? '/images/default-profile.png'}
                width={50}
                height={50}
                alt={session?.user?.name ?? 'Profile Pic'}
                priority={true}
              />
              <p>{session?.user?.name}</p>
            </div>
          ) : (
            <div className='mx-32 mb-4 flex items-center justify-center gap-3 rounded-lg border-2 border-slate-400 px-64 py-2'>
              <p>guest</p>
            </div>
          )}
          <p className='mb-8'>Waiting for players...</p>
          <ul>
            {players.map((player, index) => (
              <li key={index}>{player}</li>
            ))}
          </ul>
          <div className='flex w-full items-center justify-between gap-4 px-12'>
            <button className='w-full rounded-md border-2 px-2'>
              Leave Game
            </button>
            {ready ? (
              <button className='w-full rounded bg-green-600 px-4 py-2 text-white hover:bg-green-500'>
                Start Match
              </button>
            ) : (
              <p className='flex w-full items-center justify-center rounded bg-gray-600 px-4 py-2 text-white'>
                Waiting for other players...
              </p>
            )}
          </div>
        </div>

        {/* Game Settings */}
        <div className='col-span-1 rounded-lg bg-gray-900 p-4'>
          <h2 className='text-lg font-semibold'>Game Settings</h2>
          <div className='mt-4'>
            <p className='text-gray-400'>Lobby Name:</p>
            <p className='text-lg font-bold'>Lobby of {user?.name}</p>
          </div>
          <div className='mt-4'>
            <p className='text-gray-400'>Room Id::</p>
            <p className='text-lg font-bold'>123456</p>
          </div>
          <button className='mt-4 rounded bg-green-600 px-4 py-2 text-white hover:bg-green-500'>
            Change Modes
          </button>
        </div>
      </div>

      {/* chat room*/}
      <footer className='flex justify-center space-x-4 bg-gray-700 p-4'>
        <button className='rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-500'>
          chatroom
        </button>
      </footer>
    </div>
  );
}
