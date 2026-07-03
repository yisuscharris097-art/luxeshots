'use client';
import { useEffect, useRef } from 'react';
import Magnetic from './magnetic';

export default function Nav() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const nav = ref.current;
    if (!nav) return;
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      nav.classList.toggle('nav--solid', y > 60);
      nav.classList.toggle('nav--hidden', y > 240 && y > last + 4);
      last = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className="nav" ref={ref}>
      <a href="#top" className="nav__brand is-link">Luxe<b>Shots</b></a>
      <div className="nav__links">
        <a href="#collection" className="nav__link">The Dates</a>
        <a href="#reels" className="nav__link">The Work</a>
        <a href="#reviews" className="nav__link">Reviews</a>
      </div>
      <Magnetic strength={0.3}>
        <a className="btn btn--sm is-link" href="https://luxeshots.as.me/" target="_blank" rel="noopener noreferrer">Reserve Your Spot</a>
      </Magnetic>
    </nav>
  );
}
