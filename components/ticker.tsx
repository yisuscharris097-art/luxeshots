'use client';

const ITEMS = [
  'Free Luxe Content Day', 'Viral Reels', '$1,500 Value — Free',
  'Scroll-Stopping Headshots', 'By Invitation Only', 'Inside Multimillion-Dollar Listings',
];

function Row() {
  return (
    <div className="looper__row">
      {ITEMS.map((t, i) => (
        <span className="t" key={i}>{t}<span className="sep">✦</span></span>
      ))}
    </div>
  );
}

export default function Ticker({ reverse = false, ghost = false, dur = '36s' }: { reverse?: boolean; ghost?: boolean; dur?: string }) {
  return (
    <div className={`ticker${ghost ? ' ticker--ghost' : ''}`} aria-hidden>
      <div className={`looper${reverse ? ' looper--rev' : ''}`} style={{ ['--loop-dur' as any]: dur }}>
        <Row /><Row />
      </div>
    </div>
  );
}
