'use client';

import { INote, INotes, ISong, KeyMapping } from '@repo/shared-types';
import { useRouter, useSearchParams } from 'next/navigation';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FaFontAwesomeFlag } from 'react-icons/fa';

import Countdown from '@/components/CountDown';
import Piano from '@/components/Piano';
import ProfileInGame from '@/components/ProfileInGame';
import { Button } from '@/components/ui/button';
import { defaultKeyMappings } from '@/const/keymapping';
import { SERVER_URL } from '@/env';
import getNoteFrequency from '@/lib/getNoteFrequency';
import { socket } from '@/socket';

import style from './page.module.css';

type pressNote = {
  pressing: boolean;
  note: string;
};
const defaultNotes: { [key: string]: INotes } = {
  C: {
    color: 'var(--note,0.85)',
    color2: 'var(--note1)',
    nextNoteInd: 0,
    notes: [],
  },
  'C#': {
    color: 'var(--note2,0.85)',
    color2: 'var(--note1)',
    nextNoteInd: 0,
    notes: [],
  },
  D: {
    color: 'var(--note,0.85)',
    color2: 'var(--note1)',
    nextNoteInd: 0,
    notes: [],
  },
  'D#': {
    color: 'var(--note,0.85)',
    color2: 'var(--note1)',
    nextNoteInd: 0,
    notes: [],
  },
  E: {
    color: 'var(--note,0.85)',
    color2: 'var(--note1)',
    nextNoteInd: 0,
    notes: [],
  },
  F: {
    color: 'var(--note,0.85)',
    color2: 'var(--note1)',
    nextNoteInd: 0,
    notes: [],
  },
  'F#': {
    color: 'var(--note2,0.85)',
    color2: 'var(--note1)',
    nextNoteInd: 0,
    notes: [],
  },
  G: {
    color: 'var(--note,0.85)',
    color2: 'var(--note1)',
    nextNoteInd: 0,
    notes: [],
  },
  'G#': {
    color: 'var(--note2,0.85)',
    color2: 'var(--note1)',
    nextNoteInd: 0,
    notes: [],
  },
  A: {
    color: 'var(--note,0.85)',
    color2: 'var(--note1)',
    nextNoteInd: 0,
    notes: [],
  },
  'A#': {
    color: 'var(--note2,0.85)',
    color2: 'var(--note1)',
    nextNoteInd: 0,
    notes: [],
  },
  B: {
    color: 'var(--note,0.85)',
    color2: 'var(--note1)',
    nextNoteInd: 0,
    notes: [],
  },
};

export default function Game({
  roomId,
  host,
}: {
  roomId: string;
  host: string;
}) {
  const { data: session, status } =
    useSession({
      required: false,
    }) || {};
  const searchParams = useSearchParams();
  const players = searchParams.get('players') ?? '1';
  const countPlayer = parseInt(players, 10);
  //const host = searchParams.get('host') === 'true';
  // const Host = host === 'true';
  const Host = host === 'true';
  const turn = parseInt(searchParams.get('turn') ?? '1', 10);
  const user = session?.user ?? ({ name: 'Guest' } as User);

  const [playAlong, setPlayAlong] = useState<boolean>(false);
  const [isPlayerTurn, setIsPlayerTurn] = useState<boolean>(Host); //playerTurn form randaomization backend
  const [pressedNotes, setPressedNotes] = useState<string[]>([]);
  const [result, setResult] = useState('none');
  const [presNote, setPresNote] = useState<pressNote>({
    pressing: false,
    note: '',
  });
  const [keyMappings, setKeyMappings] =
    useState<KeyMapping>(defaultKeyMappings);
  useEffect(() => {
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
        console.log('new Keybind', keybindings);
      });
    }
  }, [user]);
  const router = useRouter();
  const turncount = useRef(1);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [activeOscillators, setActiveOscillators] = useState<{
    [key: string]: { oscillator: OscillatorNode; gainNode: GainNode };
  }>({});
  const [pressStartTime, setPressStartTime] = useState<number | null>(null);
  const [notes, setNotes] = useState<{ [key: string]: INotes }>(defaultNotes);
  const [song, setSong] = useState<ISong>({
    roomId: roomId,
    user: user.name ?? 'Guest',
    sheet: defaultNotes,
  });
  const [initialStartTime, setInitialStartTime] = useState<number>(Date.now());
  const [isFirstNote, setIsFirstNote] = useState<boolean>(true);
  const [scoreComboResult, setScoreComboResult] = useState<
    [number, number, string]
  >([0, 0, '']);
  const [speed, setSpeed] = useState(1);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [pressingNoteTime, setPressingNoteTime] = useState<[number, number]>([
    -1,
    Date.now(),
  ]);
  const getKeyIndex = function (key: string): number {
    console.log('key:', key);
    if (key === 'C') {
      return 0;
    } else if (key === 'C#') {
      return 1;
    } else if (key === 'D') {
      return 2;
    } else if (key === 'D#') {
      return 3;
    } else if (key === 'E') {
      return 4;
    } else if (key === 'F') {
      return 5;
    } else if (key === 'F#') {
      return 6;
    } else if (key === 'G') {
      return 7;
    } else if (key === 'G#') {
      return 8;
    } else if (key === 'A') {
      return 9;
    } else if (key === 'A#') {
      return 10;
    } else if (key === 'B') {
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

  const trackContainerRef = useRef<HTMLDivElement>(null);

  const updateNotesForKey = (key: string, newNote: INote) => {
    console.log('updating notes for key:', key);
    setNotes((prevNotes) => ({
      ...prevNotes,
      [key]: {
        ...prevNotes[key], // Keep other properties like color, nextNoteInd
        notes: [...prevNotes[key].notes, newNote], // Update the notes array
      },
    }));
    console.log('new notes:', notes);
  };

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
  };
  const resetNextNoteInd2 = () => {
    // Create a new object for the updated sheet
    const updatedSheet = Object.entries(notes).reduce(
      (acc, [key, value]) => {
        acc[key] = {
          ...value, // Keep other properties
          nextNoteInd: 0, // Set nextNoteInd to 0
        };
        return acc;
      },
      {} as { [key: string]: INotes }
    );
    setSong((prevSong) => ({
      ...prevSong,
      sheet: updatedSheet,
    }));
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
    const perfectTimeOffset = -0.9; // manual calibration for perfect note
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
        handleScoreCalculation(hitJudgement);
        // console.log(hitJudgement);
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

  const handleScoreCalculation = function (state: string) {
    if (state !== 'miss') {
      setScoreComboResult(([score, combo, status]) => [
        score,
        combo + 1,
        state,
      ]);
    } else setScoreComboResult(([score, combo, status]) => [score, 0, state]);
    if (state === 'perfect') {
      setScoreComboResult(([score, combo, status]) => [
        score + 300 * Math.floor(Math.E ** (combo * 0.3)),
        combo,
        state,
      ]);
    } else if (state === 'good') {
      setScoreComboResult(([score, combo, status]) => [
        score + 100 * Math.floor(Math.E ** (combo * 0.3)),
        combo,
        state,
      ]);
    } else if (state === 'bad') {
      setScoreComboResult(([score, combo, status]) => [
        score + 50 * Math.floor(Math.E ** (combo * 0.3)),
        combo,
        state,
      ]);
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
    if (playAlong) {
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
    const releasedKey = event.key.toLowerCase();
    const note = Object.keys(keyMappings).find(
      (note) => keyMappings[note] === releasedKey
    );
    const tracks = document.querySelectorAll('.track');
    if (note) {
      const keyIndex = getKeyIndex(note);
      if (tracks[keyIndex] && tracks[keyIndex].firstChild) {
        judge(keyIndex, tracks);
      }
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

  const playSong = () => {
    console.log('playing song', song);
    // setIsPlaying(false);
    // setIsPlaying(true);
    resetNextNoteInd();
    initializedSong();
    document.querySelectorAll('.note').forEach(function (note) {
      (note as HTMLDivElement).style.animationPlayState = 'running';
    });
    setupNoteMiss();
    setStartTime(Date.now());
  };
  const playSong2 = () => {
    // setIsPlaying(false);
    // setIsPlaying(true);
    console.log('playing song', notes);
    resetNextNoteInd2();
    initializedSong2();
    document.querySelectorAll('.note').forEach(function (note) {
      (note as HTMLDivElement).style.animationPlayState = 'running';
    });
  };

  useEffect(() => {
    const sendMaxScore = async () => {
      const res = await fetch(`${SERVER_URL}/user/${user.name}/profile/edit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          max_combo: scoreComboResult[1],
          max_score: scoreComboResult[0],
        }),
      });
      if (res.status === 200) {
        console.log('Max score saved');
      } else {
        console.log('Max score cant be saved');
      }
    };
    const handleResult = ({
      result,
      winner,
    }: {
      result: string;
      winner: string[];
    }) => {
      sendMaxScore();
      if (
        session &&
        session.user &&
        session.user.name &&
        winner.includes(session.user.name)
      ) {
        setResult(result);
      } else setResult('lose');
    };
    socket.on('result', handleResult);

    return () => {
      socket.off('result', handleResult);
    };
  }, [socket]);

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
        noteElement.style.background = `linear-gradient(${value.color}, ${value.color2})`;

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
  const initializedSong2 = function (): void {
    const trackContainer = trackContainerRef.current;

    // Clear all child nodes in the trackContainer
    while (trackContainer && trackContainer.hasChildNodes()) {
      trackContainer.removeChild(trackContainer.lastChild as ChildNode);
    }

    // Iterate through song's notes and create the track elements
    Object.entries(notes).forEach(([key, value]) => {
      const trackElement = document.createElement('div');
      trackElement.classList.add('track');
      trackElement.classList.add(style.track);

      value.notes.forEach(function (note: INote) {
        const noteElement = document.createElement('div');
        noteElement.classList.add(style.note);
        noteElement.classList.add(style.moveDown);
        noteElement.classList.add('note--' + key);
        noteElement.style.background = `linear-gradient(${value.color}, ${value.color2})`;

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
      handleScoreCalculation('miss');
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

  const handleKeyRelease = (event: KeyboardEvent) => {
    if (playAlong) handleKeyReleaseIsPlaying(event);
    else handleKeyReleaseIsNotPlaying(event);
  };
  const handleKeyReleaseIsPlaying = (event: KeyboardEvent) => {
    const releasedKey = event.key.toLowerCase();
    const note = Object.keys(keyMappings).find(
      (note) => keyMappings[note] === releasedKey
    );
    const tracks = document.querySelectorAll('.track');
    if (note) {
      const keyIndex = getKeyIndex(note);
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

  const handleNoteReleaseIsPlaying = (note: string) => {
    const tracks = document.querySelectorAll('.track');
    const keyIndex = getKeyIndex(note);

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

  const handleNoteClickIsPlaying = (note: string) => {
    const tracks = document.querySelectorAll('.track');
    const keyIndex = getKeyIndex(note);
    if (tracks[keyIndex] && tracks[keyIndex].firstChild) {
      judge(keyIndex, tracks);
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
    console.log('keymapping:', keyMappings);
    if (turncount.current > 2 * countPlayer) {
      socket.emit('end_game', roomId, scoreComboResult[0], user?.name);
      setTimeout(() => {
        router.push('/lobby/' + roomId + '?host=false');
      }, 10000);
    }
  }, [turncount.current]);

  useEffect(() => {
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

  useEffect(() => {
    if (playAlong === false) {
      setTimeout(() => {
        setPressedNotes([]);
        setPlayAlong(true);
      }, 15000);
    }
    if (playAlong === true) {
      setTimeout(() => {
        turncount.current += 1;
        setPlayAlong(false);
        if (isPlayerTurn === true) setIsPlayerTurn(false);
        if ((turncount.current - turn) % countPlayer === 0) {
          setIsPlayerTurn((prev) => !prev);
        }
        setPressedNotes([]);
        setIsFirstNote(true);
        setNotes(defaultNotes);
        setScoreComboResult(([score, combo, state]) => [score, 0, '']);
      }, 30000);
      const newSong: ISong = {
        roomId: roomId,
        user: user.name ?? 'Guest',
        sheet: notes,
      };
      // setSong(newSong);
      console.log('sending song');
      socket.emit('send_song', newSong);
      socket.on('play_song', (roomId: string) => {
        console.log('revieve play song', notes);
        playSong2();
      });
      return () => {
        socket.off('play_song');
      };
    }
    //sendNote after 0.5 minute
  }, [playAlong]);

  useEffect(() => {
    setPressedNotes([]);
    socket.on('receive_song', (newISong: ISong) => {
      setSong(newISong);
      console.log('receive song');
    });

    return () => {
      socket.off('receive_song');
    };
  }, [playAlong, song]);

  useEffect(() => {
    console.log(scoreComboResult);
  }, [scoreComboResult]);

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
  }, [
    keyMappings,
    pressedNotes,
    initialStartTime,
    pressStartTime,
    pressingNoteTime,
    playAlong,
    startTime,
    song,
    audioContext,
    isPlayerTurn,
  ]);

  useEffect(() => {
    if (result !== 'none') {
      setTimeout(() => {
        router.push('/result/' + roomId + '/' + result);
      }, 2000);
      socket.emit('leave_lobby', { roomId, username: user?.name });
    }
  }, [result]);

  return (
    <div className='flex h-screen w-screen flex-col items-center'>
      <div className='flex w-full flex-row justify-end px-10 pt-4'>
        <div className='my-auto flex max-h-min w-min flex-row items-end rounded-full bg-white'>
          <ProfileInGame session={session} />
        </div>
        <div>
          <p className='justify-center px-3 text-xl text-white'>{user.name}</p>
          {(!isPlayerTurn && playAlong) || (isPlayerTurn && !playAlong) ? (
            <p className='mt-3 px-2 text-sm text-white'>Your Turn!</p>
          ) : (
            <p className='mt-3 px-2 text-sm text-white'>
              Wait For other Player!
            </p>
          )}
          <div className='bg-note flesx-shrink-0 h-[16px] w-[400px] rounded-lg'></div>
        </div>
        <div className='flex w-full items-start justify-end'>
          <button
            className='size-20 px-8 pt-6 text-white'
            onClick={() => {
              socket.emit('game_end');
              console.log('player resign');
              socket.emit('leave_lobby', {
                username: user?.name,
                roomId,
              });
              router.push('/lobby/' + roomId + '?host=false&multi=true');
            }}
          >
            <FaFontAwesomeFlag
              size={30}
              className='shadow-inner shadow-white'
            />
          </button>
        </div>
      </div>
      {playAlong ? (
        <div>
          {/* waiting for rainfall from mark */}
          {isPlayerTurn ? (
            <div>
              {/* <Countdown duration={60} /> */}
              <div className='flex w-full flex-col items-center justify-center rounded-2xl bg-slate-300 px-12 py-8'>
                <div className='flex justify-center'>
                  <div
                    ref={trackContainerRef}
                    className='flex min-h-[220px] w-[118%] justify-center gap-1'
                  ></div>
                </div>
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
          ) : (
            <div className='w-full'>
              <div className='flex w-full flex-col items-center justify-end rounded-2xl bg-slate-300 px-12 py-8'>
                <Countdown duration={30} />
                <div className='flex w-full justify-center pt-8'>
                  <div
                    ref={trackContainerRef}
                    className='flex min-h-[220px] w-[118%] justify-center gap-1'
                  ></div>
                </div>
                <div>
                  <Piano
                    onNoteClick={handleNoteClickIsPlaying}
                    onNoteReleased={handleNoteReleaseIsPlaying}
                  />
                </div>
                <div className='flex w-full justify-center gap-8 pt-8'>
                  <h1>Combo : {scoreComboResult[1]}</h1>
                  <h1>Score : {scoreComboResult[0]}</h1>
                  <h1 className='text-note2 text-xl'>{scoreComboResult[2]}</h1>
                  <Button
                    onClick={() => {
                      playSong();
                      console.log('play song ', song);
                      socket.emit('play_song', roomId);
                    }}
                  >
                    Play
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div>
          {isPlayerTurn ? (
            <div>
              <div className='flex h-full max-w-full flex-col items-center justify-end pt-2'>
                <div className='max-w-svw mx-16 flex max-h-full flex-col items-center justify-end gap-8 rounded-2xl bg-slate-300 px-12 pb-8'>
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
              <div className='flex h-full max-w-full flex-col items-center justify-end pt-2'>
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
