'use client';
import React, { useEffect, useState } from 'react';

import Piano from '@/components/Piano';

type Note = {
  note: string;
  timePressed: number;
};

export default function GamePage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [keyMappings, setKeyMappings] = useState<{ [key: string]: string }>({
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
    ' B': 'k',
  });
  //need to get keybindings from the server

  const [pressedNotes, setPressedNotes] = useState<string[]>([]);
  const [pressStartTime, setPressStartTime] = useState<number | null>(null);

  const handleKeyDown = (event: KeyboardEvent) => {
    const pressedKey = event.key.toLowerCase();

    // Find the corresponding note for the pressed key
    const note = Object.keys(keyMappings).find(
      (note) => keyMappings[note] === pressedKey
    );

    if (note && pressedNotes[pressedNotes.length - 1] !== note) {
      setPressedNotes((prev) => [...prev, note]);
      const startTime = Date.now();
      setPressStartTime(startTime);
    }
  };

  const handleKeyRelease = (event: KeyboardEvent) => {
    const releasedKey = event.key.toLowerCase();
    const note = Object.keys(keyMappings).find(
      (note) => keyMappings[note] === releasedKey
    );
    if (pressStartTime !== null && note && pressedNotes.includes(note)) {
      const endTime = Date.now();
      const timePressed = endTime - pressStartTime;

      const newNote: Note = {
        note: pressedNotes[pressedNotes.length - 1],
        timePressed: timePressed,
      };
      setNotes((prev) => [...prev, newNote]);
      console.log(notes);
      //idk why this console.log dealyed by 1 note
      setPressStartTime(null);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (pressedNotes.length > 0) {
        //sendNotesToPlayer();
      }
    }, 5000);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyRelease);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyRelease);
    };
  }, [keyMappings, pressedNotes, pressStartTime]);

  const handleNoteClick = (note: string) => {
    setPressedNotes((prev) => [...prev, note]);
    const startTime = Date.now();
    setPressStartTime(startTime);
  };

  const handleNoteRelease = (note: string) => {
    if (pressStartTime !== null) {
      const endTime = Date.now();
      const timePressed = endTime - pressStartTime;

      const newNote: Note = {
        note: note,
        timePressed: timePressed,
      };
      setNotes((prev) => [...prev, newNote]);
      console.log(notes);
      setPressStartTime(null);
    }
  };

  // const sendNotesToServer = async () => {
  //   try {
  //     await fetch('/api/notes', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ notes: pressedNotes }),
  //     });
  //     setPressedNotes([]);
  //   } catch (error) {
  //     console.error('Error sending notes to server:', error);
  //   }
  // };

  return (
    //still need to change background? or make a white box?
    <div className='flex h-screen w-screen flex-col items-center justify-end pb-24'>
      <div className='flex flex-col items-center gap-8 rounded-2xl bg-slate-300 px-64 py-12'>
        <p className='pt-6 text-3xl text-white'>Play Your notes:</p>
        <div className='drop flex gap-4 space-x-2 pt-10'>
          {pressedNotes.map((note, index) => (
            <span
              key={index}
              className='bg-gradient-radial gradient flex h-16 w-16 items-center justify-center rounded-full border border-[#2FBCE7B0] bg-white from-[#C4C4C400] from-10% to-[#2FBCE7B0] text-xl font-bold text-[#6A98FF] shadow-[0_0px_40px_8px_#6A98FF]'
            >
              {note}
            </span>
          ))}
        </div>
        {/* {show pressednotes here} */}
        <div className='flex h-full flex-col justify-end pt-16'>
          <Piano
            onNoteClick={handleNoteClick}
            onNoteReleased={handleNoteRelease}
          />
        </div>
      </div>
    </div>

    // <div className="h-screen pb-12 flex items-end justify-end">
    //   {initialNotes.map((note) => (
    //     <button key={note} //onClick={() => handleNoteClick(note)}
    //     className='w-20 h-52 flex-shrink-0 bg-gradient-to-b from-[#DCDCDC] to-[#F7F7F7] border rounded-b-lg'>
    //       {note}
    //     </button>
    //   ))}
    // </div>
  );
}
