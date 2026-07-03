'use client';
import Magnetic from './magnetic';

const RSVP = 'https://luxeshots.as.me/';
const ITEMS = [
  'Look like a luxury agent — even before your first high-end listing',
  'Build a scroll-stopping brand that attracts clients',
  "Finally get content you're proud to post",
  'Get found, followed, and referred',
  'Be seen as a leader in your market',
];
const Dot = () => (<svg viewBox="0 0 10 10" width="9" height="9" aria-hidden="true"><path fill="currentColor" d="M5 0l5 5-5 5L0 5z" /></svg>);
const Arrow = () => (<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M4 12h15M13.5 5.5 20 12l-6.5 6.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>);

export default function Invitation() {
  return (
    <section className="invite">
      <div className="wrap--narrow center">
        <span className="eyebrow" data-reveal="fade"><span className="rule" /> Your Invitation <span className="rule" /></span>
        <h2 className="display display--lg" data-split style={{ marginTop: '1.2rem' }}>This Is Your Invitation To</h2>
        <ul className="invite__list">
          {ITEMS.map((t, i) => (
            <li className="invite__item" data-reveal="fade" data-delay={i * 80} key={i}>
              <span className="dot"><Dot /></span><p>{t}</p>
            </li>
          ))}
        </ul>
        <div data-reveal="fade" data-delay="160" style={{ marginTop: '2.6rem' }}>
          <Magnetic strength={0.4}>
            <a className="btn is-link" href={RSVP} target="_blank" rel="noopener noreferrer">RSVP — Reserve Your Spot <span className="arr"><Arrow /></span></a>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
