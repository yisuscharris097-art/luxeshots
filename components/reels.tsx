'use client';
import { useEffect, useRef, useState } from 'react';
import { teamReels } from '@/lib/data';
import Mask from './mask';
import HlsVideo from './hls-video';
import { attachHls, posterFor, onSoundUnlock, type HlsHandle } from '@/lib/hls';

/* ── Real Bunny reels (vertical 9:16) ──────────────────────────────────────
   Editar aquí si cambian las URLs. El headshot se toma de data/team.json.   */
const HOST = 'https://vz-5c81264f-e6c.b-cdn.net';
const REELS = [
  { name: 'Andrea Mamane', url: `${HOST}/6a0a2269-14fc-452c-b1a8-c102616ad477/playlist.m3u8` },
  { name: 'JJ Lambert',    url: `${HOST}/bfe5d383-bfd2-46cf-8053-95401c06190e/playlist.m3u8` },
  { name: 'Kelly Louis',   url: `${HOST}/e8a7988a-c2c3-42fa-844f-c04bb5cd655e/playlist.m3u8` },
  { name: 'Jacob Edri',    url: `${HOST}/7621b373-5a25-4f82-923c-785972dd7344/playlist.m3u8` },
];

const imgFor = (name: string) =>
  teamReels.find((t) => t.name.toLowerCase() === name.toLowerCase())?.image || '';

const SLIDE_W = 270, SLIDE_H = 480, GAP = 175, ARC = 150, LIFT = 110, LERP = 0.07;

export default function Reels() {
  const [reduce, setReduce] = useState(false);
  const [active, setActive] = useState(0);
  const [wantSound, setWantSound] = useState(false);

  const wrapRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<HTMLDivElement[]>([]);
  const videoRefs = useRef<HTMLVideoElement[]>([]);
  const handles = useRef<(HlsHandle | null)[]>([]);
  const wantSoundRef = useRef(false);
  const activeRef = useRef(0);

  useEffect(() => { setReduce(window.matchMedia('(prefers-reduced-motion: reduce)').matches); }, []);
  useEffect(() => { wantSoundRef.current = wantSound; applySound(); /* eslint-disable-next-line */ }, [wantSound]);

  // first user gesture anywhere arms sound on the centered reel
  useEffect(() => onSoundUnlock(() => setWantSound(true)), []);

  const ensureAttached = (i: number) => {
    if (handles.current[i]) return;
    const v = videoRefs.current[i];
    if (v) handles.current[i] = attachHls(v, REELS[i].url);
  };

  const applySound = () => {
    const i = activeRef.current;
    videoRefs.current.forEach((v, k) => { if (v) v.muted = !(k === i && wantSoundRef.current); });
  };

  const playCenter = (i: number) => {
    activeRef.current = i;
    setActive(i);
    ensureAttached(i);
    videoRefs.current.forEach((v, k) => {
      if (!v) return;
      if (k === i) { v.muted = !wantSoundRef.current; v.play().catch(() => {}); }
      else { v.pause(); v.muted = true; }
    });
  };

  // arc engine
  useEffect(() => {
    if (reduce) return;
    const wrap = wrapRef.current;
    if (!wrap) return;
    const slides = slideRefs.current.filter(Boolean);
    const N = slides.length;
    const track = N * GAP;
    let W = wrap.clientWidth, H = wrap.clientHeight;
    let cxw = W / 2, baseY = H * 0.46;
    let target = 0, current = 0, best = -1, raf = 0;

    const tf = (i: number, scroll: number) => {
      let off = (((i * GAP - scroll) % track) + track) % track;
      if (off > track / 2) off -= track;
      const sc = cxw + off;
      const nd = (sc - cxw) / (W * 0.5);
      const ad = Math.min(Math.abs(nd), 1.3);
      const scale = Math.max(1 - ad * 0.62, 0.34);
      const w = SLIDE_W * scale, h = SLIDE_H * scale;
      const cl = Math.min(ad, 1);
      const drop = (1 - Math.cos(cl * Math.PI)) * 0.5 * ARC;
      const lift = Math.max(1 - ad * 2, 0) * LIFT;
      return { x: sc - w / 2, y: baseY - h / 2 + drop - lift, w, h, z: Math.round((1 - ad) * 100), dist: Math.abs(off) };
    };

    const layout = (scroll: number) => {
      let b = 0, bd = Infinity;
      slides.forEach((el, i) => {
        const t = tf(i, scroll);
        el.style.transform = `translate(${t.x}px, ${t.y}px)`;
        el.style.width = `${t.w}px`; el.style.height = `${t.h}px`;
        el.style.zIndex = String(t.z);
        el.style.opacity = String(Math.max(0.25, 1 - t.dist / (W * 0.9)));
        if (t.dist < bd) { bd = t.dist; b = i; }
      });
      if (b !== best) { best = b; playCenter(b); }
    };
    layout(0);

    const loop = () => { current += (target - current) * LERP; layout(current); raf = requestAnimationFrame(loop); };
    loop();

    const wheel = (e: WheelEvent) => { e.preventDefault(); target += e.deltaY * 0.55; };
    let tsx = 0;
    const tstart = (e: TouchEvent) => { tsx = e.touches[0].clientX; };
    const tmove = (e: TouchEvent) => { e.preventDefault(); const x = e.touches[0].clientX; target += (tsx - x) * 1.25; tsx = x; };
    const resize = () => { W = wrap.clientWidth; H = wrap.clientHeight; cxw = W / 2; baseY = H * 0.46; };

    wrap.addEventListener('wheel', wheel, { passive: false });
    wrap.addEventListener('touchstart', tstart, { passive: true });
    wrap.addEventListener('touchmove', tmove, { passive: false });
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(raf);
      wrap.removeEventListener('wheel', wheel);
      wrap.removeEventListener('touchstart', tstart);
      wrap.removeEventListener('touchmove', tmove);
      window.removeEventListener('resize', resize);
      handles.current.forEach((h) => h?.destroy());
      handles.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce]);

  return (
    <section className="bg-ink text-paper pt-20 md:pt-28 pb-10">
      <div className="max-w-6xl mx-auto px-5 md:px-8 text-center">
        <span className="text-gold uppercase tracking-[0.3em] text-xs font-semibold">Si una imagen dice 1.000 palabras…</span>
        <Mask as="h2" split="lines" className="mt-4 font-serif leading-[1.04]" style={{ fontSize: 'clamp(1.9rem,4.6vw,3.6rem)' }}>
          ¿Qué dice tu contenido <span className="italic text-gold-bright">sobre ti?</span>
        </Mask>
        <p className="text-paper-muted mt-5 max-w-2xl mx-auto text-base md:text-lg">
          Solo tienes una oportunidad para causar una buena primera impresión; déjanos hacerla inolvidable.
        </p>
      </div>

      {reduce ? (
        <div className="max-w-5xl mx-auto px-5 md:px-8 grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
          {REELS.map((r, i) => (
            <figure key={i} className="relative">
              <HlsVideo src={r.url} poster={posterFor(r.url)} rounded autoUnmute={i === 0}
                className="aspect-[9/16] ring-1 ring-line" />
              <figcaption className="mt-2 flex items-center gap-2">
                {imgFor(r.name) && <img src={imgFor(r.name)} alt={r.name} className="w-7 h-7 rounded-full object-cover ring-1 ring-gold/40" />}
                <span className="text-sm text-paper">{r.name}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      ) : (
        <div
          ref={wrapRef}
          className="lux-arc mt-4 select-none"
          onClick={() => setWantSound((s) => !s)}
          role="button"
          aria-label={wantSound ? 'Silenciar reel' : 'Activar sonido del reel'}
        >
          {REELS.map((r, i) => (
            <div key={i} ref={(el) => { if (el) slideRefs.current[i] = el; }} className="lux-arc-slide ring-1 ring-line">
              <video
                ref={(el) => { if (el) videoRefs.current[i] = el; }}
                poster={posterFor(r.url)} playsInline loop muted preload="none"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/55 to-transparent pointer-events-none" />
            </div>
          ))}

          {/* sound state pill */}
          <span className="absolute top-6 left-1/2 -translate-x-1/2 z-20 text-[0.62rem] uppercase tracking-[0.24em] bg-ink/55 ring-1 ring-line px-3 py-1.5 rounded-full pointer-events-none">
            {wantSound ? '🔊 Sonido activado · toca para silenciar' : '🔇 Toca para activar el sonido'}
          </span>

          {/* synced name + headshot */}
          <div className="lux-arc-title flex items-center gap-3">
            {imgFor(REELS[active].name) && (
              <img src={imgFor(REELS[active].name)} alt={REELS[active].name}
                className="w-9 h-9 rounded-full object-cover ring-1 ring-gold/50" />
            )}
            <span>{REELS[active].name}</span>
          </div>
        </div>
      )}
    </section>
  );
}
