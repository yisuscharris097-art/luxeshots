import SmoothScroll from '@/components/smooth-scroll';
import Preloader from '@/components/preloader';
import Cursor from '@/components/cursor';
import Grain from '@/components/grain';
import ScrollProgress from '@/components/scroll-progress';
import Nav from '@/components/nav';
import RhythmEngine from '@/components/rhythm-engine';

/** V1 (main site) chrome — kept exactly as before, just scoped to its route group. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Preloader />
      <Grain />
      <ScrollProgress />
      <Cursor />
      <Nav />
      <SmoothScroll>{children}</SmoothScroll>
      <RhythmEngine />
    </>
  );
}
