'use client'; // Enables client-side rendering for this component

import { ChangeEvent, useEffect, useRef, useState } from 'react'; // Import React hooks and types

export default function Countdown() {
  // State to manage the duration input
  const [duration, setDuration] = useState<number | string>(30);
  // State to manage the countdown timer value
  const [timeLeft, setTimeLeft] = useState<number>(0);
  // State to track if the timer is active
  const [isActive, setIsActive] = useState<boolean>(false);
  // Reference to store the timer ID
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Function to handle setting the duration of the countdown
  const handleSetDuration = (): void => {
    if (typeof duration === 'number' && duration > 0) {
      setTimeLeft(duration); // Set the countdown timer
      setIsActive(false); // Reset active state
      // Clear any existing timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  // Function to start the countdown timer
  const handleStart = (): void => {
    if (timeLeft > 0) {
      setIsActive(true); // Set the timer as active
    }
  };

  // Function to reset the countdown timer
  const handleReset = (): void => {
    setIsActive(false); // Set the timer as inactive
    setTimeLeft(typeof duration === 'number' ? duration : 0); // Reset the timer to the original duration
    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  // useEffect hook to manage the countdown interval
  useEffect(() => {
    // If the timer is active and not paused
    if (isActive) {
      // Set an interval to decrease the time left
      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          // If time is up, clear the interval
          if (prevTime <= 1) {
            clearInterval(timerRef.current!);
            return 0;
          }
          // Decrease the time left by one second
          return prevTime - 1;
        });
      }, 1000); // Interval of 1 second
    }
    // Cleanup function to clear the interval
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isActive]); // Dependencies array to rerun the effect

  // Function to format the time left into mm:ss format
  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60); // Calculate minutes
    const seconds = time % 60; // Calculate seconds
    // Return the formatted string
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(
      2,
      '0'
    )}`;
  };

  // Function to handle changes in the duration input field
  const handleDurationChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setDuration(Number(e.target.value) || ''); // Update the duration state
  };

  // JSX return statement rendering the Countdown UI
  return (
    // Container div for centering the content
    <div className='flex h-screen flex-col items-center justify-center'>
      {/* Timer box container */}
      <div className='w-full max-w-md rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800'>
        {/* Title of the countdown timer */}
        <h1 className='mb-4 text-center text-2xl font-bold text-gray-800 dark:text-gray-200'>
          Countdown Timer
        </h1>
        {/* Input and set button container */}
        <div className='mb-6 flex items-center'>
          <input
            type='number'
            id='duration'
            placeholder='Enter duration in seconds'
            value={duration}
            onChange={handleDurationChange}
            className='mr-4 flex-1 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200'
          />
          <button
            onClick={handleSetDuration}
            className='text-gray-800 dark:text-gray-200'
          >
            Set
          </button>
        </div>
        {/* Display the formatted time left */}
        <div className='mb-8 text-center text-6xl font-bold text-gray-800 dark:text-gray-200'>
          {formatTime(timeLeft)}
        </div>
        {/* Buttons to start, pause, and reset the timer */}
        <div className='flex justify-center gap-4'>
          <button
            onClick={handleStart}
            className='text-gray-800 dark:text-gray-200'
          >
            Start
          </button>
        </div>
      </div>
    </div>
  );
}
