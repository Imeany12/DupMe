'use client';
import { INote, INotes, ISong } from '@repo/shared-types/src/types';
import React, { useEffect, useState } from 'react';

import Piano from '@/components/Piano';
import { socket } from '@/socket';

type pressNote = {
  pressing: boolean;
  note: string;
};

export default function GamePage() {
  const [notes, setNotes] = useState<{ [key: string]: INotes }>({
    C: {
      color: '#3A2618',
      nextNoteInd: 0,
      notes: [],
    },
    'C#': {
      color: '#754043',
      nextNoteInd: 0,
      notes: [],
    },
    D: {
      color: '#9A8873',
      nextNoteInd: 0,
      notes: [],
    },
    'D#': {
      color: '#37423D',
      nextNoteInd: 0,
      notes: [],
    },
    E: {
      color: '#D6F8D6',
      nextNoteInd: 0,
      notes: [],
    },
    F: {
      color: '#5D737E',
      nextNoteInd: 0,
      notes: [],
    },
    'F#': {
      color: '#55505C',
      nextNoteInd: 0,
      notes: [],
    },
    G: {
      color: '#FAF33E',
      nextNoteInd: 0,
      notes: [],
    },
    'G#': {
      color: '#7FC6A4',
      nextNoteInd: 0,
      notes: [],
    },
    A: {
      color: '#82A0BC',
      nextNoteInd: 0,
      notes: [],
    },
    'A#': {
      color: '#304D6D',
      nextNoteInd: 0,
      notes: [],
    },
    B: {
      color: '#A7CCED',
      nextNoteInd: 0,
      notes: [],
    },
  });

  const updateNotesForKey = (key: string, newNote: INote) => {
    setNotes((prevNotes) => ({
      ...prevNotes,
      [key]: {
        ...prevNotes[key], // Keep other properties like color, nextNoteInd
        notes: [...prevNotes[key].notes, newNote], // Update the notes array
      },
    }));
  };

  const [initialStartTime, setInitialStartTime] = useState<number>(Date.now());
  const [isFirstNote, setIsFirstNote] = useState<boolean>(true);

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
    B: 'k',
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

      const newNote: INote = {
        isLongNote: timePressed > 150,
        longNoteDuration: Math.max(timePressed, 150),
        fallDuration: 3,
        // Find a way to keep track game start time and get the delay from start.
        delay: isFirstNote ? 0 : endTime - initialStartTime,
      };
      updateNotesForKey(pressedNotes[pressedNotes.length - 1], newNote);
      // console.log(notes);
      //idk why this console.log dealyed by 1 note
      setPressStartTime(null);

      if (isFirstNote) {
        console.log(true);
        setInitialStartTime(endTime);
        setIsFirstNote(false);
      }
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

  useEffect(() => {
    console.log(notes);
  }, [notes]);

  const handleNoteClick = (note: string) => {
    setPressedNotes((prev) => [...prev, note]);
    const startTime = Date.now();
    setPressStartTime(startTime);
  };

  const handleNoteRelease = (note: string) => {
    if (pressStartTime !== null) {
      const endTime = Date.now();
      const timePressed = endTime - pressStartTime;

      if (isFirstNote) {
        setInitialStartTime(endTime);
        setIsFirstNote(false);
      }

      const newNote: INote = {
        isLongNote: timePressed > 150,
        longNoteDuration: Math.max(timePressed, 150),
        fallDuration: 3,
        // Find a way to keep track game start time and get the delay from start.
        delay: endTime - initialStartTime,
      };
      updateNotesForKey(pressedNotes[pressedNotes.length - 1], newNote);
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
        <button
          onClick={() => {
            socket.emit('join_lobby', { username: 'test', roomId: 1 });
            const song: ISong = {
              roomID: 1,
              user: 'test',
              sheet: notes,
            };
            socket.emit('send_song', song);
          }}
        >
          Click here
        </button>
      </div>
    </div>
  );
}
