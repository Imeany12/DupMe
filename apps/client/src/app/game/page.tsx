'use client';
import { INote, INotes, ISong } from '@repo/shared-types/src/types';
import React, { useCallback, useEffect, useRef, useState } from 'react';

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

  const judge = function (index: number, tracks: NodeListOf<ChildNode>) {
    const perfectTimeOffset = 0.17; // manual calibration for perfect note
    const timeInSecond = (Date.now() - startTime) / 1000;
    console.log(timeInSecond);
    const nextNoteIndex = song.sheet[getKeyString(index)].nextNoteInd;
    if (nextNoteIndex < song.sheet[getKeyString(index)].notes.length) {
      const nextNote = song.sheet[getKeyString(index)].notes[nextNoteIndex];
      const perfectTime =
        nextNote.fallDuration + nextNote.delay / 1000 - perfectTimeOffset;
      const accuracy = Math.abs(timeInSecond - perfectTime);
      console.log(`perfect time: ${perfectTime} accuracy : ${accuracy}`);

      /**
       * As long as the note has travelled less than 3/4 of the height of
       * the track, any key press on this track will be ignored.
       */
      if (accuracy > (nextNote.fallDuration - speed) / 3) {
        return;
      }

      const hitJudgement = getHitJudgement(accuracy);
      removeNoteFromTrack(tracks[index], tracks[index].firstChild);
      updateNext(getKeyString(index));

      console.log(hitJudgement);
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

    if (note && (!presNote.pressing || presNote.note !== pressedKey)) {
      setPressedNotes((prev) => [...prev, note]);
      setPressStartTime(Date.now());
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
    endTime: number,
    initialStartTime: number
  ): INote {
    return {
      isLongNote: timePressed > 100,
      longNoteDuration: Math.max(timePressed, 100),
      fallDuration: 2,
      // Find a way to keep track game start time and get the delay from start.
      delay: isFirstNote ? 0 : endTime - initialStartTime,
    };
  };

  const handleKeyRelease = (event: KeyboardEvent) => {
    if (!isPlaying) {
      const releasedKey = event.key.toLowerCase();
      const note = Object.keys(keyMappings).find(
        (note) => keyMappings[note] === releasedKey
      );
      if (pressStartTime !== null && note && pressedNotes.includes(note)) {
        const endTime = Date.now();
        const timePressed = endTime - pressStartTime;
        const newNote: INote = createNote(
          timePressed,
          isFirstNote,
          endTime,
          initialStartTime
        );
        updateNotesForKey(pressedNotes[pressedNotes.length - 1], newNote);
        //idk why this console.log dealyed by 1 note
        setPressStartTime(null);

        if (isFirstNote) {
          setInitialStartTime(endTime);
          setIsFirstNote(false);
        }
      }
      setPresNote({
        pressing: false,
        note: '',
      });
    }
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
          note.fallDuration - speed + 's'
        );
        noteElement.style.setProperty(
          '--delay',
          Math.max(
            0,
            note.delay / 1000 +
              speed -
              (note.longNoteDuration * 0.2) /
                (400 / (note.fallDuration - speed))
          ) + 's'
        );
        noteElement.style.setProperty(
          '--bottomHeight',
          `${250 - note.longNoteDuration * 0.2}px`
        );
        // noteElement.style.animationPlayState = 'paused';
        noteElement.style.width = '44px'; // Set width
        noteElement.style.height = `${note.longNoteDuration * 0.2}px`; // Set height
        noteElement.style.top = `-${note.longNoteDuration * 0.2}px`;
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
        endTime,
        initialStartTime
      );
      updateNotesForKey(pressedNotes[pressedNotes.length - 1], newNote);
      setPressStartTime(null);
    }
  };

  const handleNoteClick = (note: string) => {
    setPressedNotes((prev) => [...prev, note]);
    setPressStartTime(Date.now());
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
  }, [keyMappings, pressedNotes, pressStartTime, isPlaying, startTime, song]);

  // Debugging Section
  useEffect(() => {
    console.log(notes);
  }, [notes]);
  useEffect(() => {
    console.log(song);
  }, [song]);
  useEffect(() => {
    console.log(startTime);
  }, [startTime]);

  return (
    /* still need to change background? or make a white box? */
    <div className='flex h-screen w-screen flex-col items-center justify-end pb-12'>
      <div className='max-w-screen-svh mx-16 flex max-h-svh flex-col items-center rounded-2xl bg-slate-300 px-12 pb-8'>
        <p className='pt-6 text-3xl text-white'>Play Your notes:</p>
        {/* <div className='drop max-w-screen flex min-h-[220px] flex-wrap gap-4'>
          {pressedNotes.map((note, index) => (
            <span
            key={index}
            className='bg-gradient-radial shirk-0 gradient flex h-16 w-16 items-center justify-center rounded-full border border-[#2FBCE7B0] bg-white from-[#C4C4C400] from-10% to-[#2FBCE7B0] text-xl font-bold text-[#6A98FF] shadow-[0_0px_40px_8px_#6A98FF]'
            >
              {note}
            </span>
          ))}
        </div> */}
        <div
          ref={trackContainerRef}
          className='flex min-h-[220px] w-[940px] justify-center gap-1 px-32'
        ></div>
        {/* {show pressednotes here} */}
        <div className='flex flex-col justify-end'>
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
            playSong();
          }}
        >
          Play
        </button>
      </div>
    </div>
  );
}
