'use client';
import { useEffect, useRef, useState } from 'react';
import { attachHls, posterFor, onSoundUnlock } from '@/lib/hls';

/**
 * HlsVideo — autoplay (muted) + loop + playsinline HLS player with an unmute
 * control. Plays only while on screen. Used for the horizontal hero reel.
 * `autoUnmute` lets it un-mute itself after the page's first user gesture.
 */
export default function HlsVideo({
  src, poster, className, rounded = false, autoUnmute = false,
}: {
  src: string; poster?: string; className?: string; rounded?: boolean; autoUnmute?: boolean;
}) {
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

    let off = () => {};
    if (autoUnmute) {
      off = onSoundUnlock(() => { v.muted = false; setMuted(false); v.play().catch(() => {}); });
    }
    return () => { io.disconnect(); off(); handle.destroy(); };
  }, [src, autoUnmute]);

  const toggle = () => {
    const v = ref.current; if (!v) return;
    v.muted = !v.muted; setMuted(v.muted);
    if (!v.muted) v.play().catch(() => {});
  };

  return (
    <div className={`relative overflow-hidden ${rounded ? 'rounded-sm' : ''} ${className || ''}`}>
      <video ref={ref} poster={poster} playsInline loop muted preload="metadata"
        className="h-full w-full object-cover" />
      <button onClick={toggle} aria-label={muted ? 'Unmute' : 'Mute'}
        className="absolute bottom-3 right-3 z-10 grid place-items-center w-11 h-11 rounded-full bg-ink/65 backdrop-blur text-paper ring-1 ring-line transition-colors hover:bg-gold hover:text-ink">
        <span className="text-base leading-none">{muted ? '🔇' : '🔊'}</span>
      </button>
      {muted && (
        <span className="absolute bottom-4 left-4 z-10 text-[0.62rem] uppercase tracking-[0.22em] text-paper/90 bg-ink/55 px-2.5 py-1 rounded-full ring-1 ring-line pointer-events-none">
          Tap for sound
        </span>
      )}
    </div>
  );
}
