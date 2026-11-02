import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { experience } from '../data/portfolioData';
import ScrambleText from './ScrambleText';

// ── TimelineEntry ─────────────────────────────────────────────────────────────
/**
 * One row on the timeline.
 *
 * Animation is driven from the parent Journey component's gsap.context so that
 * all ScrollTriggers are tracked together and cleaned up in one revert() call.
 * This component is purely presentational — it only renders markup.
 *
 * The item <li> receives the class "is-on" via ScrollTrigger when the
 * scroll fill line reaches it. Tailwind arbitrary-variant selectors:
 *   [&.is-on_.node]:bg-signal   — node turns solid signal orange
 *   [&.is-on_.node]:scale-100   — node scales up to full size
 */
function TimelineEntry({ entry, itemRef }) {
  return (
    <li
      ref={itemRef}
      /* Arbitrary Tailwind variants that fire when is-on is present on this li */
      className="
        relative pb-16 last:pb-0
        [&.is-on_.node]:bg-signal
        [&.is-on_.node]:scale-100
        [&.is-on_.node]:border-signal
      "
    >
      {/* ── Timeline node — 15 px square, sits on the left line ── */}
      <div
        aria-hidden="true"
        /* "node" is the plain class name targeted by the arbitrary variants above */
        className="
          node
          absolute -left-[7.5px] top-[6px]
          w-[15px] h-[15px]
          border border-signal bg-ink
          scale-75
          transition-all duration-300 ease-out
        "
      />

      {/* ── Content ── */}
      <div className="pl-2">
        {/* Period */}
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-dim mb-2">
          {entry.period}
        </p>

        {/* Role */}
        <h3 className="text-2xl md:text-3xl font-bold text-bone leading-tight mb-1">
          {entry.role}
        </h3>

        {/* Organisation */}
        <p className="font-mono text-sm text-signal mb-4">
          {entry.org}
        </p>

        {/* Description */}
        <p className="text-bone/70 leading-relaxed max-w-xl">
          {entry.description}
        </p>
      </div>
    </li>
  );
}

// ── Journey ───────────────────────────────────────────────────────────────────
/**
 * Journey section — two-column layout on large screens.
 *
 * Left col: sticky heading (03 / Journey + h2).
 * Right col: ordered list with:
 *   - a full-height 1px base line (bg-bone/15)
 *   - a signal-orange fill line on top that scaleY 0→1 with scroll
 *   - per-item node activation (is-on class) and entrance fade animations
 *
 * ALL ScrollTriggers are created inside one gsap.context() so ctx.revert()
 * cleans them all up reliably on unmount.
 */
export default function Journey() {
  const sectionRef  = useRef(null);
  const fillLineRef = useRef(null);
  // Map of index → DOM node; populated by callback refs during mount
  const itemNodes   = useRef(new Map());

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      const fillLine = fillLineRef.current;

      // ── Fill line — scaleY 0 → 1 tied to scroll ──────────────────────────
      if (fillLine) {
        gsap.fromTo(
          fillLine,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: fillLine.parentElement, // the relative container
              start: 'top 70%',
              end:   'bottom 60%',
              scrub: true,
            },
          }
        );
      }

      // ── Per-item: node activation + entrance fade ─────────────────────────
      itemNodes.current.forEach((item) => {
        if (!item) return;

        // Node activation: add/remove is-on class as the user scrolls
        ScrollTrigger.create({
          trigger: item,
          start: 'top 65%',
          onEnter:     () => item.classList.add('is-on'),
          onLeaveBack: () => item.classList.remove('is-on'),
        });

        // Entrance fade — x 30 → 0, fires once and never reverses
        gsap.fromTo(
          item,
          { x: 30, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.75,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 85%',
              once: true,
            },
          }
        );
      });
    }, sectionRef); // scope: sectionRef — ctx.revert() kills every ST inside

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="journey"
      ref={sectionRef}
      className="px-5 md:px-10 py-28 md:py-40"
    >
      {/* ── Two-column grid ── */}
      <div className="max-w-[1440px] mx-auto grid lg:grid-cols-[0.8fr_1.2fr] gap-12 lg:gap-20">

        {/* ── LEFT — sticky heading ── */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <ScrambleText
            text="03 / Journey"
            className="block font-mono text-xs uppercase tracking-[0.3em] text-signal mb-6"
          />

          <h2
            className="font-bold leading-[1.02] tracking-[-0.03em] text-bone"
            style={{ fontSize: 'clamp(2.4rem, 5vw, 4.5rem)' }}
          >
            Where I&#39;ve been learning and building.
          </h2>
        </div>

        {/* ── RIGHT — animated timeline ── */}
        <div className="relative pl-10">

          {/* Base vertical line — full height, faint */}
          <div
            aria-hidden="true"
            className="absolute left-0 top-0 bottom-0 w-px bg-bone/15"
          />

          {/* Fill line — signal orange, grows from top with scroll */}
          <div
            ref={fillLineRef}
            aria-hidden="true"
            className="absolute left-0 top-0 bottom-0 w-px bg-signal origin-top"
            style={{ transform: 'scaleY(0)' }}
          />

          {/* Timeline entries */}
          {/*
            Callback ref registers the DOM node in the Map without
            touching .current during render — avoids the react/refs lint rule.
          */}
          <ol>
            {experience.map((entry, i) => (
              <TimelineEntry
                key={i}
                entry={entry}
                itemRef={(node) => {
                  if (node) itemNodes.current.set(i, node);
                  else itemNodes.current.delete(i);
                }}
              />
            ))}
          </ol>
        </div>

      </div>
    </section>
  );
}
