'use client';
import { useEffect, useRef, useState, ReactNode } from 'react';

/**
 * Reveal suave al entrar al viewport — IntersectionObserver + transición CSS ease-out.
 * Robusto frente a secciones pineadas (no depende de las posiciones de ScrollTrigger,
 * que el spacer del pin de la exhibición desfasa). emil-design-eng: lento, ease-out, sin bounce.
 */
export default function Reveal({
  children, y = 30, delay = 0, className,
}: { children: ReactNode; y?: number; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setShown(true); return; }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) { setShown(true); io.disconnect(); }
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? 'none' : `translateY(${y}px)`,
        transition: `opacity 900ms cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 900ms cubic-bezier(0.16,1,0.3,1) ${delay}s`,
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </div>
  );
}
