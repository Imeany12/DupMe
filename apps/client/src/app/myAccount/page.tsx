'use client';
// Remember you must use an AuthProvider for
// client components to useSession
import Link from 'next/link';
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
    <div>
      <Link href='/'>Back</Link>
      <section className='flex flex-col gap-4'>
        <UserProfile user={session?.user} pagetype={'Account/client'} />
      </section>
    </div>
  );
}
