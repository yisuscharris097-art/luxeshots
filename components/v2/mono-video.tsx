'use client';
import { useEffect, useRef, useState } from 'react';
import { attachHls, soloAudio, dropAudio, subscribeAudio, posterFor, safePlay } from '@/lib/hls';

const VolOn = () => (<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 9v6h4l5 4V5L8 9H4z" /><path d="M16.5 8.5a5 5 0 0 1 0 7" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /><path d="M19 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>);
const VolOff = () => (<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 9v6h4l5 4V5L8 9H4z" /><path d="M16 9.5l5 5M21 9.5l-5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" fill="none" /></svg>);

/** Full-colour HLS video with a gold sound button (shared audio bus). Same reels/showreel as V1. */
export default function ColorVideo({ src, className }: { src: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const first = useRef(true);
  const last = useRef(0);

  useEffect(() => {
    const v = ref.current; if (!v) return;
    v.muted = true;
    const h = attachHls(v, src);
    let offscreen = false;
    const io = new IntersectionObserver(([e]) => {
      offscreen = !e.isIntersecting;
      if (offscreen) { if (!v.paused) v.pause(); }
      else if (v.paused) v.play().catch(() => {});
    }, { threshold: 0.2 });
    io.observe(v);
    // HLS attaches async — attempt muted autoplay as soon as it's ready (retries).
    const tryPlay = () => { if (!offscreen && v.paused && v.readyState >= 2) v.play().catch(() => {}); };
    v.addEventListener('loadeddata', tryPlay);
    v.addEventListener('canplay', tryPlay);
    const kicks = [400, 1100, 2200, 3500].map((ms) => setTimeout(tryPlay, ms));
    const off = subscribeAudio(() => setMuted(v.muted));
    return () => {
      io.disconnect(); off(); h.destroy();
      v.removeEventListener('loadeddata', tryPlay); v.removeEventListener('canplay', tryPlay);
      kicks.forEach(clearTimeout);
    };
  }, [src]);

  const toggle = () => {
    const v = ref.current; if (!v) return;
    if (v.muted) { if (first.current) { first.current = false; try { v.currentTime = 0; } catch { /* noop */ } } soloAudio(v); }
    else dropAudio(v);
    setMuted(v.muted);
  };
  const onT = () => { const n = performance.now(); if (n - last.current < 350) return; last.current = n; toggle(); };

  return (
    <div className={`e2-video ${className || ''}`}>
      <video ref={ref} poster={posterFor(src)} playsInline loop muted preload="metadata" onPointerUp={onT} onClick={onT} />
      <button className={`e2-vbtn ${muted ? 'pulse' : ''}`} aria-label={muted ? 'Play with sound' : 'Mute'}
        onPointerDown={(e) => e.stopPropagation()} onPointerUp={onT} onClick={onT}>
        {muted ? <VolOff /> : <VolOn />}
      </button>
    </div>
  );
}
