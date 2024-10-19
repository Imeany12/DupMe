'use client';
import { IUser } from '@repo/shared-types';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useState } from 'react';

export default function SignUpPage() {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<IUser>({
    username: '',
    password: '',
    image: '',
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
  });
  const handleInput = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setUserInfo({
      ...userInfo,
      [name]: value,
    });
    console.log(userInfo);
  };
  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:5001/user/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: userInfo.username,
          password: userInfo.password,
        }),
      });

      const result = await res.json();

      if (res.ok) {
        alert('User created successfully');
        console.log('User creation result:', result);
      } else {
        alert('Error creating user');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
    router.push(
      'signIn?username=' + userInfo.username + '&password=' + userInfo.password
    );
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
              id='username'
              name='username'
              type='text'
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
              placeholder='your password'
              onChange={handleInput}
            />
          </div>
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
              <option value='MTF'>MTF</option>
              <option value='FTM'>FTM</option>
              <option value='Non'>Non-Binary</option>
              <option value=''>Prefer not to say</option>
            </select>
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
