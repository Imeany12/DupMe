'use client';
import React, { useState } from 'react';

import SetNote from '@/lib/setNotes';

interface KeyMapping {
  [key: string]: string;
}

export default function SettingsPage() {
  const [keyMappings, setKeyMappings] = useState<KeyMapping>({
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

  const notes = [
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

  return (
    <div className='flex flex-col items-center bg-white text-gray-500'>
      <h1>Settings</h1>
      <h2>Set Keys to Notes</h2>
      <form className='flex flex-col items-center gap-3'>
        {notes.map((note) => (
          <div key={note} className='flex items-start justify-start gap-4'>
            <label className='flex min-w-20 flex-row items-start justify-start'>
              {note}:
              <button
                className='mx-3 max-w-8 items-center rounded-md border border-gray-300 p-1'
                onClick={(event) => {
                  event.preventDefault();
                  const handleKeyPress = (e: KeyboardEvent) => {
                    SetNote(e.key, note, keyMappings, setKeyMappings);
                    window.removeEventListener('keydown', handleKeyPress);
                    // Reload the window to reflect the changes
                    window.location.reload();
                  };
                  window.addEventListener('keydown', handleKeyPress);
                }}
              >
                {keyMappings[note] || 'Set Key'}
              </button>
            </label>
          </div>
        ))}
      </form>
    </div>
  );
}

//need to sent to server to save keybindings
