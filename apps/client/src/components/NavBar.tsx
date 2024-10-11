import Link from 'next/link';
<<<<<<< HEAD
import React from 'react';
import { FiHome } from 'react-icons/fi';
=======
import { useSession } from 'next-auth/react';
import React from 'react';
>>>>>>> 1b6c80e (feat: background images, Navbar)

type User =
  | {
      name?: string | null | undefined;
      email?: string | null | undefined;
      image?: string | null | undefined;
    }
  | undefined;

<<<<<<< HEAD
export default function NavBar({ session }: { session: any }) {
  const user: User = session?.user;

  return (
    <nav>
      <ul className='flex flex-grow py-4'>
        <li className='ml-4'>
          <Link href='/' className='items-start text-3xl text-white'>
            <FiHome />
          </Link>
        </li>
        <li className='mr-6 flex w-full flex-col items-end'>
          {!user ? (
            <div className='flex items-center gap-4'>
              <Link
                href='/api/auth/signin'
                className='rounded-lg border bg-neutral-300 px-2 text-xl font-semibold text-neutral-700'
              >
                Sign In
              </Link>
              <Link
                href='/auth/signUp'
                className='rounded-lg border bg-neutral-800 px-2 text-xl font-semibold text-white'
              >
                register
              </Link>
            </div>
          ) : (
            <Link
              href={'/api/auth/signout'}
              className='rounded-lg border bg-neutral-300 px-2 text-xl font-semibold text-neutral-700'
            >
=======
export default function NavBar() {
  const { data: session } = useSession({
    required: false,
  });
  const user = session?.user;

  return (
    <nav>
      <ul>
        <li className='flex flex-grow'>
          <Link color='inherit' href='/'>
            Home
          </Link>
        </li>
        <li>
          {!user ? (
            <Link href='/api/auth/signin' className='text-3xl text-red-500'>
              Sign In
            </Link>
          ) : (
            <Link color='inherit' href={'/api/auth/signout'}>
>>>>>>> 1b6c80e (feat: background images, Navbar)
              Sign Out
            </Link>
          )}
        </li>
      </ul>
    </nav>
  );
}
