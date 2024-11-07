import Image from 'next/image';
import React, { useEffect } from 'react';
import { MdOutlineFemale, MdOutlineMale } from 'react-icons/md';

import { CountryCode, countryNameRecord } from './countryCode';

function getCountryCodeByName(countryName: string): CountryCode | undefined {
  return Object.keys(countryNameRecord).find(
    (code) => countryNameRecord[code as CountryCode] === countryName
  ) as CountryCode | undefined;
}

export default function ProfileAvatar({ session }: { session: any }) {
  const user = session?.user;
  const countryCode = getCountryCodeByName('Thailand');
  //const countryCode2 = getCountryCodeByName(user?.country ?? '');  implement country later
  useEffect(() => {
    console.log('countryCode:', countryCode);
  }, [user?.country]);

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
            <p className='text-sm'>Game Won : {user.gameWon}</p>{' '}
            <div className='flex flex-row gap-2'>
              <p className='flex gap-2 text-sm'>
                country flag : {user?.country}
              </p>
              <Image
                alt={countryCode?.toString() ?? 'unknown'}
                src={`http://purecatamphetamine.github.io/country-flag-icons/3x2/${countryCode}.svg`}
                width={20}
                height={20}
              />
            </div>
            <p className='flex gap-4 text-sm'>
              Gender :
              {user.gender === 'Male' ? (
                <MdOutlineMale width={12} height={12} className='mt-1' />
              ) : (
                <MdOutlineFemale width={12} height={12} className='mt-1' />
              )}
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
