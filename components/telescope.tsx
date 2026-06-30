'use client';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { contentDays } from '@/lib/data';

const CENTER_IMG = '/images/luxe-event.jpeg';
const FRONT = [1, 0.85, 0.6, 0.45, 0.3, 0.15];

export default function Telescope() {
  const ref = useRef<HTMLElement>(null);
  const [reduce, setReduce] = useState(false);
  const small = contentDays.slice(0, 10).map((c) => c.image);

  useEffect(() => { setReduce(window.matchMedia('(prefers-reduced-motion: reduce)').matches); }, []);

  useEffect(() => {
    if (reduce) return;
    const section = ref.current;
    if (!section) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const fronts = gsap.utils.toArray<HTMLElement>('.tele-front', section);
      const smalls = gsap.utils.toArray<HTMLElement>('.tele-small i', section);
      const msg = section.querySelector('.tele-msg');
      fronts.forEach((el, i) => gsap.set(el, { scale: FRONT[i] ?? 0.15, filter: 'blur(2px)' }));
      gsap.set(smalls, { transformStyle: 'preserve-3d', force3D: true });
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section, start: 'top top', end: () => '+=' + window.innerHeight * 3,
          scrub: true, pin: true, anticipatePin: 1, invalidateOnRefresh: true,
          onUpdate: (s) => section.style.setProperty('--p', String(gsap.parseEase('power1.inOut')(s.progress))),
        },
      });
      tl.to(smalls, { z: '100vh', duration: 1, ease: 'power1.inOut', stagger: { amount: 0.2, from: 'center' } }, 0)
        .to(fronts, { scale: 1, duration: 1, ease: 'power1.inOut' }, 0.6)
        .to(fronts, { filter: 'blur(0px)', duration: 1, ease: 'power1.inOut', stagger: { amount: 0.2, from: 'end' } }, 0.6)
        .to(msg, { opacity: 1, duration: 0.4 }, 0.85);
    }, section);
    const r = requestAnimationFrame(() => ScrollTrigger.refresh());
    const t = setTimeout(() => ScrollTrigger.refresh(), 700);
    return () => { cancelAnimationFrame(r); clearTimeout(t); ctx.revert(); };
  }, [reduce]);

  if (reduce) {
    return (
      <section className="relative grid place-items-center" style={{ height: '70svh', background: 'var(--ink)', overflow: 'hidden' }}>
        <img src={CENTER_IMG} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.55 }} />
        <div className="center" style={{ position: 'relative', zIndex: 2, padding: '0 1.5rem' }}>
          <h2 className="display display--md">Step Into <span className="accent">Luxury</span></h2>
          <p className="lede" style={{ marginTop: '1rem' }}>Every frame, shot where luxury actually lives.</p>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} className="telescope" id="telescope">
      <div className="tele-words"><span className="l">Step Into</span><span className="r">Luxury</span></div>
      <div className="tele-media">
        <div className="tele-layer" style={{ backgroundImage: `url(${CENTER_IMG})` }} />
        {FRONT.map((_, i) => (
          <div key={i} className="tele-layer tele-front" style={{ backgroundImage: `url(${CENTER_IMG})` }} />
        ))}
      </div>
      <div className="tele-small">
        {small.map((src, i) => (<i key={i} style={{ backgroundImage: `url(${src})` }} />))}
      </div>
      <div className="tele-msg">
        <p className="display display--md">Every frame, shot where <span className="accent">luxury actually lives.</span></p>
      </div>
    </section>
  );
}
