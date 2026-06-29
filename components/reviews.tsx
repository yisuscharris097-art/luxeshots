'use client';
import { useEffect, useRef, useState } from 'react';
import { reviewsData } from '@/lib/data';
import Reveal from './reveal';
import Mask from './mask';

const Stars = ({ n = 5 }: { n?: number }) => (
  <span className="text-gold tracking-[0.15em]" aria-hidden>{'★'.repeat(n)}</span>
);

export default function Reviews() {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) return;
      const target = reviewsData.count;
      const t0 = performance.now();
      const dur = 1500;
      const tick = (t: number) => {
        const p = Math.min(1, (t - t0) / dur);
        setCount(Math.round(target * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      io.disconnect();
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section className="bg-ink-2 py-20 md:py-32 px-5 md:px-8">
      <div className="max-w-5xl mx-auto">
        <div ref={ref} className="flex flex-col items-center text-center">
          <p className="text-gold uppercase tracking-[0.3em] text-xs font-semibold">Loved by Realtors</p>
          <Mask as="h2" split="lines" className="mt-4 font-serif text-paper leading-[1.04]" style={{ fontSize: 'clamp(2rem,5vw,3.6rem)' }}>
            What Our Clients Say
          </Mask>
          <div className="mt-7 flex items-center gap-4">
            <span className="font-sans font-extrabold text-gold text-5xl md:text-6xl tabular-nums leading-none">{reviewsData.rating.toFixed(2)}</span>
            <div className="text-left">
              <div className="text-xl"><Stars /></div>
              <div className="text-paper-muted text-sm tabular-nums mt-1">{count.toLocaleString('en-US')} reviews</div>
            </div>
          </div>
        </div>

        <Reveal delay={0.05}>
          <div className="mt-12 mx-auto max-w-3xl bg-ink/60 ring-1 ring-line p-7 rounded-sm">
            <p className="text-gold text-xs uppercase tracking-[0.22em] font-semibold mb-3">✦ AI Summary</p>
            <p className="text-paper-muted leading-relaxed">{reviewsData.aiSummary}</p>
          </div>
        </Reveal>

        <div className="mt-8 grid md:grid-cols-2 gap-4 md:gap-5">
          {reviewsData.items.map((r, i) => (
            <Reveal key={i} delay={i * 0.05}>
              <figure className="bg-ink/50 ring-1 ring-line p-6 rounded-sm h-full flex flex-col">
                <div className="flex items-center justify-between">
                  <Stars n={r.stars} />
                  <span className="text-paper-muted text-xs">
                    {new Date(r.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <blockquote className="text-paper mt-4 leading-relaxed flex-1">&ldquo;{r.text}&rdquo;</blockquote>
                <figcaption className="text-paper-muted text-sm mt-5 font-medium tracking-wide">— {r.name}</figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
