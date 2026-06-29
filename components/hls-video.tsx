'use client';
import { useEffect, useRef, useState } from 'react';
import { attachHls, subscribeAudio, soloAudio, dropAudio } from '@/lib/hls';

/**
 * HlsVideo — autoplay (muted) + loop + playsinline HLS player with a sound button.
 * Sound goes through the shared audio bus, so turning this on mutes every other
 * player (hero + reels). Plays only while on screen.
 */
export default function HlsVideo({
  src, poster, className, rounded = false,
}: { src: string; poster?: string; className?: string; rounded?: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    const handle = attachHls(v, src);
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) v.play().catch(() => {});
      else v.pause();
    }, { threshold: 0.25 });
    io.observe(v);
    const off = subscribeAudio(() => setMuted(v.muted));
    return () => { io.disconnect(); off(); handle.destroy(); };
  }, [src]);

  const toggle = () => {
    const v = ref.current; if (!v) return;
    if (v.muted) soloAudio(v); else dropAudio(v);
    setMuted(v.muted);
  };

  return (
    <div className={`relative overflow-hidden ${rounded ? 'rounded-sm' : ''} ${className || ''}`}>
      <video ref={ref} poster={poster} playsInline loop muted preload="metadata"
        className="h-full w-full object-cover" />
      <button onClick={toggle} aria-label={muted ? 'Activar sonido' : 'Silenciar'}
        className="absolute bottom-3 right-3 z-10 grid place-items-center w-11 h-11 rounded-full bg-ink/65 backdrop-blur text-paper ring-1 ring-line transition-colors hover:bg-gold hover:text-ink">
        <span className="text-base leading-none">{muted ? '🔇' : '🔊'}</span>
      </button>
    </div>
  );
}
