'use client';
import { useEffect, useRef, useState } from 'react';
import { attachHls, subscribeAudio, soloAudio, dropAudio } from '@/lib/hls';

const IconVolOn = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 9v6h4l5 4V5L8 9H4z" /><path d="M16.5 8.5a5 5 0 0 1 0 7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /><path d="M19 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
);
const IconVolOff = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 9v6h4l5 4V5L8 9H4z" /><path d="M16 9.5l5 5M21 9.5l-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none" /></svg>
);

/**
 * HlsVideo — autoplay (muted) + loop + playsinline HLS player with a sound button.
 * Sound goes through the shared audio bus (only one player audible at a time).
 * The FIRST time the user enables sound, the clip restarts from the beginning.
 */
export default function HlsVideo({
  src, poster, className, rounded = false,
}: { src: string; poster?: string; className?: string; rounded?: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const firstUnmute = useRef(true);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    const handle = attachHls(v, src);
    // Play while in view, pause when scrolled away. Multiple thresholds fire more
    // callbacks as you scroll, so the clip never gets stuck paused while visible.
    const io = new IntersectionObserver((entries) => {
      const e = entries[entries.length - 1];
      if (e.isIntersecting) { if (v.paused) v.play().catch(() => {}); }
      else if (!v.paused) v.pause();
    }, { threshold: [0, 0.25, 0.6] });
    io.observe(v);
    // kick playback shortly after mount in case it's already on screen
    const kick = setTimeout(() => {
      const r = v.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0 && v.paused) v.play().catch(() => {});
    }, 400);
    const off = subscribeAudio(() => setMuted(v.muted));
    return () => { io.disconnect(); off(); handle.destroy(); clearTimeout(kick); };
  }, [src]);

  const toggle = () => {
    const v = ref.current; if (!v) return;
    if (v.muted) {
      if (firstUnmute.current) { firstUnmute.current = false; try { v.currentTime = 0; } catch { /* noop */ } }
      soloAudio(v);
    } else {
      dropAudio(v);
    }
    setMuted(v.muted);
  };

  return (
    <div className={`relative overflow-hidden ${rounded ? 'rounded-sm' : ''} ${className || ''}`}>
      <video ref={ref} poster={poster} playsInline loop muted preload="metadata" onClick={toggle}
        className="h-full w-full object-cover cursor-pointer" />
      <button onPointerDown={(e) => e.stopPropagation()} onClick={toggle}
        aria-label={muted ? 'Activar sonido' : 'Silenciar'}
        className={`snd-btn is-link${muted ? ' snd-pulse' : ''}`}>
        {muted ? <IconVolOff /> : <IconVolOn />}
      </button>
    </div>
  );
}
