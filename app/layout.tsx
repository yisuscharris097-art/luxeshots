import type { Metadata } from 'next';
import './globals.css';
import SmoothScroll from '@/components/smooth-scroll';
import Preloader from '@/components/preloader';
import Cursor from '@/components/cursor';
import Grain from '@/components/grain';
import ScrollProgress from '@/components/scroll-progress';
import Nav from '@/components/nav';
import RhythmEngine from '@/components/rhythm-engine';

export const metadata: Metadata = {
  title: 'LuxeShots — LUXE Content Days | Viral Reels & Headshots for Realtors',
  description:
    'Book your Luxe Content Day inside a multimillion-dollar listing. Walk away with a viral video reel and a scroll-stopping headshot — absolutely free. Top realtors pay $1,500+.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo:ital,wdth,wght@0,75..125,300..800;1,100,400..600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body id="top">
        <Preloader />
        <Grain />
        <ScrollProgress />
        <Cursor />
        <Nav />
        <SmoothScroll>{children}</SmoothScroll>
        <RhythmEngine />
      </body>
    </html>
  );
}
