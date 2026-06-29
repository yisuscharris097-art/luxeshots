'use client';
import { ReactNode, useEffect, useRef, ElementType } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

/**
 * MASK — line/word reveal with overflow mask (adapted from the project's
 * animated-copy.js). Cinematic: power3.out, no bounce. Honors reduced-motion.
 */
export default function Mask({
  children,
  as: Tag = 'div',
  split = 'lines',
  delay = 0,
  duration = 0.9,
  stagger = 0.1,
  start = 'top 75%',
  scroll = true,
  className,
  style,
}: {
  children: ReactNode;
  as?: ElementType;
  split?: 'lines' | 'words';
  delay?: number;
  duration?: number;
  stagger?: number;
  start?: string;
  scroll?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.registerPlugin(ScrollTrigger, SplitText);

    let st: ScrollTrigger | undefined;
    let split_: SplitText | undefined;

    const run = () => {
      split_ = SplitText.create(el, {
        type: split,
        mask: split,
        autoSplit: true,
        linesClass: 'split-line',
        wordsClass: 'split-word',
        onSplit(self: SplitText) {
          const targets = split === 'words' ? self.words : self.lines;
          gsap.set(targets, { yPercent: 100 });
          const anim = gsap.to(targets, {
            yPercent: 0, duration, ease: 'power3.out', delay, stagger,
            paused: scroll,
          });
          if (scroll) {
            st = ScrollTrigger.create({
              trigger: el, start, animation: anim,
              toggleActions: 'play none none none',
            });
          }
          return anim;
        },
      });
    };

    const fonts = (document as any).fonts?.ready;
    if (fonts?.then) fonts.then(run);
    else run();

    return () => {
      st?.kill();
      split_?.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Tag ref={ref as any} className={className} style={style}>
      {children}
    </Tag>
  );
}
