const ITEMS = [
  'Palm Beach', 'Boca Raton', 'Delray Beach', 'Jupiter', 'Wellington',
  'West Palm Beach', 'Singer Island', 'Juno Beach', 'Hobe Sound', 'Lighthouse Point',
];

function Seq() {
  return (
    <>
      {ITEMS.map((c, i) => (
        <span key={i}>{c}<span className="dot"> · </span></span>
      ))}
    </>
  );
}

export default function Marquee() {
  return (
    <div className="e2-marquee" aria-hidden>
      <div className="e2-marquee__track">
        <Seq /><Seq />
      </div>
    </div>
  );
}
