'use client';

const ITEMS = [
  'Free Luxe Content Day', 'Viral Reels', '$1,500 Value — Free',
  'Scroll-Stopping Headshots', 'By Invitation Only', 'Inside Multimillion-Dollar Listings',
];

const Diamond = () => (
  <svg viewBox="0 0 10 10" width="8" height="8" aria-hidden="true"><path fill="currentColor" d="M5 0l5 5-5 5L0 5z" /></svg>
);

function Row() {
  return (
    <div className="looper__row">
      {ITEMS.map((t, i) => (
        <span className="t" key={i}>
          {i % 2 ? <em>{t}</em> : t}
          <span className="sep"><Diamond /></span>
        </span>
      ))}
    </div>
  );
}

export default function Ticker({ dur = '38s', reverse = false, ghost = false }:
  { dur?: string; reverse?: boolean; ghost?: boolean }) {
  return (
    <div className={`ticker ${ghost ? 'ticker--ghost' : ''}`} aria-hidden>
      <div className={`looper ${reverse ? 'looper--rev' : ''}`} style={{ ['--loop-dur' as string]: dur } as React.CSSProperties}>
        <Row /><Row />
      </div>
    </div>
  );
}
