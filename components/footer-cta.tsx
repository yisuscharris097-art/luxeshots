'use client';
import { useEffect, useRef } from 'react';
import { brandData } from '@/lib/data';
import { FooterFluidField } from '@/lib/footer-fluid';

function FluidCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const canvas = ref.current; if (!canvas) return;
    const parent = canvas.parentElement!; const ctx = canvas.getContext('2d'); if (!ctx) return;
    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    let W = parent.clientWidth, H = parent.clientHeight;
    let field = new FooterFluidField({ widthPx: W, heightPx: H, cellSizePx: 16 });
    let particles: { x: number; y: number; ox: number; oy: number }[] = [];
    const seed = () => {
      particles = [];
      const cols = Math.floor(W / 26), rows = Math.floor(H / 26);
      for (let i = 0; i <= cols; i++) for (let j = 0; j <= rows; j++) { const x = (i / cols) * W, y = (j / rows) * H; particles.push({ x, y, ox: x, oy: y }); }
    };
    const size = () => {
      W = parent.clientWidth; H = parent.clientHeight;
      canvas.width = W * DPR; canvas.height = H * DPR; canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0); field.resize(W, H); seed();
    };
    size();
    let mx = -1, my = -1, pmx = -1, pmy = -1, raf = 0, last = performance.now();
    const move = (e: MouseEvent) => { const r = parent.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top; };
    parent.addEventListener('mousemove', move);
    const loop = () => {
      const now = performance.now(); const dt = Math.min((now - last) / 1000, 0.033); last = now;
      const dx = pmx < 0 ? 0 : mx - pmx, dy = pmy < 0 ? 0 : my - pmy;
      field.step(dt, { mouseX: mx, mouseY: my, mouseDX: dx, mouseDY: dy, mouseRadiusPx: 130, mouseStrength: 0.9 });
      pmx = mx; pmy = my;
      ctx.clearRect(0, 0, W, H); ctx.fillStyle = 'rgba(185,160,106,0.5)';
      for (const p of particles) {
        const s = field.sample(p.x, p.y);
        p.x += s.u * dt; p.y += s.v * dt; p.x += (p.ox - p.x) * 0.012; p.y += (p.oy - p.y) * 0.012;
        ctx.fillRect(p.x, p.y, 1.6, 1.6);
      }
      raf = requestAnimationFrame(loop);
    };
    loop();
    window.addEventListener('resize', size);
    return () => { cancelAnimationFrame(raf); parent.removeEventListener('mousemove', move); window.removeEventListener('resize', size); };
  }, []);
  return <canvas ref={ref} className="footer__canvas" aria-hidden />;
}

export default function FooterCta() {
  const c = brandData.contact;
  return (
    <footer className="footer">
      <FluidCanvas />
      <div className="footer__in wrap--narrow">
        <span className="eyebrow" data-reveal="fade">Spots Are Limited</span>
        <h2 className="display display--xl" data-split style={{ marginTop: '1.4rem' }}>Step Into <span className="accent">Luxury.</span></h2>
        <p className="lede" data-reveal="fade" data-delay="120" style={{ maxWidth: '34rem', margin: '1.6rem auto 0' }}>
          Book your free Luxe Content Day inside a multimillion-dollar listing — and walk away with a viral reel and a
          scroll-stopping headshot.
        </p>
        <div data-reveal="fade" data-delay="200" style={{ marginTop: '2.6rem' }}>
          <a className="btn is-link" href="https://luxeshots.as.me/" target="_blank" rel="noopener noreferrer">Reserve Your Spot — Free <span className="arr">→</span></a>
        </div>
        <div className="footer__meta">
          <div className="b">Luxe<b>Shots</b></div>
          <p>{c.phone} · {c.address}</p>
          <a href={c.instagram} target="_blank" rel="noopener noreferrer" className="is-link">Instagram</a>
          <p className="cc">© 2026 LuxeShots — LUXE Content Days · South Florida</p>
        </div>
      </div>
    </footer>
  );
}
