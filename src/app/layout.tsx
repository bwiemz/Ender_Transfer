import './globals.css';
import '../styles/fonts.css';
import React from 'react';
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Enderfall',
  description: 'Enderfall Studio - tools, projects, and communities.',
  icons: {
    icon: '/images/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} main-site`}>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
