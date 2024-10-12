import React from 'react';

export default function SignUpPage() {
  return (
    <div>
      <h1 className='py-2 pb-10 text-center text-3xl'>Register</h1>
      <form className='mx-auto w-5/6 max-w-xl rounded-xl bg-white px-8 py-2'>
        <fieldset className='flex flex-col gap-2 border px-4 py-2'>
          <legend className='mb-2 text-2xl font-semibold text-gray-500'>
            About YOU!
          </legend>
          <div className='flex flex-col'>
            <label className='text-3xl font-semibold'>
              What&apos;s your name?
            </label>
            <input
              className='mb-3 mt-4 w-3/5 rounded border px-2 py-2 text-lg leading-tight focus:outline-indigo-300'
              id='firstName'
              name='firstName'
              type='text'
              placeholder='First Name'
              //onChange={handleInput}
            />
            <input
              className='mb-3 mt-4 w-3/5 rounded border px-2 py-2 text-lg leading-tight focus:outline-indigo-300'
              id='lastName'
              name='lastName'
              type='text'
              placeholder='Last Name'
              //onChange={handleInput}
            />
          </div>
          <div className='flex flex-col'>
            <label className='text-3xl font-semibold'>
              What&apos;s your email?
            </label>
            <input
              className='mb-3 mt-4 w-3/5 rounded border px-2 py-2 text-lg leading-tight focus:outline-indigo-300'
              id='email'
              name='email'
              type='email'
              placeholder='example@email.com'
              //onChange={handleInput}
            />
          </div>
          <div className='flex flex-col'>
            <label className='text-3xl font-semibold'>
              What&apos;s your date of birth
            </label>
            <input
              className='mb-3 mt-4 w-3/5 rounded border px-2 py-2 text-lg leading-tight focus:outline-indigo-300'
              id='dob'
              name='dob'
              type='date'
              max='2006-03-31'
              placeholder='Date of Birth' //won't show up
              //   onChange={handleInput}
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
              //    onChange={handleInput}
            >
              <option>Gender</option>
              <option value='Male'>Male</option>
              <option value='Female'>Female</option>
              <option value='MTF'>MTF</option>
              <option value='FTM'>FTM</option>
              <option value='Non'>Non-Binary</option>
              <option value='Unknown'>Prefer not to say</option>
            </select>
          </div>
        </fieldset>
        <fieldset className='flex flex-col gap-2 border px-4 py-2'>
          <legend className='mb-2 text-2xl font-semibold text-gray-500'>
            Prompt
          </legend>
        </fieldset>
      </form>
    </div>
  );
}
