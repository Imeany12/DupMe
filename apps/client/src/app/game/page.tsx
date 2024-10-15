'use client';
import React, { useEffect, useState } from 'react';

import Piano from '@/components/Piano';

type Note = {
  note: string;
  timePressed: number;
  //startTime: number;
  //endTime: number;
};
type pressNote = {
  pressing: boolean;
  note: string;
};

export default function GamePage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [presNote, setPresNote] = useState<pressNote>({
    pressing: false,
    note: '',
  });
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

    if (note && (!presNote.pressing || presNote.note !== pressedKey)) {
      setPressedNotes((prev) => [...prev, note]);
      const startTime = Date.now();
      setPressStartTime(startTime);
      setPresNote({
        pressing: true,
        note: pressedKey,
      });
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
    setPresNote({
      pressing: false,
      note: '',
    });
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
    <div className='flex h-screen w-screen flex-col items-center justify-end pb-12'>
      <div className='max-w-screen-svh mx-16 flex max-h-svh flex-col items-center gap-8 rounded-2xl bg-slate-300 px-12 pb-8'>
        <p className='pt-6 text-3xl text-white'>Play Your notes:</p>
        <div className='drop max-w-screen flex min-h-[220px] flex-wrap gap-4'>
          {pressedNotes.map((note, index) => (
            <span
              key={index}
              className='bg-gradient-radial shirk-0 gradient flex h-16 w-16 items-center justify-center rounded-full border border-[#2FBCE7B0] bg-white from-[#C4C4C400] from-10% to-[#2FBCE7B0] text-xl font-bold text-[#6A98FF] shadow-[0_0px_40px_8px_#6A98FF]'
            >
              {note}
            </span>
          ))}
        </div>
        {/* {show pressednotes here} */}
        <div className='flex h-full flex-col justify-end pt-4'>
          <Piano
            onNoteClick={handleNoteClick}
            onNoteReleased={handleNoteRelease}
          />
        </div>
      </div>
    </div>
  );
}
