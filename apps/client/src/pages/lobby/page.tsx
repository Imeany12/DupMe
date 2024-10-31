'use client';

import { TH } from 'country-flag-icons/react/3x2';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';
import { MdOutlineMale } from 'react-icons/md';

import { CountryCode, countryNameRecord } from '@/components/countryCode';
import ProfileAvatar from '@/components/ProfileAvatar';
import { socket } from '@/socket';

import ChatPage from '../chat/page';

function getCountryCodeByName(countryName: string): CountryCode | undefined {
  return Object.keys(countryNameRecord).find(
    (code) => countryNameRecord[code as CountryCode] === countryName
  ) as CountryCode | undefined;
}
export default function Lobby({
  host,
  roomId,
}: {
  host: string;
  roomId: string;
}): React.JSX.Element {
  const countryCode = getCountryCodeByName('Thailand');
  //const flag = getCountryFlagEmoji(countryCode as CountryCode);

  useEffect(() => {
    console.log('countryCode:', countryCode);
  }, []);

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
  const searchParams = useSearchParams();
  const limit = searchParams.get('multi') === 'true';
  //same for this need to use searchParams

  useEffect(() => {
    console.log('multiplayer', limit);
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
    socket.on('start_game', (username: string[]) => {
      hasJoined.current = false;
      for (let i = 0; i < username.length; i++) {
        console.log(username[i]);
        if (username[i][0].toString() === user.name?.toString()) {
          console.log(username[i][0] + 'vs' + user.name);
          const start: boolean = i === 0;
          router.push(
            `/game/${roomId}?host=${start}&players=${readyPlayers}&turn=${i + 1}`
          );
        }
      }
    });

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
              <p className='text-sm'>Game Won : {0}</p> {/*IUSer.gameWon */}
              <p className='text-sm'>Lv98</p> {/*IUser.level maybe */}
              <p className='flex gap-2 text-sm'>
                country flag :
                <TH width={22} className='mt-0.5' />
              </p>
              <p className='flex gap-4 text-sm'>
                Gender :
                <MdOutlineMale width={12} height={12} className='mt-1' />
              </p>
            </div>
          </div>
        ) : (
          <div className='flex items-center'>
            <h1 className='text-xl font-bold'>Guest</h1>
          </div>
        )}
        <div className='flex items-center'>
          {/* <div className='relative h-2 w-40 rounded-full bg-gray-700'>
                <div
                  className='absolute left-0 top-0 h-2 rounded-full bg-pink-500'
                  style={{ width: '75%' }}
                ></div>
              </div>
              <p className='ml-2 text-sm'>#248705</p> */}
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
