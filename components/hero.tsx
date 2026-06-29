'use client';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { contentDays } from '@/lib/data';

/**
 * HERO — cinematic gold/black entrance.
 * image-in-text on "FREE" (mansions revealed inside the word) + staggered GSAP
 * entrance + slow Ken Burns ambience + 3D cursor tilt on the headline (home-hero).
 */
export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const heroImg = contentDays[3]?.image || contentDays[0]?.image || '/images/og.jpeg';

  // entrance
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const seen = sessionStorage.getItem('luxePreloaderSeen') === 'true';
    const startDelay = seen ? 0.1 : 1.6;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' }, delay: startDelay });
      tl.from('[data-h-top]', { y: -18, opacity: 0, duration: 0.8 })
        .from('[data-h-eyebrow]', { y: 22, opacity: 0, duration: 0.7 }, '-=0.3')
        .from('[data-h-line]', { yPercent: 115, duration: 1.05, stagger: 0.12 }, '-=0.2')
        .from('[data-h-sub]', { y: 18, opacity: 0, duration: 0.7 }, '-=0.55')
        .from('[data-h-video]', { y: 42, opacity: 0, scale: 0.965, duration: 1.05 }, '-=0.5')
        .from('[data-h-cta]', { y: 18, opacity: 0, duration: 0.7, stagger: 0.1 }, '-=0.55')
        .from('[data-h-urgency]', { opacity: 0, duration: 0.6 }, '-=0.3');
    }, root);
    return () => ctx.revert();
  }, []);

  // 3D cursor tilt on the headline block
  useEffect(() => {
    if (window.matchMedia('(pointer: fine)').matches === false) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const container = root.current, target = headRef.current;
    if (!container || !target) return;
    let cx = 0, cy = 0, txr = 0, tyr = 0, raf = 0, inside = false;
    const LERP = 0.06, MAX = 10;
    const render = () => {
      cx += (txr - cx) * LERP; cy += (tyr - cy) * LERP;
      gsap.set(target, { rotateX: cy, rotateY: cx, transformPerspective: 1200, transformOrigin: 'center', force3D: true });
      const settled = Math.abs(cx - txr) < 0.01 && Math.abs(cy - tyr) < 0.01;
      if (settled && !inside) { raf = 0; return; }
      raf = requestAnimationFrame(render);
    };
    const loop = () => { if (!raf) raf = requestAnimationFrame(render); };
    const move = (e: MouseEvent) => {
      const r = container.getBoundingClientRect();
      txr = ((e.clientX - r.left) / r.width - 0.5) * MAX;
      tyr = -((e.clientY - r.top) / r.height - 0.5) * MAX;
      inside = true; loop();
    };
    const leave = () => { txr = 0; tyr = 0; inside = false; loop(); };
    container.addEventListener('mousemove', move);
    container.addEventListener('mouseleave', leave);
    return () => {
      cancelAnimationFrame(raf);
      container.removeEventListener('mousemove', move);
      container.removeEventListener('mouseleave', leave);
    };
  }, []);

  const clipText: React.CSSProperties = {
    backgroundImage: `url(${heroImg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center 35%',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    color: 'transparent',
  };

  return (
    <section ref={root} className="relative min-h-[100svh] bg-ink text-paper overflow-hidden">
      <div className="absolute inset-0 z-0" aria-hidden>
        <img src={heroImg} alt="" className="kenburns h-full w-full object-cover opacity-[0.16]" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/75 via-ink/88 to-ink" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_35%,transparent_30%,rgba(11,11,12,0.65)_100%)]" />
      </div>

      <header data-h-top className="relative z-10 flex items-center justify-between px-5 md:px-10 py-5">
        <img src="/images/logo.png" alt="LuxeShots" className="h-7 md:h-9 w-auto" />
        <a href="https://instagram.com/luxeshotsbyus" target="_blank" rel="noopener noreferrer"
          className="text-paper-muted hover:text-gold transition-colors text-xs uppercase tracking-[0.24em]">
          Instagram
        </a>
      </header>

      <div ref={headRef} className="relative z-10 mx-auto max-w-6xl px-5 md:px-8 pt-1 md:pt-3 pb-12 flex flex-col items-center text-center" style={{ transformStyle: 'preserve-3d' }}>
        <span data-h-eyebrow className="inline-block bg-gold text-ink font-sans font-semibold tracking-[0.1em] uppercase text-[0.7rem] md:text-sm px-6 py-2.5">
          Schedule Your FREE Luxe Content Day Session
        </span>

        <h1 className="mt-5 font-sans font-extrabold leading-[0.98] tracking-[-0.02em]" style={{ fontSize: 'clamp(2rem,5vw,4.4rem)' }}>
          <span className="block overflow-hidden"><span data-h-line className="block">Get a Viral Video Reel</span></span>
          <span className="block overflow-hidden"><span data-h-line className="block">+ Scroll-Stopping Headshot</span></span>
          <span className="block overflow-hidden">
            <span data-h-line className="block">Absolutely <span style={clipText}>FREE</span></span>
          </span>
        </h1>

        <p data-h-sub className="mt-4 max-w-2xl text-paper-muted text-base md:text-lg">
          Top Realtors pay <span className="text-gold font-semibold">$1,500+</span> for this — you get it{' '}
          <span className="text-gold font-semibold">FREE</span>, inside a multimillion-dollar listing.
        </p>

        <div data-h-video className="mt-6 relative w-full max-w-xl aspect-video overflow-hidden ring-1 ring-line shadow-[0_50px_130px_-50px_rgba(0,0,0,0.85)]">
          <img src="/images/og.jpeg" alt="Luxe Content Day session preview" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-ink/25" />
          <button className="group absolute inset-0 grid place-items-center" aria-label="Play intro video">
            <span className="grid place-items-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-gold/95 text-ink text-2xl pl-1 shadow-[0_10px_40px_rgba(0,0,0,0.5)] transition-transform duration-300 group-hover:scale-110">▶</span>
          </button>
        </div>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
          <a data-h-cta href={contentDays[0]?.rsvp || '#'} target="_blank" rel="noopener noreferrer"
            className="bg-gold text-ink font-sans font-bold uppercase tracking-[0.1em] text-sm px-8 py-4 transition-colors duration-300 hover:bg-gold-bright">
            RSVP — Reserve Your Spot
          </a>
          <a data-h-cta href="#exhibition"
            className="border border-line text-paper font-sans font-semibold uppercase tracking-[0.1em] text-sm px-8 py-4 transition-colors duration-300 hover:border-gold hover:text-gold">
            Learn More
          </a>
        </div>

        <p data-h-urgency className="mt-5 text-paper-muted text-[0.7rem] uppercase tracking-[0.32em]">
          RSVP Below — Spots Are Limited
        </p>
      </div>
    </section>
  );
}
