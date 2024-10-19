'use client';
// Remember you must use an AuthProvider for
// client components to useSession
import { redirect } from 'next/navigation';
import { useSession } from 'next-auth/react';

import NavBar from '@/components/NavBar';
import UserProfile from '@/components/UserProfile';

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
      <UserProfile username={user?.name ?? 'Guest'} />
    </div>
  );
}
