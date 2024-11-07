'use client';

import { useTheme } from 'next-themes';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function ToggleTheme() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='outline'
          className='bg-note2 rounded-lg px-20 text-center text-3xl'
        >
          Theme
          <span className='sr-only'>Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='bg-note2 text-note w-36'>
        <DropdownMenuItem onClick={() => setTheme('star')} className='text-xl'>
          Star
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('snow')}>
          Snow
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('forest')}>
          Forest
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('city')}>
          City
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('haunt')}>
          Haunt
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
