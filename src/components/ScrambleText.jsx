import { useEffect, useRef, useState } from 'react';

// Characters used during the scramble animation
const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=<>/';

function randomGlyph() {
  return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
}

/**
 * ScrambleText — decodes scrambled glyphs into real text, left to right.
 *
 * Props:
 *   text      (string)  — the final text to reveal
 *   as        (string)  — HTML tag to render, default 'span'
 *   className (string)  — extra Tailwind / CSS classes
 *   delay     (number)  — ms before animation starts (default 0)
 *   speed     (number)  — ms between each interval tick (default 30)
 *   trigger   (string)  — 'mount' | 'view' (default 'view')
 *               'mount' — starts immediately when the component mounts
 *               'view'  — starts once 40% of the element enters the viewport
 *
 * Accessibility: the real text is always in the accessible tree via
 * aria-label on the wrapper; the scrambled span is aria-hidden.
 *
 * Reduced-motion: skips the animation and shows the text immediately.
 */
export default function ScrambleText({
  text,
  as: Tag = 'span',
  className = '',
  style,
  delay = 0,
  speed = 30,
  trigger = 'view',
}) {
  // `display` holds what is currently rendered (mix of glyphs + real chars)
  const [display, setDisplay] = useState(text);
  const ref = useRef(null);
  // Track whether animation has already played (plays only once)
  const hasPlayed = useRef(false);

  useEffect(() => {
    // Respect prefers-reduced-motion — just show the text immediately
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplay(text);
      return;
    }

    // How many characters are "locked in" (revealed from left to right)
    let locked = 0;
    // Interval ticks twice per locked character: two ticks of glyphs, then lock
    let ticks = 0;
    let intervalId = null;
    let timeoutId = null;

    /**
     * Run one animation frame:
     *  - Characters before `locked` show the real character
     *  - Characters at `locked` and beyond show random glyphs (spaces stay spaces)
     *  - Every 2 ticks, advance `locked` by 1
     */
    const step = () => {
      // Every 2 ticks lock one more character
      if (ticks % 2 === 0 && locked < text.length) {
        locked++;
      }
      ticks++;

      const next = text
        .split('')
        .map((char, i) => {
          if (i < locked) return char;          // already revealed
          if (char === ' ') return ' ';         // preserve spaces
          return randomGlyph();                 // still scrambling
        })
        .join('');

      setDisplay(next);

      // Once everything is locked, stop
      if (locked >= text.length) {
        clearInterval(intervalId);
        setDisplay(text); // guarantee exact final text
      }
    };

    const play = () => {
      if (hasPlayed.current) return;
      hasPlayed.current = true;

      // Reset state before starting
      locked = 0;
      ticks = 0;
      setDisplay(text.replace(/[^ ]/g, randomGlyph)); // initial scramble

      timeoutId = setTimeout(() => {
        intervalId = setInterval(step, speed);
      }, delay);
    };

    if (trigger === 'mount') {
      play();
    } else {
      // 'view' — start when 40% of the element enters the viewport
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            play();
            observer.disconnect();
          }
        },
        { threshold: 0.4 }
      );

      if (ref.current) observer.observe(ref.current);

      return () => {
        clearInterval(intervalId);
        clearTimeout(timeoutId);
        observer.disconnect();
        // Reset so the second StrictMode mount can re-run the animation
        hasPlayed.current = false;
        setDisplay(text);
      };
    }

    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
      // Reset so the second StrictMode mount can re-run the animation
      hasPlayed.current = false;
      setDisplay(text);
    };
  // Re-run if the `text` prop changes (e.g. rotating status lines)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, trigger, delay, speed]);

  return (
    <Tag ref={ref} aria-label={text} className={className} style={style}>
      {/* aria-hidden so screen readers use aria-label above, not glyphs */}
      <span aria-hidden="true">{display}</span>
    </Tag>
  );
}
