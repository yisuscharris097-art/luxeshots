import { reviewsData } from '@/lib/data';

export default function Voices() {
  return (
    <section className="e2-sec e2-dark">
      <div className="e2-wrap">
        <span className="e2-kick" data-slide>04 — Loved by realtors</span>
        <div className="e2-voices__grid">
          {reviewsData.items.slice(0, 3).map((r, i) => (
            <figure className="e2-voice" data-slide data-delay={i * 90} key={i}>
              <blockquote>“{r.text}”</blockquote>
              <figcaption>— {r.name}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
