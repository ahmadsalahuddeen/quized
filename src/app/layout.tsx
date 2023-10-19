import { cn } from '@/lib/utils';
import { Toaster } from 'sonner';

import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Providers from '@/components/Providers';
import Dashboard from './dashboard/page';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Quized',
  description: 'project github@ahmadsalahuddeen',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cn(inter.className, 'antialiased min-h-screen pt-16')}>
        <Providers>
          <Navbar />

          {children}
          <Toaster richColors />
        </Providers>
      </body>
    </html>
  );
}
