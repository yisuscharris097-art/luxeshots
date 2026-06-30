import Hero from '@/components/hero';
import Stats from '@/components/stats';
import Ticker from '@/components/ticker';
import Manifesto from '@/components/manifesto';
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
      <Stats />
      <Ticker dur="36s" />
      <Manifesto />
      <Telescope />
      <Exhibition />
      <Reels />
      <Ticker reverse ghost dur="44s" />
      <Invitation />
      <Faq />
      <Reviews />
      <FooterCta />
    </main>
  );
}
