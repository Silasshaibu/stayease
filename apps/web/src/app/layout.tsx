import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: { default: 'StayEase — Hotel Booking Platform', template: '%s | StayEase' },
  description: 'Find and book the best hotels worldwide. Booking.com-style platform with great deals.',
  keywords: ['hotel booking', 'accommodation', 'travel', 'stayease'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
