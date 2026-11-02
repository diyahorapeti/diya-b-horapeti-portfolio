import { useState, useEffect } from 'react';
import { personalInfo, navLinks, heroContent } from '../data/portfolioData';

/**
 * useClock — returns a live time string in the portfolio's local timezone,
 * updated every second.
 */
function useClock(timezone) {
  const [time, setTime] = useState('');

  useEffect(() => {
    const tick = () =>
      setTime(
        new Date().toLocaleTimeString('en-GB', {
          timeZone: timezone,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        })
      );
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [timezone]);

  return time;
}

/**
 * useStatusCycle — cycles through the hero status lines every 3 s,
 * returning the currently visible one.
 */
function useStatusCycle(lines) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setIndex((i) => (i + 1) % lines.length),
      3000
    );
    return () => clearInterval(id);
  }, [lines.length]);

  return lines[index];
}

/**
 * Hud — fixed top navigation bar with brand name, nav links,
 * a live local clock, and a cycling HUD status line.
 */
export default function Hud() {
  const time = useClock(personalInfo.timezone);
  const status = useStatusCycle(heroContent.statusLines);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-bone/10 bg-ink/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 h-14">

        {/* ── Brand ── */}
        <a
          href="#home"
          className="font-mono text-xs uppercase tracking-widest text-bone/60 hover:text-signal transition-colors"
        >
          {personalInfo.brandName}
        </a>

        {/* ── Desktop nav ── */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-mono text-xs uppercase tracking-widest text-dim hover:text-bone transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* ── Clock + cycling status (desktop) ── */}
        <div className="hidden md:flex flex-col items-end gap-0.5 min-w-[180px]">
          <span className="font-mono text-xs text-signal tabular-nums">{time}</span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-dim truncate max-w-[200px]">
            {status}
          </span>
        </div>

        {/* ── Mobile hamburger ── */}
        <button
          className="md:hidden font-mono text-xs text-dim hover:text-bone transition-colors"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? '[ CLOSE ]' : '[ MENU ]'}
        </button>
      </div>

      {/* ── Mobile dropdown ── */}
      {menuOpen && (
        <nav
          className="md:hidden border-t border-bone/10 bg-ink/95 px-6 py-5 flex flex-col gap-5"
          aria-label="Mobile navigation"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="font-mono text-xs uppercase tracking-widest text-dim hover:text-bone transition-colors"
            >
              {link.label}
            </a>
          ))}
          {/* Show clock in mobile menu too */}
          <div className="pt-2 border-t border-bone/10">
            <span className="font-mono text-xs text-signal tabular-nums">{time}</span>
          </div>
        </nav>
      )}
    </header>
  );
}
