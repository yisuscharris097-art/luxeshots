const ITEMS = [
  { t: 'Styling consultation', d: 'We guide wardrobe, posing and messaging before the camera ever rolls.' },
  { t: 'A multimillion-dollar location', d: 'Every session is shot inside a real luxury listing.' },
  { t: 'A directed video shoot', d: 'Scroll-stopping vertical content, directed end to end.' },
  { t: 'Premium headshots', d: 'Editorial portraits that position you as the go-to agent.' },
  { t: 'Same-day selects', d: 'You leave knowing your best frames are already in the bag.' },
  { t: 'A posting strategy', d: 'What to post, when, and how to make it actually convert.' },
];

export default function Included() {
  return (
    <section className="e2-sec e2-light">
      <div className="e2-wrap">
        <div className="e2-included__head">
          <span className="e2-kick" data-slide>What&rsquo;s included</span>
          <h2 className="e2-disp e2-lg" data-slide data-delay="60">One session. A complete content library.</h2>
        </div>
        <div className="e2-incl">
          {ITEMS.map((it, i) => (
            <div className="e2-incl__item" data-slide data-delay={i * 70} key={i}>
              <span className="k">—</span>
              <span className="t">{it.t}</span>
              <span className="d">{it.d}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
