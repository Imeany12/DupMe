'use client';
// Remember you must use an AuthProvider for
// client components to useSession
import { redirect } from 'next/navigation';
import { useSession } from 'next-auth/react';

import UserProfile from '@/components/UserProfile';

export default function ClientPage() {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/api/auth/signin?callbackUrl=/myAccount');
    },
  });

  return (
    <section className='flex flex-col gap-4'>
      <UserProfile user={session?.user} pagetype={'Client'} />
    </section>
  );
}
