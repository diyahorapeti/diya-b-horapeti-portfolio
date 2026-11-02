import { personalInfo, footerContent, socialLinks, academy } from '../data/portfolioData';

// Evaluated once at module load — safe to use inside a pure component
const YEAR = new Date().getFullYear();

/**
 * Footer — copyright line, TAP Academy credit, and social icon links.
 */
export default function Footer() {

  return (
    <footer className="border-t border-bone/10 py-10">
      <div className="mx-auto max-w-7xl px-6">

        {/* ── Top row: tagline + social links ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-6">

          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            {/* Copyright + tagline */}
            <p className="font-mono text-xs text-dim">
              © {YEAR} {personalInfo.name} &mdash; {footerContent.tagline}
            </p>

            <span className="hidden sm:block text-dim/20" aria-hidden="true">|</span>

            {/* TAP Academy credit — required by project rules */}
            <a
              href={academy.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-dim hover:text-signal transition-colors whitespace-nowrap"
            >
              Trained at {academy.name} ↗
            </a>
          </div>

          {/* Social links — abbreviated labels */}
          <div className="flex gap-5">
            {socialLinks.github && (
              <a
                href={socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub profile"
                className="font-mono text-xs uppercase tracking-widest text-dim hover:text-bone transition-colors"
              >
                GH
              </a>
            )}
            {socialLinks.linkedin && (
              <a
                href={socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn profile"
                className="font-mono text-xs uppercase tracking-widest text-dim hover:text-bone transition-colors"
              >
                LI
              </a>
            )}
            {socialLinks.instagram && (
              <a
                href={socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram profile"
                className="font-mono text-xs uppercase tracking-widest text-dim hover:text-bone transition-colors"
              >
                IG
              </a>
            )}
          </div>
        </div>

        {/* ── Bottom rule ── */}
        <div className="h-px w-full bg-gradient-to-r from-signal/30 via-bone/5 to-transparent" />
      </div>
    </footer>
  );
}
