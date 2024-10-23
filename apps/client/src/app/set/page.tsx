'use client';
import React, { useEffect, useState } from 'react';

import { ToggleTheme } from '@/components/ui/toggle-theme';

interface KeyMapping {
  [key: string]: string;
}

export default function SettingsPage() {
  const defaultKeyMappings = {
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
  };
  const [keyMappings, setKeyMappings] = useState<KeyMapping>(() => {
    const storedMappings =
      typeof window !== 'undefined'
        ? localStorage.getItem('keyMappings')
        : null;
    return storedMappings ? JSON.parse(storedMappings) : defaultKeyMappings;
  });
  //change this local storage to server storage?
  useEffect(() => {
    localStorage.setItem('keyMappings', JSON.stringify(keyMappings));
  }, [keyMappings]);

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
    <div className='w-svh mx-10 my-12 flex flex-col items-center gap-4 rounded-lg bg-neutral-50'>
      <div className='text-note bg-note2 mt-6 rounded-lg'>
        <ToggleTheme />
      </div>

      <div className='flex flex-col items-center py-4 text-gray-500'>
        <h1>Settings</h1>
        <h2>Set Keys to Notes</h2>
        <form className='flex flex-col items-center gap-3 rounded-lg bg-white p-4 shadow-md'>
          {notes.map((note) => (
            <div
              key={note}
              className='flex w-full items-center justify-between gap-4'
            >
              <label className='flex w-full flex-row items-center gap-10 text-gray-700'>
                <span className='font-semibold'>{note}:</span>
                <div className='ml-auto flex justify-end'>
                  <button
                    className='w-12 rounded-md bg-blue-500 py-1 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400'
                    onClick={(event) => {
                      event.preventDefault();
                      const handleKeyPress = (e: KeyboardEvent) => {
                        setKeyMappings((prev) => ({
                          ...prev,
                          [note]: e.key,
                        }));
                        window.removeEventListener('keydown', handleKeyPress);
                      };
                      window.addEventListener('keydown', handleKeyPress);
                    }}
                  >
                    {keyMappings[note] || 'Set Key'}
                  </button>
                </div>
              </label>
            </div>
          ))}
        </form>
      </div>
    </div>
  );
}

//need to sent to server to save keybindings
