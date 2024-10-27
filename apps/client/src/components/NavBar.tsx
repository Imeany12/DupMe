import { Avatar } from '@radix-ui/react-avatar';
import Image from 'next/image';
import Link from 'next/link';
import { Session } from 'next-auth';
import React from 'react';
import { IoMdSettings } from 'react-icons/io';

type User =
  | {
      name?: string | null | undefined;
      email?: string | null | undefined;
      image?: string | null | undefined;
    }
  | undefined;

export default function NavBar({ session }: { session: Session | null }) {
  const user: User = session?.user;

  return (
    <nav>
      <ul className='flex flex-grow py-4'>
        {/* <li className='ml-4'>
          <Link href='/' className='items-start text-3xl text-white'>
            <FiHome />
          </Link>
        </li> */}
        <li className='ml-4'>
          <Link href='/set' className='text-3xl text-white'>
            <IoMdSettings />
          </Link>
        </li>
        <li className='mr-10 flex w-full flex-col items-end'>
          {!user ? (
            <div className='flex items-center gap-4'>
              <Link
                href='/api/auth/signin'
                className='rounded-lg border bg-neutral-300 px-2 py-1 text-xl font-semibold text-neutral-700'
              >
                Sign In
              </Link>
              <Link
                href='/auth/signUp'
                className='rounded-lg border bg-neutral-800 px-2 py-1 text-xl font-semibold text-white'
              >
                register
              </Link>
            </div>
          ) : (
            <div className='flex flex-row gap-4'>
              <Link href='/me'>
                <Avatar>
                  <Image
                    className='rounded-full border border-white shadow-black drop-shadow-xl'
                    width={45}
                    height={45}
                    src={user.image ?? '/images/default-profile.png'}
                    alt='Profile Pic'
                  />
                </Avatar>
              </Link>
              <Link
                href={'/api/auth/signout'}
                className='text-note2 bg-note rounded-lg border px-2 pt-1.5 text-xl font-semibold'
              >
                Sign Out
              </Link>
            </div>
          )}
        </li>
      </ul>
    </nav>
  );
}
