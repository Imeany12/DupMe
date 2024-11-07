import React from 'react';

export default function WelcomPage(): React.JSX.Element {
  return (
    <div className='flex min-h-screen bg-[#D9D9D9E5] opacity-90'>
      <div className='flex flex-col items-center justify-center'>
        <div className='text-9xl lg:text-[256px]'>Welcome to DupMe!</div>
        <div className='text-7xl lg:text-[175px]'>Game is loading...</div>
      </div>
    </div>
  );
}
