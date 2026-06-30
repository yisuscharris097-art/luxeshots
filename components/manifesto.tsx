'use client';
import { contentDays } from '@/lib/data';

/** Editorial reveal — sentence with inline image "windows" that expand. */
export default function Manifesto() {
  const m1 = contentDays[5]?.image || contentDays[0]?.image || '';
  const m2 = contentDays[8]?.image || contentDays[1]?.image || '';
  return (
    <section className="manifesto">
      <div className="wrap--narrow center">
        <p data-reveal="mask">
          Step into luxury <span className="win" style={{ backgroundImage: `url(${m1})` }} /> and capture content that
          doesn&rsquo;t just look expensive — it <span className="accent">converts</span>. Every frame, shot where
          <span className="win" style={{ backgroundImage: `url(${m2})` }} /> luxury actually lives.
        </p>
        <small className="eyebrow" data-reveal="fade" data-delay="320">LuxeShots — South Florida</small>
      </div>
    </section>
  );
}
