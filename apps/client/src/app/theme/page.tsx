import { ToggleTheme } from '@/components/ui/toggle-theme'
import React from 'react'

export default function 
() {
  return (
    <div className='flex items-center flex-col py-4 gap-4 text-3xl'>
        <p className='text-white'>This is theme testing page</p>
        <div className='text-note bg-note2 rounded-lg max-w-fit'>

        <ToggleTheme />
        </div>

    </div>
  )
}
