'use client';
import { useState } from 'react';
import { faqs } from '@/lib/data';

export default function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section className="faq">
      <div className="wrap--narrow">
        <p className="eyebrow center">Still Not Sure?</p>
        <h2 className="display display--md center" data-split style={{ marginTop: '.8rem' }}>Frequently Asked Questions</h2>
        <div className="faq__list">
          {faqs.map((f, i) => (
            <div className={`faq__item${open === i ? ' open' : ''}`} key={i}>
              <button className="faq__q is-link" aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}>
                <h3>{f.q}</h3><span className="pm" aria-hidden="true">+</span>
              </button>
              <div className="faq__a"><div><p>{f.a}</p></div></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
