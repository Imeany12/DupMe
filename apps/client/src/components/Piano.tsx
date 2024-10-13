import React from 'react';

export default function Piano() {
  return (
    <div className='flex h-svh w-screen flex-col items-center justify-end pb-24'>
      <div className='relative'>
        {/* White Keys */}
        <div className='flex'>
          <button className='h-52 w-20 flex-shrink-0 rounded-b-lg rounded-s-lg border bg-gradient-to-b from-[#DCDCDC] to-[#F7F7F7]'>
            C
          </button>
          <button className='h-52 w-20 flex-shrink-0 rounded-b-lg border bg-gradient-to-b from-[#DCDCDC] to-[#F7F7F7]'>
            D
          </button>
          <button className='h-52 w-20 flex-shrink-0 rounded-b-lg border bg-gradient-to-b from-[#DCDCDC] to-[#F7F7F7]'>
            E
          </button>
          <button className='h-52 w-20 flex-shrink-0 rounded-b-lg border bg-gradient-to-b from-[#DCDCDC] to-[#F7F7F7]'>
            F
          </button>
          <button className='h-52 w-20 flex-shrink-0 rounded-b-lg border bg-gradient-to-b from-[#DCDCDC] to-[#F7F7F7]'>
            G
          </button>
          <button className='h-52 w-20 flex-shrink-0 rounded-b-lg border bg-gradient-to-b from-[#DCDCDC] to-[#F7F7F7]'>
            A
          </button>
          <button className='h-52 w-20 flex-shrink-0 rounded-b-lg rounded-e-lg border bg-gradient-to-b from-[#DCDCDC] to-[#F7F7F7]'>
            B
          </button>
        </div>

        {/* Black Keys */}
        <div className='absolute left-5 top-0 flex'>
          <button className='absolute ml-[4px] h-44 w-12 translate-x-8 transform rounded-b-lg border border-[#171717] bg-[#3B3B3B]'>
            C#
          </button>
          <button className='absolute ml-[36px] h-44 w-12 translate-x-20 transform rounded-b-lg border border-[#171717] bg-[#3B3B3B]'>
            D#
          </button>
          {/* No black key between E and F */}
          <button className='absolute ml-[84px] h-44 w-12 translate-x-48 transform rounded-b-lg border border-[#171717] bg-[#3B3B3B]'>
            F#
          </button>
          <button className='absolute ml-[116px] h-44 w-12 translate-x-60 transform rounded-b-lg border border-[#171717] bg-[#3B3B3B]'>
            G#
          </button>
          <button className='absolute ml-[148px] h-44 w-12 translate-x-72 transform rounded-b-lg border border-[#171717] bg-[#3B3B3B]'>
            A#
          </button>
        </div>
      </div>
    </div>
  );
}
