'use client';
import { useEffect, useRef } from 'react';
import { brandData } from '@/lib/data';
import Reveal from './reveal';
import Mask from './mask';
import { FooterFluidField } from '@/lib/footer-fluid';

function FluidCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const canvas = ref.current;
    if (!canvas) return;
    const parent = canvas.parentElement!;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const DPR = Math.min(window.devicePixelRatio || 1, 2);

    let W = parent.clientWidth, H = parent.clientHeight;
    let field = new FooterFluidField({ widthPx: W, heightPx: H, cellSizePx: 16 });
    let particles: { x: number; y: number; ox: number; oy: number }[] = [];

    const seed = () => {
      particles = [];
      const cols = Math.floor(W / 26), rows = Math.floor(H / 26);
      for (let i = 0; i <= cols; i++)
        for (let j = 0; j <= rows; j++) {
          const x = (i / cols) * W, y = (j / rows) * H;
          particles.push({ x, y, ox: x, oy: y });
        }
    };
    const size = () => {
      W = parent.clientWidth; H = parent.clientHeight;
      canvas.width = W * DPR; canvas.height = H * DPR;
      canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      field.resize(W, H); seed();
    };
    size();

    let mx = -1, my = -1, pmx = -1, pmy = -1, raf = 0, last = performance.now();
    const move = (e: MouseEvent) => {
      const r = parent.getBoundingClientRect();
      mx = e.clientX - r.left; my = e.clientY - r.top;
    };
    parent.addEventListener('mousemove', move);

    const loop = () => {
      const now = performance.now();
      const dt = Math.min((now - last) / 1000, 0.033); last = now;
      const dx = pmx < 0 ? 0 : mx - pmx, dy = pmy < 0 ? 0 : my - pmy;
      field.step(dt, { mouseX: mx, mouseY: my, mouseDX: dx, mouseDY: dy, mouseRadiusPx: 130, mouseStrength: 0.9 });
      pmx = mx; pmy = my;

      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = 'rgba(187,161,92,0.5)';
      for (const p of particles) {
        const s = field.sample(p.x, p.y);
        p.x += s.u * dt; p.y += s.v * dt;
        p.x += (p.ox - p.x) * 0.012; p.y += (p.oy - p.y) * 0.012;
        ctx.fillRect(p.x, p.y, 1.6, 1.6);
      }
      raf = requestAnimationFrame(loop);
    };
    loop();
    window.addEventListener('resize', size);
    return () => {
      cancelAnimationFrame(raf);
      parent.removeEventListener('mousemove', move);
      window.removeEventListener('resize', size);
    };
  }, []);
  return <canvas ref={ref} className="lux-fluid-canvas" aria-hidden />;
}

export default function FooterCta() {
  return (
    <footer className="relative bg-ink border-t border-line py-20 md:py-32 px-5 md:px-8 overflow-hidden">
      <FluidCanvas />
      <div className="relative z-[1] max-w-4xl mx-auto text-center">
        <Reveal>
          <span className="text-gold uppercase tracking-[0.32em] text-xs font-semibold">Spots Are Limited</span>
        </Reveal>
        <Mask as="h2" split="lines" className="mt-6 font-serif text-paper leading-[1.0]" style={{ fontSize: 'clamp(2.6rem,8vw,6.5rem)' }}>
          Step Into <span className="italic text-gold-bright">Luxury.</span>
        </Mask>
        <Reveal delay={0.05}>
          <p className="mt-6 text-paper-muted max-w-xl mx-auto text-base md:text-lg">
            Book your free Luxe Content Day inside a multimillion-dollar listing — and walk away with a viral
            reel and a scroll-stopping headshot.
          </p>
          <a href="https://luxeshots.as.me/" target="_blank" rel="noopener noreferrer"
            className="mt-10 inline-block bg-gold text-ink font-sans font-bold uppercase tracking-[0.12em] text-sm px-12 py-5 transition-colors duration-300 hover:bg-gold-bright">
            Reserve Your Spot — Free
          </a>
        </Reveal>

        <div className="mt-20 pt-10 border-t border-line flex flex-col items-center gap-4">
          <img src="/images/logo.png" alt="LuxeShots" className="h-8 w-auto opacity-90" />
          <p className="text-paper-muted text-sm">{brandData.contact.phone} · {brandData.contact.address}</p>
          <a href={brandData.contact.instagram} target="_blank" rel="noopener noreferrer" className="text-paper-muted hover:text-gold transition-colors text-xs uppercase tracking-[0.26em]">Instagram</a>
          <p className="text-paper-muted/50 text-xs mt-3">© 2026 LuxeShots — LUXE Content Days. South Florida.</p>
        </div>
      </div>
    </footer>
  );
}
