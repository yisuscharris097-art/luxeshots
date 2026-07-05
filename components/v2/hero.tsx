import { contentDays } from '@/lib/data';
import ColorVideo from './mono-video';

const HERO_REEL = 'https://vz-5c81264f-e6c.b-cdn.net/1e7a339f-240e-454a-aeb7-a1690e293540/playlist.m3u8';

export default function Hero() {
  const rsvp = contentDays[0]?.rsvp || 'https://luxeshots.as.me/';
  return (
    <section className="e2-hero">
      <div className="e2-wrap e2-hero__grid">
        <div>
          <div className="e2-hero__ed" data-slide>
            <span className="n">N°02</span>
            <span className="e2-kick">The Content Days Edition · South Florida</span>
          </div>
          <h1 className="e2-disp" data-slide data-delay="90">
            A viral reel &amp; a <em>scroll-stopping</em> headshot — <span className="e2-gold">FREE</span>.
          </h1>
          <p className="e2-hero__sub" data-fade data-delay="240">
            Book a free Luxe Content Day inside a multimillion-dollar listing — a viral video reel and a
            premium headshot. Top realtors pay <b>$1,500+</b> for this.
          </p>
          <div className="e2-hero__cta" data-fade data-delay="320">
            <a className="e2-btn" href={rsvp} target="_blank" rel="noopener noreferrer">Reserve a date <span className="a">→</span></a>
            <a className="e2-ghost" href="#work">See the work</a>
          </div>
        </div>
        <figure className="e2-hero__media" data-fade data-delay="200">
          <span className="e2-hero__tag">Showreel · tap for sound</span>
          <ColorVideo src={HERO_REEL} className="fill" />
        </figure>
      </div>
    </section>
  );
}
