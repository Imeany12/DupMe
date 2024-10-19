'use client';
// Remember you must use an AuthProvider for
// client components to useSession
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { useSession } from 'next-auth/react';

import NavBar from '@/components/NavBar';

// export default function AccountPage() {
//   const { data: session } = useSession({
//     required: true,
//     onUnauthenticated() {
//       redirect('/api/auth/signin?callbackUrl=/myAccount');
//     },
//   });

//   return (
//     <div className='px-3 py-4'>
//       <Link
//         href={'/'}
//         className='mt-12 rounded-lg border-2 border-gray-500 px-6'
//       >
//         Back
//       </Link>
//       <section className='flex flex-col gap-4'>
//         <UserProfile user={session?.user} />
//       </section>
//     </div>
//   );
// }

export default function AccountPage() {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/api/auth/signin?callbackUrl=/myAccount');
    },
  });
  const user = session?.user;

  return (
    <div className='h-screen bg-zinc-900 font-sans text-white'>
      {/* Header */}
      <header className='flex items-center justify-between bg-slate-600 p-4'>
        <NavBar session={session} />
      </header>

      {/* Profile Section */}
      <section className='p-8'>
        <div className='flex flex-col items-center'>
          <Image
            className='mx-auto mt-8 rounded-full border-4 border-black shadow-black drop-shadow-xl dark:border-slate-500'
            src={user?.image ?? '/images/default-profile.png'}
            width={200}
            height={200}
            alt={user?.name ?? 'Profile Pic'}
            priority={true}
          />
          <div className='ml-6 flex flex-col gap-2'>
            <h1 className='text-3xl font-bold'>{user?.name}</h1>
            <p className='text-sm text-gray-400'>Thailand</p>
          </div>
        </div>

        {/* Ranking and Stats */}
        <div className='mt-8 grid grid-cols-2 items-center justify-between gap-4'>
          <div className='flex flex-col items-center pl-24'>
            <h2 className='text-xl font-semibold'>Global Rank</h2>
            <p>#248,633</p>
          </div>
          <div className='flex flex-col items-center pr-24'>
            <h2 className='text-xl font-semibold'>Country Rank</h2>
            <p>#2,608</p>
          </div>
        </div>

        {/* Score & Stats */}
        <div className='m-8 mx-32 flex flex-col items-center justify-center bg-gray-800'>
          <h3 className='mt-4 text-2xl font-semibold underline'>Statistics</h3>
          <div className='my-6 grid grid-cols-2 gap-32'>
            <div className='flex w-full flex-col items-center gap-4'>
              <p>
                Total Score: <span className='font-bold'>3,718,176,703</span>
              </p>
              <p>
                Average Accuracy: <span className='font-bold'>97.17%</span>
              </p>
              <p>
                Play Count: <span className='font-bold'>17,652</span>
              </p>
            </div>
            <div className='flex w-full flex-col items-center gap-4'>
              <p>
                Hit Count: <span className='font-bold'>4,016,360</span>
              </p>
              <p>
                Max Combo: <span className='font-bold'>1,257</span>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
