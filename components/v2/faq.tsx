'use client';
import { useState } from 'react';
import { faqs } from '@/lib/data';

export default function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section className="e2-sec e2-dark">
      <div className="e2-wrap">
        <div className="e2-faq__head">
          <span className="e2-kick" data-slide>Questions</span>
          <h2 className="e2-disp e2-lg" data-slide data-delay="60" style={{ marginTop: '1.2rem' }}>Still not sure?</h2>
        </div>
        <div className="e2-faq__list">
          {faqs.map((f, i) => (
            <div className={`e2-faq__item${open === i ? ' open' : ''}`} data-fade data-delay={i * 60} key={i}>
              <button className="e2-faq__q" aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}>
                <h3>{f.q}</h3><span className="pm" aria-hidden />
              </button>
              <div className="e2-faq__a"><div><p>{f.a}</p></div></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
