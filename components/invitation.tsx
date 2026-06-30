'use client';

const bullets = [
  'Look like a luxury agent — even before your first high-end listing',
  'Build a scroll-stopping brand that attracts clients',
  'Finally get content you’re proud to post',
  'Get found, followed, and referred',
  'Be seen as a leader in your market',
];

export default function Invitation() {
  return (
    <section className="invite">
      <div className="wrap--narrow center">
        <span className="eyebrow" data-reveal="fade"><span className="rule" /> Your Invitation <span className="rule" /></span>
        <h2 className="display display--lg" data-split style={{ marginTop: '1.2rem' }}>This Is Your Invitation To</h2>
        <ul className="invite__list">
          {bullets.map((b, i) => (
            <li className="invite__item" data-reveal="fade" data-delay={String(i * 80)} key={i}>
              <span className="dot">◆</span><p>{b}</p>
            </li>
          ))}
        </ul>
        <div data-reveal="fade" data-delay="160" style={{ marginTop: '2.6rem' }}>
          <a className="btn is-link" href="https://luxeshots.as.me/" target="_blank" rel="noopener noreferrer">
            RSVP — Reserve Your Spot <span className="arr">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
