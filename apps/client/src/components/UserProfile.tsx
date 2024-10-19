import { IUser } from '@repo/shared-types';
import Image from 'next/image';
import { IoMdMale } from 'react-icons/io';

import getAllUsers from '@/lib/getAllUser';

export default async function UserProfile({ username }: { username: string }) {
  const users: IUser[] = await getAllUsers();
  // const user: IUser = await getUser(username);
  // const user = users.find((user) => user.username === username);
  const user = users[0];

  const userImage = user?.image ? (
    <Image
      className='mx-auto mt-8 rounded-full border-4 border-black shadow-black drop-shadow-xl dark:border-slate-500'
      src={user?.image}
      width={200}
      height={200}
      alt={user?.username ?? 'Profile Pic'}
      priority={true}
    />
  ) : null;

  return (
    <div className='h-screen bg-zinc-900 font-sans text-white'>
      {/* Profile Section */}
      <section className='p-8'>
        <div className='flex flex-col items-center'>
          {userImage}
          <div className='ml-6 flex flex-col gap-2'>
            <h1 className='text-3xl font-bold'>{user?.username}</h1>
            <div>
              <p className='text-sm text-gray-400'>Thailand</p>
              <IoMdMale className='text-2xl text-gray-400' />
            </div>
          </div>
        </div>

        {/* Ranking and Stats */}
        <div className='mt-8 grid grid-cols-2 items-center justify-between gap-4'>
          <div className='flex flex-col items-center pl-24'>
            <h2 className='text-xl font-semibold'>Joined Since:</h2>
            <p>{user?.createdAt?.getDate()}</p>
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
