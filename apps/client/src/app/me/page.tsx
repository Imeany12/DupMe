// 'use client';
// 'use client';

// Remember you must use an AuthProvider for
// client components to useSession
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { FiHome } from 'react-icons/fi';

import EditUserProfile from '@/components/EditUserProfile';
import { Button } from '@/components/ui/button';
import UserProfile from '@/components/UserProfile';
import { SERVER_URL } from '@/env';

export default function AccountPage(): React.JSX.Element {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/api/auth/signin?callbackUrl=/me');
    },
  });
  const user1 = session?.user;
  const [user, setUser] = useState(user1);
  useEffect(() => {
    if (status !== 'loading') {
      setUser(user1);
    }
  }, [status]);
  const [edit, setEdit] = useState(false);
  useEffect(() => {
    const fetchUser = async () => {
      if (user) {
        console.log('user', user);
        const newUser = await fetch(
          `${SERVER_URL}/user/${user.username ?? user.name}/`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        const data = await newUser.json();
        setUser(data.user);
        console.log('newUser', data.user);
        console.log('user', data.user);
      }
    };
    fetchUser();
  }, [user]);

  return (
    <div>
      <nav className='bg-note2 flex w-svw justify-between px-10'>
        <Link href={'/'}>
          <Button className=''>
            <FiHome />
          </Button>
        </Link>
        {edit ? (
          <Button onClick={() => setEdit(false)}>Cancel</Button>
        ) : (
          <Button onClick={() => setEdit(true)}>Edit</Button>
        )}
      </nav>
      {edit ? (
        <>{user ? <EditUserProfile user={user} setEdit={setEdit} /> : <></>}</>
      ) : (
        <div>{user ? <UserProfile user={user} /> : <></>}</div>
      )}
    </div>
  );
  //   <div className='h-full bg-zinc-900 font-sans text-white'>
  //     {/* Header */}
  //     <header className='flex items-center justify-between bg-slate-600 p-4'>
  //       <NavBar session={session} />
  //     </header>
  //     <section className='p-8'>
  //       <div className='flex flex-col items-center'>
  //         <Image
  //           className='mx-auto mt-8 rounded-full border-4 border-black shadow-black drop-shadow-xl dark:border-slate-500'
  //           src={user?.image ?? '/images/default-profile.png'}
  //           width={200}
  //           height={200}
  //           alt={user?.name ?? 'Profile Pic'}
  //           priority={true}
  //         />
  //         <div className='ml-6 flex flex-col gap-2'>
  //           <h1 className='text-3xl font-bold'>{user?.name}</h1>
  //           <p className='text-sm text-gray-400'>Thailand</p>
  //         </div>
  //       </div>
  //       {/* Ranking and Stats */}
  //       <div className='mt-8 grid grid-cols-2 items-center justify-between gap-4'>
  //         <div className='flex flex-col items-center pl-24'>
  //           <h2 className='text-xl font-semibold'>Global Rank</h2>
  //           <p>#248,633</p>
  //         </div>
  //         <div className='flex flex-col items-center pr-24'>
  //           <h2 className='text-xl font-semibold'>Country Rank</h2>
  //           <p>#2,608</p>
  //         </div>
  //       </div>
  //       {/* Score & Stats */}
  //       <div className='m-8 mx-32 flex flex-col items-center justify-center bg-gray-800'>
  //         <h3 className='mt-4 text-2xl font-semibold underline'>Statistics</h3>
  //         <div className='my-6 grid grid-cols-2 gap-32'>
  //           <div className='flex w-full flex-col items-center gap-4'>
  //             <p>
  //               Total Score: <span className='font-bold'>3,718,176,703</span>
  //             </p>
  //             <p>
  //               Average Accuracy: <span className='font-bold'>97.17%</span>
  //             </p>
  //             <p>
  //               Play Count: <span className='font-bold'>17,652</span>
  //             </p>
  //           </div>
  //           <div className='flex w-full flex-col items-center gap-4'>
  //             <p>
  //               Hit Count: <span className='font-bold'>4,016,360</span>
  //             </p>
  //             <p>
  //               Max Combo: <span className='font-bold'>1,257</span>
  //             </p>
  //           </div>
  //         </div>
  //       </div>
  //     </section>
  //   </div>
  // );
}
