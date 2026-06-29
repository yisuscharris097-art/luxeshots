// Shared HLS layer for Bunny Stream reels + a single-owner AUDIO BUS.
// hls.js loaded from CDN (no npm import). Only ONE video may have sound at a time.

export function posterFor(playlistUrl: string): string {
  return playlistUrl.replace(/playlist\.m3u8.*$/, 'thumbnail.jpg');
}

let hlsPromise: Promise<any> | null = null;
export function loadHls(): Promise<any> {
  if (typeof window === 'undefined') return Promise.resolve(null);
  if ((window as any).Hls) return Promise.resolve((window as any).Hls);
  if (hlsPromise) return hlsPromise;
  hlsPromise = new Promise((res) => {
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/hls.js@1/dist/hls.min.js';
    s.onload = () => res((window as any).Hls);
    s.onerror = () => res(null);
    document.head.appendChild(s);
  });
  return hlsPromise;
}

export type HlsHandle = { destroy: () => void };

export function attachHls(video: HTMLVideoElement, url: string): HlsHandle {
  if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = url;
    return { destroy: () => { try { video.removeAttribute('src'); video.load(); } catch {} } };
  }
  let hls: any = null;
  let killed = false;
  loadHls().then((Hls: any) => {
    if (killed) return;
    if (Hls && Hls.isSupported()) {
      hls = new Hls({ enableWorker: true, maxBufferLength: 18, capLevelToPlayerSize: true });
      hls.loadSource(url);
      hls.attachMedia(video);
    } else {
      video.src = url;
    }
  });
  return { destroy: () => { killed = true; if (hls) { try { hls.destroy(); } catch {} } } };
}

/* ───────────────── AUDIO BUS — solo un video con sonido a la vez ───────────────── */
let currentAudio: HTMLVideoElement | null = null;
const subs = new Set<() => void>();
const notify = () => subs.forEach((cb) => { try { cb(); } catch {} });

/** Subscribe to audio-owner changes (so each player can refresh its mute icon). */
export function subscribeAudio(cb: () => void): () => void {
  subs.add(cb);
  return () => { subs.delete(cb); };
}
/** Robust play: retries once the media can actually play (HLS warm-up). */
export function safePlay(v: HTMLVideoElement) {
  const p = v.play?.();
  if (p && typeof p.catch === 'function') {
    p.catch(() => { v.addEventListener('canplay', () => v.play().catch(() => {}), { once: true }); });
  }
}
/** Give sound to `v`, muting whoever had it. */
export function soloAudio(v: HTMLVideoElement) {
  if (currentAudio && currentAudio !== v) currentAudio.muted = true;
  currentAudio = v;
  v.muted = false;
  safePlay(v);
  notify();
}
/** Mute `v` and release the bus if it owned it. */
export function dropAudio(v: HTMLVideoElement) {
  v.muted = true;
  if (currentAudio === v) currentAudio = null;
  notify();
}
export const audioOwner = () => currentAudio;
