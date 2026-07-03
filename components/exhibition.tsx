'use client';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { contentDays } from '@/lib/data';

const RSVP = 'https://luxeshots.as.me/';
const Arrow = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M4 12h15M13.5 5.5 20 12l-6.5 6.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
const Diamond = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M12 2l10 10-10 10L2 12z" /></svg>
);

const parseTs = (date: string) => {
  const m = date.match(/(\d{1,2})\/(\d{1,2})\/(\d{2})/);
  if (!m) return 0;
  return new Date(2000 + +m[3], +m[1] - 1, +m[2], 9, 0, 0).getTime();
};
const shortDate = (date: string) => {
  const wd = (date.split(',')[0] || '').slice(0, 3);
  const m = date.match(/\d{1,2}\/\d{1,2}\/\d{2}/);
  return `${wd} ${m ? m[0] : ''}`.trim();
};

function CD({ t }: { t: number }) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => { setNow(Date.now()); const id = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(id); }, []);
  let s = now === null ? 0 : Math.max(0, Math.floor((t - now) / 1000));
  const d = Math.floor(s / 86400); s -= d * 86400;
  const h = Math.floor(s / 3600); s -= h * 3600;
  const m = Math.floor(s / 60); s -= m * 60;
  const p = (n: number) => String(n).padStart(2, '0');
  return (
    <div className="cd">
      <span><b>{p(d)}</b><em>days</em></span><s>:</s>
      <span><b>{p(h)}</b><em>hrs</em></span><s>:</s>
      <span><b>{p(m)}</b><em>min</em></span><s>:</s>
      <span><b>{p(s)}</b><em>sec</em></span>
    </div>
  );
}

export default function Exhibition() {
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const cards = [...contentDays]
    .map((c) => ({ ...c, t: parseTs(c.date) }))
    .filter((c) => c.t >= Date.now() - 864e5)
    .sort((a, b) => a.t - b.t);
  const list = (cards.length >= 4 ? cards
    : [...contentDays].map((c) => ({ ...c, t: parseTs(c.date) })).sort((a, b) => a.t - b.t)).slice(0, 16);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const pin = pinRef.current, trk = trackRef.current;
    if (!pin || !trk) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const len = () => trk.scrollWidth - window.innerWidth;
      const skew = gsap.quickTo(trk, 'skewX', { duration: 0.5, ease: 'power3' });
      const imgs = Array.from(trk.querySelectorAll<HTMLElement>('.card__img'));
      const drift = () => {
        const vw = window.innerWidth;
        imgs.forEach((img) => {
          const r = img.parentElement!.getBoundingClientRect();
          if (r.right < 0 || r.left > vw) return;
          const off = (r.left + r.width / 2 - vw / 2) / vw;
          img.style.setProperty('--px', (off * 10).toFixed(2) + '%');
        });
      };
      gsap.to(trk, {
        x: () => -len(), ease: 'none',
        scrollTrigger: {
          trigger: pin, start: 'top top', end: () => '+=' + len(),
          scrub: 1, pin: true, anticipatePin: 1, invalidateOnRefresh: true,
          onUpdate: (s) => { skew(gsap.utils.clamp(-6, 6, (s.getVelocity() || 0) / -420)); drift(); },
        },
      });
      drift();
    }, pin);
    const r = requestAnimationFrame(() => ScrollTrigger.refresh());
    const to = setTimeout(() => ScrollTrigger.refresh(), 700);
    return () => { cancelAnimationFrame(r); clearTimeout(to); ctx.revert(); };
  }, []);

  return (
    <section className="exhibition" id="collection">
      <div className="exhibition__head wrap">
        <span className="eyebrow"><span className="rule" /> 01 — The Collection <span className="rule" /></span>
        <h2 className="display display--lg" data-split style={{ marginTop: '1.2rem' }}>Reserve Your <span className="accent">Date</span></h2>
        <p className="lede" data-reveal="fade" data-delay="120" style={{ maxWidth: '42rem', margin: '1.4rem auto 0' }}>
          Pick a date and book your Luxe Content Day — a scroll-stopping reel, a premium headshot and
          next-level brand content, all inside a multimillion-dollar listing.
        </p>
      </div>
      <div className="exh-pin" ref={pinRef}>
        <div className="exh-track" ref={trackRef}>
          {list.map((c, i) => (
            <article className="card" key={i}>
              <div className="card__img" style={{ backgroundImage: `url(${c.image})` }} />
              <div className="card__veil" /><div className="card__frame" />
              <div className="card__top">
                <span className="card__idx">{String(i + 1).padStart(2, '0')}</span>
                <div>{c.commercial && (<><span className="card__tag">Commercial</span><br /></>)}<span className="card__date">{shortDate(c.date)}</span></div>
              </div>
              <div className="card__bot">
                <div className="card__price">{c.price}</div>
                <div className="card__city">{c.city}</div>
                <div className="card__addr">{c.address}</div>
                <CD t={c.t} />
                <a className="card__cta is-link" href={c.rsvp || RSVP} target="_blank" rel="noopener noreferrer">
                  <span>Reserve this date</span><span className="cta-arr"><Arrow /></span>
                </a>
              </div>
            </article>
          ))}
          <article className="card card--more">
            <div>
              <span className="card__idx" style={{ fontStyle: 'normal' }}><Diamond /></span>
              <p>More dates every week.</p>
              <p className="card__addr" style={{ WebkitLineClamp: 3 }}>New multimillion-dollar listings added across South Florida.</p>
              <a className="more-link is-link" href={RSVP} target="_blank" rel="noopener noreferrer">See all dates <Arrow /></a>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
