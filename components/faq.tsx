'use client';
import { useState } from 'react';
import { faqs } from '@/lib/data';
import Mask from './mask';

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="bg-ink py-20 md:py-32 px-5 md:px-8">
      <div className="max-w-3xl mx-auto">
        <p className="text-center text-gold uppercase tracking-[0.3em] text-xs font-semibold">Still Not Sure?</p>
        <Mask as="h2" split="lines" className="mt-4 font-serif text-center text-paper leading-[1.04]" style={{ fontSize: 'clamp(2rem,5vw,3.6rem)' }}>
          Frequently Asked Questions
        </Mask>

        <div className="mt-12 border-t border-line">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={i} className="border-b border-line">
                <button onClick={() => setOpen(isOpen ? null : i)} className="w-full flex items-center justify-between gap-6 py-6 text-left group" aria-expanded={isOpen}>
                  <span className={`font-sans font-medium text-lg md:text-xl transition-colors duration-300 ${isOpen ? 'text-gold' : 'text-paper group-hover:text-gold-bright'}`}>{f.q}</span>
                  <span className={`text-gold text-2xl font-light shrink-0 transition-transform duration-500 ${isOpen ? 'rotate-45' : ''}`}>+</span>
                </button>
                <div className="grid transition-[grid-template-rows] duration-500 ease-out" style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}>
                  <div className="overflow-hidden">
                    <p className="text-paper-muted leading-relaxed pb-6 pr-8 max-w-2xl">{f.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
