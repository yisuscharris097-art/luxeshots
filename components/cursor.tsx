'use client';
import { useEffect } from 'react';

/** Gold custom cursor (#cursor, mix-blend difference). Fine-pointer only. */
export default function Cursor() {
  useEffect(() => {
    if (!matchMedia('(pointer: fine)').matches) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const c = document.createElement('div');
    c.id = 'cursor';
    document.body.appendChild(c);
    let tx = -100, ty = -100, cx = tx, cy = ty, raf = 0;
    const tick = () => {
      cx += (tx - cx) * 0.18; cy += (ty - cy) * 0.18;
      c.style.setProperty('--x', `${cx}px`); c.style.setProperty('--y', `${cy}px`);
      raf = requestAnimationFrame(tick);
    };
    const move = (e: PointerEvent) => { tx = e.clientX; ty = e.clientY; c.classList.add('on'); if (!raf) raf = requestAnimationFrame(tick); };
    const over = (e: Event) => {
      const t = e.target as HTMLElement;
      c.classList.toggle('hot', !!t.closest('a,button,[role=button],.is-link'));
    };
    const leave = () => c.classList.remove('on');
    addEventListener('pointermove', move, { passive: true });
    addEventListener('pointerover', over, { passive: true });
    document.addEventListener('mouseleave', leave);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener('pointermove', move);
      removeEventListener('pointerover', over);
      document.removeEventListener('mouseleave', leave);
      c.remove();
    };
  }, []);
  return null;
}
