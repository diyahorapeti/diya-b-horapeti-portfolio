import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { personalInfo, aboutContent, skillGroups } from '../data/portfolioData';
import ScrambleText from './ScrambleText';

// ── Portrait image ─────────────────────────────────────────────────────────
// Load all matching files; the component shows a placeholder if none exist.
const portraitModules = import.meta.glob(
  '../assets/about/about-portrait.*',
  { eager: true }
);
const portraitSrc =
  Object.values(portraitModules)[0]?.default ?? null;

// ── Animated counter ───────────────────────────────────────────────────────

/**
 * useCounter — ramps from 0 to `target` with an ease-out curve
 * once `active` flips to true. Plays only once.
 */
function useCounter(target, active) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;

    const DURATION = 1600; // ms — matches spec
    const startTime = performance.now();

    const step = (now) => {
      const progress = Math.min((now - startTime) / DURATION, 1);
      // ease power2.out: deceleration curve
      const eased = 1 - Math.pow(1 - progress, 2);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }, [active, target]);

  return count;
}

/**
 * StatItem — one stat cell; starts counting when scrolled into view.
 */
function StatItem({ value, suffix, label }) {
  const [active, setActive] = useState(false);
  const count = useCounter(value, active);
  const ref = useRef(null);

  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: ref.current,
      start: 'top 85%',
      once: true,
      onEnter: () => setActive(true),
    });
    return () => st.kill();
  }, []);

  return (
    <div ref={ref} className="flex flex-col gap-2 px-6 py-8 text-center lg:text-left">
      {/* Number + suffix */}
      <dt className="text-4xl md:text-6xl font-bold tabular-nums text-bone leading-none">
        {count}
        <span className="text-signal">{suffix}</span>
      </dt>
      {/* Label */}
      <dd className="font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] text-dim">
        {label}
      </dd>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

/**
 * About — bio section with portrait, animated stat counters, and skill modules.
 *
 * Structure:
 *   • Section label (ScrambleText, trigger="view")
 *   • Two-column layout: portrait left, text + stats + skills right
 *   • Skill modules grid: gap-px to make 1-px dividers between tiles
 *   • ScrollTrigger reveal animation on data-about="reveal" elements
 */
export default function About() {
  const sectionRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      gsap.from('[data-about="reveal"]', {
        opacity: 0,
        y: 40,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          once: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="w-full px-5 md:px-10 py-28 md:py-40 border-t border-bone/10"
    >
      <div className="max-w-[1440px] mx-auto">

        {/* ── Section label ─────────────────────────────────────────── */}
        <div data-about="reveal" className="mb-10">
          <ScrambleText
            text={aboutContent.label}
            trigger="view"
            className="font-mono text-xs uppercase tracking-[0.3em] text-signal"
          />
        </div>

        {/* ── Two-column grid ───────────────────────────────────────── */}
        <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-12 lg:gap-20 items-start">

          {/* ══ LEFT — portrait ════════════════════════════════════════ */}
          <div data-about="reveal">
            <div className="hud-frame relative aspect-[4/5] max-w-[420px] border border-bone/10 bg-panel overflow-hidden">
              {portraitSrc ? (
                <>
                  {/* Greyscale photo with extra contrast */}
                  <img
                    src={portraitSrc}
                    alt="Diya B Horapeti — Data Analyst, TAP Academy student"
                    className="absolute inset-0 w-full h-full object-cover grayscale contrast-125"
                    draggable={false}
                  />
                  {/* Signal-orange tint overlay */}
                  <div
                    className="absolute inset-0 bg-signal opacity-25"
                    style={{ mixBlendMode: 'multiply' }}
                    aria-hidden="true"
                  />
                </>
              ) : (
                /* Placeholder when portrait file is missing */
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-mono text-xs uppercase tracking-[0.2em] text-dim/40">
                    portrait.missing
                  </span>
                </div>
              )}

              {/* Bottom-left ID label */}
              <span
                className="absolute bottom-3 left-3 z-10 font-mono text-[10px] uppercase tracking-[0.2em] text-bone/50 pointer-events-none select-none"
                aria-hidden="true"
              >
                ID · {personalInfo.brandName}
              </span>
            </div>
          </div>

          {/* ══ RIGHT — text, stats, skills ════════════════════════════ */}
          <div className="flex flex-col gap-10">

            {/* Heading */}
            <h2
              data-about="reveal"
              className="text-[clamp(2.2rem,5vw,4.5rem)] font-bold leading-[1.02] tracking-[-0.03em] text-bone"
            >
              {aboutContent.heading}
            </h2>

            {/* Paragraph */}
            <p
              data-about="reveal"
              className="text-lg md:text-xl leading-relaxed text-bone/75 max-w-2xl"
            >
              {aboutContent.paragraph}
            </p>

            {/* ── Stats — 3-col between two 1-px lines ───────────────── */}
            <dl
              data-about="reveal"
              className="grid grid-cols-3 border-y border-bone/10 divide-x divide-bone/10"
            >
              {aboutContent.stats.map((stat) => (
                <StatItem key={stat.label} {...stat} />
              ))}
            </dl>

            {/* ── Skill modules ─────────────────────────────────────── */}
            <div data-about="reveal">
              {/*
                gap-px on a bg-bone/10 wrapper creates 1-px dividing lines
                between tiles; each tile uses bg-ink to "cut out" from the gap
              */}
              <div className="grid sm:grid-cols-2 gap-px bg-bone/10 border border-bone/10">
                {skillGroups.map((group, i) => (
                  <div
                    key={group.title}
                    className="bg-ink p-6 hover:bg-panel transition-colors duration-200"
                  >
                    {/* Module header row */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-signal">
                        {group.title}
                      </span>
                      <span className="font-mono text-[11px] text-dim">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                    </div>

                    {/* Skill tags */}
                    <div className="flex flex-wrap gap-2">
                      {group.items.map((item) => (
                        <span
                          key={item}
                          className="border border-bone/15 px-2.5 py-1 font-mono text-xs text-bone/70"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
