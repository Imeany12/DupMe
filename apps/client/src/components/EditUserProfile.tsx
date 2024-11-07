import { IUser } from '@repo/shared-types';
import Image from 'next/image';
import React, { useState } from 'react';

import { SERVER_URL } from '@/env';

import { CountryCode, countryNameRecord } from './countryCode';
import { Button } from './ui/button';

function getCountryCodeByName(countryName: string): CountryCode | undefined {
  return Object.keys(countryNameRecord).find(
    (code) => countryNameRecord[code as CountryCode] === countryName
  ) as CountryCode | undefined;
}

export default function ProfileAvatar({
  user,
  setEdit,
}: {
  user: IUser;
  setEdit: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [userInfo, setUserInfo] = useState<IUser>({
    name: user.name,
    password: '',
    image: user.image,
    email: '',
    createdAt: new Date(),
    dob: new Date(),
    bio: user.bio,
    gender: user.gender,
    games_won: 0,
    games_lost: 0,
    games_draw: 0,
    total_score: 0,
    country: user.country,
    matchHistory: [],
    keybindings: {
      C: 's',
      'C#': 'e',
      D: 'd',
      'D#': 'r',
      E: 'f',
      F: 'g',
      'F#': 'y',
      G: 'h',
      'G#': 'u',
      A: 'j',
      'A#': 'i',
      B: 'k',
    },
  });
  const handleInput = (e: {
    target: { name: string; value: string };
  }): void => {
    const { name, value } = e.target;
    setUserInfo({
      ...userInfo,
      [name]: value,
    });
    console.log(userInfo);
  };

  const handleSunmit = async () => {
    console.log('submit', userInfo);
    if (user) {
      const res = await fetch(`${SERVER_URL}/user/${user.name}/profile/edit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          //email: userInfo.email,
          //dob: userInfo.dob,
          bio: userInfo.bio,
          gender: userInfo.gender,
          country: userInfo.country,
          dob: userInfo.dob,
        }),
      });
      if (res.ok) {
        console.log('User profile updated');
        setEdit(false);
      } else {
        console.error('Failed to update user profile');
      }
    }
  };

  return (
    <div className='h-screen bg-zinc-900 font-sans text-white'>
      <section className='p-8'>
        {user ? (
          <div className='flex flex-col items-center gap-4'>
            <Image
              src={user?.image ?? '/images/default-profile.png'}
              alt='Player Avatar'
              width={100}
              height={100}
              className='rounded-full'
            />
            <form onSubmit={handleSunmit}>
              <div className='items- ml-4 flex w-full flex-col justify-between gap-4'>
                <div>
                  <label className='text-xl font-bold'>username: </label>
                  <input
                    className='w-3/5 rounded border px-2 py-2 text-lg leading-tight text-black focus:outline-indigo-300'
                    id='username'
                    name='username'
                    type='text'
                    placeholder='Username'
                    onChange={handleInput}
                    value={userInfo.name}
                  />
                </div>
                <div>
                  <label className='text-xl font-bold'>Password: </label>
                  <input
                    className='w-3/5 rounded border px-2 py-2 text-lg leading-tight text-black focus:outline-indigo-300'
                    id='password'
                    name='password'
                    type='password'
                    placeholder='Password'
                    onChange={handleInput}
                    value={userInfo.password}
                  />
                </div>
                <div className='flex flex-row gap-2'>
                  <label className='flex gap-2 text-xl'>Country :</label>
                  <input
                    className='w-3/5 rounded border text-lg leading-tight text-black focus:outline-indigo-300'
                    id='country'
                    name='country'
                    type='text'
                    placeholder='Country'
                    onChange={handleInput}
                    value={userInfo.country}
                  />
                </div>
                <div className='flex flex-row gap-2'>
                  <label className='flex gap-4 text-xl'>Gender :</label>
                  <select
                    id='gender'
                    name='gender'
                    className='w-3/5 rounded border px-2 py-2 text-lg leading-tight text-black focus:outline-indigo-300'
                    onChange={handleInput}
                  >
                    <option>Gender</option>
                    <option value='Male'>Male</option>
                    <option value='Female'>Female</option>
                    <option value=''>Prefer not to say</option>
                  </select>
                </div>
              </div>
              <div className='flex w-full flex-col items-center'>
                <fieldset className='flex w-full flex-col gap-2 border px-4 py-2'>
                  <legend className='mb-2 w-full text-xl font-semibold text-gray-500'>
                    About you!
                  </legend>
                  <textarea
                    className='border border-dashed px-2 py-3 text-black focus:outline-indigo-200'
                    id='bio'
                    name='bio'
                    rows={5}
                    placeholder='Tell us something about you'
                    onChange={handleInput}
                    value={userInfo.bio}
                  />
                </fieldset>
                <Button type='submit' className='mt-4 bg-slate-600 text-xl'>
                  Submit
                </Button>
              </div>
            </form>
          </div>
        ) : (
          <div className='flex items-center'>
            <h1 className='text-xl font-bold'>Guest</h1>
          </div>
        )}
      </section>
    </div>
  );
}
