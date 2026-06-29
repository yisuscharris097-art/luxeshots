import type { Metadata } from 'next';
import { Cormorant_Garamond, Montserrat } from 'next/font/google';
import './globals.css';
import SmoothScroll from '@/components/smooth-scroll';
import Preloader from '@/components/preloader';
import Cursor from '@/components/cursor';

const serif = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
});
const sans = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'LuxeShots — LUXE Content Days | Viral Reels & Headshots for Realtors',
  description:
    'Book your Luxe Content Day inside a multimillion-dollar home. Get a high-end headshot & a viral video reel — absolutely FREE. Top realtors pay $1,500+. You get it free.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body>
        <Preloader />
        <Cursor />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
