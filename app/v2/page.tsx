import Hero from '@/components/v2/hero';
import Statement from '@/components/v2/statement';
import Reserve from '@/components/v2/dates';
import Work from '@/components/v2/work';
import Figures from '@/components/v2/figures';
import Voices from '@/components/v2/voices';
import Invitation from '@/components/v2/invitation';

export default function V2Page() {
  return (
    <main>
      <Hero />
      <Statement />
      <Reserve />
      <Work />
      <Figures />
      <Voices />
      <Invitation />
    </main>
  );
}
