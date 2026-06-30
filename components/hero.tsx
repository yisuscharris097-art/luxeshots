'use client';
import { contentDays } from '@/lib/data';
import HlsVideo from './hls-video';
import { posterFor } from '@/lib/hls';
import Magnetic from './magnetic';

const HERO_REEL = 'https://vz-5c81264f-e6c.b-cdn.net/1e7a339f-240e-454a-aeb7-a1690e293540/playlist.m3u8';
const HERO_BG = '/images/luxe-event.jpeg';

export default function Hero() {
  const rsvp = contentDays[0]?.rsvp || 'https://luxeshots.as.me/';
  return (
    <section className="hero">
      <div className="hero__bg" data-parallax="0.16" aria-hidden>
        <img src={HERO_BG} alt="" />
      </div>

      <div className="hero__inner">
        <span className="hero__eyebrow">
          <span className="rule" /><span className="eyebrow">Free Luxe Content Day · By Invitation</span><span className="rule" />
        </span>

        <h1 className="display display--xl" data-split>
          A viral video reel &amp; a <span className="accent">scroll-stopping</span> headshot — absolutely <span className="free">free</span>
        </h1>

        <p className="hero__sub lede" data-reveal="fade" data-delay="120">
          Top realtors pay <b>$1,500+</b> for this. You get it free — shot inside a multimillion-dollar listing.
        </p>

        <div className="hero__media" data-reveal="fade" data-delay="220">
          <HlsVideo src={HERO_REEL} poster={posterFor(HERO_REEL)} rounded className="media media--16x9" />
        </div>

        <div className="hero__cta" data-reveal="fade" data-delay="320">
          <Magnetic strength={0.4}>
            <a className="btn is-link" href={rsvp} target="_blank" rel="noopener noreferrer">Reserve Your Spot <span className="arr">→</span></a>
          </Magnetic>
          <a className="btn-ghost is-link" href="#collection">See the Dates</a>
        </div>
      </div>

      <div className="hero__cue" data-reveal="fade" data-delay="520">
        <span className="eyebrow" style={{ color: 'var(--muted)' }}>Scroll</span><span className="bar" />
      </div>
    </section>
  );
}
