const RSVP = 'https://luxeshots.as.me/';

export default function Invitation() {
  return (
    <>
      <section className="e2-sec e2-invite">
        <div className="e2-wrap">
          <span className="e2-kick" data-slide>05 — Your invitation</span>
          <h2 className="e2-disp" data-slide data-delay="90">Make it unforgettable, <span className="free">for free</span>.</h2>
          <p data-fade data-delay="220">
            Book your free Luxe Content Day inside a multimillion-dollar listing and walk away with a viral
            reel and a scroll-stopping headshot. Spots are limited.
          </p>
          <div className="e2-invite__cta" data-fade data-delay="300">
            <a className="e2-link" href={RSVP} target="_blank" rel="noopener noreferrer">Reserve your spot <span className="a">→</span></a>
          </div>
        </div>
      </section>

      <footer className="e2-foot e2-wrap">
        <div className="e2-foot__top">
          <div className="e2-foot__brand" data-slide>LuxeShots</div>
          <div className="e2-foot__meta" data-fade data-delay="80">
            <a href="tel:+15615701414">+1 561-570-1414</a>
            <span>12000 Forest Hill Boulevard, Wellington, FL 33414</span>
            <a href="https://instagram.com/luxeshotsbyus" target="_blank" rel="noopener noreferrer">Instagram ↗</a>
          </div>
        </div>
        <div className="e2-foot__cc">
          <span>© 2026 LuxeShots — LUXE Content Days · South Florida</span>
          <span>Edition N°02 — The Gallery</span>
        </div>
      </footer>
    </>
  );
}
