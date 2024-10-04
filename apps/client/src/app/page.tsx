import Link from 'next/link';
import { getServerSession } from 'next-auth';

import UserProfile from '@/components/UserProfile';

import { options } from '../pages/api/auth/[...nextauth]';

export default async function Home() {
  const session = await getServerSession(options);

  return (
    <div className='mx-auto flex h-screen w-screen flex-col items-center'>
      {session ? (
        <div className='flex flex-col items-center'>
          <UserProfile user={session?.user} pagetype={'Home'} />
          <Link href='/api/auth/signout' className='text-3xl text-violet-500'>
            Sign Out
          </Link>
        </div>
      ) : (
        <div className='flex flex-col items-center'>
          <h1 className='text-5xl'>Not logged In</h1>
          <Link href='/api/auth/signin' className='text-3xl text-red-500'>
            Sign In
          </Link>
        </div>
      )}
      {/* <Image 
        src= "/images/starBg.jpg"
        alt='background'
        layout = 'fill'
        /> */}
      <div className='flex h-screen flex-row items-end'>
        <button className='my-64 rounded-lg border border-gray-500 bg-gray-200 px-8 py-2 text-4xl text-sky-600'>
          Play
        </button>
      </div>
    </div>
  );
}
