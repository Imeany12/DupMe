import './globals.css';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import NavBar from '@/components/NavBar';

import AuthProvider from './context/AuthProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'DupMe',
  description: 'Netcentric Project',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={`background-image ${inter.className}`}>
        <AuthProvider>
<<<<<<< HEAD
          {/* <NavBar /> */}
=======
          <NavBar />
>>>>>>> 1b6c80e (feat: background images, Navbar)
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
