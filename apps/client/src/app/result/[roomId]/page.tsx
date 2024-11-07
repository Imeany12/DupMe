'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

import { socket } from '@/socket';

export default function ResultPage() {
  const [result, setResult] = useState('Lose');
  const { data: session, status } =
    useSession({
      required: false,
    }) || {};

  useEffect(() => {
    const handleResult = ({
      result,
      winners,
    }: {
      result: string;
      winners: string[];
    }) => {
      console.log('helo');
      if (
        session &&
        session.user &&
        session.user.name &&
        winners.includes(session.user.name)
      ) {
        setResult(result);
      }
    };
    socket.on('result', () => {
      console.log('test result');
    });
  }, [socket]);

  return (
    <div className='h-full py-2'>
      <h1 className='text-center text-4xl font-bold'>
        {result === 'win'
          ? 'You Win!'
          : result === 'draw'
            ? 'Draw!'
            : 'You Lose!'}
      </h1>
    </div>
  );
}
