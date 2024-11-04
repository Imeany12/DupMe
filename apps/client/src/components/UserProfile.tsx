import { IUser } from '@repo/shared-types';
import Image from 'next/image';

import { IoMdMale } from 'react-icons/io';

import getFormattedDate from '@/lib/getFormattedDate';

import { CountryCode, countryNameRecord } from './countryCode';

function getCountryCodeByName(countryName: string): CountryCode | undefined {
  return Object.keys(countryNameRecord).find(
    (code) => countryNameRecord[code as CountryCode] === countryName
  ) as CountryCode | undefined;
}

export default function UserProfile({ user }: { user: IUser }) {
  // const user0 = await fetch(`http://localhost:5001/user/${user.username}`, {
  //   method: 'GET',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  // });
  // user = await user0.json();
  const countryCode = getCountryCodeByName(user?.country ?? 'Thailand');
  const userImage = user?.image ? (
    <Image
      className='mx-auto mt-8 rounded-full border-4 border-black shadow-black drop-shadow-xl'
      src={user?.image}
      width={200}
      height={200}
      alt={user?.username ?? 'Profile Pic'}
      priority={true}
    />
  ) : (
    <Image
      className='border-note mx-auto mt-8 rounded-full border-4 shadow-black drop-shadow-xl'
      src={'/images/default-profile.png'}
      alt='Player Avatar'
      width={100}
      height={100}
    />
  );

  return (
    <div className='h-screen bg-zinc-900 font-sans text-white'>
      {/* Profile Section */}
      <section className='p-8'>
        <div className='flex flex-col items-center'>
          {userImage}
          <div className='ml-6 flex flex-col gap-2'>
            <h1 className='text-3xl font-bold'>{user?.username}</h1>
            <div>
              <p className='text-sm text-gray-400'>Thailand</p>
            </div>
          </div>
        </div>

        {/* Ranking and Stats */}
        <div className='mt-8 grid grid-cols-2 items-center justify-between gap-4'>
          <div className='flex flex-col items-center pl-24'>
            <h2 className='text-xl font-semibold'>Joined Since:</h2>
            <p>
              {getFormattedDate(user?.createdAt?.toString() || '01/01/2000')}
            </p>
          </div>
          <div className='flex flex-col items-center pr-24'>
            <h2 className='text-xl font-semibold'>Country : </h2>
            <div className='flex flex-row gap-3'>
              <p>{user?.country}</p>
              <Image
                alt={countryCode ?? 'unknown'}
                src={`http://purecatamphetamine.github.io/country-flag-icons/3x2/${countryCode}.svg`}
                width={20}
                height={20}
              />
            </div>
          </div>
          <div className='flex flex-col items-center pr-24'>
            <h2 className='text-xl font-semibold'>Gender : </h2>
            <p>{user?.gender}</p>
            <IoMdMale className='text-2xl text-gray-400' />
          </div>
          <div className='flex flex-col items-center pr-24'>
            <h2 className='text-xl font-semibold'>About me : </h2>
            <p>{user?.bio}</p>
          </div>
        </div>

        {/* Score & Stats */}
        <div className='m-8 mx-32 flex flex-col items-center justify-center bg-gray-800'>
          <h3 className='mt-4 text-2xl font-semibold underline'>Statistics</h3>
          <div className='my-6 grid grid-cols-2 gap-32'>
            <div className='flex w-full flex-col items-center gap-4'>
              <p>
                Game Won : <span className='font-bold'>{user?.games_won}</span>
              </p>
              <p>
                Game Lost :<span className='font-bold'>{user?.games_lost}</span>
              </p>
              <p>
                Game Draw :<span className='font-bold'>{user?.games_draw}</span>
              </p>
            </div>
            <div className='flex w-full flex-col items-center gap-4'>
              <p>
                Hit Count: <span className='font-bold'>4,016,360</span>
              </p>
              <p>
                Max Combo: <span className='font-bold'>1,257</span>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
