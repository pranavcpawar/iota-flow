import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Providers from '@/providers';
import { Navbar } from '@/app/navbar';
import { Note } from '@/app/note';

import './globals.css';
import '@iota/dapp-kit/dist/index.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'IOTA Flow',
  description: 'Streamlined receivables management powered by IOTA blockchain',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <Providers>
          <Navbar />
          <main className='min-h-screen pt-14'>{children}</main>
          <Note />
        </Providers>
      </body>
    </html>
  );
}
