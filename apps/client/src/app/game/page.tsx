'use client';
import React, { useEffect, useState } from 'react';

import Piano from '@/components/Piano';
const initialNotes = [
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'A#',
  'B',
];

export default function GamePage() {
  const [notes, setNotes] = useState<string[]>([]);
  const [pressedNotes, setPressedNotes] = useState<string[]>([]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const note = event.key.toUpperCase();
      if (initialNotes.includes(note)) {
        setPressedNotes((prev) => [...prev, note]);
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  const handleNoteClick = (note: string) => {
    setPressedNotes((prev) => [...prev, note]);
  };

  const sendNotesToServer = async () => {
    try {
      await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notes: pressedNotes }),
      });
      setPressedNotes([]);
    } catch (error) {
      console.error('Error sending notes to server:', error);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (pressedNotes.length > 0) {
        sendNotesToServer();
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [pressedNotes]);

  return (
    <Piano />
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
