'use client';

/**
 * /portfolio — "The Work" (Content Days). Port fiel del archivo de referencia,
 * integrado a Next.js y unificado con la identidad LuxeShots (Sora + Instrument
 * Sans, negro/dorado). Markup idéntico bajo .pf; la lógica vanilla (lazy load,
 * paginación, lightbox, booking drawer, count-ups, magnetic) corre en useEffect
 * y lee la config de lib/portfolio-data. V1 y v2 quedan intactos.
 */
import { useEffect } from 'react';
import Hls from 'hls.js';
import {
  HERO_VIDEO, HERO_VIDEO_MOBILE, REELS, GRID_PAGE,
} from '@/lib/portfolio-data';
import './portfolio.css';

const MQ = [
  { t: 'Viral Reels' }, { t: 'Shot Where Luxury Lives', b: true },
  { t: 'Scroll-Stopping Headshots' }, { t: 'By Invitation Only', b: true },
  { t: 'Multimillion-Dollar Listings' }, { t: 'South Florida', b: true },
];
const MarqueeTrack = () => (
  <div className="track">
    {[0, 1].map((copy) => MQ.map((m, i) => (
      <span key={`${copy}-${i}`}>{m.b ? <b>{m.t}</b> : m.t} ·</span>
    )))}
  </div>
);

export default function PortfolioPage() {
  useEffect(() => {
    const cleanups: Array<() => void> = [];
    const on = (t: EventTarget, ev: string, fn: EventListener, opts?: AddEventListenerOptions) => {
      t.addEventListener(ev, fn, opts); cleanups.push(() => t.removeEventListener(ev, fn, opts));
    };
    const $ = (id: string) => document.getElementById(id) as HTMLElement;
    const pad = (n: number) => String(n).padStart(2, '0');

    /* HLS (Bunny) — hls.js en Chrome/Firefox, nativo en Safari */
    const hlsList: Hls[] = [];
    const nativeHls = !!document.createElement('video').canPlayType('application/vnd.apple.mpegurl');
    function attach(v: HTMLVideoElement | null) {
      if (!v) return;
      const src = v.dataset.src;
      if (!src || v.dataset.on) return;
      v.dataset.on = '1';
      if (nativeHls || !src.endsWith('.m3u8')) { v.src = src; }
      else if (Hls.isSupported()) {
        const hls = new Hls({ enableWorker: true, capLevelToPlayerSize: true });
        hls.loadSource(src); hls.attachMedia(v); hlsList.push(hls);
      } else { v.src = src; }
    }
    cleanups.push(() => hlsList.forEach((h) => { try { h.destroy(); } catch { /* noop */ } }));

    /* hero video de fondo — horizontal en desktop, vertical en móvil */
    const heroSrc = window.matchMedia('(max-width: 900px)').matches
      ? (HERO_VIDEO_MOBILE || HERO_VIDEO)
      : (HERO_VIDEO || HERO_VIDEO_MOBILE);
    if (heroSrc) {
      const hv = document.createElement('video');
      hv.muted = true; hv.loop = true; hv.playsInline = true; hv.autoplay = true; hv.preload = 'metadata';
      hv.poster = heroSrc.replace('playlist.m3u8', 'thumbnail.jpg');
      hv.dataset.src = heroSrc;
      $('heroMedia').innerHTML = '';
      $('heroMedia').appendChild(hv);
      attach(hv); hv.play().catch(() => {});
    }

    const mediaHTML = (r: typeof REELS[number], i: number) =>
      r.src
        ? `<video muted loop playsinline preload="none" ${r.poster ? `poster="${r.poster}"` : ''} data-src="${r.src}"></video>`
        : `<div class="ph"><span>Reel ${pad(i + 1)}</span></div>`;
    const botHTML = (r: typeof REELS[number]) => `<div class="bot"><div class="agent">${r.location}</div></div>`;

    const lazyIO = new IntersectionObserver((es) => {
      es.forEach((e) => {
        if (e.isIntersecting) {
          const v = e.target as HTMLVideoElement;
          attach(v); v.play().catch(() => {});
          lazyIO.unobserve(v);
        }
      });
    }, { rootMargin: '600px 0px' });
    cleanups.push(() => lazyIO.disconnect());

    /* reveals */
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting) e.target.classList.add('inview'); });
    }, { threshold: 0.2 });
    cleanups.push(() => io.disconnect());
    document.querySelectorAll('.pf .rv,.pf .statement').forEach((el) => io.observe(el));

    /* ---------- GRID (paginado) ---------- */
    const gridEl = $('gridEl');
    gridEl.innerHTML = '';
    let gridShown = 0;

    function buildCard(r: typeof REELS[number], i: number) {
      const c = document.createElement('div');
      c.className = 'card rv';
      c.style.transitionDelay = ((i % 3) * 0.08) + 's';
      c.innerHTML = `
        ${mediaHTML(r, i)}
        <div class="top"><span class="idx">N° ${pad(i + 1)}</span><span class="price">${r.price}</span></div>
        <div class="play"><i>PLAY</i></div>
        ${botHTML(r)}
        <span class="gold-edge"></span>`;
      gridEl.appendChild(c);
      const v = c.querySelector('video') as HTMLVideoElement | null;
      if (v) {
        lazyIO.observe(v);
        c.addEventListener('mouseenter', () => { attach(v); v.play().catch(() => {}); });
        c.addEventListener('mouseleave', () => { if (v.muted) v.pause(); });
      }
      c.addEventListener('click', () => openLB(i));
      return c;
    }
    function loadMoreGrid() {
      const end = Math.min(gridShown + GRID_PAGE, REELS.length);
      for (let i = gridShown; i < end; i++) { const c = buildCard(REELS[i], i); io.observe(c); }
      gridShown = end;
      $('lmShown').textContent = pad(gridShown);
      $('lmTotal').textContent = pad(REELS.length);
      if (gridShown >= REELS.length) $('lmWrap').classList.add('done');
    }
    loadMoreGrid();
    on($('lmBtn'), 'click', loadMoreGrid);

    /* ---------- LIGHTBOX ---------- */
    const lb = $('lb'); const lbStage = $('lbStage'); let lbIdx = 0;
    const lbMedia = (r: typeof REELS[number], i: number) =>
      r.src
        ? `<video controls autoplay playsinline ${r.poster ? `poster="${r.poster}"` : ''} data-src="${r.src}"></video>`
        : `<div class="ph"><span>Reel ${pad(i + 1)}</span></div>`;
    function openLB(i: number) {
      lbIdx = i; renderLB();
      lb.classList.add('open');
      document.body.style.overflow = 'hidden';
      document.querySelectorAll('.pf .grid video').forEach((v) => (v as HTMLVideoElement).pause());
    }
    function renderLB() {
      const r = REELS[lbIdx];
      lbStage.innerHTML = `
        <span class="lb-idx">N° ${pad(lbIdx + 1)}</span>
        ${lbMedia(r, lbIdx)}
        <span class="edge"></span>
        <div class="lb-meta"><span class="a">${r.location}</span><span class="p">${r.price}</span></div>`;
      attach(lbStage.querySelector('video')); // HLS con sonido (gesto de click permite autoplay)
    }
    function closeLB() {
      lb.classList.remove('open');
      document.body.style.overflow = '';
      lbStage.querySelectorAll('video').forEach((v) => v.pause());
      setTimeout(() => { if (!lb.classList.contains('open')) lbStage.innerHTML = ''; }, 500);
    }
    on($('lbClose'), 'click', closeLB);
    on(lb, 'click', (e) => { if (e.target === lb) closeLB(); });
    on($('lbPrev'), 'click', () => { lbIdx = (lbIdx - 1 + REELS.length) % REELS.length; renderLB(); });
    on($('lbNext'), 'click', () => { lbIdx = (lbIdx + 1) % REELS.length; renderLB(); });
    on(window, 'keydown', ((e: KeyboardEvent) => {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') closeLB();
      if (e.key === 'ArrowLeft') $('lbPrev').click();
      if (e.key === 'ArrowRight') $('lbNext').click();
    }) as EventListener);

    /* ---------- SCROLL PROGRESS + PARALLAX ---------- */
    const sbar = $('sbar');
    const wm = document.querySelector('.pf .wm') as HTMLElement | null;
    on(window, 'scroll', (() => {
      const h = document.documentElement;
      sbar.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight) * 100) + '%';
      if (wm) { const r = wm.parentElement!.getBoundingClientRect(); wm.style.transform = `translateY(${r.top * -0.12}px)`; }
    }) as EventListener, { passive: true } as AddEventListenerOptions);

    /* ---------- STAT COUNT-UP ---------- */
    function animateStat(el: HTMLElement) {
      const raw = el.dataset.value!; const suffix = el.dataset.suffix || ''; const prefix = el.dataset.prefix || '';
      const target = parseFloat(raw); const dur = 1600; const t0 = performance.now();
      function tick(t: number) {
        const p = Math.min(1, (t - t0) / dur); const e = 1 - Math.pow(1 - p, 3);
        el.querySelector('b')!.textContent = prefix + Math.round(target * e) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }
    const statIO = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting) { animateStat(e.target as HTMLElement); statIO.unobserve(e.target); } });
    }, { threshold: 0.6 });
    cleanups.push(() => statIO.disconnect());
    document.querySelectorAll('.pf .stat .n[data-value]').forEach((el) => statIO.observe(el));

    /* ---------- MAGNETIC CTA ---------- */
    document.querySelectorAll('.pf .btn').forEach((b) => {
      const el = b as HTMLElement;
      const mv = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.18}px,${(e.clientY - r.top - r.height / 2) * 0.3}px)`;
      };
      const lv = () => { el.style.transform = ''; };
      el.addEventListener('pointermove', mv as EventListener);
      el.addEventListener('pointerleave', lv);
      cleanups.push(() => { el.removeEventListener('pointermove', mv as EventListener); el.removeEventListener('pointerleave', lv); });
    });


    /* ---------- PRELOADER ---------- */
    const loaderT = setTimeout(() => $('loader').classList.add('done'), 1400);
    cleanups.push(() => clearTimeout(loaderT));

    /* cursor nativo dentro del portafolio (la landing usa cursor:none global) */
    const prevCursor = document.body.style.cursor;
    document.body.style.cursor = 'auto';

    return () => {
      cleanups.forEach((c) => c());
      document.body.style.overflow = '';
      document.body.style.cursor = prevCursor;
      gridEl.innerHTML = ''; lbStage.innerHTML = '';
    };
  }, []);

  return (
    <div className="pf" id="top">
      <div className="grain" aria-hidden="true"></div>

      <div className="loader" id="loader">
        <div className="mark">Luxe<b>Shots</b></div>
        <div className="mark-sub">Portfolio</div>
        <div className="bar"><i></i></div>
      </div>
      <div className="scrollbar"><i id="sbar"></i></div>

      <div className="lb" id="lb" aria-modal="true" role="dialog">
        <button className="lb-close" id="lbClose" aria-label="Close">✕</button>
        <button className="lb-arrow prev" id="lbPrev" aria-label="Previous">←</button>
        <button className="lb-arrow next" id="lbNext" aria-label="Next">→</button>
        <div className="lb-stage" id="lbStage"></div>
      </div>

      <header>
        <a className="logo" href="#top">Luxe<b>Shots</b></a>
        <div className="hdr-right">
          <span className="kicker">LuxeShots — The Portfolio</span>
        </div>
      </header>

      {/* HERO */}
      <section className="hero hero--video" id="topHero">
        <div className="hero-media" id="heroMedia"><div className="ph"></div></div>
        <div className="hero-inner">
          <div className="eyebrow">LuxeShots — The Portfolio</div>
          <div className="hero-sub">
            <p>The complete work of LuxeShots Content Days — every reel filmed inside a multimillion-dollar listing across South Florida.</p>
            <div className="scrollcue"><span>See the work</span><i></i></div>
          </div>
        </div>
        <div className="stats">
          <div className="stat"><div className="n" data-value="400" data-prefix="$" data-suffix="M+"><b>$0M+</b></div><div className="l">In Listings Filmed</div></div>
          <div className="stat"><div className="n" data-value="100" data-suffix="%"><b>0%</b></div><div className="l">Five-Star Reviews</div></div>
          <div className="stat"><div className="n" data-value="17" data-suffix="M+"><b>0M+</b></div><div className="l">Views Generated</div></div>
        </div>
      </section>

      <div className="marquee" aria-hidden="true"><MarqueeTrack /></div>

      {/* THE GRID */}
      <section className="shell gridsec" id="grid">
        <div className="wm">The Work</div>
        <div className="sec-head rv">
          <div>
            <div className="eyebrow">The Collection</div>
            <h2 className="h2-statement">If a Picture Says <em>1,000 Words</em>… What&rsquo;s Your Content Saying About You?</h2>
          </div>
          <p className="side">Hover to preview. Tap any reel to watch it full screen — each one shot inside a real multimillion-dollar home.</p>
        </div>
        <div className="grid" id="gridEl"></div>
        <div className="loadmore-wrap" id="lmWrap">
          <button className="loadmore" id="lmBtn">Load More Reels</button>
          <span className="loadmore-count"><b id="lmShown">0</b> / <span id="lmTotal">0</span></span>
        </div>
      </section>

      <footer>
        <a className="logo" href="#top">Luxe<b>Shots</b></a>
        <span>Shot Where Luxury Lives</span>
        <a href="https://instagram.com/luxeshotsbyus" target="_blank" rel="noopener">Instagram</a>
        <span>© 2026 LuxeShots · South Florida</span>
      </footer>
    </div>
  );
}
