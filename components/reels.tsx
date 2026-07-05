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

const IconPlay = () => (<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" /></svg>);
const IconVolOn = () => (<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="M4 9v6h4l5 4V5L8 9H4z" /><path d="M16.5 8.5a5 5 0 0 1 0 7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>);
const IconVolOff = () => (<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="M4 9v6h4l5 4V5L8 9H4z" /><path d="M16 9.5l5 5M21 9.5l-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none" /></svg>);

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
  const wantSound = useRef(false);   // once the user enables sound, the center reel keeps it
  const lastToggle = useRef(0);      // dedupe pointerup + click firing together

  useEffect(() => { setReduce(window.matchMedia('(prefers-reduced-motion: reduce)').matches); }, []);

  const ensure = (i: number) => {
    const v = videoRefs.current[i];
    if (!v || handles.current[i]) return;
    v.muted = true;
    handles.current[i] = attachHls(v, REELS[i].url);
    v.addEventListener('playing', () => cardRefs.current[i]?.classList.add('is-playing'));
    v.addEventListener('pause', () => cardRefs.current[i]?.classList.remove('is-playing'));
    v.addEventListener('canplay', () => { if (centerRef.current === i) safePlay(v); }, { once: true });
  };

  const setCenterVideo = (i: number) => {
    ensure(i);
    videoRefs.current.forEach((v, k) => {
      if (!v) return;
      if (k === i) {
        if (wantSound.current) soloAudio(v);   // sound follows the centered reel
        else { v.muted = true; safePlay(v); }
      } else { v.pause(); if (audioOwner() === v) dropAudio(v); else v.muted = true; }
    });
    setCenter(i);
    setActive(wantSound.current);
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
    let W = stage.clientWidth, spacing = Math.min(W * 0.36, 480), raf = 0;
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
    let rendered = NaN;
    const loop = () => {
      if (!dragging.current) { const idle = performance.now() - lastInteract.current; if (idle > 90) target.current += (Math.round(target.current) - target.current) * 0.12; }
      const diff = target.current - current.current;
      // Snap to the target once close enough so the cards STOP micro-moving when
      // settled — a perpetually-animating card makes the browser drop taps on the
      // sound button. When nothing changed we skip the DOM write entirely.
      if (!dragging.current && Math.abs(diff) < 0.0015) current.current = target.current;
      else current.current += diff * 0.09;
      if (current.current !== rendered) { rendered = current.current; layout(); }
      raf = requestAnimationFrame(loop);
    };
    loop();
    // Keep the centered reel (and its sound) playing through normal scrolling;
    // only pause once the section is well past the viewport (big margin), so a
    // small scroll up/down never cuts the audio. Resume the center on return.
    const vis = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { const c = clamp(Math.round(current.current)); const v = videoRefs.current[c]; if (v && v.paused) safePlay(v); }
      else { videoRefs.current.forEach((v) => v && v.pause()); }
    }, { threshold: 0, rootMargin: '600px 0px 600px 0px' });
    vis.observe(stage);
    let downX = 0, downT = 0;
    const onDown = (e: PointerEvent) => {
      // don't start a coverflow drag when the press begins on the sound button —
      // otherwise the card shifts and the browser cancels the button's click.
      if ((e.target as HTMLElement)?.closest?.('.snd-btn')) return;
      dragging.current = true; moved.current = false; downX = e.clientX; downT = target.current; lastInteract.current = performance.now();
    };
    const onMove = (e: PointerEvent) => { if (!dragging.current) return; const dx = e.clientX - downX; if (Math.abs(dx) > 8) moved.current = true; target.current = clamp(downT - dx / spacing); lastInteract.current = performance.now(); };
    const onUp = () => { dragging.current = false; target.current = clamp(Math.round(target.current)); lastInteract.current = performance.now(); };
    const onResize = () => { W = stage.clientWidth; spacing = Math.min(W * 0.36, 480); };
    stage.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(raf);
      vis.disconnect();
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
  const enableSound = (i: number) => {
    ensure(i); const v = videoRefs.current[i]; if (!v) return;
    wantSound.current = true; soloAudio(v); setActive(true);
  };
  // tap a card: center it if it isn't; tapping the centered card turns sound on
  const onCardClick = (i: number) => {
    if (moved.current) return;
    if (i !== centerRef.current) { target.current = i; lastInteract.current = performance.now(); return; }
    enableSound(i);
  };
  // volume icon: first tap unmutes (and keeps sound on the center from now on); tap again mutes
  const toggleSound = (e: React.MouseEvent | React.PointerEvent, i: number) => {
    e.stopPropagation();
    if (i !== centerRef.current) { target.current = i; lastInteract.current = performance.now(); enableSound(i); return; }
    const v = videoRefs.current[i]; if (!v) return;
    if (v.muted) { wantSound.current = true; soloAudio(v); setActive(true); }
    else { wantSound.current = false; dropAudio(v); setActive(false); }
  };
  // fire on pointerup AND click, deduped — so a tap works even if the browser
  // suppresses the synthetic click (movement, touch, etc.).
  const onSndBtn = (e: React.MouseEvent | React.PointerEvent, i: number) => {
    const now = performance.now();
    if (now - lastToggle.current < 350) { e.stopPropagation(); return; }
    lastToggle.current = now;
    toggleSound(e, i);
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
              <div className="ph" style={{ backgroundImage: `url(${posterFor(r.url)})` }} />
              <video playsInline loop muted preload="none"
                ref={(el) => { if (el) { videoRefs.current[i] = el; ensure(i); } }} />
              <div className="name">{r.name}</div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="reel-stage" ref={stageRef}>
            <button className="reel-arrow l is-link" aria-label="Previous reel" onClick={() => go(-1)}>
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M14.5 5.5 8 12l6.5 6.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
            <button className="reel-arrow r is-link" aria-label="Next reel" onClick={() => go(1)}>
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M9.5 5.5 16 12l-6.5 6.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
            <div className="reel-track">
              {REELS.map((r, i) => (
                <div key={i} className="reel-card" ref={(el) => { if (el) cardRefs.current[i] = el; }} onClick={() => onCardClick(i)}>
                  <div className="ph" style={{ backgroundImage: `url(${posterFor(r.url)})` }} />
                  <video ref={(el) => { if (el) videoRefs.current[i] = el; }} playsInline loop preload="none" />
                  {center === i && active && <span className="live"><i />Live</span>}
                  <button
                    className={`snd-btn is-link${center === i && !active ? ' snd-pulse' : ''}`}
                    aria-label={center === i && active ? `Mute ${r.name}` : `Play ${r.name} with sound`}
                    onPointerDown={(e) => e.stopPropagation()}
                    onPointerUp={(e) => onSndBtn(e, i)}
                    onClick={(e) => onSndBtn(e, i)}>
                    {center === i ? (active ? <IconVolOn /> : <IconVolOff />) : <IconPlay />}
                  </button>
                  <div className="name">{r.name}</div>
                </div>
              ))}
            </div>
          </div>
          <p className="reels__cap">Drag, use the arrows, or tap a reel to play</p>
        </>
      )}
    </section>
  );
}
