import type { Metadata } from 'next';
import './v2.css';
import Shell from '@/components/v2/shell';
import Masthead from '@/components/v2/masthead';

export const metadata: Metadata = {
  title: 'LuxeShots — Edition N°02 · Monochrome',
  description:
    'A monochrome editorial edition of LuxeShots. Book a free Luxe Content Day inside a multimillion-dollar listing — a viral reel and a scroll-stopping headshot, in black & white.',
};

export default function V2Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="v2">
      <Shell />
      <Masthead />
      {children}
    </div>
  );
}
