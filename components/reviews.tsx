'use client';
import { reviewsData } from '@/lib/data';

export default function Reviews() {
  return (
    <section className="reviews" id="reviews">
      <div className="wrap">
        <div className="center">
          <p className="eyebrow">Loved by Realtors</p>
          <h2 className="display display--md" data-split style={{ marginTop: '.8rem' }}>What Our Clients Say</h2>
          <div className="reviews__score">
            <span className="num">{reviewsData.rating.toFixed(2)}</span>
            <div style={{ textAlign: 'left' }}>
              <div className="stars" style={{ fontSize: '1.2rem' }}>★★★★★</div>
              <div style={{ color: 'var(--muted)', fontSize: '.84rem', marginTop: '.3rem' }}>
                <span data-count={String(reviewsData.count)}>0</span> reviews
              </div>
            </div>
          </div>
        </div>

        <div className="reviews__ai" data-reveal="fade" data-delay="60">
          <div className="k">✦ AI Summary</div>
          <p className="lede" style={{ color: 'var(--paper)', opacity: 0.9 }}>{reviewsData.aiSummary}</p>
        </div>

        <div className="reviews__grid">
          {reviewsData.items.map((r, i) => (
            <figure className="rev" data-reveal="fade" data-delay={String(i * 60)} key={i}>
              <div className="rev__top">
                <span className="stars">{'★'.repeat(r.stars)}</span>
                <time>{new Date(r.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</time>
              </div>
              <blockquote>&ldquo;{r.text}&rdquo;</blockquote>
              <figcaption>— {r.name}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
