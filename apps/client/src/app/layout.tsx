import './globals.css';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

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
          {/* <NavBar /> */}
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
