'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';

import ProfileAvatar from '@/components/ProfileAvatar';
import { socket } from '@/socket';

import ChatPage from '../chat/page';

export default function Lobby({
  host,
  roomId,
}: {
  host: string;
  roomId: string;
}): React.JSX.Element {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: false,
  });
  const Host = host === 'true';
  const user = session?.user ?? ({ name: 'Guest' } as User);
  const [ready, setReady] = useState(false);
  const [readyPlayers, setReadyPlayers] = useState(1);
  //test map
  const [players, setPlayers] = useState<string[]>([]);
  const [amReady, setAmReady] = useState(false);
  const hasJoined = useRef(false);

  useEffect(() => {
    console.log('this is player');
    socket.on('setReady', (readyPlayers: number) => {
      console.log('setReady', readyPlayers);
      setReadyPlayers(readyPlayers);
    });
    if (!user || !socket || !roomId || status === 'loading') return;
    if (!hasJoined.current) {
      socket.emit('join_lobby', {
        username: user.name,
        image: user.image ?? '/images/default-profile.png',
        roomId,
      });
      console.log(`user ${user?.name} joined room-${roomId}`);
      hasJoined.current = true; // Mark as joined
    }
    if (players.length >= 2) {
      setReady(true);
    }

    socket.on('update_players', (playerList: string[]) => {
      console.log('this is playerlist:' + playerList);
      setPlayers(playerList);
    });
    socket.on('start_game', (username) => {
      hasJoined.current = false;
      if (username.toString() === user.name?.toString()) {
        console.log(username + 'vs' + user.name);
        router.push(`/game/${roomId}?host=true`);
      } else {
        console.log(username + 'false' + user.name);
        router.push(`/game/${roomId}?host=false`);
      }
    });
    //now having problem first player, host always false

    return () => {
      //socket.emit('leave_lobby', { roomId });
      socket.off('update_players');
      socket.off('start_game');
      socket.off('setReady');
    };
  }, [user, socket, roomId, readyPlayers, hasJoined, players]);

  const startGame = () => {
    hasJoined.current = false;
    socket.emit('start_game', roomId);
    // router.push(`/game/${roomId}`);
  };
  return (
    <div className='flex min-h-screen flex-col bg-gray-800 text-white'>
      {/* Header: Player Info */}
      <header className='flex items-center justify-between bg-gray-900 p-4'>
        <ProfileAvatar session={session} />
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
                    src={user[1] ?? '/images/default-profile.png'}
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
          <div className='flex w-full items-center justify-between gap-10 px-12 pt-2'>
            <Link
              href='/'
              className='w-full rounded bg-yellow-600 px-4 py-2 hover:bg-yellow-500'
            >
              <button
                onClick={() => socket.emit('leave_lobby', { roomId })}
                className='w-full text-center text-white'
              >
                Leave Match
              </button>
            </Link>
            {Host ? (
              <div className='w-full'>
                {ready && readyPlayers >= players.length ? (
                  <button
                    className='w-full rounded bg-green-600 px-4 py-2 text-white hover:bg-green-500'
                    onClick={startGame}
                  >
                    Start Match
                  </button>
                ) : (
                  <p className='flex w-full items-center justify-center rounded bg-gray-600 px-4 py-2 text-white'>
                    Waiting for other players...
                  </p>
                )}
              </div>
            ) : (
              <div className='w-full'>
                {!amReady ? (
                  <button
                    className='w-full rounded bg-green-600 px-4 py-2 text-white hover:bg-green-500'
                    onClick={() => {
                      setAmReady(true);
                      socket.emit('countReady', readyPlayers + 1, roomId);
                      // setReadyPlayers(readyPlayers + 1);
                    }}
                  >
                    Ready
                  </button>
                ) : (
                  <button
                    className='w-full rounded bg-orange-800 px-4 py-2 text-white hover:bg-red-500'
                    onClick={() => {
                      setAmReady(false);
                      socket.emit('countReady', readyPlayers - 1, roomId);
                      setReadyPlayers(readyPlayers - 1);
                    }}
                  >
                    UnReady
                  </button>
                )}
              </div>
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
            <p className='text-2xl font-bold'>{roomId}</p>
          </div>
          <button className='mt-4 rounded bg-green-600 px-4 py-2 text-white hover:bg-green-500'>
            Change Modes
          </button>
        </div>
      </div>

      {/* chat room*/}
      <footer className='flex w-full flex-grow items-center justify-center space-x-4 bg-gray-700 p-4'>
        <ChatPage
          socket={socket}
          username={user?.name ?? 'Guest'}
          roomId={parseInt(roomId as string)}
        />
      </footer>
    </div>
  );
}
