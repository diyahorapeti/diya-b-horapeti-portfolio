import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { experience } from '../data/portfolioData';

/**
 * TimelineEntry — one role/education card on the vertical timeline.
 */
function TimelineEntry({ entry }) {
  return (
    <div
      data-journey-item
      className="relative pl-10 pb-14 last:pb-0 border-l border-bone/10"
    >
      {/* Diamond dot on the timeline line */}
      <div
        className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rotate-45 border-2 border-signal bg-ink"
        aria-hidden="true"
      />

      {/* Period */}
      <p className="font-mono text-xs uppercase tracking-widest text-signal mb-2">
        {entry.period}
      </p>

      {/* Role */}
      <h3 className="font-sans text-xl font-bold text-bone mb-1">{entry.role}</h3>

      {/* Organisation */}
      <p className="font-mono text-xs uppercase tracking-widest text-dim mb-4">
        {entry.org}
      </p>

      {/* Description */}
      <p className="font-sans text-sm text-dim leading-relaxed max-w-lg">
        {entry.description}
      </p>
    </div>
  );
}

/**
 * Journey — vertical timeline of work experience and education.
 */
export default function Journey() {
  const sectionRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      gsap.from('[data-journey-item]', {
        x: -24,
        opacity: 0,
        duration: 0.8,
        stagger: 0.16,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 78%',
          once: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="journey" ref={sectionRef} className="py-28 border-t border-bone/10">
      <div className="mx-auto max-w-7xl px-6">

        {/* Label */}
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-signal mb-8 flex items-center gap-3">
          <span className="w-6 h-px bg-signal inline-block" />
          04 / Journey
        </p>

        <h2 className="font-sans text-4xl sm:text-5xl font-bold text-bone mb-16 leading-tight">
          Experience &amp; education.
        </h2>

        {/* Timeline */}
        <div className="max-w-2xl ml-2">
          {experience.map((entry, i) => (
            <TimelineEntry key={i} entry={entry} />
          ))}
        </div>
      </div>
    </section>
  );
}
