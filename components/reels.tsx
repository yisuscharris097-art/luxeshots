'use client';
import { useEffect, useRef, useState } from 'react';
import { teamReels } from '@/lib/data';
import Mask from './mask';
import Reveal from './reveal';

const SLIDE_W = 230, SLIDE_H = 320, GAP = 150, ARC = 150, LIFT = 110, LERP = 0.06;

export default function Reels() {
  const [reduce, setReduce] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLParagraphElement>(null);
  const slideRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    setReduce(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  useEffect(() => {
    if (reduce) return;
    const wrap = wrapRef.current;
    if (!wrap) return;
    const slides = slideRefs.current.filter(Boolean);
    const N = slides.length;
    const track = N * GAP;

    let W = wrap.clientWidth, H = wrap.clientHeight;
    let cxw = W / 2, baseY = H * 0.42;
    let target = 0, current = 0, active = -1, raf = 0;

    const transform = (i: number, scroll: number) => {
      let off = (((i * GAP - scroll) % track) + track) % track;
      if (off > track / 2) off -= track;
      const sc = cxw + off;
      const nd = (sc - cxw) / (W * 0.5);
      const ad = Math.min(Math.abs(nd), 1.3);
      const scale = Math.max(1 - ad * 0.8, 0.25);
      const w = SLIDE_W * scale, h = SLIDE_H * scale;
      const cl = Math.min(ad, 1);
      const drop = (1 - Math.cos(cl * Math.PI)) * 0.5 * ARC;
      const lift = Math.max(1 - ad * 2, 0) * LIFT;
      return { x: sc - w / 2, y: baseY - h / 2 + drop - lift, w, h, z: Math.round((1 - ad) * 100), dist: Math.abs(off) };
    };

    const layout = (scroll: number) => {
      let best = 0, bestD = Infinity;
      slides.forEach((el, i) => {
        const t = transform(i, scroll);
        el.style.transform = `translate(${t.x}px, ${t.y}px)`;
        el.style.width = `${t.w}px`;
        el.style.height = `${t.h}px`;
        el.style.zIndex = String(t.z);
        if (t.dist < bestD) { bestD = t.dist; best = i; }
      });
      if (best !== active) {
        active = best;
        if (titleRef.current) titleRef.current.textContent = teamReels[best]?.name || '';
      }
    };
    layout(0);

    const loop = () => {
      current += (target - current) * LERP;
      layout(current);
      raf = requestAnimationFrame(loop);
    };
    loop();

    const wheel = (e: WheelEvent) => { e.preventDefault(); target += e.deltaY * 0.5; };
    let tsx = 0;
    const tstart = (e: TouchEvent) => { tsx = e.touches[0].clientX; };
    const tmove = (e: TouchEvent) => { e.preventDefault(); const x = e.touches[0].clientX; target += (tsx - x) * 1.2; tsx = x; };
    const resize = () => { W = wrap.clientWidth; H = wrap.clientHeight; cxw = W / 2; baseY = H * 0.42; };

    wrap.addEventListener('wheel', wheel, { passive: false });
    wrap.addEventListener('touchstart', tstart, { passive: true });
    wrap.addEventListener('touchmove', tmove, { passive: false });
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(raf);
      wrap.removeEventListener('wheel', wheel);
      wrap.removeEventListener('touchstart', tstart);
      wrap.removeEventListener('touchmove', tmove);
      window.removeEventListener('resize', resize);
    };
  }, [reduce]);

  return (
    <section className="bg-ink text-paper pt-20 md:pt-28">
      <div className="max-w-6xl mx-auto px-5 md:px-8 text-center">
        <span className="text-gold uppercase tracking-[0.3em] text-xs font-semibold">If a picture says 1,000 words…</span>
        <Mask as="h2" split="lines" className="mt-4 font-serif leading-[1.04]" style={{ fontSize: 'clamp(1.9rem,4.6vw,3.6rem)' }}>
          What is your content saying <span className="italic text-gold-bright">about you?</span>
        </Mask>
        <p className="text-paper-muted mt-5 max-w-2xl mx-auto text-base md:text-lg">
          You only get one chance to make a first impression — let us make it unforgettable.
        </p>
      </div>

      {reduce ? (
        <div className="max-w-6xl mx-auto px-5 md:px-8 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-12 pb-24">
          {teamReels.map((t, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <figure className="group relative aspect-[9/16] overflow-hidden rounded-sm bg-ink ring-1 ring-line">
                <img src={t.image} alt={t.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/25 to-transparent" />
                <figcaption className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="font-sans font-semibold text-paper">{t.name}</p>
                  <p className="text-paper-muted text-[0.65rem] uppercase tracking-[0.16em] mt-0.5">Content Day Reel · {t.vimeoLen}</p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      ) : (
        <div ref={wrapRef} className="lux-arc mt-6">
          {teamReels.map((t, i) => (
            <div key={i} ref={(el) => { if (el) slideRefs.current[i] = el; }} className="lux-arc-slide">
              <img src={t.image} alt={t.name} loading="lazy" />
            </div>
          ))}
          <span className="lux-arc-play" aria-hidden>▶</span>
          <p ref={titleRef} className="lux-arc-title">{teamReels[0]?.name}</p>
        </div>
      )}
    </section>
  );
}
