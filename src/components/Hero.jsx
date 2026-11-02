import { lazy, Suspense, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { personalInfo, heroContent } from '../data/portfolioData';
import ScrambleText from './ScrambleText';

// Three.js scene loads in its own JS chunk — keeps the initial bundle light
const HeroScene = lazy(() => import('./HeroScene'));

/**
 * Hero — full-viewport landing section.
 *
 * Left column : eyebrow · name (scramble decoded) · divider · role + intro · CTAs
 * Right column : three.js HeroScene inside a .hud-frame box with corner labels
 * Bottom strip : availability status + scroll indicator
 */
export default function Hero() {
  const sectionRef = useRef(null);
  const dividerRef = useRef(null);

  // Split "Diya B Horapeti" → ["Diya", "B Horapeti"]
  const nameParts = personalInfo.name.trim().split(/\s+/);
  const nameFirst = nameParts[0];                       // solid bone
  const nameRest  = nameParts.slice(1).join('\u00a0');  // outlined, non-breaking spaces

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      // gsap.fromTo guarantees the final state (opacity:1, y:0) even if
      // ctx.revert() + remount happens in React 18 StrictMode.
      gsap.fromTo(
        '[data-hero="fade"]',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          stagger: 0.12,
          delay: 0.3,
          clearProps: 'opacity,transform', // remove inline styles when done
        }
      );

      // Divider draws from the left
      gsap.fromTo(
        dividerRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          transformOrigin: 'left center',
          duration: 1.2,
          ease: 'power3.inOut',
          delay: 0.3,
          clearProps: 'transform',
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="home"
      ref={sectionRef}
      className="hud-grid relative min-h-screen flex flex-col overflow-hidden px-5 md:px-10 pt-24 pb-10"
    >
      {/* ── Two-column grid ─────────────────────────────────────────── */}
      <div className="max-w-[1440px] mx-auto w-full grid lg:grid-cols-[1.1fr_0.9fr] items-center gap-10 flex-1">

        {/* ══ LEFT COLUMN — the wrapper fades as one unit ══════════════════ */}
        <div data-hero="fade" className="flex flex-col gap-6">

          {/* Eyebrow — inside the fading wrapper, no separate fade needed */}
          <p
            className="font-mono text-xs uppercase tracking-[0.3em] text-signal"
          >
            {heroContent.eyebrow}
          </p>

          {/* Name — two-line, first solid, rest outlined.
              The h1 itself is NOT faded by GSAP — only the column wrapper
              is, so the name always has a guaranteed visible final state. */}
          <h1
            className="text-[clamp(3.2rem,11vw,9.5rem)] font-bold uppercase leading-[0.88] tracking-[-0.04em]"
          >
            {/* First word: solid bone */}
            <ScrambleText
              as="span"
              text={nameFirst}
              trigger="mount"
              delay={200}
              className="block text-bone"
            />

            {/* Rest: outlined with webkit-text-stroke */}
            <ScrambleText
              as="span"
              text={nameRest}
              trigger="mount"
              delay={500}
              className="block text-transparent"
              style={{ WebkitTextStroke: '1.5px #e8e6df' }}
            />
          </h1>

          {/* Divider — animates scaleX 0→1 from the left */}
          <div
            ref={dividerRef}
            className="h-px max-w-xl bg-bone/25"
          />

          {/* Role + intro */}
          <div className="flex flex-col gap-3">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-dim">
              {personalInfo.role}
            </p>
            <p className="text-lg md:text-xl text-bone/85 leading-relaxed max-w-lg">
              {heroContent.intro}
            </p>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-3 mt-2">
            {/* Primary — signal fill, hover to bone */}
            <a
              href={heroContent.ctaPrimary.href}
              className="group inline-flex items-center gap-2 bg-signal text-ink hover:bg-bone font-mono text-xs font-semibold uppercase tracking-[0.2em] px-6 py-3.5 transition-colors duration-200"
            >
              {heroContent.ctaPrimary.label}
              <span
                aria-hidden="true"
                className="transition-transform duration-200 group-hover:translate-x-1"
              >
                →
              </span>
            </a>

            {/* Secondary — ghost border, hover to signal */}
            <a
              href={heroContent.ctaSecondary.href}
              className="inline-flex items-center gap-2 border border-bone/30 text-bone hover:border-signal hover:text-signal font-mono text-xs font-semibold uppercase tracking-[0.2em] px-6 py-3.5 transition-colors duration-200"
            >
              {heroContent.ctaSecondary.label}
            </a>
          </div>
        </div>

        {/* ══ RIGHT COLUMN ═════════════════════════════════════════════ */}
        <div
          data-hero="fade"
          className="hud-frame relative border border-bone/10 bg-panel/40 h-[48vh] min-h-[320px] lg:h-[70vh]"
        >
          {/* Top-left corner label */}
          <span
            className="absolute top-3 left-3 z-10 font-mono text-[10px] uppercase tracking-[0.25em] text-dim pointer-events-none select-none"
          >
            core.view — drag to rotate
          </span>

          {/* The 3D scene — fills the box, Three.js loads in a separate chunk */}
          <Suspense fallback={null}>
            <HeroScene />
          </Suspense>

          {/* Bottom-right corner label */}
          <span
            className="absolute bottom-3 right-3 z-10 font-mono text-[10px] uppercase tracking-[0.25em] text-dim pointer-events-none select-none"
          >
            {personalInfo.city}
          </span>
        </div>
      </div>

      {/* ── Bottom strip ────────────────────────────────────────────── */}
      <div className="max-w-[1440px] mx-auto w-full mt-10 border-t border-bone/10 pt-5 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.2em] text-dim">
        {/* Availability */}
        <div className="flex items-center gap-2.5">
          {/* Pulsing signal dot */}
          <span className="relative flex h-1.5 w-1.5 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-signal" />
          </span>
          {personalInfo.availability}
        </div>

        {/* Scroll indicator — visible from sm */}
        <span className="hidden sm:block">Scroll ↓</span>
      </div>
    </section>
  );
}
