'use client';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const WORDS = ['Luxe', 'Cinematic', 'Effortless', 'Unforgettable', 'LUXESHOTS'];
const SEEN = 'luxePreloaderSeen';

export default function Preloader() {
  const [active, setActive] = useState(false);
  const wordRef = useRef<HTMLParagraphElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || sessionStorage.getItem(SEEN) === 'true') return;
    setActive(true);
    document.documentElement.style.overflow = 'hidden';

    const w = window.innerWidth, h = window.innerHeight;
    const initial = `M0 0 L${w} 0 L${w} ${h} Q${w / 2} ${h + 300} 0 ${h} L0 0`;
    const target = `M0 0 L${w} 0 L${w} ${h} Q${w / 2} ${h} 0 ${h} L0 0`;
    const path = pathRef.current!;
    path.setAttribute('d', initial);

    let i = 0;
    if (textRef.current) textRef.current.textContent = WORDS[0];
    gsap.to(wordRef.current, { opacity: 0.85, duration: 0.9, delay: 0.2 });

    const cycle = () => {
      if (i === WORDS.length - 1) return;
      gsap.delayedCall(i === 0 ? 0.9 : 0.18, () => {
        i += 1;
        if (textRef.current) textRef.current.textContent = WORDS[i];
        cycle();
      });
    };
    cycle();

    const total = WORDS.length * 0.18 + 1.4;
    const dc = gsap.delayedCall(total, () => {
      const tl = gsap.timeline({
        defaults: { ease: 'power4.inOut' },
        onComplete: () => {
          document.documentElement.style.overflow = '';
          sessionStorage.setItem(SEEN, 'true');
          setActive(false);
        },
      });
      tl.to(wordRef.current, { opacity: 0, duration: 0.3 }, 0);
      tl.to(rootRef.current, { y: '-100vh', duration: 0.9, delay: 0.15 }, 0);
      tl.fromTo(path, { attr: { d: initial } },
        { attr: { d: target }, duration: 0.7, delay: 0.25 }, 0);
    });

    return () => { dc.kill(); document.documentElement.style.overflow = ''; };
  }, []);

  if (!active) return null;
  return (
    <div className="lux-preloader" ref={rootRef} aria-hidden>
      <p className="lux-preloader__word" ref={wordRef}>
        <span className="lux-preloader__dot" />
        <span ref={textRef}>Luxe</span>
      </p>
      <svg className="lux-preloader__svg" preserveAspectRatio="none">
        <path ref={pathRef} />
      </svg>
    </div>
  );
}
