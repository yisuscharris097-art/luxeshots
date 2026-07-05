'use client';
import { useEffect } from 'react';

/**
 * V2 shell — sets the monochrome body, drives the progress hairline, and runs
 * the signature reveal engine (slide-down / fade / mask) via IntersectionObserver.
 * Native scroll (no Lenis) — this edition is deliberately its own system.
 */
export default function Shell() {
  useEffect(() => {
    document.body.classList.add('v2-on');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // progress hairline + masthead solid-on-scroll
    const bar = document.getElementById('v2-progress');
    const mast = document.querySelector('.e2-mast');
    let raf = 0;
    const tick = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      if (bar) bar.style.transform = `scaleX(${max > 0 ? Math.min(1, h.scrollTop / max) : 0})`;
      if (mast) mast.classList.toggle('solid', h.scrollTop > 40);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // reveals
    document.querySelectorAll<HTMLElement>('.v2 [data-delay]').forEach((el) =>
      el.style.setProperty('--d', `${el.dataset.delay}ms`),
    );
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }),
      { threshold: 0.16, rootMargin: '0px 0px -8% 0px' },
    );
    document.querySelectorAll('.v2 [data-slide],.v2 [data-fade],.v2 [data-mask]').forEach((el) => {
      if (reduce) { el.classList.add('in'); return; }
      io.observe(el);
    });

    // count-up
    const cio = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return; cio.unobserve(e.target);
        const el = e.target as HTMLElement;
        const target = +(el.dataset.count || '0');
        const t0 = performance.now(), dur = 1400;
        const step = (t: number) => {
          const p = Math.min(1, (t - t0) / dur);
          el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))).toLocaleString('en-US');
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
    }, { threshold: 0.6 });
    document.querySelectorAll('.v2 [data-count]').forEach((el) => cio.observe(el));

    return () => { cancelAnimationFrame(raf); io.disconnect(); cio.disconnect(); document.body.classList.remove('v2-on'); };
  }, []);

  return <div className="v2-progress" id="v2-progress" aria-hidden />;
}
