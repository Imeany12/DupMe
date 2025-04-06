import './signin.css';

import React from 'react';

import SignIn from '@/pages/signIn/page';

export default async function SignInPage(props: {
  searchParams: Promise<{
    callbackUrl: string;
  }>;
}): Promise<React.JSX.Element> {
  const searchParams = await props.searchParams;
  return <SignIn callbackUrl={searchParams.callbackUrl} />;
}
