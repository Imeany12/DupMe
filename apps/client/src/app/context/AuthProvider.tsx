'use client';

import { SessionProvider } from 'next-auth/react';

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return <SessionProvider>{children}</SessionProvider>;
}
