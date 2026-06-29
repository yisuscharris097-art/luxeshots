'use client';
import { useEffect, useRef, useState } from 'react';
import { teamReels } from '@/lib/data';
import Mask from './mask';
import HlsVideo from './hls-video';
import { attachHls, posterFor, soloAudio, dropAudio, subscribeAudio, audioOwner, type HlsHandle } from '@/lib/hls';

/* ── Reels reales (vertical 9:16) — editar aquí si cambian las URLs ── */
const HOST = 'https://vz-5c81264f-e6c.b-cdn.net';
const REELS = [
  { name: 'Andrea Mamane', url: `${HOST}/6a0a2269-14fc-452c-b1a8-c102616ad477/playlist.m3u8` },
  { name: 'JJ Lambert',    url: `${HOST}/bfe5d383-bfd2-46cf-8053-95401c06190e/playlist.m3u8` },
  { name: 'Kelly Louis',   url: `${HOST}/e8a7988a-c2c3-42fa-844f-c04bb5cd655e/playlist.m3u8` },
  { name: 'Jacob Edri',    url: `${HOST}/7621b373-5a25-4f82-923c-785972dd7344/playlist.m3u8` },
];
const imgFor = (name: string) =>
  teamReels.find((t) => t.name.toLowerCase() === name.toLowerCase())?.image || '';

export default function Reels() {
  const [reduce, setReduce] = useState(false);
  const [center, setCenter] = useState(0);
  const [active, setActive] = useState(false); // center reel enfocado + con sonido

  const stageRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<HTMLDivElement[]>([]);
  const videoRefs = useRef<HTMLVideoElement[]>([]);
  const handles = useRef<(HlsHandle | null)[]>([]);

  const target = useRef(0);
  const current = useRef(0);
  const centerRef = useRef(-1);
  const activeRef = useRef(false);
  const dragging = useRef(false);
  const moved = useRef(false);
  const lastInteract = useRef(0);

  useEffect(() => { setReduce(window.matchMedia('(prefers-reduced-motion: reduce)').matches); }, []);

  const ensure = (i: number) => {
    if (handles.current[i]) return;
    const v = videoRefs.current[i];
    if (v) handles.current[i] = attachHls(v, REELS[i].url);
  };

  const setCenterVideo = (i: number) => {
    ensure(i);
    activeRef.current = false; setActive(false); // nuevo central llega desenfocado
    videoRefs.current.forEach((v, k) => {
      if (!v) return;
      if (k === i) { v.muted = true; v.play().catch(() => {}); }
      else { v.pause(); if (audioOwner() === v) dropAudio(v); else v.muted = true; }
    });
    setCenter(i);
  };

  useEffect(() => subscribeAudio(() => {
    const v = videoRefs.current[centerRef.current];
    const on = !!v && audioOwner() === v && !v.muted;
    activeRef.current = on; setActive(on);
  }), []);

  useEffect(() => {
    if (reduce) return;
    const stage = stageRef.current;
    if (!stage) return;
    const N = REELS.length;
    let W = stage.clientWidth;
    let spacing = Math.min(W * 0.3, 340);
    let raf = 0;
    const clamp = (v: number) => Math.max(0, Math.min(N - 1, v));

    const layout = () => {
      const c = current.current;
      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        const off = i - c;
        const a = Math.min(Math.abs(off), 3);
        el.style.transform = `translate(-50%,-50%) translateX(${off * spacing}px) translateZ(${-a * 190}px) rotateY(${Math.max(-58, Math.min(58, -off * 27))}deg) scale(${1 - a * 0.07})`;
        el.style.opacity = String(Math.max(0.5, 1 - a * 0.16));
        el.style.zIndex = String(100 - Math.round(a * 10));
      });
      const ci = clamp(Math.round(c));
      if (ci !== centerRef.current) { centerRef.current = ci; setCenterVideo(ci); }
    };

    const loop = () => {
      if (!dragging.current) {
        const idle = performance.now() - lastInteract.current;
        if (idle > 90) target.current += (Math.round(target.current) - target.current) * 0.12;
      }
      current.current += (target.current - current.current) * 0.09;
      layout();
      raf = requestAnimationFrame(loop);
    };
    loop();

    const onWheel = (e: WheelEvent) => { e.preventDefault(); target.current = clamp(target.current + e.deltaY * 0.0045); lastInteract.current = performance.now(); };
    let downX = 0, downT = 0;
    const onDown = (e: PointerEvent) => { dragging.current = true; moved.current = false; downX = e.clientX; downT = target.current; lastInteract.current = performance.now(); };
    const onMove = (e: PointerEvent) => {
      if (!dragging.current) return;
      const dx = e.clientX - downX;
      if (Math.abs(dx) > 6) moved.current = true;
      target.current = clamp(downT - dx / spacing);
      lastInteract.current = performance.now();
    };
    const onUp = () => { dragging.current = false; target.current = clamp(Math.round(target.current)); lastInteract.current = performance.now(); };
    const onResize = () => { W = stage.clientWidth; spacing = Math.min(W * 0.3, 340); };

    stage.addEventListener('wheel', onWheel, { passive: false });
    stage.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(raf);
      stage.removeEventListener('wheel', onWheel);
      stage.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('resize', onResize);
      handles.current.forEach((h) => h?.destroy());
      handles.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce]);

  const go = (dir: number) => { target.current = Math.max(0, Math.min(REELS.length - 1, Math.round(current.current) + dir)); lastInteract.current = performance.now(); };

  const onCardClick = (i: number) => {
    if (moved.current) return;
    if (Math.round(current.current) !== i) { target.current = i; lastInteract.current = performance.now(); return; }
    // está centrado -> enfocar + sonido / quitar
    const v = videoRefs.current[i]; if (!v) return;
    if (v.muted) { soloAudio(v); activeRef.current = true; setActive(true); }
    else { dropAudio(v); activeRef.current = false; setActive(false); }
  };

  const videoFilter = (i: number): string => {
    if (i === center) return active ? 'none' : 'blur(11px) brightness(0.62)';
    return 'blur(2px) brightness(0.82)';
  };

  return (
    <section className="bg-ink text-paper pt-20 md:pt-28 pb-14">
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
              <HlsVideo src={r.url} poster={posterFor(r.url)} rounded className="aspect-[9/16] ring-1 ring-line" />
              <figcaption className="mt-2 flex items-center gap-2">
                {imgFor(r.name) && <img src={imgFor(r.name)} alt={r.name} className="w-7 h-7 rounded-full object-cover ring-1 ring-gold/40" />}
                <span className="text-sm text-paper">{r.name}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      ) : (
        <>
          <div ref={stageRef} className="reel-stage mt-6 select-none">
            <button className="reel-arrow left" aria-label="Anterior" onClick={() => go(-1)}>‹</button>
            <button className="reel-arrow right" aria-label="Siguiente" onClick={() => go(1)}>›</button>
            <div className="reel-track">
              {REELS.map((r, i) => (
                <div
                  key={i}
                  ref={(el) => { if (el) cardRefs.current[i] = el; }}
                  className={`reel-card${center === i ? ' is-center' : ''}`}
                  onClick={() => onCardClick(i)}
                >
                  {center === i && active && <span className="reel-live">● En vivo</span>}
                  <video
                    ref={(el) => { if (el) videoRefs.current[i] = el; }}
                    poster={posterFor(r.url)} playsInline loop muted preload="none"
                    style={{ filter: videoFilter(i) }}
                    className="h-full w-full object-cover"
                  />
                  {center === i && !active && (
                    <div className="reel-veil">
                      <span className="reel-play">▶</span>
                      <span>Toca para reproducir con sonido</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex items-center justify-center gap-3">
            {imgFor(REELS[center].name) && (
              <img src={imgFor(REELS[center].name)} alt={REELS[center].name} className="w-11 h-11 rounded-full object-cover ring-1 ring-gold/50" />
            )}
            <span className="font-serif italic text-gold-bright" style={{ fontSize: 'clamp(1.3rem,3vw,2rem)' }}>{REELS[center].name}</span>
          </div>
          <p className="mt-3 text-center text-paper-muted/70 text-[0.7rem] uppercase tracking-[0.22em]">
            Arrastra con el mouse · usa las flechas · toca el reel para reproducirlo
          </p>
        </>
      )}
    </section>
  );
}
