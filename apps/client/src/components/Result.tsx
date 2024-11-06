'use client';

import { createContext, useState } from 'react';

import { cn } from '@/lib/utils';

interface ResultContextProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  result: boolean;
  setResult: (result: boolean) => void;
  score: number;
  setScore: (score: number) => void;
}

export const ResultContext = createContext<ResultContextProps>({
  open: false,
  setOpen: () => null,
  result: false,
  setResult: () => null,
  score: 0,
  setScore: () => null,
});

export function ResultProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState<boolean>(true);
  const [result, setResult] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);

  return (
    <ResultContext.Provider
      value={{ open, setOpen, result, setResult, score, setScore }}
    >
      <div
        className={`fixed bottom-0 left-0 right-0 top-0 z-[100] ${
          open ? '' : 'pointer-events-none'
        }`}
      >
        <div className='relative flex h-full w-full'>
          <div
            className={cn(
              'absolute h-full w-full bg-[#D9D9D9E5] transition-all duration-300 ease-out',
              open ? 'opacity-90' : 'opacity-0'
            )}
          >
            <div className='flex h-full w-full flex-col items-center justify-center'>
              <div className='flex text-9xl lg:text-[256px]'>
                {result ? 'Win!' : 'Lose!'}
              </div>

              <div className='flex text-7xl lg:text-[175px]'>{score}</div>
            </div>
          </div>
        </div>
      </div>
      {children}
    </ResultContext.Provider>
  );
}
