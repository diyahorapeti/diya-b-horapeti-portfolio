import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * useSmoothScroll — sets up Lenis smooth scrolling driven by GSAP's ticker
 * so that Lenis and every ScrollTrigger share ONE animation loop.
 *
 * Call this once at the top of App. It respects prefers-reduced-motion:
 * if the user has requested reduced motion the hook does nothing (the
 * browser's native scroll is used instead).
 */
export function useSmoothScroll() {
  useEffect(() => {
    // Bail out for users who prefer less motion
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      // Still refresh so ScrollTrigger positions are correct
      ScrollTrigger.refresh();
      return;
    }

    // ── Create Lenis ───────────────────────────────────────────────
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });

    // Keep ScrollTrigger in sync with every Lenis scroll event
    lenis.on('scroll', ScrollTrigger.update);

    // Drive Lenis from GSAP's ticker — one shared animation loop
    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0); // prevent big jumps after tab switch

    // ── Smooth anchor-link clicks ──────────────────────────────────
    const handleAnchorClick = (e) => {
      const anchor = e.target.closest('a[href^="#"]');
      if (!anchor) return;

      const targetId = anchor.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (!target) return;

      e.preventDefault();
      // offset: -60 clears the fixed HUD bar
      lenis.scrollTo(target, { offset: -60 });
    };

    document.addEventListener('click', handleAnchorClick);

    // ── Refresh ScrollTrigger once the page is fully painted ───────
    const onLoad = () => {
      ScrollTrigger.refresh();
      // Second refresh ~800 ms later catches lazy-loaded images / fonts
      setTimeout(() => ScrollTrigger.refresh(), 800);
    };

    if (document.readyState === 'complete') {
      onLoad();
    } else {
      window.addEventListener('load', onLoad);
    }

    // ── Cleanup on unmount ─────────────────────────────────────────
    return () => {
      document.removeEventListener('click', handleAnchorClick);
      window.removeEventListener('load', onLoad);
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []); // run once on mount
}
