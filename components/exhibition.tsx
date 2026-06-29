'use client';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { contentDays, type ContentDay } from '@/lib/data';
import Mask from './mask';

type Card = ContentDay & { _d: number };

function parseDate(d: string): number | null {
  const m = d.match(/(\d{2})\/(\d{2})\/(\d{2})/);
  if (!m) return null;
  return new Date(2000 + +m[3], +m[1] - 1, +m[2], 9, 0, 0).getTime();
}

function CountUnit({ n, l }: { n: number; l: string }) {
  return (
    <div className="text-center">
      <div className="font-sans font-bold text-paper text-lg md:text-xl tabular-nums leading-none">{String(n).padStart(2, '0')}</div>
      <div className="text-[0.55rem] uppercase tracking-[0.18em] text-paper-muted mt-1">{l}</div>
    </div>
  );
}

export default function Exhibition() {
  const section = useRef<HTMLDivElement>(null);
  const pinWrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const t = Date.now();
    const arr = contentDays
      .map((c) => ({ ...c, _d: parseDate(c.date) }))
      .filter((c): c is Card => c._d !== null);
    const upcoming = arr.filter((c) => c._d >= t - 864e5).sort((a, b) => a._d - b._d);
    setCards((upcoming.length >= 4 ? upcoming : [...arr].sort((a, b) => a._d - b._d)).slice(0, 16));
  }, []);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!cards.length) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const el = track.current!;
      const getLen = () => el.scrollWidth - window.innerWidth;
      gsap.to(el, {
        x: () => -getLen(),
        ease: 'none',
        scrollTrigger: {
          trigger: pinWrap.current,
          start: 'top top',
          end: () => '+=' + getLen(),
          scrub: 1,
          pin: pinWrap.current,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
    }, section);
    const r = requestAnimationFrame(() => ScrollTrigger.refresh());
    const t = setTimeout(() => ScrollTrigger.refresh(), 700);
    return () => { cancelAnimationFrame(r); clearTimeout(t); ctx.revert(); };
  }, [cards.length]);

  return (
    <section id="exhibition" ref={section} className="relative bg-ink overflow-hidden">
      <div className="mx-auto max-w-6xl px-5 md:px-8 pt-24 md:pt-32 pb-10 md:pb-14 text-center">
        <span className="inline-flex items-center gap-3 text-gold uppercase tracking-[0.3em] text-xs font-semibold">
          <span className="w-8 h-px bg-gold" /> The Collection <span className="w-8 h-px bg-gold" />
        </span>
        <Mask as="h2" split="lines" className="mt-5 font-serif text-paper leading-[1.02]" style={{ fontSize: 'clamp(2.2rem,5.5vw,4.6rem)' }}>
          Step Into Luxury. <span className="italic text-gold-bright">Capture Content That Converts.</span>
        </Mask>
        <p className="mt-5 mx-auto max-w-2xl text-paper-muted text-base md:text-lg">
          Choose a date and book your Luxe Content Day — a scroll-stopping reel, a premium headshot, and
          next-level brand content, all inside a multimillion-dollar listing.
        </p>
      </div>

      <div ref={pinWrap} className="h-[100svh] flex items-center overflow-hidden">
        <div ref={track} className="flex gap-5 md:gap-7 px-[6vw] [perspective:1600px] will-change-transform">
          {cards.map((c, i) => {
            let s = Math.max(0, Math.floor((c._d - now) / 1000));
            const d = Math.floor(s / 86400); s -= d * 86400;
            const h = Math.floor(s / 3600); s -= h * 3600;
            const m = Math.floor(s / 60); s -= m * 60;
            return (
              <article key={i} className="group relative shrink-0 w-[80vw] sm:w-[58vw] md:w-[34vw] lg:w-[26vw] max-w-[440px] aspect-[3/4] overflow-hidden rounded-sm ring-1 ring-line">
                <img src={c.image} alt={`${c.city} content day`} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/10" />
                <div className="absolute inset-0 ring-1 ring-inset ring-white/5" />
                {c.commercial && (
                  <span className="absolute top-4 right-4 bg-gold text-ink text-[0.6rem] font-bold uppercase tracking-[0.16em] px-2.5 py-1">Commercial</span>
                )}
                <span className="absolute top-4 left-4 text-paper text-xs uppercase tracking-[0.18em] font-semibold">{c.date}</span>
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <p className="font-sans font-extrabold text-gold leading-none tracking-tight" style={{ fontSize: 'clamp(1.9rem,3.2vw,2.6rem)' }}>{c.price}</p>
                  <p className="font-serif text-paper text-xl mt-1">{c.city}</p>
                  <p className="text-paper-muted text-xs mt-1 leading-snug">{c.address}</p>
                  <div className="mt-4 flex items-center gap-3 border-t border-line pt-3">
                    <CountUnit n={d} l="days" /><span className="text-gold/40">:</span>
                    <CountUnit n={h} l="hrs" /><span className="text-gold/40">:</span>
                    <CountUnit n={m} l="min" /><span className="text-gold/40">:</span>
                    <CountUnit n={s} l="sec" />
                  </div>
                  <a href={c.rsvp || '#'} target="_blank" rel="noopener noreferrer" className="mt-4 flex items-center justify-center bg-gold text-ink font-sans font-bold uppercase tracking-[0.1em] text-xs py-3 transition-colors duration-300 hover:bg-gold-bright">
                    Click to RSVP
                  </a>
                </div>
              </article>
            );
          })}

          <article className="shrink-0 w-[70vw] sm:w-[40vw] md:w-[22vw] max-w-[320px] aspect-[3/4] grid place-items-center text-center px-6 border border-line rounded-sm">
            <div>
              <p className="font-serif text-paper text-2xl">More dates every week.</p>
              <p className="text-paper-muted text-sm mt-3">New multimillion-dollar listings added constantly across South Florida.</p>
              <a href="https://luxeshots.as.me/" target="_blank" rel="noopener noreferrer" className="mt-6 inline-block text-gold uppercase tracking-[0.18em] text-xs font-semibold border-b border-gold pb-1">See all dates →</a>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
