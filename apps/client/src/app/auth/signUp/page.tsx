'use client';

import { IUser } from '@repo/shared-types';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useState } from 'react';

import CountrySelector from '@/components/CountrySelector';
import { SERVER_URL } from '@/env';

export default function SignUpPage(): React.JSX.Element {
  const typed_password_confirm = '';
  const [password_confirm, setPassword_confirm] = useState('');
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<IUser>({
    name: '',
    password: '',
    image: 'images/default-profile.png',
    email: '',
    createdAt: new Date(),
    dob: new Date(),
    bio: '',
    gender: '',
    games_won: 0,
    games_lost: 0,
    games_draw: 0,
    total_score: 0,
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
  };
  const handleSubmit = async (e: {
    preventDefault: () => void;
  }): Promise<void> => {
    e.preventDefault();
    if (password_confirm !== userInfo.password || userInfo.password.length < 4)
      return;
    try {
      // Test this with 2 devices
      const res = await fetch(`${SERVER_URL}/user/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: userInfo.name,
          password: userInfo.password,
          email: userInfo.email,
          dob: userInfo.dob,
          bio: userInfo.bio,
          gender: userInfo.gender,
          country: userInfo.country,
          keybindings: userInfo.keybindings,
        }),
      });

      const result = await res.json();

      if (res.ok) {
        alert('User created successfully');
        console.log('User creation result:', result);
        router.push(
          'signIn?username=' + userInfo.name + '&password=' + userInfo.password
        );
      } else {
        alert('Error creating user');
        console.log(result);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  //need div for iput images still no idea
  return (
    <div className='h-full py-2'>
      <h1 className='py-2 pb-10 text-center text-3xl text-white'>Register</h1>
      <form
        className='mx-auto w-5/6 max-w-xl rounded-xl bg-white px-8 py-2'
        onSubmit={handleSubmit}
      >
        <fieldset className='flex flex-col gap-2 border px-4 py-2'>
          <legend className='mb-2 text-2xl font-semibold text-gray-500'>
            Set up your account
          </legend>
          <div className='flex flex-col'>
            <label className='text-3xl font-semibold'>Username</label>
            <input
              className='mb-3 mt-4 w-3/5 rounded border px-2 py-2 text-lg leading-tight focus:outline-indigo-300'
              id='name'
              name='name'
              type='text'
              value={userInfo.name}
              placeholder='IGN (In-Game Name)'
              onChange={handleInput}
            />
          </div>
          <div className='flex flex-col'>
            <label className='text-3xl font-semibold'>Password</label>
            <input
              className='mb-3 mt-4 w-3/5 rounded border px-2 py-2 text-lg leading-tight focus:outline-indigo-300'
              id='password'
              name='password'
              type='password'
              value={userInfo.password}
              placeholder='your password'
              onChange={handleInput}
            />
          </div>
          <div className='flex flex-col'>
            <label className='text-3xl font-semibold'>
              Confirm Your Password
            </label>
            <input
              className='mb-3 mt-4 w-3/5 rounded border px-2 py-2 text-lg leading-tight focus:outline-indigo-300'
              id='password'
              name='password_confirm'
              type='password'
              value={password_confirm}
              placeholder='your password'
              onChange={(e) => {
                setPassword_confirm(e.target.value);
              }}
            />
          </div>
          {password_confirm !== userInfo.password &&
          password_confirm.length >= (userInfo.password?.length || 0) ? (
            <p className='text-red-500'>Your password do not match</p>
          ) : (
            <></>
          )}
          {password_confirm === userInfo.password &&
          password_confirm.length > 4 ? (
            <></>
          ) : (
            <p>password must contain at least 4 letters</p>
          )}
          <div className='flex flex-col'>
            <label className='text-3xl font-semibold'>Email (Optional)</label>
            <input
              className='mb-3 mt-4 w-3/5 rounded border px-2 py-2 text-lg leading-tight focus:outline-indigo-300'
              id='email'
              name='email'
              type='email'
              placeholder='example@email.com'
              onChange={handleInput}
            />
          </div>
          <div className='flex flex-col'>
            <label className='text-3xl font-semibold'>
              What&apos;s your date of birth (optional)
            </label>
            <input
              className='mb-3 mt-4 w-3/5 rounded border px-2 py-2 text-lg leading-tight focus:outline-indigo-300'
              id='dob'
              name='dob'
              type='date'
              max='2006-03-31'
              placeholder='Date of Birth' //won't show up
              onChange={handleInput}
            />
          </div>
          <div className='flex flex-col'>
            <label className='text-3xl font-semibold'>
              What&apos;s your gender?
            </label>
            <select
              id='gender'
              name='gender'
              className='mb-3 mt-4 w-3/5 rounded border px-2 py-2 text-lg leading-tight focus:outline-indigo-300'
              onChange={handleInput}
            >
              <option>Gender</option>
              <option value='Male'>Male</option>
              <option value='Female'>Female</option>
              <option value=''>Prefer not to say</option>
            </select>
          </div>
          <div className='flex flex-col'>
            <CountrySelector onChange={handleInput} />
          </div>
        </fieldset>
        <fieldset className='flex flex-col gap-2 border px-4 py-2'>
          <legend className='mb-2 text-2xl font-semibold text-gray-500'>
            About you!
          </legend>
          <textarea
            className='mb-4 border border-dashed px-2 py-3 focus:outline-indigo-200'
            id='bio'
            name='bio'
            rows={5}
            placeholder='Tell us something about you'
            onChange={handleInput}
          />
        </fieldset>
        <div className='flex w-full flex-col items-center'>
          <button
            type='submit'
            className='my-4 rounded-md border-2 border-neutral-500 px-4 text-xl'
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
}
