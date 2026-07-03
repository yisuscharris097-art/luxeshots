'use client';
import { reviewsData } from '@/lib/data';

const Dot = () => (<svg viewBox="0 0 10 10" width="8" height="8" aria-hidden="true"><path fill="currentColor" d="M5 0l5 5-5 5L0 5z" /></svg>);

export default function Reviews() {
  const { count, aiSummary, items } = reviewsData;
  return (
    <section className="reviews" id="reviews">
      <div className="wrap">
        <div className="center">
          <p className="eyebrow">Loved by Realtors</p>
          <h2 className="display display--md" data-split style={{ marginTop: '.8rem' }}>What Our Clients Say</h2>
          <div className="reviews__score" data-reveal="fade">
            <span className="score-num">5.00</span>
            <div style={{ textAlign: 'left' }}>
              <div className="stars" style={{ fontSize: '1.2rem' }}>★★★★★</div>
              <div style={{ color: 'var(--muted)', fontSize: '.84rem', marginTop: '.3rem' }}>
                <span data-count={count}>0</span> reviews
              </div>
            </div>
          </div>
        </div>
        <div className="reviews__ai" data-reveal="fade" data-delay="60">
          <div className="k"><Dot /> AI Summary</div>
          <p className="lede" style={{ color: 'var(--paper)', opacity: 0.9 }}>{aiSummary}</p>
        </div>
        <div className="reviews__grid">
          {items.slice(0, 4).map((r, i) => (
            <figure className="rev" data-reveal="fade" data-delay={i * 60} key={i}>
              <div className="rev__top"><span className="stars">{'★'.repeat(r.stars)}</span><time>{r.date}</time></div>
              <blockquote>“{r.text}”</blockquote>
              <figcaption>— {r.name}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
