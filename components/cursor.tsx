'use client';
import { useEffect } from 'react';

/** Gold custom cursor (mix-blend difference). Desktop / fine-pointer only. */
export default function Cursor() {
  useEffect(() => {
    if (!matchMedia('(pointer: fine)').matches) return;
    const el = document.createElement('div');
    el.id = 'lux-cursor';
    document.body.appendChild(el);

    let tx = -100, ty = -100, cx = tx, cy = ty, raf = 0;
    const k = 0.18;
    const tick = () => {
      cx += (tx - cx) * k;
      cy += (ty - cy) * k;
      el.style.setProperty('--x', `${cx}px`);
      el.style.setProperty('--y', `${cy}px`);
      raf = requestAnimationFrame(tick);
    };
    const move = (e: PointerEvent) => {
      tx = e.clientX; ty = e.clientY;
      el.classList.add('is-visible');
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const over = (e: Event) => {
      const t = e.target as HTMLElement;
      if (t.closest('a, button, [role="button"]')) el.classList.add('is-hover');
      else el.classList.remove('is-hover');
    };
    const leave = () => el.classList.remove('is-visible');

    addEventListener('pointermove', move, { passive: true });
    addEventListener('pointerover', over, { passive: true });
    document.addEventListener('mouseleave', leave);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener('pointermove', move);
      removeEventListener('pointerover', over);
      document.removeEventListener('mouseleave', leave);
      el.remove();
    };
  }, []);
  return null;
}
