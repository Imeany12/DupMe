'use client';
import { useParams, useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import React, { useEffect, useRef, useState } from 'react';
import { FaFontAwesomeFlag } from 'react-icons/fa';

import Piano from '@/components/Piano';
import getNoteFrequency from '@/lib/getNoteFrequency';
import { socket } from '@/socket';

type User =
  | {
      name?: string | null | undefined;
      email?: string | null | undefined;
      image?: string | null | undefined;
    }
  | undefined;

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

export default function GamePage({
  params,
}: {
  params: { slug: string };
}): React.JSX.Element {
  const { data: session, status } = useSession({
    required: false,
  });

  const searchParams = useSearchParams();
  const host: boolean = searchParams.get('host') === 'true';

  const user = session?.user ?? ({ name: 'Guest' } as User);

  const [playAlong, setPlayAlong] = useState<boolean>(false);
  const [isPlayerTurn, setIsPlayerTurn] = useState<boolean>(host);
  //playerTurn form randaomization backend
  //const [isPlayerTurn, setIsPlayerTurn] = useState<boolean>(true);
  const { roomId } = useParams<{ roomId: string }>();
  const [notes, setNotes] = useState<Note[]>([]);
  const [pressedNotes, setPressedNotes] = useState<string[]>([]);
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
  const router = useRouter();
  const turncount = useRef(0);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [activeOscillators, setActiveOscillators] = useState<{
    [key: string]: { oscillator: OscillatorNode; gainNode: GainNode };
  }>({});
  const [pressStartTime, setPressStartTime] = useState<number | null>(null);
  const hasJoined = useRef(false);

  const sendNoteToPlayer = (notes: Note[]) => {
    socket.emit('sendNote', roomId, notes);
  };

  useEffect(() => {
    if (turncount.current === 4) {
      socket.emit('leave_lobby', { roomId, username: user?.name });
      socket.emit('end_game', roomId);
      router.push('/lobby/' + roomId + '?host=' + host);
    }
    socket.on('end_game', () => {
      router.push('/lobby/' + roomId + '?host=' + host);
    });
  }, [turncount.current]);

  useEffect(() => {
    if (!isPlayerTurn && pressedNotes.length > 0) {
      // setPressedNotes([]); //reset notes
    }
  }, [pressedNotes, isPlayerTurn]);

  useEffect(() => {
    console.log('Play along first:', playAlong);
    console.log('listening');
    const handleRecieve = (recievedNote: string) => {
      if (!isPlayerTurn && recievedNote) {
        console.log('recieved note:', recievedNote);
        setPressedNotes((prev) => [...prev, recievedNote.toString()]);
      }
    };
    socket.on('playNote', handleRecieve);

    return () => {
      socket.off('playNote', handleRecieve);
    };
  }, [isPlayerTurn, socket]);

  // useEffect(() => {
  //   const handleReceiveNote = (notes: Note[]) => {
  //     notes.forEach(({ note, timePressed }) => {
  //       console.log(`Received note: ${note} for ${timePressed}ms`);
  //     });
  //   };

  //   socket.on('receiveNote', handleReceiveNote);

  //   return () => {
  //     socket.off('receiveNote', handleReceiveNote);
  //   };
  // }, [socket]);

  const startSound = (frequency: number, key: string) => {
    if (!audioContext || activeOscillators[key]) return;
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
    // make the sound clear, smooth and not too loud
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.type = 'sine';

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(1, audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(
      0.001,
      audioContext.currentTime + 2
    );

    oscillator.start();
    console.log('start');

    setActiveOscillators((prev) => ({
      ...prev,
      [key]: { oscillator, gainNode },
    }));
  };

  const stopSound = (key: string) => {
    if (activeOscillators[key]) {
      const { oscillator, gainNode } = activeOscillators[key];

      // Apply a smooth release for the sound
      gainNode.gain.cancelScheduledValues(audioContext!.currentTime);
      gainNode.gain.setValueAtTime(
        gainNode.gain.value,
        audioContext!.currentTime
      );
      gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        audioContext!.currentTime + 0.3
      );

      oscillator.stop(audioContext!.currentTime + 0.3); // Stop after release

      setActiveOscillators((prev) => {
        const newOscillators = { ...prev };
        delete newOscillators[key];
        return newOscillators;
      });
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (!isPlayerTurn) return;
    console.log('key pressed' + isPlayerTurn);
    const pressedKey = event.key.toLowerCase();

    // Find the corresponding note for the pressed key
    const note = Object.keys(keyMappings).find(
      (note) => keyMappings[note] === pressedKey
    );
    //play many notes at once
    if (note && !activeOscillators[note]) {
      const frequency = getNoteFrequency(note);
      startSound(frequency, note);
    }
    //prevent adding the same note multiple times
    if (note && (!presNote.pressing || presNote.note !== pressedKey)) {
      socket.emit('getNote', roomId, note);
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
    if (!isPlayerTurn) return;
    const releasedKey = event.key.toLowerCase();

    const note = Object.keys(keyMappings).find(
      (note) => keyMappings[note] === releasedKey
    );

    if (note && activeOscillators[note]) {
      stopSound(note);

      if (pressStartTime !== null) {
        const endTime = Date.now();
        const timePressed = endTime - pressStartTime;

        const newNote: Note = {
          note: note,
          timePressed: timePressed,
        };

        setNotes((prev) => [...prev, newNote]);
        setPressStartTime(null);
      }

      setPresNote({
        pressing: false,
        note: '',
      });
    }
  };

  useEffect(() => {
    if (playAlong === false) {
      setTimeout(() => {
        if (pressedNotes.length > 0) {
          //console.log('sending notes');
          //sendNoteToPlayer(notes);
          setPressedNotes([]);
          setNotes([]);
        }
        setPlayAlong(true);
        console.log('playalong : ', playAlong);
        console.log('isPlayerTurn : ', isPlayerTurn);
      }, 10000);
    }
    if (playAlong === true) {
      setTimeout(() => {
        if (pressedNotes.length > 0) {
          //console.log('sending notes');
          //sendNoteToPlayer(notes);
        }
        turncount.current += 1;
        setPlayAlong(false);
        setIsPlayerTurn((prev) => !prev);
        console.log('playalong : ', playAlong);
        console.log('isPlayerTurn : ', isPlayerTurn);
        setPressedNotes([]);
        setNotes([]);
        console.log('playalong : ', playAlong);
      }, 20000);
    }
    //sendNote after 0.5 minute
  }, [playAlong]);

  useEffect(() => {
    if (!audioContext) {
      setAudioContext(new AudioContext());
    }
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyRelease);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyRelease);
    };
  }, [pressedNotes, pressStartTime, audioContext, isPlayerTurn]);

  const handleNoteClick = (note: string) => {
    socket.emit('getNote', roomId, note);
    console.log('sending note', note);
    const frequency = getNoteFrequency(note);
    startSound(frequency, note);
    setPressedNotes((prev) => [...prev, note]);
    const startTime = Date.now();
    setPressStartTime(startTime);
  };

  const handleNoteRelease = (note: string) => {
    stopSound(note);
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

  return (
    <div className='flex h-screen w-screen flex-col items-center'>
      {playAlong ? (
        <div>
          {/* waiting for rainfall from mark */}
          {!isPlayerTurn ? (
            <div>
              <p className='text-3xl text-white'>rainfall</p>
            </div>
          ) : (
            <div>
              <p className='text-3xl text-white'>watch other rainfall</p>
            </div>
          )}
        </div>
      ) : (
        <div>
          {isPlayerTurn ? (
            <div>
              <div className='flex w-full items-start justify-start'>
                <button
                  className='size-20 px-8 pt-6 text-white'
                  onClick={() => {
                    // socket.emit('game_end');
                    // console.log('player resign');
                    // router.push('/lobby/' + roomId);
                    setIsPlayerTurn(false);
                  }}
                >
                  <FaFontAwesomeFlag
                    size={30}
                    className='shadow-inner shadow-white'
                  />
                </button>
              </div>
              <div className='flex h-full flex-col justify-end'>
                <div className='max-w-screen-svh mx-16 flex max-h-full flex-col items-center justify-end gap-8 rounded-2xl bg-slate-300 px-12 pb-8'>
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
                  <div>
                    <Piano
                      onNoteClick={handleNoteClick}
                      onNoteReleased={handleNoteRelease}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className='flex h-screen w-screen flex-col items-center justify-end pb-12'>
                <div className='flex w-full items-start justify-start'>
                  <button
                    className='size-20 px-8 pt-6 text-white'
                    onClick={() => {
                      socket.emit('game_end');
                      console.log('player resign');
                      socket.emit('leave_lobby', {
                        username: user?.name,
                        roomId,
                      });
                      router.push('/lobby/' + roomId + '?host=' + host);
                      //use host as temporary code for development
                    }}
                  >
                    <FaFontAwesomeFlag
                      size={30}
                      className='shadow-inner shadow-white'
                    />
                  </button>
                </div>
                <div className='max-w-screen-svh mx-16 flex max-h-svh flex-col items-center gap-8 rounded-2xl bg-slate-300 px-12 pb-8'>
                  <p className='pt-6 text-3xl text-white'>
                    Memorize your opponent notes:
                  </p>
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
                      onNoteClick={() => {
                        return;
                      }}
                      onNoteReleased={() => {
                        return;
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
