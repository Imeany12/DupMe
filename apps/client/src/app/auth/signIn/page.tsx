'use client';

import './signin.css';

import Image from 'next/image';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useState } from 'react';

export default function SignInPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Call NextAuth's signIn function with credentials
    const res = await signIn('credentials', {
      redirect: false,
      username: username,
      password: password,
      callbackUrl: '/',
    });
    if (res?.error) {
      setError('Login failed. Please check your credentials.');
    } else {
      window.location.href = '/';
    }
  };

  return (
    <div className='__next-auth-theme-auto'>
      <div className='card'>
        <div className='page'>
          <div className='signin'>
            <div className='flex flex-col items-center rounded-lg border px-5 py-2 pb-4 pt-4'>
              <div className='provider'>
                {error && <p className='text-red-500'>{error}</p>}
                <form
                  onSubmit={handleSubmit}
                  className='flex flex-col items-center py-2'
                >
                  <div>
                    <label
                      className='section-header'
                      htmlFor='input-username-for-credentials-provider'
                    >
                      Username :
                    </label>
                    <input
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value);
                      }}
                      name='username'
                      id='input-username-for-credentials-provider'
                      type='text'
                      placeholder='your-username'
                    />
                  </div>
                  <div>
                    <label
                      className='section-header'
                      htmlFor='input-password-for-credentials-provider'
                    >
                      Password :{' '}
                    </label>
                    <input
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                      }}
                      name='password'
                      id='input-password-for-credentials-provider'
                      type='password'
                      placeholder='your-password'
                    />
                  </div>
                  <button
                    className='my-3 mt-6 w-full rounded-lg px-4 text-xl'
                    type='submit'
                  >
                    Sign in
                  </button>
                  <Link
                    href={'/auth/signUp'}
                    className='mb-4 flex w-full flex-col items-center rounded-lg border bg-cyan-600 px-4 text-xl text-gray-100'
                  >
                    Register
                  </Link>
                </form>
                <hr />
              </div>
              <div className='provider'>
                <button
                  type='submit'
                  name='googleButton'
                  onClick={() => signIn('google', { callbackUrl: '/' })}
                  style={
                    {
                      '--provider-bg': '#fff',
                      '--provider-dark-bg': '#fff',
                      '--provider-color': '#000',
                      '--provider-dark-color': '#000',
                      '--provider-bg-hover': 'rgba(255, 255, 255, 0.8)',
                      '--provider-dark-bg-hover': 'rgba(255, 255, 255, 0.8)',
                    } as React.CSSProperties
                  }
                  className='flex items-center gap-4 rounded-xl border-4 border-neutral-100 px-4 py-1'
                >
                  <Image
                    loading='lazy'
                    height='24'
                    width='24'
                    id='provider-logo'
                    src='https://authjs.dev/img/providers/google.svg'
                    alt='github_logo'
                  />
                  <span>Sign in with Google</span>
                </button>
              </div>
              <div className='provider'>
                <button
                  type='submit'
                  name='githubButton'
                  onClick={() => signIn('github', { callbackUrl: '/' })}
                  style={
                    {
                      '--provider-bg': 'rgba(36, 41, 47, 0.8)',
                      '--provider-dark-bg': 'rgba(36, 41, 47, 0.8)',
                      '--provider-color': '#fff',
                      '--provider-dark-color': '#fff',
                      '--provider-bg-hover': 'rgba(36, 41, 47, 0.5)',
                      '--provider-dark-bg-hover': 'rgba(36, 41, 47, 0.5)',
                    } as React.CSSProperties
                  }
                  className='flex items-center gap-4 rounded-xl border-4 border-neutral-100 px-4 py-1'
                >
                  <Image
                    loading='lazy'
                    height='24'
                    width='24'
                    id='provider-logo'
                    src='https://authjs.dev/img/providers/github.svg'
                    alt='github_logo'
                  />
                  <span>Sign in with GitHub</span>
                </button>
              </div>
              <div className='provider'>
                <button
                  type='submit'
                  name='twitterButton'
                  onClick={() => signIn('twitter', { callbackUrl: '/' })}
                  style={
                    {
                      '--provider-bg': 'rgba(29, 161, 242, 0.8)',
                      '--provider-dark-bg': 'rgba(29, 161, 242, 0.8)',
                      '--provider-color': '#fff',
                      '--provider-dark-color': '#fff',
                      '--provider-bg-hover': 'rgba(29, 161, 242, 0.5)',
                      '--provider-dark-bg-hover': 'rgba(29, 161, 242, 0.5)',
                    } as React.CSSProperties
                  }
                  className='flex items-center gap-4 rounded-xl border-4 border-neutral-100 px-4 py-1'
                >
                  <Image
                    loading='lazy'
                    height='24'
                    width='24'
                    id='provider-logo'
                    src='https://authjs.dev/img/providers/twitter.svg'
                    alt='github_logo'
                  />
                  <span>Sign in with Twitter</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
