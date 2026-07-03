'use client';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Magnetic from './magnetic';

const RSVP = 'https://luxeshots.as.me/';
const Arrow = () => (<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M4 12h15M13.5 5.5 20 12l-6.5 6.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>);

export default function FooterCta() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // GSAP footer title scale-in
    gsap.registerPlugin(ScrollTrigger);
    let ctx: gsap.Context | null = null;
    if (titleRef.current) {
      ctx = gsap.context(() => {
        gsap.fromTo(titleRef.current, { yPercent: 26, scale: 0.94 }, {
          yPercent: 0, scale: 1, ease: 'none',
          scrollTrigger: { trigger: '.footer', start: 'top 95%', end: 'top 38%', scrub: 1 },
        });
      });
    }

    // fluid particle drift
    const canvas = canvasRef.current;
    let raf = 0; let cleanup = () => {};
    if (canvas) {
      const parent = canvas.parentElement!;
      const c = canvas.getContext('2d')!;
      const DPR = Math.min(window.devicePixelRatio || 1, 2);
      let W = 1, H = 1;
      let pts: { x: number; y: number; ox: number; oy: number; vx: number; vy: number }[] = [];
      let mx = -1, my = -1, pmx = -1, pmy = -1;
      const seed = () => {
        pts = []; const cx = Math.floor(W / 26), cy = Math.floor(H / 26);
        for (let i = 0; i <= cx; i++) for (let j = 0; j <= cy; j++) { const x = (i / cx) * W, y = (j / cy) * H; pts.push({ x, y, ox: x, oy: y, vx: 0, vy: 0 }); }
      };
      const size = () => {
        W = parent.clientWidth; H = parent.clientHeight;
        canvas.width = W * DPR; canvas.height = H * DPR;
        canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
        c.setTransform(DPR, 0, 0, DPR, 0, 0); seed();
      };
      const onMove = (e: MouseEvent) => { const r = parent.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top; };
      size();
      parent.addEventListener('mousemove', onMove);
      const loop = () => {
        c.clearRect(0, 0, W, H); c.fillStyle = 'rgba(185,160,106,.5)';
        const ddx = pmx < 0 ? 0 : mx - pmx, ddy = pmy < 0 ? 0 : my - pmy; pmx = mx; pmy = my;
        for (const p of pts) {
          const dx = p.x - mx, dy = p.y - my, d2 = dx * dx + dy * dy;
          if (mx >= 0 && d2 < 18000) { const f = 1 - d2 / 18000; p.vx += (dx / Math.sqrt(d2 + 1) * 2 + ddx * 0.4) * f; p.vy += (dy / Math.sqrt(d2 + 1) * 2 + ddy * 0.4) * f; }
          p.vx *= 0.92; p.vy *= 0.92; p.x += p.vx; p.y += p.vy; p.x += (p.ox - p.x) * 0.02; p.y += (p.oy - p.y) * 0.02;
          c.fillRect(p.x, p.y, 1.6, 1.6);
        }
        raf = requestAnimationFrame(loop);
      };
      loop();
      window.addEventListener('resize', size);
      cleanup = () => { parent.removeEventListener('mousemove', onMove); window.removeEventListener('resize', size); };
    }

    return () => { cancelAnimationFrame(raf); cleanup(); ctx?.revert(); };
  }, []);

  return (
    <footer className="footer">
      <canvas className="footer__canvas" ref={canvasRef} aria-hidden />
      <div className="footer__in wrap--narrow">
        <span className="eyebrow" data-reveal="fade">Spots Are Limited</span>
        <h2 className="display display--xl" ref={titleRef} data-split style={{ marginTop: '1.4rem' }}>Make It <span className="accent">Unforgettable.</span></h2>
        <p className="lede" data-reveal="fade" data-delay="120" style={{ maxWidth: '34rem', margin: '1.6rem auto 0' }}>
          Book your free Luxe Content Day inside a multimillion-dollar listing — and walk away with a viral
          reel and a scroll-stopping headshot.
        </p>
        <div data-reveal="fade" data-delay="200" style={{ marginTop: '2.6rem' }}>
          <Magnetic strength={0.4}>
            <a className="btn is-link" href={RSVP} target="_blank" rel="noopener noreferrer">Reserve Your Spot — Free <span className="arr"><Arrow /></span></a>
          </Magnetic>
        </div>
        <div className="footer__meta">
          <div className="b">Luxe<b>Shots</b></div>
          <p>+1 561-570-1414 · 12000 Forest Hill Boulevard, Wellington, FL 33414</p>
          <a href="https://instagram.com/luxeshotsbyus" target="_blank" rel="noopener noreferrer" className="is-link">Instagram</a>
          <p className="cc">© 2026 LuxeShots — LUXE Content Days · South Florida</p>
        </div>
      </div>
    </footer>
  );
}
