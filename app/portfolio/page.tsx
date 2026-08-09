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
  HERO_VIDEO, REELS, RESULTS, GRID_PAGE, WA_NUMBER, WA_MSG, BOOKING_URL,
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

    /* hero video */
    if (HERO_VIDEO) {
      $('heroMedia').innerHTML = `<video autoplay muted loop playsinline src="${HERO_VIDEO}"></video>`;
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
        <div class="lb-meta"><span class="a">${r.location}</span><span class="p">${r.price}</span></div>
        <div class="lb-actions">
          <button class="lb-book book-open">Reserve Your Content Day</button>
        </div>`;
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

    /* ---------- THE RESULTS ---------- */
    const casesEl = $('cases'); casesEl.innerHTML = '';
    RESULTS.forEach((cs, ci) => {
      const r = REELS[cs.reel];
      const el = document.createElement('div');
      el.className = 'case rv' + (ci % 2 ? ' flip' : '');
      el.innerHTML = `
        <div class="case-frame" data-reel="${cs.reel}">
          ${mediaHTML(r, cs.reel)}
          <div class="cf-play"><i>PLAY</i></div>
          <span class="edge"></span>
        </div>
        <div class="case-info">
          <span class="kick">Case ${pad(ci + 1)} — Content Day</span>
          <h3>${r.location}</h3>
          <div class="where">Filmed inside a <b>${r.price}</b> listing</div>
          <div class="case-metrics">
            ${cs.metrics.map((m) => `<div class="metric"><div class="mv" data-mv="${m.v}">0</div><div class="ml">${m.l}</div></div>`).join('')}
          </div>
        </div>`;
      casesEl.appendChild(el);
      io.observe(el);
      const v = el.querySelector('video') as HTMLVideoElement | null;
      const frame = el.querySelector('.case-frame') as HTMLElement;
      if (v) {
        lazyIO.observe(v);
        frame.addEventListener('mouseenter', () => { attach(v); v.play().catch(() => {}); });
        frame.addEventListener('mouseleave', () => { if (v.muted) v.pause(); });
      }
      frame.addEventListener('click', () => openLB(cs.reel));
    });

    /* metric count-up: soporta 2.4M, +1,800, 890K, 3x, 14 */
    function animateMetric(el: HTMLElement) {
      const raw = el.dataset.mv!;
      const m = raw.match(/^([^0-9]*)([\d.,]+)(.*)$/);
      if (!m) { el.textContent = raw; return; }
      const prefix = m[1]; const suffix = m[3];
      const num = parseFloat(m[2].replace(/,/g, ''));
      const decimals = (m[2].split('.')[1] || '').length;
      const hasComma = m[2].includes(',');
      const dur = 1500; const t0 = performance.now();
      const fmt = (n: number) => { let s = n.toFixed(decimals); if (hasComma) s = Number(s).toLocaleString('en-US'); return s; };
      function tick(t: number) {
        const p = Math.min(1, (t - t0) / dur); const e = 1 - Math.pow(1 - p, 3);
        el.textContent = prefix + fmt(num * e) + suffix;
        if (p < 1) requestAnimationFrame(tick); else el.textContent = raw;
      }
      requestAnimationFrame(tick);
    }
    const metricIO = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting) { animateMetric(e.target as HTMLElement); metricIO.unobserve(e.target); } });
    }, { threshold: 0.6 });
    cleanups.push(() => metricIO.disconnect());
    document.querySelectorAll('.pf .metric .mv').forEach((el) => metricIO.observe(el));

    /* ---------- WHATSAPP ---------- */
    ($('waBtn') as HTMLAnchorElement).href = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(WA_MSG)}`;

    /* ---------- BOOKING DRAWER ---------- */
    const bk = $('bk'); const bkOv = $('bkOv'); const bkFrame = $('bkFrame') as HTMLIFrameElement; let bkLoaded = false;
    function openBK() {
      if (!bkLoaded) {
        bkFrame.src = BOOKING_URL;
        bkFrame.addEventListener('load', () => $('bkLoading').classList.add('off'), { once: true });
        bkLoaded = true;
      }
      bk.classList.add('open'); bkOv.classList.add('open');
      document.body.style.overflow = 'hidden';
      document.querySelectorAll('.pf video').forEach((v) => { const vid = v as HTMLVideoElement; if (!vid.muted) vid.muted = true; });
    }
    function closeBK() {
      bk.classList.remove('open'); bkOv.classList.remove('open');
      if (!lb.classList.contains('open')) document.body.style.overflow = '';
    }
    on($('bkClose'), 'click', closeBK);
    on(bkOv, 'click', closeBK);
    on(document, 'click', ((e: MouseEvent) => {
      const t = (e.target as HTMLElement).closest('.book-open');
      if (t) { e.preventDefault(); openBK(); }
    }) as EventListener);
    on(window, 'keydown', ((e: KeyboardEvent) => {
      if (e.key === 'Escape' && bk.classList.contains('open')) closeBK();
    }) as EventListener);

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
      gridEl.innerHTML = ''; casesEl.innerHTML = ''; lbStage.innerHTML = '';
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

      <a className="wa" id="waBtn" href="#" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">
        <svg viewBox="0 0 32 32"><path d="M16 3C9.4 3 4 8.4 4 15c0 2.6.8 5 2.3 7L4 29l7.2-2.2c1.9 1 4 1.6 6.3 1.6h.5c6.6 0 12-5.4 12-12S22.6 3 16 3zm0 22.4h-.4c-2 0-3.9-.6-5.6-1.6l-.4-.2-4.2 1.3 1.3-4.1-.3-.4C5.1 18.7 4.4 16.9 4.4 15 4.4 8.9 9.6 4.4 16 4.4S27.6 9 27.6 15 22.4 25.4 16 25.4zm6.4-7.9c-.3-.2-2-1-2.3-1.1-.3-.1-.5-.2-.8.2-.2.3-.9 1.1-1.1 1.3-.2.2-.4.3-.7.1-.3-.2-1.4-.5-2.7-1.6-1-.9-1.7-2-1.9-2.3-.2-.3 0-.5.1-.7l.5-.6c.2-.2.2-.3.3-.6.1-.2.1-.4 0-.6-.1-.2-.8-1.9-1.1-2.6-.3-.7-.6-.6-.8-.6h-.7c-.2 0-.6.1-.9.4-.3.3-1.2 1.2-1.2 2.9s1.2 3.3 1.4 3.6c.2.2 2.4 3.7 5.9 5.2.8.4 1.5.6 2 .7.8.3 1.6.2 2.2.1.7-.1 2-.8 2.3-1.6.3-.8.3-1.5.2-1.6-.1-.2-.3-.3-.6-.4z" /></svg>
      </a>

      <div className="bk-ov" id="bkOv"></div>
      <aside className="bk" id="bk" aria-label="Booking">
        <div className="bk-head">
          <span className="t">Reserve Your <b>Content Day</b></span>
          <button className="bk-close" id="bkClose" aria-label="Close booking">✕</button>
        </div>
        <div className="bk-body">
          <div className="bk-loading" id="bkLoading">Loading Calendar</div>
          <iframe id="bkFrame" title="LuxeShots Booking" loading="lazy"></iframe>
        </div>
      </aside>

      <div className="lb" id="lb" aria-modal="true" role="dialog">
        <button className="lb-close" id="lbClose" aria-label="Close">✕</button>
        <button className="lb-arrow prev" id="lbPrev" aria-label="Previous">←</button>
        <button className="lb-arrow next" id="lbNext" aria-label="Next">→</button>
        <div className="lb-stage" id="lbStage"></div>
      </div>

      <header>
        <a className="logo" href="#top">Luxe<b>Shots</b></a>
        <div className="hdr-right">
          <span className="kicker">The Work — Content Days</span>
          <button className="hdr-cta book-open">Book Yours</button>
        </div>
      </header>

      {/* HERO */}
      <section className="hero" id="topHero">
        <div className="hero-media" id="heroMedia"><div className="ph"></div></div>
        <div className="hero-inner">
          <div className="eyebrow">LuxeShots — Content Days</div>
          <h1>Shot where <em>luxury</em> lives.</h1>
          <div className="hero-sub">
            <p>The complete work of LuxeShots Content Days — every reel filmed inside a multimillion-dollar listing across South Florida.</p>
            <div className="scrollcue"><span>See the work</span><i></i></div>
          </div>
        </div>
        <div className="stats">
          <div className="stat"><div className="n" data-value="40" data-prefix="$" data-suffix="M+"><b>$0M+</b></div><div className="l">In Listings Filmed</div></div>
          <div className="stat"><div className="n" data-value="100" data-suffix="%"><b>0%</b></div><div className="l">Five-Star Reviews</div></div>
          <div className="stat"><div className="n" data-value="1" data-suffix="M+"><b>0M+</b></div><div className="l">Views Generated</div></div>
        </div>
      </section>

      <div className="marquee" aria-hidden="true"><MarqueeTrack /></div>

      {/* THE GRID */}
      <section className="shell gridsec" id="grid">
        <div className="wm">The Work</div>
        <div className="sec-head rv">
          <div>
            <div className="eyebrow">The Collection</div>
            <h2>Every frame,<br /><em>every listing.</em></h2>
          </div>
          <p className="side">Hover to preview. Tap any reel to watch it full screen — each one shot inside a real multimillion-dollar home.</p>
        </div>
        <div className="grid" id="gridEl"></div>
        <div className="loadmore-wrap" id="lmWrap">
          <button className="loadmore" id="lmBtn">Load More Reels</button>
          <span className="loadmore-count"><b id="lmShown">0</b> / <span id="lmTotal">0</span></span>
        </div>
      </section>

      <div className="marquee" aria-hidden="true"><MarqueeTrack /></div>

      {/* THE RESULTS */}
      <section className="shell res" id="results">
        <div className="sec-head rv">
          <div>
            <div className="eyebrow">The Results</div>
            <h2>Content that<br /><em>produces.</em></h2>
          </div>
          <p className="side">Real agents, real numbers. What a single Content Day did for their brand.</p>
        </div>
        <div id="cases"></div>
      </section>

      <section className="statement">
        <p>One chance at a first impression. Make it <em>unforgettable.</em></p>
      </section>

      {/* CTA */}
      <section className="cta">
        <div className="eyebrow">Spots Are Limited</div>
        <h2>Want content like <em>this?</em></h2>
        <p>Reserve your free Luxe Content Day inside a multimillion-dollar listing — and walk away with a viral reel and a scroll-stopping headshot.</p>
        <button className="btn book-open">Reserve Your Content Day</button>
        <div className="sub">$1,500 Value — Free · By Invitation Only</div>
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
