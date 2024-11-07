import './signin.css';

import React from 'react';

import SignIn from '@/pages/signIn/page';

export default async function SignInPage({
  searchParams,
}: {
  searchParams: {
    callbackUrl: string;
  };
}): Promise<React.JSX.Element> {
  return <SignIn callbackUrl={searchParams.callbackUrl} />;
}
