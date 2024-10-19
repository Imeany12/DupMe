import './globals.css';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import AuthProvider from './context/AuthProvider';
import ThemeHandler from '@/components/ThemeHandler';

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
          <ThemeProvider attribute='class' defaultTheme='star' enableSystem={true}>
          <ThemeHandler />
            <main>{children}</main>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
