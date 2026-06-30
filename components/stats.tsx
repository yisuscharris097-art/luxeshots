'use client';
import { reviewsData, contentDays } from '@/lib/data';

export default function Stats() {
  return (
    <section className="stats">
      <div className="wrap stats__grid">
        <div className="stat">
          <div className="stat__n" data-count={String(reviewsData.count)} data-suffix="★">0</div>
          <div className="stat__l eyebrow">Five-Star Reviews</div>
        </div>
        <div className="stat">
          <div className="stat__n" data-count={String(contentDays.length)}>0</div>
          <div className="stat__l eyebrow">Luxury Listings</div>
        </div>
        <div className="stat">
          <div className="stat__n" data-count="1500" data-prefix="$" data-suffix="+">0</div>
          <div className="stat__l eyebrow">Value — Yours Free</div>
        </div>
      </div>
    </section>
  );
}
