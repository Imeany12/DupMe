import { TH } from 'country-flag-icons/react/3x2';
import Image from 'next/image';
import React from 'react';
import { MdOutlineMale } from 'react-icons/md';

export default function ProfileAvatar({ session }: { session: any }) {
  const user = session?.user;
  return (
    <>
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
    </>
  );
}
