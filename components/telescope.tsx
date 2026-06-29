'use client';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { contentDays } from '@/lib/data';

/**
 * TELESCOPE ZOOM (adaptado del demo "Telescope Zoom on Scroll").
 * Reemplaza la marquesina. Hace zoom telescópico sobre la foto de luxe-event
 * mientras miniaturas de propiedades vuelan hacia la cámara y el titular se abre.
 * ScrollTrigger puro (sin ScrollSmoother) para convivir con Lenis.
 */
const CENTER_IMG = '/images/luxe-event.jpeg';
const FRONT_SCALES = [1, 0.85, 0.6, 0.45, 0.3, 0.15];

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

    const fronts = gsap.utils.toArray<HTMLElement>('.tele-front', section);
    const smalls = gsap.utils.toArray<HTMLElement>('.tele-small img', section);
    const message = section.querySelector('.tele-message');

    const ctx = gsap.context(() => {
      fronts.forEach((el, i) => gsap.set(el, { scale: FRONT_SCALES[i] ?? 0.15, filter: 'blur(2px)' }));
      gsap.set(smalls, { transformStyle: 'preserve-3d', backfaceVisibility: 'hidden', force3D: true });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section, start: 'top top', end: () => '+=' + window.innerHeight * 3,
          scrub: true, pin: true, anticipatePin: 1, invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = gsap.parseEase('power1.inOut')(self.progress);
            section.style.setProperty('--progress', String(p));
          },
        },
      });
      tl.to(smalls, { z: '100vh', duration: 1, ease: 'power1.inOut', stagger: { amount: 0.2, from: 'center' } }, 0);
      tl.to(fronts, { scale: 1, duration: 1, ease: 'power1.inOut' }, 0.6);
      tl.to(fronts, { filter: 'blur(0px)', duration: 1, ease: 'power1.inOut', stagger: { amount: 0.2, from: 'end' } }, 0.6);
      tl.to(message, { opacity: 1, duration: 0.4 }, 0.85);
    }, section);

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh, { once: true });
    (document as any).fonts?.ready?.then(refresh);
    return () => { ctx.revert(); window.removeEventListener('load', refresh); };
  }, [reduce]);

  if (reduce) {
    return (
      <section className="relative h-[70svh] overflow-hidden bg-ink grid place-items-center">
        <img src={CENTER_IMG} alt="" className="absolute inset-0 h-full w-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-ink/50" />
        <div className="relative z-10 text-center px-6">
          <h2 className="font-serif italic text-paper" style={{ fontSize: 'clamp(2.4rem,8vw,5rem)' }}>El <span className="text-gold-bright">Lujo</span></h2>
          <p className="mt-4 text-paper-muted max-w-xl mx-auto">Cada toma, grabada donde el lujo realmente vive.</p>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} className="telescope">
      <div className="tele-words">
        <h1><span className="left">El</span><span className="right">Lujo</span></h1>
      </div>

      <div className="tele-media">
        <div className="tele-layer"><img src={CENTER_IMG} alt="" /></div>
        {FRONT_SCALES.map((_, i) => (
          <div key={i} className="tele-layer tele-front"><img src={CENTER_IMG} alt="" /></div>
        ))}
      </div>

      <div className="tele-small">
        {small.map((src, i) => (<img key={i} src={src} alt="" loading="lazy" />))}
      </div>

      <div className="tele-message">
        <p className="font-serif text-paper" style={{ fontSize: 'clamp(1.4rem,3vw,2.4rem)', lineHeight: 1.15 }}>
          Cada toma, grabada donde <span className="italic text-gold-bright">el lujo realmente vive.</span>
        </p>
      </div>
    </section>
  );
}
