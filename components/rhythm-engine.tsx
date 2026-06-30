'use client';
import { useEffect } from 'react';

/**
 * Rhythm reveal engine — attribute-driven, runs once after mount.
 * - [data-split]  : wraps words in masked spans (staggered rise)
 * - [data-reveal] : fade / mask, toggled by IntersectionObserver
 * - [data-delay]  : sets --d
 * - [data-count]  : count-up when in view
 * - [data-parallax]: translateY driven each frame
 * JS only toggles .is-in / builds spans — CSS does the animation.
 */
export default function RhythmEngine() {
  useEffect(() => {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

    const splitText = (el: HTMLElement) => {
      if (el.dataset.splitDone === '1') return;
      el.dataset.splitDone = '1';
      const walk = (node: Node) => {
        Array.from(node.childNodes).forEach((n) => {
          if (n.nodeType === 3) {
            const frag = document.createDocumentFragment();
            (n.textContent || '').split(/(\s+)/).forEach((tok) => {
              if (tok.trim() === '') { frag.append(document.createTextNode(tok)); return; }
              const w = document.createElement('span'); w.className = 'word';
              const inner = document.createElement('span'); inner.className = 'sp'; inner.textContent = tok;
              w.append(inner); frag.append(w);
            });
            node.replaceChild(frag, n);
          } else if (n.nodeType === 1) {
            const elc = n as HTMLElement;
            if (elc.classList.contains('win')) return;
            if (elc.children.length === 0 && (elc.textContent || '').trim()) {
              const inner = document.createElement('span'); inner.className = 'sp';
              inner.append(...Array.from(elc.childNodes)); elc.append(inner); elc.classList.add('word');
            } else { walk(elc); }
          }
        });
      };
      walk(el);
      el.querySelectorAll<HTMLElement>('.word').forEach((w, i) => w.style.setProperty('--i', String(i)));
    };

    const run = () => {
      document.querySelectorAll<HTMLElement>('[data-split]').forEach(splitText);
      document.querySelectorAll<HTMLElement>('[data-delay]').forEach((el) =>
        el.style.setProperty('--d', `${el.dataset.delay}ms`),
      );

      const io = new IntersectionObserver(
        (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }),
        { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
      );
      document.querySelectorAll('[data-reveal],[data-split],.manifesto').forEach((el) => {
        if (reduce) { el.classList.add('is-in'); return; }
        io.observe(el);
      });

      const cio = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return; cio.unobserve(e.target);
          const el = e.target as HTMLElement;
          const target = +(el.dataset.count || '0'), pre = el.dataset.prefix || '', suf = el.dataset.suffix || '';
          const t0 = performance.now(), dur = 1500;
          const tick = (t: number) => {
            const p = Math.min(1, (t - t0) / dur);
            el.textContent = pre + Math.round(target * (1 - Math.pow(1 - p, 3))).toLocaleString('en-US') + suf;
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        });
      }, { threshold: 0.4 });
      document.querySelectorAll('[data-count]').forEach((el) => cio.observe(el));

      // parallax
      let raf = 0;
      const pals = Array.from(document.querySelectorAll<HTMLElement>('[data-parallax]'))
        .map((el) => ({ el, s: parseFloat(el.dataset.parallax || '0.15') || 0.15 }));
      if (!reduce && pals.length) {
        const loop = () => {
          const vh = window.innerHeight;
          pals.forEach((p) => {
            const r = p.el.getBoundingClientRect();
            const off = (r.top + r.height / 2 - vh / 2) / vh;
            p.el.style.transform = `translate3d(0,${(-off * p.s * 100).toFixed(2)}px,0)`;
          });
          raf = requestAnimationFrame(loop);
        };
        raf = requestAnimationFrame(loop);
      }

      return () => { io.disconnect(); cio.disconnect(); cancelAnimationFrame(raf); };
    };

    let cleanup = () => {};
    const id = requestAnimationFrame(() => { cleanup = run() || (() => {}); });
    return () => { cancelAnimationFrame(id); cleanup(); };
  }, []);

  return null;
}
