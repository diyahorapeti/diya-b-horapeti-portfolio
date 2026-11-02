import { useState, useEffect, useRef, useId } from 'react';
import { personalInfo, navLinks, heroContent } from '../data/portfolioData';

// ── Helpers ────────────────────────────────────────────────────────────────

/** Extract uppercase initials from a full name, e.g. "Diya B Horapeti" → "DH" */
function getInitials(name) {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  // First + last word initial only
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// ── Hooks ──────────────────────────────────────────────────────────────────

/**
 * useClock — returns a live 24-hour HH:MM:SS string in the given IANA timezone,
 * updated every second via Intl.DateTimeFormat.
 */
function useClock(timezone) {
  const fmt = useRef(null);
  const [time, setTime] = useState('');

  useEffect(() => {
    // Build the formatter once
    fmt.current = new Intl.DateTimeFormat('en-GB', {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });

    const tick = () => setTime(fmt.current.format(new Date()));
    tick(); // paint immediately
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [timezone]);

  return time;
}

/**
 * useStatusCycle — cycles through heroContent.statusLines every 3.5 s.
 */
function useStatusCycle(lines) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setIndex((i) => (i + 1) % lines.length),
      3500
    );
    return () => clearInterval(id);
  }, [lines.length]);

  return lines[index];
}

/**
 * useScrolled — returns true once the page has scrolled past `threshold` px.
 */
function useScrolled(threshold = 40) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const check = () => setScrolled(window.scrollY > threshold);
    check();
    window.addEventListener('scroll', check, { passive: true });
    return () => window.removeEventListener('scroll', check);
  }, [threshold]);

  return scrolled;
}

// ── Component ──────────────────────────────────────────────────────────────

/**
 * Hud — fixed top navigation bar.
 *
 * Structure (L → R):
 *   Left   : initials badge + brand name (sm+)
 *   Centre : pulsing dot + cycling status line (lg+)
 *   Right  : nav links (md+) + live clock (md+) | mobile menu toggle
 *
 * Background transitions from transparent → bg-ink/80 + blur after 40 px scroll
 * or when the mobile menu is open.
 */
export default function Hud() {
  const time   = useClock(personalInfo.timezone);
  const status = useStatusCycle(heroContent.statusLines);
  const scrolled = useScrolled(40);

  const [menuOpen, setMenuOpen] = useState(false);
  const mobileNavId = useId();

  const initials = getInitials(personalInfo.brandName);

  // Header is "active" (opaque) when scrolled OR mobile menu is open
  const isActive = scrolled || menuOpen;

  return (
    <header
      className={[
        'fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,border-color] duration-300',
        isActive
          ? 'bg-ink/80 backdrop-blur-md border-b border-bone/10'
          : 'bg-transparent border-b border-transparent',
      ].join(' ')}
      style={{ height: '64px' }}
    >
      {/* ── Inner layout ── */}
      <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between px-5 md:px-10">

        {/* ── LEFT: initials badge + brand name ── */}
        <a
          href="#home"
          className="flex items-center gap-3 group"
          aria-label={`${personalInfo.brandName} — home`}
        >
          {/* 32 × 32 badge */}
          <div
            className="flex items-center justify-center border border-signal font-mono text-xs font-semibold text-signal transition-colors group-hover:bg-signal group-hover:text-ink"
            style={{ width: 32, height: 32 }}
          >
            {initials}
          </div>

          {/* Brand name — hidden on xs, shown sm+ */}
          <span className="hidden sm:block font-mono text-xs uppercase tracking-[0.2em] text-bone/70 group-hover:text-bone transition-colors">
            {personalInfo.brandName}
          </span>
        </a>

        {/* ── CENTRE: pulsing dot + status line (lg+) ── */}
        <div
          className="hidden lg:flex items-center gap-2.5 min-w-0"
          aria-live="polite"
          aria-atomic="true"
        >
          {/* Pulsing 6 px signal dot */}
          <span className="relative flex h-1.5 w-1.5 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-signal" />
          </span>

          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-dim truncate max-w-[340px]">
            {status}
          </span>
        </div>

        {/* ── RIGHT: nav links + clock (md+) and mobile toggle ── */}
        <div className="flex items-center gap-6">

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center gap-6" aria-label="Primary navigation">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-mono text-xs uppercase tracking-[0.18em] text-bone/70 hover:text-signal transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Live clock (md+) */}
          <time
            className="hidden md:block font-mono text-xs tabular-nums text-dim"
            title={personalInfo.timezone}
            dateTime={time}
          >
            {time}
          </time>

          {/* Mobile menu toggle (below md) */}
          <button
            className="md:hidden font-mono text-xs uppercase tracking-[0.18em] text-bone/70 hover:text-signal transition-colors"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls={mobileNavId}
          >
            {menuOpen ? 'Close' : 'Menu'}
          </button>
        </div>
      </div>

      {/* ── MOBILE DROPDOWN PANEL ── */}
      {menuOpen && (
        <div
          id={mobileNavId}
          className="md:hidden bg-ink/95 backdrop-blur-md border-t border-bone/10"
        >
          <nav aria-label="Mobile navigation">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center border-b border-bone/10 px-5 py-4 text-2xl font-semibold text-bone hover:text-signal transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* City + clock in mobile panel */}
          <div className="flex items-center justify-between px-5 py-4">
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-dim">
              {personalInfo.city}
            </span>
            <time
              className="font-mono text-xs tabular-nums text-dim"
              title={personalInfo.timezone}
              dateTime={time}
            >
              {time}
            </time>
          </div>
        </div>
      )}
    </header>
  );
}
