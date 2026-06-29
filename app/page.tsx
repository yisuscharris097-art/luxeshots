import Hero from '@/components/hero';
import Telescope from '@/components/telescope';
import Exhibition from '@/components/exhibition';
import Reels from '@/components/reels';
import Invitation from '@/components/invitation';
import Faq from '@/components/faq';
import Reviews from '@/components/reviews';
import FooterCta from '@/components/footer-cta';

export default function Home() {
  return (
    <main>
      <Hero />
      <Telescope />
      <Exhibition />
      <Reels />
      <Invitation />
      <Faq />
      <Reviews />
      <FooterCta />
    </main>
  );
}
