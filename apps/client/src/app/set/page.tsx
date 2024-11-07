'use client';

import { KeyMapping } from '@repo/shared-types';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { FiHome } from 'react-icons/fi';

import { ToggleTheme } from '@/components/ui/toggle-theme';
import { defaultKeyMappings } from '@/const/keymapping';
import { SERVER_URL } from '@/env';

export default function SettingsPage(): React.JSX.Element {
  const { data: session } = useSession({
    required: false,
  });
  const [isLoaded, setIsLoaded] = useState(false);

  const user = session?.user;
  const [keyMappings, setKeyMappings] =
    useState<KeyMapping>(defaultKeyMappings);

  useEffect(() => {
    console.log('keymapping', keyMappings);
    const getKeybindings = async () => {
      const res = await fetch(`${SERVER_URL}/user/${user?.name}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (res.status === 200) {
        const data = await res.json();
        return data.user.keybindings;
      } else {
        console.log('Keybindings not found');
        return defaultKeyMappings;
      }
    };
    if (session) {
      getKeybindings().then((keybindings) => {
        setKeyMappings(keybindings);
        console.log(keybindings);
      });
      setIsLoaded(true);
    }
  }, [user]);
  //change this local storage to server storage?
  useEffect(() => {
    const sendKeyMappings = async () => {
      const res = await fetch(`${SERVER_URL}/user/${user?.name}/profile/edit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ keybindings: keyMappings }),
      });
      if (res.status === 200) {
        console.log('Keybindings saved to ' + JSON.stringify(keyMappings));
      } else {
        console.log('Keybind cant be' + JSON.stringify(keyMappings));
      }
    };
    if (session && isLoaded) {
      sendKeyMappings();
    }
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
    <div className='h-svh w-svw px-8'>
      <div className='ml-4 pt-4'>
        <Link href='/' className='items-start text-3xl text-white'>
          <FiHome />
        </Link>
      </div>
      <div className='w-svh mx-10 my-12 flex flex-col items-center gap-4 rounded-lg bg-neutral-50 pb-24'>
        <div className='flex flex-col items-center gap-2 py-4 text-gray-500'>
          <h1 className='text-3xl font-bold'>Settings</h1>
          <h1 className='text-xl font-semibold'>Set Keys to Notes</h1>
          <form className='mx-auto flex flex-row items-center gap-3 rounded-lg bg-white p-4 shadow-md'>
            {notes.map((note) => (
              <div
                key={note}
                className='flex w-full items-center justify-between gap-4'
              >
                <label className='flex w-full flex-col items-center gap-10 text-gray-700'>
                  <span className='font-semibold'>{note}:</span>
                  <div className='ml-auto flex justify-end'>
                    <button
                      className='w-12 rounded-md bg-blue-500 py-1 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400'
                      onClick={(event) => {
                        event.preventDefault();
                        const handleKeyPress = (e: KeyboardEvent) => {
                          window.removeEventListener('keydown', handleKeyPress);
                          if (e.key === 'Escape' || !isLoaded) return;
                          setKeyMappings((prev) => ({
                            ...prev,
                            [note]: e.key.toLowerCase(),
                          }));
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
        <div className='text-note mt-6 rounded-lg bg-black'>
          <ToggleTheme />
        </div>
      </div>
    </div>
  );
}

//need to sent to server to save keybindings
