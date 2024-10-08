import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { options } from '@/pages/api/auth/[...nextauth]';
import HomePage from '@/view/home/home';

export default async function Home() {
  const session = await getServerSession(options);
  if (!session) {
    redirect('/api/auth/signin?callbackUrl=/');
  }

  return <HomePage {...session} />;
}
