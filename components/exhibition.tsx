'use client';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { contentDays, type ContentDay } from '@/lib/data';

type Card = ContentDay & { _d: number };

function parseDate(d: string): number | null {
  const m = d.match(/(\d{2})\/(\d{2})\/(\d{2})/);
  if (!m) return null;
  return new Date(2000 + +m[3], +m[1] - 1, +m[2], 9, 0, 0).getTime();
}

function CD({ t, now }: { t: number; now: number }) {
  let s = Math.max(0, Math.floor((t - now) / 1000));
  const d = Math.floor(s / 86400); s -= d * 86400;
  const h = Math.floor(s / 3600); s -= h * 3600;
  const m = Math.floor(s / 60); s -= m * 60;
  const u = (n: number) => String(n).padStart(2, '0');
  return (
    <div className="cd">
      <span><b>{u(d)}</b><em>days</em></span><s>:</s>
      <span><b>{u(h)}</b><em>hrs</em></span><s>:</s>
      <span><b>{u(m)}</b><em>min</em></span><s>:</s>
      <span><b>{u(s)}</b><em>sec</em></span>
    </div>
  );
}

export default function Exhibition() {
  const section = useRef<HTMLDivElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const t = Date.now();
    const arr = contentDays.map((c) => ({ ...c, _d: parseDate(c.date) }))
      .filter((c): c is Card => c._d !== null);
    const up = arr.filter((c) => c._d >= t - 864e5).sort((a, b) => a._d - b._d);
    setCards((up.length >= 4 ? up : [...arr].sort((a, b) => a._d - b._d)).slice(0, 16));
  }, []);

  useEffect(() => { const id = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(id); }, []);

  useEffect(() => {
    if (!cards.length) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const el = track.current!;
      const len = () => el.scrollWidth - window.innerWidth;
      const skew = gsap.quickTo(el, 'skewX', { duration: 0.5, ease: 'power3' });
      gsap.to(el, {
        x: () => -len(), ease: 'none',
        scrollTrigger: {
          trigger: pin.current, start: 'top top', end: () => '+=' + len(), scrub: 1,
          pin: pin.current, anticipatePin: 1, invalidateOnRefresh: true,
          onUpdate: (s) => skew(gsap.utils.clamp(-6, 6, (s.getVelocity() || 0) / -420)),
        },
      });
    }, section);
    const r = requestAnimationFrame(() => ScrollTrigger.refresh());
    const t = setTimeout(() => ScrollTrigger.refresh(), 700);
    return () => { cancelAnimationFrame(r); clearTimeout(t); ctx.revert(); };
  }, [cards.length]);

  return (
    <section className="exhibition" id="collection" ref={section}>
      <div className="exhibition__head wrap">
        <span className="eyebrow"><span className="rule" /> 01 — The Collection <span className="rule" /></span>
        <h2 className="display display--lg" data-split style={{ marginTop: '1.2rem' }}>Reserve Your <span className="accent">Date</span></h2>
        <p className="lede" data-reveal="fade" data-delay="120" style={{ maxWidth: '42rem', margin: '1.4rem auto 0' }}>
          Pick a date and book your Luxe Content Day — a scroll-stopping reel, a premium headshot and next-level brand
          content, all inside a multimillion-dollar listing.
        </p>
      </div>

      <div className="exh-pin" ref={pin}>
        <div className="exh-track" ref={track}>
          {cards.map((c, i) => (
            <article className="card" key={i}>
              <div className="card__img" style={{ backgroundImage: `url(${c.image})` }} />
              <div className="card__veil" />
              <div className="card__frame" />
              <div className="card__top">
                <span className="card__idx">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  {c.commercial && <><span className="card__tag">Commercial</span><br /></>}
                  <span className="card__date">{c.date}</span>
                </div>
              </div>
              <div className="card__bot">
                <div className="card__price">{c.price}</div>
                <div className="card__city">{c.city}</div>
                <div className="card__addr">{c.address}</div>
                <CD t={c._d} now={now} />
                <a className="card__cta is-link" href={c.rsvp || '#'} target="_blank" rel="noopener noreferrer">
                  <span>Reserve this date</span><span className="cta-arr" style={{ color: 'var(--gold)' }}>→</span>
                </a>
              </div>
            </article>
          ))}
          <article className="card card--more">
            <div>
              <span className="card__idx">✦</span>
              <p>More dates every week.</p>
              <p className="card__addr" style={{ WebkitLineClamp: 3 }}>New multimillion-dollar listings added across South Florida.</p>
              <a className="is-link" href="https://luxeshots.as.me/" target="_blank" rel="noopener noreferrer"
                style={{ display: 'inline-block', marginTop: '1.2rem', color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '.16em', fontSize: '.66rem', fontWeight: 600, borderBottom: '1px solid var(--gold)', paddingBottom: '.3rem' }}>
                See all dates →
              </a>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
