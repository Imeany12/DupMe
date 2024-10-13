import React from 'react';

export default function Piano({
  onNoteClick,
}: {
  onNoteClick: (note: string) => void;
}) {
  return (
    <div className='flex rounded-3xl border-2 bg-white p-2'>
      <div className='relative'>
        {/* White Keys */}
        <div className='flex text-gray-700'>
          <button
            className='h-52 w-20 flex-shrink-0 rounded-b-lg rounded-s-lg border bg-gradient-to-b from-[#DCDCDC] to-[#F7F7F7]'
            onClick={() => onNoteClick('C')}
          >
            C
          </button>
          <button
            className='h-52 w-20 flex-shrink-0 rounded-b-lg border bg-gradient-to-b from-[#DCDCDC] to-[#F7F7F7]'
            onClick={() => onNoteClick('D')}
          >
            D
          </button>
          <button
            className='h-52 w-20 flex-shrink-0 rounded-b-lg border bg-gradient-to-b from-[#DCDCDC] to-[#F7F7F7]'
            onClick={() => onNoteClick('E')}
          >
            E
          </button>
          <button
            className='h-52 w-20 flex-shrink-0 rounded-b-lg border bg-gradient-to-b from-[#DCDCDC] to-[#F7F7F7]'
            onClick={() => onNoteClick('F')}
          >
            F
          </button>
          <button
            className='h-52 w-20 flex-shrink-0 rounded-b-lg border bg-gradient-to-b from-[#DCDCDC] to-[#F7F7F7]'
            onClick={() => onNoteClick('G')}
          >
            G
          </button>
          <button
            className='h-52 w-20 flex-shrink-0 rounded-b-lg border bg-gradient-to-b from-[#DCDCDC] to-[#F7F7F7]'
            onClick={() => onNoteClick('A')}
          >
            A
          </button>
          <button
            className='h-52 w-20 flex-shrink-0 rounded-b-lg rounded-e-lg border bg-gradient-to-b from-[#DCDCDC] to-[#F7F7F7]'
            onClick={() => onNoteClick('B')}
          >
            B
          </button>
        </div>

        {/* Black Keys */}
        <div className='absolute left-5 top-0 flex text-white'>
          <button
            className='absolute ml-[4px] h-44 w-12 translate-x-8 transform rounded-b-lg border border-[#171717] bg-[#3B3B3B]'
            onClick={() => onNoteClick('C#')}
          >
            C#
          </button>
          <button
            className='absolute ml-[48px] h-44 w-12 translate-x-20 transform rounded-b-lg border border-[#171717] bg-[#3B3B3B]'
            onClick={() => onNoteClick('D#')}
          >
            D#
          </button>
          <button
            className='absolute ml-[104px] h-44 w-12 translate-x-48 transform rounded-b-lg border border-[#171717] bg-[#3B3B3B]'
            onClick={() => onNoteClick('F#')}
          >
            F#
          </button>
          <button
            className='absolute ml-[144px] h-44 w-12 translate-x-60 transform rounded-b-lg border border-[#171717] bg-[#3B3B3B]'
            onClick={() => onNoteClick('G#')}
          >
            G#
          </button>
          <button
            className='absolute ml-[186px] h-44 w-12 translate-x-72 transform rounded-b-lg border border-[#171717] bg-[#3B3B3B]'
            onClick={() => onNoteClick('A#')}
          >
            A#
          </button>
        </div>
      </div>
    </div>
  );
}
