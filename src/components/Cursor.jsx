import { useEffect, useRef } from 'react';

/**
 * Cursor — renders a small dot (snaps instantly) and a larger ring
 * (lags behind for a fluid feel). Only activates on fine-pointer
 * devices (desktop mouse). Respects prefers-reduced-motion.
 */
export default function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    // Skip on touch-only devices
    if (!window.matchMedia('(pointer: fine)').matches) return;
    // Skip if user prefers reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Tell CSS to hide the default OS cursor
    document.body.classList.add('has-cursor');

    const dot = dotRef.current;
    const ring = ringRef.current;

    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;
    let rafId;

    // Dot follows the pointer instantly
    const onMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    };

    // Ring lerps toward the pointer for a trailing-lag effect
    const animate = () => {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
      rafId = requestAnimationFrame(animate);
    };
    animate();

    window.addEventListener('mousemove', onMove);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafId);
      document.body.classList.remove('has-cursor');
    };
  }, []);

  return (
    <>
      {/* Solid dot — instant */}
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[9999]"
        style={{ willChange: 'transform' }}
      >
        <div className="w-2 h-2 rounded-full bg-signal" />
      </div>

      {/* Hollow ring — lags slightly */}
      <div
        ref={ringRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[9998]"
        style={{ willChange: 'transform' }}
      >
        <div className="w-9 h-9 rounded-full border border-signal/40" />
      </div>
    </>
  );
}
