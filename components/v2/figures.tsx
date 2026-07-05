import { contentDays, reviewsData } from '@/lib/data';

export default function Figures() {
  return (
    <section className="e2-sec">
      <div className="e2-wrap e2-figs">
        <div className="e2-fig" data-slide>
          <div className="e2-fig__n"><span data-count={reviewsData.count}>0</span></div>
          <div className="e2-fig__l">Five-star reviews</div>
        </div>
        <div className="e2-fig" data-slide data-delay="90">
          <div className="e2-fig__n">5.00</div>
          <div className="e2-fig__l">Average rating</div>
        </div>
        <div className="e2-fig" data-slide data-delay="180">
          <div className="e2-fig__n"><span data-count={contentDays.length}>0</span></div>
          <div className="e2-fig__l">Luxury listings</div>
        </div>
        <div className="e2-fig" data-slide data-delay="270">
          <div className="e2-fig__n"><span className="u">$</span><span data-count="1500">0</span></div>
          <div className="e2-fig__l">Value — yours free</div>
        </div>
      </div>
    </section>
  );
}
