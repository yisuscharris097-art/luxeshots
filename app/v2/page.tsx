import Hero from '@/components/v2/hero';
import Marquee from '@/components/v2/marquee';
import Statement from '@/components/v2/statement';
import Reserve from '@/components/v2/dates';
import Work from '@/components/v2/work';
import Included from '@/components/v2/included';
import Faq from '@/components/v2/faq';
import Figures from '@/components/v2/figures';
import Voices from '@/components/v2/voices';
import Invitation from '@/components/v2/invitation';

export default function V2Page() {
  return (
    <main>
      <Hero />
      <Marquee />
      <Statement />
      <Reserve />
      <Work />
      <Included />
      <Faq />
      <Figures />
      <Voices />
      <Invitation />
    </main>
  );
}
