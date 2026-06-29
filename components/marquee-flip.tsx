'use client';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { contentDays } from '@/lib/data';

/**
 * MARQUEE → FLIP bridge (adapted from the Flip-marquee + horizontal-scroll demo).
 * A rotated marquee of real mansions scrubs; one mansion grows to fullscreen while
 * the background crossfades light→ink; then a serif line masks in. Hands off to the
 * Exhibition gallery. Scrub-driven (no Flip-state), so it survives resize/refresh.
 */
export default function MarqueeFlip() {
  const root = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const featRef = useRef<HTMLDivElement>(null);
  const marqRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);

  const imgs = contentDays.slice(0, 12).map((c) => c.image);
  const feature = contentDays[3]?.image || imgs[0];

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.registerPlugin(ScrollTrigger);
    const stage = root.current!, track = trackRef.current!, feat = featRef.current!;
    const marq = marqRef.current!, quote = quoteRef.current!;
    const lerp = gsap.utils.interpolate;

    gsap.set(feat, { opacity: 0 });
    gsap.set(quote, { opacity: 0 });

    const st = ScrollTrigger.create({
      trigger: stage,
      start: 'top top',
      end: () => `+=${window.innerHeight * 4}`,
      pin: true,
      scrub: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const p = self.progress;

        // Phase A — marquee scrub
        const mx = lerp(-10, 6, Math.min(p / 0.5, 1));
        gsap.set(track, { xPercent: mx });

        // background light -> ink (0.32..0.5)
        const bgT = gsap.utils.clamp(0, 1, (p - 0.32) / 0.18);
        gsap.set(stage, { backgroundColor: gsap.utils.interpolate('#F4F1EA', '#0B0B0C', bgT) });
        gsap.set(marq, { opacity: 1 - gsap.utils.clamp(0, 1, (p - 0.4) / 0.2) });

        // Phase B — feature image grows to fullscreen (0.35..0.72)
        const g = gsap.utils.clamp(0, 1, (p - 0.35) / 0.37);
        const e = g * g * (3 - 2 * g); // smoothstep
        gsap.set(feat, {
          opacity: g > 0 ? 1 : 0,
          left: lerp(37, 0, e) + '%',
          top: lerp(27, 0, e) + '%',
          width: lerp(26, 100, e) + '%',
          height: lerp(46, 100, e) + '%',
          rotate: lerp(-5, 0, e),
          borderRadius: lerp(4, 0, e) + 'px',
        });

        // Phase C — quote masks in (0.72..1)
        const q = gsap.utils.clamp(0, 1, (p - 0.72) / 0.28);
        gsap.set(quote, { opacity: q, y: lerp(40, 0, q) });
      },
    });

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh, { once: true });
    (document as any).fonts?.ready?.then(refresh);

    return () => { st.kill(); window.removeEventListener('load', refresh); };
  }, []);

  return (
    <section ref={root} className="lux-flip-stage" style={{ backgroundColor: '#F4F1EA' }}>
      {/* rotated marquee */}
      <div ref={marqRef} className="lux-marquee" style={{ position: 'absolute', inset: 0, height: '100%' }}>
        <div className="lux-marquee-wrap">
          <div ref={trackRef} className="lux-marquee-track">
            {imgs.map((src, i) => (
              <div className="lux-marquee-img" key={i}><img src={src} alt="" loading="lazy" /></div>
            ))}
          </div>
        </div>
      </div>

      {/* feature image that grows to fullscreen */}
      <div ref={featRef} aria-hidden style={{ position: 'absolute', overflow: 'hidden', zIndex: 2 }}>
        <img src={feature} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(11,11,12,.72), rgba(11,11,12,.15))' }} />
      </div>

      {/* quote */}
      <div ref={quoteRef} className="lux-flip-quote" style={{ zIndex: 3 }}>
        <span className="text-gold uppercase tracking-[0.34em] text-xs font-semibold mb-5">Inside the Listings</span>
        <h2 className="font-serif text-paper" style={{ fontSize: 'clamp(2rem,5.5vw,4.6rem)', lineHeight: 1.04, maxWidth: '14ch' }}>
          Every frame shot where <span className="italic text-gold-bright">luxury actually lives.</span>
        </h2>
      </div>
    </section>
  );
}
