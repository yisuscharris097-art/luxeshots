import Hero from '@/components/hero';
import Exhibition from '@/components/exhibition';
import Stats from '@/components/stats';
import Ticker from '@/components/ticker';
import Telescope from '@/components/telescope';
import Reels from '@/components/reels';
import Invitation from '@/components/invitation';
import Faq from '@/components/faq';
import Reviews from '@/components/reviews';
import FooterCta from '@/components/footer-cta';

export default function Home() {
  return (
    <main>
      <Hero />
      <Exhibition />
      <Stats />
      <Ticker dur="36s" />
      <Telescope />
      <Reels />
      <Ticker reverse ghost dur="44s" />
      <Invitation />
      <Faq />
      <Reviews />
      <FooterCta />
    </main>
  );
}
