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
import { CopyToClipboardButton } from '@/components/ui/button';
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
  const { data: session, status } =
    useSession({
      required: false,
    }) || {};
  const Host = host === 'true';
  const user = session?.user ?? ({ name: 'Guest' } as User);
  const [ready, setReady] = useState(false);
  const [readyPlayers, setReadyPlayers] = useState(1);
  const [isStarting, setIsStarting] = useState(false);
  //test map
  const [players, setPlayers] = useState<string[]>([]);
  const [amReady, setAmReady] = useState(false);
  const hasJoined = useRef(false);
  const searchParams = useSearchParams();
  const limit = searchParams.get('multi') === 'false';
  const [mem, setMem] = useState(false);
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
          if (mem) {
            router.push('/welcome');
            setTimeout(() => {
              router.push(
                `/mem/${roomId}?host=${start}&players=${readyPlayers}&turn=${i + 1}`
              );
            }, 5000);
          } else {
            router.push('/welcome');
            setTimeout(() => {
              router.push(
                `/game/${roomId}?host=${start}&players=${readyPlayers}&turn=${i + 1}`
              );
            }, 5000);
          }
        }
      }
    });

    return () => {
      //socket.emit('leave_lobby', { roomId });
      socket.off('update_players');
      socket.off('start_game');
      socket.off('setReady');
    };
  }, [user, socket, roomId, readyPlayers, hasJoined, players, mem]);

  const startGame = () => {
    hasJoined.current = false;
    socket.emit('start_game', roomId);
    // router.push(`/game/${roomId}`);
  };
  return isStarting ? (
    <div className='flex min-h-screen text-white'>
      <div className='flex flex-col items-center justify-center'>
        <div>Game is starting...</div>
        <div>Welcome to Dupme</div>
      </div>
    </div>
  ) : (
    <div className='bg-note1 flex min-h-screen flex-col text-white'>
      {/* Header: Player Info */}
      <header className='bg-note2 flex items-center justify-between p-4'>
        <ProfileAvatar session={session} />
      </header>

      {/* Main Lobby Content */}
      <div className='grid grid-cols-3 gap-4 p-6'>
        {/* Player List */}
        <div className='bg-note2 col-span-2 rounded-lg p-4'>
          <h2 className='mb-4 text-lg font-semibold'>
            Current Players : ({players.length})
          </h2>
          <ul className='space-y-2'>
            {/* All player in the room */}
            {players.map((user: string, index: number) => (
              <li
                key={index}
                className='bg-note1 mx-2 flex items-center justify-between rounded-xl border-2 px-3'
              >
                <div className='flex items-center gap-4'>
                  <Image
                    className='mx-auto mb-2 mt-2 flex rounded-full border-2 border-black shadow-black drop-shadow-lg dark:border-slate-500'
                    src={user[1] ?? '/images/default-profile.png'}
                    width={50}
                    height={50}
                    alt={session?.user?.name ?? 'Profile Pic'}
                    priority={true}
                  />
                  <span className='text-note2 font-semibold'>{user[0]}</span>
                </div>
                <div>
                  {/* for some indicator player playing ex. locked icon */}
                </div>
              </li>
            ))}
          </ul>
          <div className='flex w-full items-center justify-between gap-10 px-[10%] pt-4'>
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
        <div className='bg-note2 col-span-1 rounded-lg p-4'>
          <h2 className='text-lg font-semibold'>Game Settings</h2>
          <div className='mt-4'>
            <p className='text-gray-400'>Lobby Name:</p>
            <p className='text-lg font-bold'>Lobby of {user?.name}</p>
          </div>
          <div className='mt-4'>
            <p className='text-gray-400'>Room Id:</p>
            <div className='flex flex-row justify-between'>
              <p className='text-2xl font-bold'>{roomId}</p>
              <CopyToClipboardButton textToCopy={roomId} />
            </div>
          </div>
          {mem ? (
            <button
              className='bg-note1 mt-4 rounded px-4 py-2 text-white hover:bg-green-500'
              onClick={() => setMem(false)}
            >
              Memorize Mode
            </button>
          ) : (
            <button
              className='bg-note mt-4 rounded px-4 py-2 text-white hover:bg-green-500'
              onClick={() => setMem(true)}
            >
              Rainfall mode
            </button>
          )}
        </div>
      </div>

      {/* chat room*/}
      <footer className='flex w-full flex-grow items-center justify-center space-x-4 bg-zinc-600 p-4'>
        <ChatPage
          socket={socket}
          username={user?.name ?? 'Guest'}
          roomId={parseInt(roomId as string)}
        />
      </footer>
    </div>
  );
}
