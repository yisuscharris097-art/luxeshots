'use client';
import { useEffect, useRef, useState } from 'react';
import { teamReels } from '@/lib/data';
import Mask from './mask';
import HlsVideo from './hls-video';
import { attachHls, posterFor, soloAudio, dropAudio, subscribeAudio, audioOwner, safePlay, type HlsHandle } from '@/lib/hls';

/* ── Real reels (vertical 9:16) — edit here if URLs change ── */
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
  const [active, setActive] = useState(false); // center reel has sound

  const stageRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<HTMLDivElement[]>([]);
  const videoRefs = useRef<HTMLVideoElement[]>([]);
  const handles = useRef<(HlsHandle | null)[]>([]);

  const target = useRef(0);
  const current = useRef(0);
  const centerRef = useRef(-1);
  const dragging = useRef(false);
  const moved = useRef(false);
  const lastInteract = useRef(0);

  useEffect(() => { setReduce(window.matchMedia('(prefers-reduced-motion: reduce)').matches); }, []);

  const ensure = (i: number) => {
    const v = videoRefs.current[i];
    if (!v) return;
    if (!handles.current[i]) {
      v.muted = true;
      handles.current[i] = attachHls(v, REELS[i].url);
      v.addEventListener('canplay', () => { if (centerRef.current === i) safePlay(v); }, { once: true });
    }
  };

  const setCenterVideo = (i: number) => {
    ensure(i);
    setActive(false);
    videoRefs.current.forEach((v, k) => {
      if (!v) return;
      if (k === i) { v.muted = true; safePlay(v); }
      else { v.pause(); if (audioOwner() === v) dropAudio(v); else v.muted = true; }
    });
    setCenter(i);
  };

  useEffect(() => subscribeAudio(() => {
    const v = videoRefs.current[centerRef.current];
    setActive(!!v && audioOwner() === v && !v.muted);
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
        el.style.opacity = String(Math.max(0.55, 1 - a * 0.15));
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
      if (Math.abs(dx) > 8) moved.current = true;
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

  // single click = center it AND play with sound
  const onCardClick = (i: number) => {
    if (moved.current) return;
    target.current = i; lastInteract.current = performance.now();
    ensure(i);
    const v = videoRefs.current[i];
    if (v) { soloAudio(v); setActive(true); }
  };

  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    const v = videoRefs.current[center]; if (!v) return;
    if (v.muted) { soloAudio(v); setActive(true); } else { dropAudio(v); setActive(false); }
  };

  return (
    <section className="bg-ink text-paper pt-20 md:pt-28 pb-14">
      <div className="max-w-6xl mx-auto px-5 md:px-8 text-center">
        <span className="text-gold uppercase tracking-[0.3em] text-xs font-semibold">If a picture says 1,000 words…</span>
        <Mask as="h2" split="lines" className="mt-4 font-serif leading-[1.04]" style={{ fontSize: 'clamp(1.9rem,4.6vw,3.6rem)' }}>
          What is your content saying <span className="italic text-gold-bright">about you?</span>
        </Mask>
        <p className="text-paper-muted mt-5 max-w-2xl mx-auto text-base md:text-lg">
          You only get one chance to make a first impression — let us make it unforgettable.
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
            <button className="reel-arrow left" aria-label="Previous" onClick={() => go(-1)}>‹</button>
            <button className="reel-arrow right" aria-label="Next" onClick={() => go(1)}>›</button>
            <div className="reel-track">
              {REELS.map((r, i) => (
                <div
                  key={i}
                  ref={(el) => { if (el) cardRefs.current[i] = el; }}
                  className={`reel-card${center === i ? ' is-center' : ''}`}
                  onClick={() => onCardClick(i)}
                >
                  <video
                    ref={(el) => { if (el) videoRefs.current[i] = el; }}
                    poster={posterFor(r.url)} playsInline loop preload="none"
                    className="h-full w-full object-cover"
                  />
                  {center === i && (
                    <button onClick={toggleSound} aria-label={active ? 'Mute' : 'Unmute'}
                      className="absolute z-20 bottom-3 right-3 grid place-items-center w-12 h-12 rounded-full bg-ink/70 backdrop-blur ring-1 ring-gold/50 text-paper transition-colors hover:bg-gold hover:text-ink">
                      <span className="text-lg leading-none">{active ? '🔊' : '🔇'}</span>
                    </button>
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
            Drag, use the arrows, or tap the volume icon to play with sound
          </p>
        </>
      )}
    </section>
  );
}
