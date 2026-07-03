'use client';
import { contentDays, reviewsData } from '@/lib/data';

export default function Stats() {
  return (
    <section className="stats">
      <div className="wrap stats__grid">
        <div className="stat" data-reveal="fade">
          <div className="stat__n" data-count={reviewsData.count} data-suffix="★">0</div>
          <div className="stat__l eyebrow">Five-Star Reviews</div>
        </div>
        <div className="stat" data-reveal="fade" data-delay="120">
          <div className="stat__n" data-count={contentDays.length}>0</div>
          <div className="stat__l eyebrow">Luxury Listings</div>
        </div>
        <div className="stat" data-reveal="fade" data-delay="240">
          <div className="stat__n" data-count="1500" data-prefix="$" data-suffix="+">0</div>
          <div className="stat__l eyebrow">Value — Yours Free</div>
        </div>
      </div>
    </section>
  );
}
