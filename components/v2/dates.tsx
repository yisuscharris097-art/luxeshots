import { contentDays } from '@/lib/data';

const RSVP = 'https://luxeshots.as.me/';
const parseTs = (date: string) => {
  const m = date.match(/(\d{1,2})\/(\d{1,2})\/(\d{2})/);
  return m ? new Date(2000 + +m[3], +m[1] - 1, +m[2], 9, 0, 0).getTime() : 0;
};
const shortDate = (date: string) => {
  const wd = (date.split(',')[0] || '').slice(0, 3);
  const m = date.match(/\d{1,2}\/\d{1,2}\/\d{2}/);
  return `${wd} ${m ? m[0] : ''}`.trim();
};

export default function Reserve() {
  const all = [...contentDays].map((c) => ({ ...c, t: parseTs(c.date) }));
  const up = all.filter((c) => c.t >= Date.now() - 864e5).sort((a, b) => a.t - b.t);
  const list = (up.length >= 4 ? up : all.sort((a, b) => a.t - b.t)).slice(0, 6);

  return (
    <section className="e2-sec" id="reserve">
      <div className="e2-wrap">
        <div className="e2-reserve__head">
          <div>
            <span className="e2-kick" data-slide>The Dates</span>
            <h2 className="e2-disp e2-xl" data-slide data-delay="60" style={{ marginTop: '1.2rem' }}>Reserve a date.</h2>
          </div>
          <p className="e2-lede" data-fade data-delay="150" style={{ maxWidth: '24rem' }}>
            Pick a listing. Each session yields a complete content library — yours, free.
          </p>
        </div>

        <div className="e2-plates">
          {list.map((c, i) => (
            <a className="e2-plate" data-slide data-delay={i * 90} key={i} href={c.rsvp || RSVP} target="_blank" rel="noopener noreferrer">
              <div className="e2-plate__top">
                <span className="e2-plate__date">{shortDate(c.date)}</span>
                {c.commercial && <span className="e2-plate__date">Commercial</span>}
              </div>
              <div className="e2-plate__img">
                <i style={{ backgroundImage: `url(${c.image})` }} />
              </div>
              <div className="e2-plate__body">
                <div>
                  <div className="e2-plate__city">{c.city}</div>
                  <div className="e2-plate__addr">{c.address}</div>
                  <span className="e2-plate__go">Reserve this date <span className="a">→</span></span>
                </div>
                <div className="e2-plate__price">{c.price}</div>
              </div>
            </a>
          ))}
        </div>

        <div className="e2-reserve__more">
          <a className="e2-btn e2-btn--ghost" href={RSVP} target="_blank" rel="noopener noreferrer">See all dates <span className="a">→</span></a>
        </div>
      </div>
    </section>
  );
}
