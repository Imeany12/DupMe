'use client';

import Image from 'next/image';
import { useParams , useRouter} from 'next/navigation';
import { useSession } from 'next-auth/react';
import React, { use, useEffect, useRef, useState } from 'react';

import { socket } from '@/socket';
//need to change User to IUser and retrive the data from the server

type User =
  | {
      name?: string | null | undefined;
      email?: string | null | undefined;
      image?: string | null | undefined;
    }
  | undefined;

export default function LobbyPage() {
  const router = useRouter();
  const { roomId } = useParams();
  const { data: session ,status} = useSession({
    required: false,
  });
  let login = false;
  if(session){
    login = true;
  }
  const user = session?.user ?? ({ name: 'Guest' } as User);
  const [ready, setReady] = useState(false);
  //test map
  const [players, setPlayers] = useState<string[]>([]);
  const [isGameStarting, setIsGameStarting] = useState(false);
  const hasJoined = useRef(false);

  useEffect(() => {
    if (!user || !socket || !roomId || status === 'loading') return;
    console.log("Hi this is" + players);
    if (!hasJoined.current) {
      socket.emit('join_lobby', { username: user.name, roomId });
      console.log(`user ${user?.name} joined room-${roomId}`);
      hasJoined.current = true; // Mark as joined
    }
    if (players.length >= 2) {
      setReady(true);
    }

    socket.on('update_players', (playerList: string[]) => {
      console.log("this is playerlist:"+playerList);
      setPlayers(playerList);
    });
    socket.on('start_game', () => {
      setIsGameStarting(true);
    });

    return () => {
      socket.emit('leave_lobby', { roomId });
      socket.off('update_players');
      socket.off('start_game');
    };
  }, [user,socket,roomId]);

  const startGame = () => {
    if (players.length >= 2) {
      socket.emit('start_game', roomId);
      router.push(`/game/${roomId}`);
    }
  };
  return (
    <div className='min-h-screen bg-gray-800 text-white'>
      {/* Header: Player Info */}
      <header className='flex items-center justify-between bg-gray-900 p-4'>
        {session ? (
          <div className='flex items-center'>
            <Image
              src={user?.image ?? '/images/default-profile.png'}
              alt='Player Avatar'
              width={100}
              height={100}
              className='rounded-full'
            />
            <div className='ml-4'>
              <h1 className='text-xl font-bold'>{user?.name}</h1>
              <p className='text-sm'>Performance: 3,161pp</p>
              <p className='text-sm'>Accuracy: 97.17%</p>
              <p className='text-sm'>Lv98</p>
            </div>
          </div>
        ) : (
          <div className='flex items-center'>
            <h1 className='text-xl font-bold'>Guest</h1>
          </div>
        )}
        <div className='flex items-center'>
          <div className='relative h-2 w-40 rounded-full bg-gray-700'>
            <div
              className='absolute left-0 top-0 h-2 rounded-full bg-pink-500'
              style={{ width: '75%' }}
            ></div>
          </div>
          <p className='ml-2 text-sm'>#248705</p>
        </div>
      </header>

      {/* Main Lobby Content */}
      <div className='grid grid-cols-3 gap-4 p-6'>
        {/* Player List */}
        <div className='col-span-2 rounded-lg bg-gray-900 p-4'>
          <h2 className='mb-4 text-lg font-semibold'>
            Current Players : ({players.length})
          </h2>
          <ul className='space-y-2'>
            {/* All player in the room */}
            {players.map((user: string, index: number) => (
              <li key={index} className='flex items-center justify-between'>
                <div className='flex items-center gap-4'>
                  <Image
                    className='mx-auto mb-2 mt-2 flex rounded-full border-2 border-black shadow-black drop-shadow-xl dark:border-slate-500'
                    src={session?.user?.image ?? '/images/default-profile.png'}
                    width={50}
                    height={50}
                    alt={session?.user?.name ?? 'Profile Pic'}
                    priority={true}
                  />
                  <span className='font-semibold text-pink-500'>{user[0]}</span>
                </div>
                <div>
                  {/* for some indicator player playing ex. locked icon */}
                </div>
              </li>
            ))}
          </ul>
          <div className='flex w-full items-center justify-between gap-20 px-12 pt-2'>
            <button
              className='w-full rounded bg-yellow-600 px-4 py-2 text-white hover:bg-yellow-500'
              onClick={() => console.log(players)}
            >
              Leave Match
            </button>
            {ready ? (
              <button className='w-full rounded bg-green-600 px-4 py-2 text-white hover:bg-green-500'
              onClick={startGame}>
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
        <button
          className='rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-500'
          onClick={() => {
            console.log({ roomId });
            console.log(players);
          }}
        >
          chatroom
        </button>
        {/* <ChatPage socket={socket} username={user?.name ?? 'Guest'
        } roomId= {parseInt(roomId as string)} /> */}
      </footer>
    </div>
  );
}
