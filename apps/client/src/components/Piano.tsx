import React from 'react';

export default function Piano({
  onNoteClick,
  onNoteReleased,
}: {
  onNoteClick: (note: string) => void;
  onNoteReleased: (note: string) => void;
}) {
  return (
    <div className='relative flex rounded-3xl border-2 bg-white p-2'>
      <div className='relative'>
        {/* White Keys */}
        <div className='flex text-gray-700'>
          <button
            className='h-52 w-20 flex-shrink-0 rounded-b-lg rounded-s-lg border bg-gradient-to-b from-[#DCDCDC] to-[#F7F7F7]'
            onMouseDown={() => onNoteClick('C')}
            onMouseUp={() => onNoteReleased('C')}
          >
            C
          </button>
          <button
            className='h-52 w-20 flex-shrink-0 rounded-b-lg border bg-gradient-to-b from-[#DCDCDC] to-[#F7F7F7]'
            onMouseDown={() => onNoteClick('D')}
            onMouseUp={() => onNoteReleased('D')}
          >
            D
          </button>
          <button
            className='h-52 w-20 flex-shrink-0 rounded-b-lg border bg-gradient-to-b from-[#DCDCDC] to-[#F7F7F7]'
            onMouseDown={() => onNoteClick('E')}
            onMouseUp={() => onNoteReleased('E')}
          >
            E
          </button>
          <button
            className='h-52 w-20 flex-shrink-0 rounded-b-lg border bg-gradient-to-b from-[#DCDCDC] to-[#F7F7F7]'
            onMouseDown={() => onNoteClick('F')}
            onMouseUp={() => onNoteReleased('F')}
          >
            F
          </button>
          <button
            className='h-52 w-20 flex-shrink-0 rounded-b-lg border bg-gradient-to-b from-[#DCDCDC] to-[#F7F7F7]'
            onMouseDown={() => onNoteClick('G')}
            onMouseUp={() => onNoteReleased('G')}
          >
            G
          </button>
          <button
            className='h-52 w-20 flex-shrink-0 rounded-b-lg border bg-gradient-to-b from-[#DCDCDC] to-[#F7F7F7]'
            onMouseDown={() => onNoteClick('A')}
            onMouseUp={() => onNoteReleased('A')}
          >
            A
          </button>
          <button
            className='h-52 w-20 flex-shrink-0 rounded-b-lg rounded-e-lg border bg-gradient-to-b from-[#DCDCDC] to-[#F7F7F7]'
            onMouseDown={() => onNoteClick('B')}
            onMouseUp={() => onNoteReleased('B')}
          >
            B
          </button>
        </div>

        {/* Black Keys */}
        <div className='absolute left-5 top-0 flex text-white'>
          <button
            className='z-10 ml-[74%] h-44 w-12 flex-shrink-0 transform rounded-b-lg border border-[#171717] bg-[#3B3B3B]'
            onMouseDown={() => onNoteClick('C#')}
            onMouseUp={() => onNoteReleased('C#')}
          >
            C#
          </button>
          <button
            className='absolute ml-[242%] h-44 w-12 flex-shrink-0 transform rounded-b-lg border border-[#171717] bg-[#3B3B3B]'
            onMouseDown={() => onNoteClick('D#')}
            onMouseUp={() => onNoteReleased('D#')}
          >
            D#
          </button>
          <button
            className='absolute ml-[574%] h-44 w-12 transform rounded-b-lg border border-[#171717] bg-[#3B3B3B]'
            onMouseDown={() => onNoteClick('F#')}
            onMouseUp={() => onNoteReleased('F#')}
          >
            F#
          </button>
          <button
            className='absolute ml-[742%] h-44 w-12 transform rounded-b-lg border border-[#171717] bg-[#3B3B3B]'
            onMouseDown={() => onNoteClick('G#')}
            onMouseUp={() => onNoteReleased('G#')}
          >
            G#
          </button>
          <button
            className='absolute ml-[906%] h-44 w-12 transform rounded-b-lg border border-[#171717] bg-[#3B3B3B]'
            onMouseDown={() => onNoteClick('A#')}
            onMouseUp={() => onNoteReleased('A#')}
          >
            A#
          </button>
        </div>
      </div>
    </div>
  );
}
