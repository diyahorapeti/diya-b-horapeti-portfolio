import {
  personalInfo,
  socialLinks,
  navLinks,
  footerContent,
  academy,
} from '../data/portfolioData';

// Evaluated once at module load — safe inside a pure component
const YEAR = new Date().getFullYear();

// ── link style helpers ────────────────────────────────────────────────────────
const colTitle =
  'block font-mono text-[11px] uppercase tracking-[0.25em] text-signal mb-5';

const linkClass =
  'block font-mono text-[11px] uppercase tracking-[0.15em] text-bone/75 ' +
  'hover:text-signal transition-colors duration-200 leading-relaxed';

// ── Footer ────────────────────────────────────────────────────────────────────
/**
 * Footer — three-column link grid, giant faint brand watermark, and
 * bottom row with copyright + required TAP Academy credit.
 */
export default function Footer() {
  return (
    <footer className="w-full overflow-hidden border-t border-bone/10 px-5 md:px-10 pt-16 pb-8">
      <div className="max-w-[1440px] mx-auto">

        {/* ══════════════════════════════════════════════════════════════
            Three-column link grid
        ══════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-14">

          {/* ── Col 1: Navigate ── */}
          <div>
            <span className={colTitle}>Navigate</span>
            <nav aria-label="Footer navigation">
              {navLinks.map((link) => (
                <a key={link.href} href={link.href} className={linkClass}>
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* ── Col 2: Elsewhere ── */}
          <div>
            <span className={colTitle}>Elsewhere</span>
            {socialLinks.github && (
              <a
                href={socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                GitHub ↗
              </a>
            )}
            {socialLinks.linkedin && (
              <a
                href={socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                LinkedIn ↗
              </a>
            )}
            {socialLinks.instagram && (
              <a
                href={socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                Instagram ↗
              </a>
            )}
          </div>

          {/* ── Col 3: Say hello (right-aligned on md+) ── */}
          <div className="md:text-right">
            <span className={`${colTitle} md:justify-end`}>Say hello</span>

            <a
              href={`mailto:${personalInfo.email}`}
              className={`${linkClass} md:ml-auto`}
            >
              {personalInfo.email}
            </a>

            {personalInfo.city && (
              <p className="font-mono text-xs text-dim mt-2 leading-relaxed">
                {personalInfo.city}
              </p>
            )}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            Giant brand watermark — purely decorative
        ══════════════════════════════════════════════════════════════ */}
        <div
          aria-hidden="true"
          className="
            text-center uppercase whitespace-nowrap
            font-bold leading-none tracking-[-0.05em]
            text-bone/[0.07] select-none
            mb-10 overflow-hidden
          "
          style={{ fontSize: '13.5vw' }}
        >
          {personalInfo.brandName}
        </div>

        {/* ══════════════════════════════════════════════════════════════
            Bottom row — copyright + TAP Academy credit
        ══════════════════════════════════════════════════════════════ */}
        <div className="
          border-t border-bone/10 pt-6
          flex flex-col md:flex-row md:justify-between md:items-center
          gap-3
          font-mono text-[11px] uppercase tracking-[0.15em] text-dim
        ">
          {/* Left: copyright + tagline */}
          <p>
            © {YEAR} {personalInfo.name} · {footerContent.tagline}
          </p>

          {/* Right: TAP Academy credit — required by project rules */}
          <p>
            Trained at{' '}
            <a
              href={academy.url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 hover:text-signal transition-colors duration-200"
            >
              {academy.name}
            </a>
          </p>
        </div>

      </div>
    </footer>
  );
}
