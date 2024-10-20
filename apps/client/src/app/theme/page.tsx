import React from 'react';

import { ToggleTheme } from '@/components/ui/toggle-theme';

export default function ThemePage() {
  return (
    <div className='flex flex-col items-center gap-4 py-4 text-3xl'>
      <p className='text-white'>This is theme testing page</p>
      <div className='text-note bg-note2 max-w-fit rounded-lg'>
        <ToggleTheme />
      </div>
    </div>
  );
}
