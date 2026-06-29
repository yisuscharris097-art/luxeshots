// Shared HLS layer for Bunny Stream reels.
// hls.js is loaded from CDN (no npm import) so it resolves anywhere.

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

/** Attach an HLS stream to a <video>. Safari uses native HLS. */
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

/* ---- Global sound unlock: first user gesture enables audio everywhere ---- */
let unlocked = false;
const subs = new Set<() => void>();
export const isSoundUnlocked = () => unlocked;
export function onSoundUnlock(cb: () => void): () => void {
  if (unlocked) { cb(); return () => {}; }
  subs.add(cb);
  return () => { subs.delete(cb); };
}
if (typeof window !== 'undefined') {
  const fire = () => {
    if (unlocked) return;
    unlocked = true;
    subs.forEach((cb) => { try { cb(); } catch {} });
    subs.clear();
  };
  ['pointerdown', 'touchstart', 'keydown'].forEach((e) =>
    window.addEventListener(e, fire, { once: true, passive: true })
  );
}
