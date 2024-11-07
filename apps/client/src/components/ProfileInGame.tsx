import Image from 'next/image';
import React from 'react';

export default function ProfileInGame({ session }: { session: any }) {
  const user = session?.user;
  return (
    <>
      {session ? (
        <div className='flex min-w-20 items-center'>
          <Image
            src={user?.image ?? '/images/default-profile.png'}
            alt='Player Avatar'
            width={100}
            height={100}
            className='rounded-full'
          />
        </div>
      ) : (
        <div className='flex items-center'>
          <h1 className='text-xl font-bold'>Guest</h1>
        </div>
      )}
    </>
  );
}
