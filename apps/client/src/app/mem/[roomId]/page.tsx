'use client';
import { useParams, useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import React, { useEffect, useRef, useState } from 'react';
import { FaFontAwesomeFlag } from 'react-icons/fa';

import Piano from '@/components/Piano';
import getNoteFrequency from '@/lib/getNoteFrequency';
import { socket } from '@/socket';

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
  const [playNote, setPlayNote] = useState<string[]>([]);
  const [initialStartTime, setInitialStartTime] = useState<number>(Date.now());
  const [isFirstNote, setIsFirstNote] = useState<boolean>(true);
  const { data: session, status } = useSession({
    required: false,
  });

  const searchParams = useSearchParams();
  const host: boolean = searchParams.get('host') === 'true';
  const turn = parseInt(searchParams.get('turn') ?? '1', 10);

  const user = session?.user ?? ({ name: 'Guest' } as User);

  const [playAlong, setPlayAlong] = useState<boolean>(false);
  const [isPlayerTurn, setIsPlayerTurn] = useState<boolean>(host);
  //playerTurn form randaomization backend
  //const [isPlayerTurn, setIsPlayerTurn] = useState<boolean>(true);
  const { roomId } = useParams<{ roomId: string }>();
  const [scoreComboResult, setScoreComboResult] = useState<
    [number, number, string]
  >([0, 0, '']);
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
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [pressingNoteTime, setPressingNoteTime] = useState<[number, number]>([
    -1,
    Date.now(),
  ]);

  const router = useRouter();
  const turncount = useRef(1);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [activeOscillators, setActiveOscillators] = useState<{
    [key: string]: { oscillator: OscillatorNode; gainNode: GainNode };
  }>({});
  const players = searchParams.get('players') ?? '1';
  const countPlayer = parseInt(players, 10);

  useEffect(() => {
    if (turncount.current > 2 * countPlayer) {
      socket.emit('leave_lobby', {
        roomId,
        username: user?.name ?? user.username,
      });
      socket.emit('end_game', roomId);
      router.push('/lobby/' + roomId + '?host=false');
    }
    socket.on('end_game', () => {
      router.push('/lobby/' + roomId + '?host=false');
    });
  }, [turncount.current]);

  useEffect(() => {
    if (!isPlayerTurn && pressedNotes.length > 0) {
      // setPressedNotes([]); //reset notes
    }
  }, [pressedNotes, isPlayerTurn]);

  useEffect(() => {
    const handleRecieve = (recievedNote: string) => {
      setPressedNotes((prev) => [...prev, recievedNote.toString()]);
      if (!isPlayerTurn && recievedNote) {
        console.log('recieved note:', recievedNote);
        setPlayNote((prev) => [...prev, recievedNote.toString()]);
        console.log('playNote', playNote);
        console.log('pressedNotes', pressedNotes);
      }
    };
    socket.on('playNote', handleRecieve);

    return () => {
      socket.off('playNote', handleRecieve);
    };
  }, [isPlayerTurn, socket, pressedNotes, playAlong]);

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
    if (playAlong) {
      handleKeyDownIsPlaying(event);
    } else {
      handleKeyDownIsNotPlaying(event);
    }
  };
  const handleKeyDownIsNotPlaying = (event: KeyboardEvent) => {
    const pressedKey = event.key.toLowerCase();

    if (pressedNotes.length >= 20) return;
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

  const handleKeyDownIsPlaying = (event: KeyboardEvent) => {
    const note = Object.keys(keyMappings).find(
      (note) => keyMappings[note] === event.key.toLowerCase()
    );
    socket.emit('getNote', roomId, note);
    if (note && !activeOscillators) {
      const frequency = getNoteFrequency(note);
      startSound(frequency, note);
    }
    console.log('playNote', playNote, ' + note', note);
    if (note && (!presNote.pressing || presNote.note !== event.key)) {
      setPressedNotes((prev) => [...prev, note]);
      if (note === playNote[0]) {
        setPlayNote((prev) => prev.slice(1));
        console.log('playNote', playNote);
        handleScoreCalculation('hit');
      } else {
        handleScoreCalculation('miss');
      }
      setPresNote({
        pressing: true,
        note: note,
      });
    }
  };

  const handleKeyRelease = (event: KeyboardEvent) => {
    if (playAlong) {
      handleKeyReleaseIsPlaying(event);
    } else {
      handleKeyReleaseIsNotPlaying(event);
    }
  };

  const handleKeyReleaseIsPlaying = (event: KeyboardEvent) => {
    const releasedKey = event.key.toLowerCase();
    const note = Object.keys(keyMappings).find(
      (note) => keyMappings[note] === releasedKey
    );
    if (note && activeOscillators[note]) {
      if (pressStartTime !== null && note && pressedNotes.includes(note)) {
        const endTime = Date.now();
        const timePressed = endTime - pressStartTime;
        setPressStartTime(null);
        if (isFirstNote) {
          setInitialStartTime(pressStartTime);
          setIsFirstNote(false);
        }
      }
    }
    setPresNote({
      pressing: false,
      note: '',
    });
  };

  const handleKeyReleaseIsNotPlaying = (event: KeyboardEvent) => {
    const releasedKey = event.key.toLowerCase();
    const note = Object.keys(keyMappings).find(
      (note) => keyMappings[note] === releasedKey
    );

    if (note && activeOscillators[note]) {
      if (pressStartTime !== null && note && pressedNotes.includes(note)) {
        const endTime = Date.now();
        const timePressed = endTime - pressStartTime;
        setPressStartTime(null);
        if (isFirstNote) {
          setInitialStartTime(pressStartTime);
          setIsFirstNote(false);
        }
      }
    }
    setPresNote({
      pressing: false,
      note: '',
    });
  };

  useEffect(() => {
    if (playAlong === false) {
      setTimeout(() => {
        setPressedNotes([]);
        setPlayAlong(true);
      }, 10000);
    }
    if (playAlong === true) {
      setTimeout(() => {
        // if (playNote.length > 0) {
        // }
        setPlayAlong(false);
        turncount.current += 1;
        if (isPlayerTurn === true) setIsPlayerTurn(false);
        if ((turncount.current - turn) % countPlayer === 0) {
          setIsPlayerTurn((prev) => !prev);
        }
        setPlayNote([]);
        console.log('playalong : ', playAlong);
        console.log('isPlayerTurn : ', isPlayerTurn);
        setPressedNotes([]);
        // setNotes([]);
        console.log('playalong : ', playAlong);
      }, 20000);
    }
    //sendNote after 0.5 minute
  }, [playAlong]);

  const handleNoteRelease = (note: string) => {
    stopSound(note);
    if (pressStartTime !== null) {
      const endTime = Date.now();
      const timePressed = endTime - pressStartTime;

      if (isFirstNote) {
        setInitialStartTime(endTime);
        setIsFirstNote(false);
      }
      setPressStartTime(null);
    }
  };

  const handleNoteClickIsPlaying = (note: string) => {
    socket.emit('getNote', roomId, note);
    const frequency = getNoteFrequency(note);
    startSound(frequency, note);
    setPressedNotes((prev) => [...prev, note]);
    if (note === playNote[0]) {
      playNote.shift();
      handleScoreCalculation('hit');
    } else {
      handleScoreCalculation('miss');
    }
  };

  const handleScoreCalculation = function (state: string) {
    if (state !== 'miss') {
      setScoreComboResult(([score, combo, status]) => [
        score + 300 * Math.floor(Math.E ** (combo * 0.3)),
        combo + 1,
        state,
      ]);
    } else setScoreComboResult(([score, combo, status]) => [score, 0, state]);
  };

  const handleNoteClick = (note: string) => {
    if (pressedNotes.length >= 20) return;
    socket.emit('getNote', roomId, note);
    console.log('sending note', note);
    const frequency = getNoteFrequency(note);
    startSound(frequency, note);
    setPressedNotes((prev) => [...prev, note]);
    const startTime = Date.now();
    setPressStartTime(startTime);
  };

  useEffect(() => {
    if (!audioContext) {
      setAudioContext(new AudioContext());
    }
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyRelease);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyRelease);
    };
  }, [
    keyMappings,
    pressedNotes,
    initialStartTime,
    pressStartTime,
    pressingNoteTime,
    startTime,
    audioContext,
    isPlayerTurn,
    playAlong,
    pressedNotes,
    playNote,
  ]);

  // Debugging Section
  // useEffect(() => {
  //   console.log(notes);
  // }, [notes]);
  // useEffect(() => {
  //   console.log(song);
  // }, [song]);
  // useEffect(() => {
  //   console.log(startTime);
  // }, [startTime]);
  // useEffect(() => {
  //   console.log(pressingNoteTime);
  // }, [pressingNoteTime]);
  // useEffect(() => {
  //   console.log(pressStartTime);
  // }, [pressStartTime]);

  return (
    <div className='flex h-screen w-screen flex-col items-center'>
      {playAlong ? (
        <div>
          {!isPlayerTurn ? (
            <div className='flex flex-col items-center gap-2 rounded-lg bg-slate-500 px-12 py-24'>
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
              <div>
                <Piano
                  onNoteClick={handleNoteClickIsPlaying}
                  onNoteReleased={handleNoteRelease}
                />
              </div>
              <div className='flex w-full justify-center gap-8 pt-8'>
                <h1>Combo : {scoreComboResult[1]}</h1>
                <h1>Score : {scoreComboResult[0]}</h1>
                <h1 className='text-note2 text-xl'>{scoreComboResult[2]}</h1>
              </div>
            </div>
          ) : (
            <div className='flex flex-col items-center gap-2 rounded-lg bg-slate-500 px-12 py-24'>
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
              <div>
                <Piano
                  onNoteClick={handleNoteClickIsPlaying}
                  onNoteReleased={handleNoteRelease}
                />
              </div>
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
                    {pressedNotes.length >= 20 ? (
                      <p className='text-sm text-red-500'>
                        You can press up to 20 notes
                      </p>
                    ) : null}
                  </div>
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
