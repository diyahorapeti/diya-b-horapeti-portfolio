import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { personalInfo, heroContent, socialLinks } from '../data/portfolioData';

/**
 * Hero — full-viewport landing section with an animated entrance.
 * Contains the name, role, intro sentence, two CTAs, and social links.
 */
export default function Hero() {
  const sectionRef = useRef(null);

  useEffect(() => {
    // Skip heavy motion if the user prefers reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // gsap.context scopes selectors to this section and auto-cleans up
    const ctx = gsap.context(() => {
      gsap.from('[data-hero-item]', {
        y: 48,
        opacity: 0,
        duration: 1,
        stagger: 0.13,
        ease: 'power3.out',
        delay: 0.15,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="home"
      ref={sectionRef}
      className="hud-grid relative min-h-screen flex items-center pt-14 overflow-hidden"
    >
      {/* ── Decorative vertical rule on the left ── */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-signal/20 to-transparent hidden lg:block" />

      <div className="mx-auto max-w-7xl px-6 py-28 w-full">

        {/* Eyebrow */}
        <p
          data-hero-item
          className="font-mono text-xs uppercase tracking-[0.25em] text-signal mb-8 flex items-center gap-3"
        >
          <span className="w-6 h-px bg-signal inline-block" />
          {heroContent.eyebrow}
        </p>

        {/* Name — the biggest typographic element */}
        <h1
          data-hero-item
          className="font-sans text-5xl sm:text-7xl lg:text-[clamp(4rem,9vw,7.5rem)] font-bold text-bone leading-[0.95] tracking-tight mb-5"
        >
          {personalInfo.name}
        </h1>

        {/* Role */}
        <p
          data-hero-item
          className="font-mono text-base sm:text-lg uppercase tracking-[0.2em] text-signal mb-10"
        >
          {personalInfo.role}
        </p>

        {/* Intro sentence */}
        <p
          data-hero-item
          className="font-sans text-lg sm:text-xl text-dim max-w-2xl mb-14 leading-relaxed"
        >
          {heroContent.intro}
        </p>

        {/* CTA buttons */}
        <div data-hero-item className="flex flex-wrap gap-4 mb-16">
          <a
            href={heroContent.ctaPrimary.href}
            id="hero-cta-primary"
            className="hud-frame inline-flex items-center gap-2 bg-signal text-ink font-mono text-xs uppercase tracking-widest px-7 py-3.5 hover:bg-signal/85 active:scale-95 transition-all"
          >
            {heroContent.ctaPrimary.label}
            <span aria-hidden="true">→</span>
          </a>
          <a
            href={heroContent.ctaSecondary.href}
            id="hero-cta-secondary"
            className="hud-frame inline-flex items-center gap-2 border border-bone/20 text-bone font-mono text-xs uppercase tracking-widest px-7 py-3.5 hover:border-signal hover:text-signal active:scale-95 transition-all"
          >
            {heroContent.ctaSecondary.label}
          </a>
        </div>

        {/* Social links */}
        <div data-hero-item className="flex gap-6 items-center">
          {socialLinks.github && (
            <a
              href={socialLinks.github}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs uppercase tracking-widest text-dim hover:text-bone transition-colors"
            >
              GitHub ↗
            </a>
          )}
          {socialLinks.linkedin && (
            <a
              href={socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs uppercase tracking-widest text-dim hover:text-bone transition-colors"
            >
              LinkedIn ↗
            </a>
          )}
          {socialLinks.instagram && (
            <a
              href={socialLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs uppercase tracking-widest text-dim hover:text-bone transition-colors"
            >
              Instagram ↗
            </a>
          )}
        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="font-mono text-[10px] uppercase tracking-widest text-dim/50">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-dim/40 to-transparent" />
      </div>

      {/* ── Decorative city/timezone label ── */}
      <div className="absolute bottom-8 right-6 font-mono text-[10px] text-dim/30 tracking-widest hidden lg:block">
        {personalInfo.city} &nbsp;/&nbsp; {personalInfo.timezone}
      </div>
    </section>
  );
}
