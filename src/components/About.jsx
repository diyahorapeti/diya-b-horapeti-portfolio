import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { aboutContent, skillGroups } from '../data/portfolioData';

/**
 * useCounter — animates from 0 to `target` once `active` becomes true.
 * Uses a cubic ease-out for a natural deceleration feel.
 */
function useCounter(target, active) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;
    const DURATION = 1400; // ms
    const startTime = performance.now();

    const step = (now) => {
      const progress = Math.min((now - startTime) / DURATION, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }, [active, target]);

  return count;
}

/**
 * StatCard — a single animated counter card.
 * Starts counting when scrolled into view.
 */
function StatCard({ value, suffix, label }) {
  const [active, setActive] = useState(false);
  const count = useCounter(value, active);
  const ref = useRef(null);

  useEffect(() => {
    const trigger = ScrollTrigger.create({
      trigger: ref.current,
      start: 'top 88%',
      once: true,           // never re-trigger — value stays visible
      onEnter: () => setActive(true),
    });
    return () => trigger.kill();
  }, []);

  return (
    <div ref={ref} className="hud-frame p-6 border border-bone/10 bg-panel">
      <p className="font-sans text-4xl font-bold text-bone mb-2 tabular-nums">
        {count}
        <span className="text-signal">{suffix}</span>
      </p>
      <p className="font-mono text-xs uppercase tracking-widest text-dim">{label}</p>
    </div>
  );
}

/**
 * About — biography, animated stat counters, and a 4-column skills grid.
 */
export default function About() {
  const sectionRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      gsap.from('[data-about-item]', {
        y: 32,
        opacity: 0,
        duration: 0.85,
        stagger: 0.1,
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
    <section id="about" ref={sectionRef} className="py-28 border-t border-bone/10">
      <div className="mx-auto max-w-7xl px-6">

        {/* ── Label ── */}
        <p
          data-about-item
          className="font-mono text-xs uppercase tracking-[0.25em] text-signal mb-8 flex items-center gap-3"
        >
          <span className="w-6 h-px bg-signal inline-block" />
          {aboutContent.label}
        </p>

        {/* ── Heading + paragraph ── */}
        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          <h2
            data-about-item
            className="font-sans text-4xl sm:text-5xl font-bold text-bone leading-tight"
          >
            {aboutContent.heading}
          </h2>
          <p
            data-about-item
            className="font-sans text-dim text-lg leading-relaxed self-center"
          >
            {aboutContent.paragraph}
          </p>
        </div>

        {/* ── Animated stat counters ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-24">
          {aboutContent.stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>

        {/* ── Skills grid ── */}
        <div data-about-item>
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-signal mb-8 flex items-center gap-3">
            <span className="w-6 h-px bg-signal inline-block" />
            02 / Skills
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {skillGroups.map((group) => (
              <div
                key={group.title}
                className="hud-frame border border-bone/10 bg-panel p-5"
              >
                <p className="font-mono text-xs uppercase tracking-widest text-signal mb-5">
                  {group.title}
                </p>
                <ul className="space-y-2.5">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="font-sans text-sm text-bone/80 flex items-center gap-2.5"
                    >
                      {/* Signal-orange bullet */}
                      <span className="w-1.5 h-1.5 bg-signal flex-shrink-0" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
