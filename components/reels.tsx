'use client';
import { useEffect, useRef, useState } from 'react';
import { attachHls, posterFor, soloAudio, dropAudio, subscribeAudio, audioOwner, safePlay, type HlsHandle } from '@/lib/hls';

const HOST = 'https://vz-5c81264f-e6c.b-cdn.net';
const REELS = [
  { name: 'Andrea Mamane', url: `${HOST}/6a0a2269-14fc-452c-b1a8-c102616ad477/playlist.m3u8` },
  { name: 'JJ Lambert',    url: `${HOST}/bfe5d383-bfd2-46cf-8053-95401c06190e/playlist.m3u8` },
  { name: 'Kelly Louis',   url: `${HOST}/e8a7988a-c2c3-42fa-844f-c04bb5cd655e/playlist.m3u8` },
  { name: 'Jacob Edri',    url: `${HOST}/7621b373-5a25-4f82-923c-785972dd7344/playlist.m3u8` },
];

export default function Reels() {
  const [reduce, setReduce] = useState(false);
  const [center, setCenter] = useState(0);
  const [active, setActive] = useState(false);

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
    if (!v || handles.current[i]) return;
    v.muted = true;
    handles.current[i] = attachHls(v, REELS[i].url);
    v.addEventListener('canplay', () => { if (centerRef.current === i) safePlay(v); }, { once: true });
  };

  const setCenterVideo = (i: number) => {
    ensure(i); setActive(false);
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
    let W = stage.clientWidth, spacing = Math.min(W * 0.3, 340), raf = 0;
    const clamp = (v: number) => Math.max(0, Math.min(N - 1, v));
    const layout = () => {
      const c = current.current;
      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        const off = i - c, a = Math.min(Math.abs(off), 3);
        el.style.transform = `translate(-50%,-50%) translateX(${off * spacing}px) translateZ(${-a * 190}px) rotateY(${Math.max(-58, Math.min(58, -off * 27))}deg) scale(${1 - a * 0.07})`;
        el.style.opacity = String(Math.max(0.55, 1 - a * 0.15));
        el.style.zIndex = String(100 - Math.round(a * 10));
        el.classList.toggle('center', clamp(Math.round(c)) === i);
      });
      const ci = clamp(Math.round(c));
      if (ci !== centerRef.current) { centerRef.current = ci; setCenterVideo(ci); }
    };
    const loop = () => {
      if (!dragging.current) { const idle = performance.now() - lastInteract.current; if (idle > 90) target.current += (Math.round(target.current) - target.current) * 0.12; }
      current.current += (target.current - current.current) * 0.09; layout(); raf = requestAnimationFrame(loop);
    };
    loop();
    const onWheel = (e: WheelEvent) => { e.preventDefault(); target.current = clamp(target.current + e.deltaY * 0.0045); lastInteract.current = performance.now(); };
    let downX = 0, downT = 0;
    const onDown = (e: PointerEvent) => { dragging.current = true; moved.current = false; downX = e.clientX; downT = target.current; lastInteract.current = performance.now(); };
    const onMove = (e: PointerEvent) => { if (!dragging.current) return; const dx = e.clientX - downX; if (Math.abs(dx) > 8) moved.current = true; target.current = clamp(downT - dx / spacing); lastInteract.current = performance.now(); };
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
    target.current = i; lastInteract.current = performance.now();
    ensure(i); const v = videoRefs.current[i]; if (v) { soloAudio(v); setActive(true); }
  };
  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    const v = videoRefs.current[center]; if (!v) return;
    if (v.muted) { soloAudio(v); setActive(true); } else { dropAudio(v); setActive(false); }
  };

  return (
    <section className="reels" id="reels">
      <div className="reels__head wrap--narrow">
        <span className="eyebrow">If a picture says 1,000 words…</span>
        <h2 className="display display--md" data-split style={{ marginTop: '1rem' }}>
          What is your content saying <span className="accent">about you?</span>
        </h2>
        <p className="lede" data-reveal="fade" data-delay="120" style={{ marginTop: '1.3rem' }}>
          You only get one chance to make a first impression — let us make it unforgettable.
        </p>
      </div>

      {reduce ? (
        <div className="wrap" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '1rem', marginTop: '2.5rem' }}>
          {REELS.map((r, i) => (
            <div key={i} className="reel-card" style={{ position: 'relative', width: '100%' }}>
              <video poster={posterFor(r.url)} playsInline loop muted preload="none"
                ref={(el) => { if (el) { videoRefs.current[i] = el; ensure(i); } }} />
              <div className="name">{r.name}</div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="reel-stage" ref={stageRef}>
            <button className="reel-arrow l is-link" aria-label="Previous reel" onClick={() => go(-1)}>‹</button>
            <button className="reel-arrow r is-link" aria-label="Next reel" onClick={() => go(1)}>›</button>
            <div className="reel-track">
              {REELS.map((r, i) => (
                <div key={i} className="reel-card" ref={(el) => { if (el) cardRefs.current[i] = el; }} onClick={() => onCardClick(i)}>
                  <video ref={(el) => { if (el) videoRefs.current[i] = el; }} poster={posterFor(r.url)} playsInline loop preload="none" />
                  {center === i && active && <span className="live">● Live</span>}
                  <div className="name">{r.name}</div>
                  {center === i && (
                    <button className="vol is-link" aria-label={active ? 'Mute' : 'Unmute'} onClick={toggleSound}>{active ? '🔊' : '🔇'}</button>
                  )}
                </div>
              ))}
            </div>
          </div>
          <p className="reels__cap">Drag, use the arrows, or tap a reel to play with sound</p>
        </>
      )}
    </section>
  );
}
