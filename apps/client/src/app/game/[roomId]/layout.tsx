import React from 'react';

import { ResultProvider } from '@/components/Result';

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return <ResultProvider>{children}</ResultProvider>;
}
