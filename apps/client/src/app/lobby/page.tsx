'use client';

import Image from 'next/image';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';

import { socket } from '@/socket';
// import style from './lobby.module.css';

export default function LobbyPage({ username, roomId }: any) {
  const { data: session } = useSession({
    required: false,
  });
  const [players, setPlayers] = useState<string[]>([]);
  const [isGameStarting, setIsGameStarting] = useState(false);

  // Emit player join event when component mounts
  useEffect(() => {
    socket.emit('join_lobby', { username, roomId });

    socket.on('update_players', (playerList: string[]) => {
      setPlayers(playerList);
    });

    socket.on('start_game', () => {
      setIsGameStarting(true);
    });

    return () => {
      socket.emit('leave_lobby', { username, roomId });
      socket.off('update_players');
      socket.off('start_game');
    };
  }, [socket, username, roomId]);

  const startGame = () => {
    if (players.length >= 2) {
      socket.emit('start_game', roomId);
    }
  };

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
            <p>guest</p>
          )}
          <p className='mb-8'>Waiting for players...</p>
          <ul>
            {players.map((player, index) => (
              <li key={index}>{player}</li>
            ))}
          </ul>
          <div className='flex w-full items-center justify-between gap-4 px-6'>
            <button className='w-full rounded-md border-2 px-2'>
              Leave Game
            </button>
            {players.length >= 2 ? (
              <button
                className='flex w-full items-center rounded-md border-2 px-2 text-xl md:justify-center'
                onClick={startGame}
              >
                Start Game
              </button>
            ) : (
              <p className='flex w-full flex-col items-center rounded-md border-2 px-2 text-lg md:justify-center'>
                Waiting for other players to join...
              </p>
            )}
            {isGameStarting && <p>Game is starting...</p>}
          </div>
          {/* {chatroom} */}
        </div>
      </div>
    </div>
  );
}
