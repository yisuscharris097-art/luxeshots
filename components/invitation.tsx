'use client';
import Reveal from './reveal';
import Mask from './mask';

const bullets = [
  'Look like a luxury agent — even before your first high-end listing',
  'Build a scroll-stopping brand that attracts clients',
  'Finally get content you’re proud to post',
  'Get found, followed, and referred',
  'Be seen as a leader in your market',
];

export default function Invitation() {
  return (
    <section className="bg-ink-2 py-20 md:py-28 px-5 md:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <Reveal>
          <span className="inline-flex items-center gap-3 text-gold uppercase tracking-[0.3em] text-xs font-semibold">
            <span className="w-8 h-px bg-gold" /> Your Invitation <span className="w-8 h-px bg-gold" />
          </span>
        </Reveal>
        <Mask as="h2" split="lines" className="mt-5 font-serif text-paper" style={{ fontSize: 'clamp(2rem,5vw,4rem)' }}>
          This Is Your Invitation To
        </Mask>

        <ul className="mt-10 grid gap-3 text-left max-w-2xl mx-auto">
          {bullets.map((b, i) => (
            <Reveal key={i} delay={i * 0.06}>
              <li className="flex items-start gap-4 border-b border-line pb-4">
                <span className="text-gold mt-1.5 text-sm">◆</span>
                <span className="text-paper text-lg md:text-xl">{b}</span>
              </li>
            </Reveal>
          ))}
        </ul>

        <Reveal delay={0.1}>
          <a href="https://luxeshots.as.me/" target="_blank" rel="noopener noreferrer" className="mt-10 inline-block bg-gold text-ink font-sans font-bold uppercase tracking-[0.1em] text-sm px-10 py-4 transition-colors duration-300 hover:bg-gold-bright">
            RSVP — Reserve Your Spot
          </a>
        </Reveal>
      </div>
    </section>
  );
}
