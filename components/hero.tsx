'use client';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { contentDays } from '@/lib/data';
import HlsVideo from './hls-video';
import { posterFor } from '@/lib/hls';
import Magnetic from './magnetic';

const HERO_REEL = 'https://vz-5c81264f-e6c.b-cdn.net/1e7a339f-240e-454a-aeb7-a1690e293540/playlist.m3u8';
const HERO_BG = '/images/luxe-event.jpeg';

export default function Hero() {
  const rsvp = contentDays[0]?.rsvp || 'https://luxeshots.as.me/';
  const frameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const frame = frameRef.current;
    if (!frame) return;
    gsap.registerPlugin(ScrollTrigger);
    const inset = window.matchMedia('(max-width:680px)').matches ? 4 : 7;
    const ctx = gsap.context(() => {
      gsap.fromTo(frame,
        { clipPath: `inset(0% ${inset}% round 6px)` },
        { clipPath: 'inset(0% 0% round 0px)', ease: 'none',
          scrollTrigger: { trigger: frame, start: 'top 92%', end: 'top 22%', scrub: 1, invalidateOnRefresh: true } });
      gsap.fromTo(frame, { scale: 1.08 }, { scale: 1, ease: 'none',
        scrollTrigger: { trigger: frame, start: 'top 92%', end: 'top 22%', scrub: 1 } });
    }, frame);
    const t = setTimeout(() => ScrollTrigger.refresh(), 700);
    return () => { clearTimeout(t); ctx.revert(); };
  }, []);

  return (
    <section className="hero">
      <div className="hero__bg" data-parallax="0.22" aria-hidden>
        <img src={HERO_BG} alt="" />
      </div>

      <div className="hero__inner">
        <span className="hero__eyebrow">
          <span className="rule" /><span className="eyebrow">Free Luxe Content Day · By Invitation</span><span className="rule" />
        </span>

        <h1 data-split>
          A viral video reel &amp; a <span className="accent">scroll-stopping</span> headshot — absolutely <span className="free">FREE</span>
        </h1>

        <p className="hero__sub lede" data-reveal="fade" data-delay="120">
          Top realtors pay <b>$1,500+</b> for this. You get it free — shot inside a multimillion-dollar listing.
        </p>

        <div className="hero__cta" data-reveal="fade" data-delay="240">
          <Magnetic strength={0.4}>
            <a className="btn is-link" href={rsvp} target="_blank" rel="noopener noreferrer">Reserve Your Spot <span className="arr">→</span></a>
          </Magnetic>
          <a className="btn-ghost is-link" href="#collection">See the Dates</a>
        </div>
      </div>

      <div className="hero__media" data-reveal="fade" data-delay="200">
        <div className="hero__frame" ref={frameRef}>
          <HlsVideo src={HERO_REEL} poster={posterFor(HERO_REEL)} className="media media--16x9" />
          <span className="media__tag">Showreel</span>
        </div>
      </div>

      <div className="hero__cue" data-reveal="fade" data-delay="420">
        <span className="eyebrow" style={{ color: 'var(--muted)' }}>Scroll</span><span className="bar" />
      </div>
    </section>
  );
}
