// 'use client';
// 'use client';

// Remember you must use an AuthProvider for
// client components to useSession
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { useSession } from 'next-auth/react';
import React from 'react';

import UserProfile from '@/components/UserProfile';

// import UserProfile from '@/components/UserProfile';

export default function AccountPage(): React.JSX.Element {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/api/auth/signin?callbackUrl=/me');
    },
  });

  return (
    <div className='px-3 py-4'>
      <Link
        href={'/'}
        className='mt-12 rounded-lg border-2 border-gray-500 px-6'
      >
        Back
      </Link>
      {/* now having problem back button need a hard refresh
      can not navigate back to ref='/' . now using /home for temp fix*/}
      <section className='flex flex-col gap-4'>
        <UserProfile user={session?.user} />
      </section>
    </div>
  );
}
