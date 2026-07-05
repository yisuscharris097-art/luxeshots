import type { Metadata } from 'next';
import './globals.css';

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
          href="https://fonts.googleapis.com/css2?family=Sora:wght@400..800&family=Instrument+Sans:ital,wght@0,400..700;1,400..700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body id="top">{children}</body>
    </html>
  );
}
