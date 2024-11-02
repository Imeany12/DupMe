'use client';
import { INote, INotes, ISong } from '@repo/shared-types/src/types';
import { useParams, useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FaFontAwesomeFlag } from 'react-icons/fa';

import Piano from '@/components/Piano';
import getNoteFrequency from '@/lib/getNoteFrequency';
import { socket } from '@/socket';

import style from './page.module.css';

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

  const resetNextNoteInd = () => {
    // Create a new object for the updated sheet
    const updatedSheet = Object.entries(song.sheet).reduce(
      (acc, [key, value]) => {
        acc[key] = {
          ...value, // Keep other properties
          nextNoteInd: 0, // Set nextNoteInd to 0
        };
        return acc;
      },
      {} as { [key: string]: INotes }
    );

    // Update the song state
    setSong((prevSong) => ({
      ...prevSong,
      sheet: updatedSheet,
    }));
  };

  const [initialStartTime, setInitialStartTime] = useState<number>(Date.now());
  const [isFirstNote, setIsFirstNote] = useState<boolean>(true);
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
  const [speed, setSpeed] = useState(1);
  const [pressedNotes, setPressedNotes] = useState<string[]>([]);
  const [pressStartTime, setPressStartTime] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [pressingNoteTime, setPressingNoteTime] = useState<[number, number]>([
    -1,
    Date.now(),
  ]);

  const trackContainerRef = useRef<HTMLDivElement>(null);

  const getKeyIndex = function (key: string): number {
    if (key === 's') {
      return 0;
    } else if (key === 'e') {
      return 1;
    } else if (key === 'd') {
      return 2;
    } else if (key === 'r') {
      return 3;
    } else if (key === 'f') {
      return 4;
    } else if (key === 'g') {
      return 5;
    } else if (key === 'y') {
      return 6;
    } else if (key === 'h') {
      return 7;
    } else if (key === 'u') {
      return 8;
    } else if (key === 'j') {
      return 9;
    } else if (key === 'i') {
      return 10;
    } else if (key === 'k') {
      return 11;
    } else return 12;
  };

  const getKeyString = function (index: number): string {
    const keyMapping: { [key: number]: string } = {
      0: 'C',
      1: 'C#',
      2: 'D',
      3: 'D#',
      4: 'E',
      5: 'F',
      6: 'F#',
      7: 'G',
      8: 'G#',
      9: 'A',
      10: 'A#',
      11: 'B',
    };
    return keyMapping[index];
  };

  const updateNext = (indexString: string | undefined) => {
    if (indexString) {
      setSong((prevSong) => {
        return {
          ...prevSong,
          sheet: {
            ...prevSong.sheet,
            [indexString]: {
              ...prevSong.sheet[indexString],
              nextNoteInd: prevSong.sheet[indexString].nextNoteInd + 1,
            },
          },
        };
      });
    }
  };
  const router = useRouter();
  const turncount = useRef(0);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [activeOscillators, setActiveOscillators] = useState<{
    [key: string]: { oscillator: OscillatorNode; gainNode: GainNode };
  }>({});

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

  const judge = function (index: number, tracks: NodeListOf<ChildNode>) {
    const perfectTimeOffset = -0.7; // manual calibration for perfect note
    const timeInSecond = (Date.now() - startTime) / 1000;
    // console.log(timeInSecond);
    const nextNoteIndex = song.sheet[getKeyString(index)].nextNoteInd;
    if (nextNoteIndex < song.sheet[getKeyString(index)].notes.length) {
      const nextNote = song.sheet[getKeyString(index)].notes[nextNoteIndex];
      if (!song.sheet[getKeyString(index)].notes[nextNoteIndex].isLongNote) {
        const perfectTime =
          nextNote.fallDuration + nextNote.delay / 1000 - perfectTimeOffset;
        const accuracy = Math.abs(timeInSecond - perfectTime);
        // console.log(`perfect time: ${perfectTime} accuracy : ${accuracy}`);

        if (accuracy > (nextNote.fallDuration - speed) / 3) {
          return;
        }

        const hitJudgement = getHitJudgement(accuracy);
        console.log(hitJudgement);
        removeNoteFromTrack(tracks[index], tracks[index].firstChild);
        updateNext(getKeyString(index));
      } else {
        if (index != pressingNoteTime[0]) {
          setPressingNoteTime([index, Date.now()]);
        }
      }
    } else console.log('Note out of range!');
  };

  const getHitJudgement = function (accuracy: number) {
    if (accuracy < 0.1) {
      return 'perfect';
    } else if (accuracy < 0.2) {
      return 'good';
    } else if (accuracy < 0.3) {
      return 'bad';
    } else {
      return 'miss';
    }
  };

  const removeNoteFromTrack = function (
    parent: ChildNode | ParentNode | null,
    child: ChildNode | null
  ) {
    if (parent != null && child != null) {
      parent.removeChild(child);
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (isPlaying) {
      handleKeyDownIsPlaying(event);
    } else {
      handleKeyDownIsNotPlaying(event);
    }
  };

  const handleKeyDownIsNotPlaying = (event: KeyboardEvent) => {
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

  const handleKeyDownIsPlaying = (event: KeyboardEvent) => {
    const pressedKey = event.key.toLowerCase();
    const tracks = document.querySelectorAll('.track');
    const keyIndex = getKeyIndex(pressedKey);
    if (tracks[keyIndex] && tracks[keyIndex].firstChild) {
      judge(keyIndex, tracks);
    }
  };

  const createNote = function (
    timePressed: number,
    isFirstNote: boolean,
    pressedStartTime: number,
    initialStartTime: number
  ): INote {
    return {
      isLongNote: timePressed > 200,
      longNoteDuration: Math.max(timePressed, 100),
      fallDuration: 2,
      delay: isFirstNote ? 0 : pressedStartTime - initialStartTime,
    };
  };

  const handleKeyRelease = (event: KeyboardEvent) => {
    if (isPlaying) handleKeyReleaseIsPlaying(event);
    else handleKeyReleaseIsNotPlaying(event);
  };

  const handleKeyReleaseIsPlaying = (event: KeyboardEvent) => {
    const releasedKey = event.key.toLowerCase();
    const tracks = document.querySelectorAll('.track');
    const keyIndex = getKeyIndex(releasedKey);
    const note = Object.keys(keyMappings).find(
      (note) => keyMappings[note] === releasedKey
    );

    // Check if Released key is in Piano key
    if (keyIndex == pressingNoteTime[0]) {
      const duration = Date.now() - pressingNoteTime[1];
      const nextNoteIndex = song.sheet[getKeyString(keyIndex)].nextNoteInd;
      if (nextNoteIndex < song.sheet[getKeyString(keyIndex)].notes.length) {
        const nextNote =
          song.sheet[getKeyString(keyIndex)].notes[nextNoteIndex];
        // console.log(pressingNoteTime[0], duration, song.sheet[getKeyString(keyIndex)].notes[nextNoteIndex].longNoteDuration);
        const perfectDuartion = nextNote.longNoteDuration * 0.771; // manual calibration
        const accuracy = Math.abs(duration - perfectDuartion);
        // console.log(perfectDuartion, accuracy);
        // console.log(`perfect duration: ${perfectDuartion}, pressed duration: ${duration}, accuracy : ${accuracy}`);

        const hitJudgement = getHitJudgement(accuracy / 1500);
        console.log(hitJudgement);
        removeNoteFromTrack(tracks[keyIndex], tracks[keyIndex].firstChild);
        updateNext(getKeyString(keyIndex));
      }
      setPressingNoteTime([-1, Date.now()]);
    }
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
        const newNote: INote = createNote(
          timePressed,
          isFirstNote,
          pressStartTime,
          initialStartTime
        );
        updateNotesForKey(pressedNotes[pressedNotes.length - 1], newNote);
        //idk why this console.log dealyed by 1 note
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
        if (pressedNotes.length > 0) {
          console.log('sending notes');
          const song: ISong = {
            roomID: parseInt(roomId),
            user: user.name ?? 'Guest',
            sheet: notes,
          };
          socket.emit('send_song', song);
          setPressedNotes([]);
          // setNotes([]);
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
          playSong();
        }
        turncount.current += 1;
        setPlayAlong(false);
        setIsPlayerTurn((prev) => !prev);
        console.log('playalong : ', playAlong);
        console.log('isPlayerTurn : ', isPlayerTurn);
        setPressedNotes([]);
        // setNotes([]);
        console.log('playalong : ', playAlong);
      }, 20000);
    }
    //sendNote after 0.5 minute
  }, [playAlong]);

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
      trackElement.classList.add(style.track);

      value.notes.forEach(function (note: INote) {
        const noteElement = document.createElement('div');
        noteElement.classList.add(style.note);
        noteElement.classList.add(style.moveDown);
        noteElement.classList.add('note--' + key);
        noteElement.style.backgroundColor = value.color;
        // Set dynamic properties for duration and delay using CSS variables
        noteElement.style.setProperty(
          '--duration',
          note.fallDuration + (note.longNoteDuration * 0.1) / 110 + 's'
        );
        noteElement.style.setProperty(
          '--delay',
          note.delay / 1000 + speed + 's'
        );
        noteElement.style.setProperty('--bottomHeight', `${250}px`);
        // noteElement.style.animationPlayState = 'paused';
        noteElement.style.width = '44px'; // Set width
        noteElement.style.height = `${note.longNoteDuration * 0.1}px`; // Set height
        noteElement.style.top = `-${note.longNoteDuration * 0.1}px`;
        trackElement.appendChild(noteElement);
      });
      if (trackContainer) trackContainer.appendChild(trackElement);
      // Query all elements with the 'track' class after each update
      const tracks = document.querySelectorAll('.track');
    });
  };

  const handleNoteMiss = useCallback((event: AnimationEvent) => {
    // Use callback to prevent React to re-render function
    if (
      event.target &&
      event.target instanceof HTMLElement &&
      event.target.classList.item(1)
    ) {
      const indexString = event.target.classList.item(2)?.split('--')[1];
      removeNoteFromTrack(event.target.parentNode, event.target);
      updateNext(indexString);
    }
  }, []);

  const setupNoteMiss = function () {
    if (trackContainerRef.current) {
      trackContainerRef.current.removeEventListener(
        // Clean up event listener
        'animationend',
        handleNoteMiss
      );

      trackContainerRef.current.addEventListener(
        'animationend',
        handleNoteMiss
      );
    }
  };

  const playSong = () => {
    setIsPlaying(false);
    setIsPlaying(true);
    resetNextNoteInd();
    initializedSong();
    document.querySelectorAll('.note').forEach(function (note) {
      (note as HTMLDivElement).style.animationPlayState = 'running';
    });
    setupNoteMiss();
    setStartTime(Date.now());
  };

  const handleNoteRelease = (note: string) => {
    stopSound(note);
    if (pressStartTime !== null) {
      const endTime = Date.now();
      const timePressed = endTime - pressStartTime;

      if (isFirstNote) {
        setInitialStartTime(endTime);
        setIsFirstNote(false);
      }

      const newNote: INote = createNote(
        timePressed,
        isFirstNote,
        pressStartTime,
        initialStartTime
      );
      updateNotesForKey(pressedNotes[pressedNotes.length - 1], newNote);
      setPressStartTime(null);
    }
  };

  const handleNoteClick = (note: string) => {
    socket.emit('getNote', roomId, note);
    console.log('sending note', note);
    const frequency = getNoteFrequency(note);
    startSound(frequency, note);
    setPressedNotes((prev) => [...prev, note]);
    const startTime = Date.now();
    setPressStartTime(startTime);
  };

  useEffect(() => {
    socket.on('receive_song', (song: ISong) => {
      setSong(song);
    });

    return () => {
      socket.off('receive_song');
    };
  }, [socket]);

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
    isPlaying,
    startTime,
    song,
    audioContext,
    isPlayerTurn,
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
            <div>
              <p className='text-3xl text-white'>rainfall</p>
              <div
                ref={trackContainerRef}
                className='flex min-h-[220px] w-[940px] justify-center gap-1 px-32'
              ></div>
              <div className='flex w-full flex-col items-center justify-end gap-8 rounded-2xl bg-slate-300 px-12 pb-8'>
                <div>
                  <Piano
                    onNoteClick={handleNoteClick}
                    onNoteReleased={handleNoteRelease}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div>
              <p className='text-3xl text-white'>watch other rainfall</p>
              <div
                ref={trackContainerRef}
                className='flex min-h-[220px] w-[940px] justify-center gap-1 px-32'
              ></div>
              <div className='flex w-full flex-col items-center justify-end gap-8 rounded-2xl bg-slate-300 px-12 pb-8'>
                <div>
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
