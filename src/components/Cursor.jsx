import { useEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * Cursor — crosshair-style custom cursor with:
 *   • a 6px signal-orange dot that snaps instantly to the pointer
 *   • a 36px ring (bone/60 border) that follows with a spring delay
 *
 * Only activates on fine-pointer (desktop mouse) devices without
 * prefers-reduced-motion. Adds `.has-cursor` to <body> so index.css
 * hides the native OS cursor.
 *
 * Hover effect: ring scales up and turns signal-orange over interactive
 * elements (a, button, input, textarea, [data-cursor="hot"]).
 */
export default function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    // Only run on real-mouse devices without reduced-motion preference
    if (!window.matchMedia('(pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;

    // Reveal both elements and centre them on their own origin
    gsap.set([dot, ring], { opacity: 1, xPercent: -50, yPercent: -50 });

    // Hide the OS cursor
    document.body.classList.add('has-cursor');

    // ── Dot: snap exactly to pointer ─────────────────────────────
    const onMove = (e) => {
      gsap.set(dot, { x: e.clientX, y: e.clientY });
    };

    // ── Ring: spring-follow with quickTo ─────────────────────────
    const setRingX = gsap.quickTo(ring, 'x', { duration: 0.35, ease: 'power3.out' });
    const setRingY = gsap.quickTo(ring, 'y', { duration: 0.35, ease: 'power3.out' });

    const onMoveRing = (e) => {
      setRingX(e.clientX);
      setRingY(e.clientY);
    };

    // ── Hover effect: scale + colour change ──────────────────────
    const HOT_SELECTORS = 'a, button, input, textarea, [data-cursor="hot"]';

    const onPointerOver = (e) => {
      const isHot = e.target.closest(HOT_SELECTORS);
      if (isHot) {
        // Scale up and switch to signal orange
        gsap.to(ring, {
          scale: 1.8,
          borderColor: '#ff5b1f',
          duration: 0.2,
          ease: 'power2.out',
        });
      } else {
        // Reset to default size and bone/60 colour
        gsap.to(ring, {
          scale: 1,
          borderColor: 'rgba(232,230,223,0.6)',
          duration: 0.2,
          ease: 'power2.out',
        });
      }
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointermove', onMoveRing);
    window.addEventListener('pointerover', onPointerOver);

    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointermove', onMoveRing);
      window.removeEventListener('pointerover', onPointerOver);
      document.body.classList.remove('has-cursor');
    };
  }, []);

  return (
    <>
      {/* 6px signal-orange dot — instant */}
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[999]"
        style={{ opacity: 0, willChange: 'transform' }}
      >
        <div className="w-1.5 h-1.5 rounded-full bg-signal" />
      </div>

      {/* 36px ring — spring-lagged */}
      <div
        ref={ringRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[999] w-9 h-9 rounded-full"
        style={{
          opacity: 0,
          border: '1px solid rgba(232,230,223,0.6)',
          willChange: 'transform',
        }}
      />
    </>
  );
}
