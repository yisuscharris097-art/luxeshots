'use client';
import { useEffect, useState } from 'react';
import Magnetic from './magnetic';
import { contentDays } from '@/lib/data';

export default function Nav() {
  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setSolid(y > 60);
      setHidden(y > 240 && y > last + 4);
      last = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const rsvp = contentDays[0]?.rsvp || 'https://luxeshots.as.me/';

  return (
    <nav className={`nav${solid ? ' nav--solid' : ''}${hidden ? ' nav--hidden' : ''}`}>
      <a href="#top" className="nav__brand is-link">Luxe<b>Shots</b></a>
      <div className="nav__links">
        <a href="#collection" className="nav__link">The Dates</a>
        <a href="#reels" className="nav__link">The Work</a>
        <a href="#reviews" className="nav__link">Reviews</a>
      </div>
      <Magnetic strength={0.35}>
        <a className="btn btn--sm is-link" href={rsvp} target="_blank" rel="noopener noreferrer">Reserve Your Spot</a>
      </Magnetic>
    </nav>
  );
}
