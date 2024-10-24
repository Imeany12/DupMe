'use client';
import { INote, INotes, ISong } from '@repo/shared-types/src/types';
import React, { useEffect, useRef, useState } from 'react';

import Piano from '@/components/Piano';
import { socket } from '@/socket';

import style from './page.module.css';

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

  const [song, setSong] = useState<ISong>({
    roomID: -999,
    user: 'dummy',
    sheet: {
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
    },
  });

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

  const [isPlaying, setIsPlaying] = useState(false);
  const [animation, setAnimation] = useState('moveDown');
  const [speed, setSpeed] = useState(1);

  const [pressedNotes, setPressedNotes] = useState<string[]>([]);
  const [pressStartTime, setPressStartTime] = useState<number | null>(null);

  const trackContainerRef = useRef<HTMLDivElement>(null);

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

  const initializedSong = function (): void {
    const trackContainer = trackContainerRef.current;

    // Clear all child nodes in the trackContainer
    while (trackContainer && trackContainer.hasChildNodes()) {
      trackContainer.removeChild(trackContainer.lastChild as ChildNode);
    }

    // Iterate through song's notes and create the track elements
    Object.entries(song.sheet).forEach(([key, value]) => {
      const trackElement = document.createElement('div');
      trackElement.classList.add('track');

      value.notes.forEach(function (note: INote) {
        const noteElement = document.createElement('div');
        noteElement.classList.add(style.note);
        noteElement.classList.add(style.moveDown);
        noteElement.classList.add('note--' + key);
        noteElement.style.backgroundColor = value.color;
        // Set dynamic properties for duration and delay using CSS variables
        noteElement.style.setProperty(
          '--duration',
          note.fallDuration - speed + 's'
        );
        noteElement.style.setProperty(
          '--delay',
          note.delay / 1000 + speed + 's'
        );
        // noteElement.style.animationPlayState = 'paused';
        noteElement.style.width = '50px'; // Set width
        noteElement.style.height = '50px'; // Set height
        trackElement.appendChild(noteElement);
      });
      if (trackContainer) trackContainer.appendChild(trackElement);
      // Query all elements with the 'track' class after each update
      const tracks = document.querySelectorAll('.track');
    });
  };

  useEffect(() => {
    if (isPlaying) {
      initializedSong();
      document.querySelectorAll('.note').forEach(function (note) {
        (note as HTMLDivElement).style.animationPlayState = 'running';
      });
      console.log('initialzed Song');
    }
  }, [isPlaying]);

  useEffect(() => {
    socket.on('receive_song', (song: ISong) => {
      setSong(song);
      console.log(song);
    });

    return () => {
      socket.off('receive_song');
    };
  }, [socket]);

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
    /* still need to change background? or make a white box? */
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
        <div ref={trackContainerRef} className='track-container'></div>
        {/* {show pressednotes here} */}
        <div className='flex h-full flex-col justify-end pt-4'>
          <Piano
            onNoteClick={handleNoteClick}
            onNoteReleased={handleNoteRelease}
          />
        </div>
        <button
          onClick={() => {
            const song: ISong = {
              roomID: 1,
              user: 'test',
              sheet: notes,
            };
            socket.emit('send_song', song);
          }}
        >
          Send Data
        </button>
        <button
          onClick={() => {
            socket.emit('join_lobby', { username: 'test', roomId: 1 });
          }}
        >
          Join Lobby dummy
        </button>
        <button
          onClick={() => {
            setIsPlaying(true);
          }}
        >
          Play
        </button>
      </div>
    </div>
  );
}
