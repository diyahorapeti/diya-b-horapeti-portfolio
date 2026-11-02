import { useRef, useState } from 'react';
import {
  personalInfo,
  contactContent,
  socialLinks,
  emailjsConfig,
} from '../data/portfolioData';
import ScrambleText from './ScrambleText';

// ── helpers ───────────────────────────────────────────────────────────────────

/** True only when the user has filled in their real EmailJS credentials. */
function emailjsIsConfigured() {
  return (
    emailjsConfig.serviceId  !== 'YOUR_EMAILJS_SERVICE_ID'  &&
    emailjsConfig.templateId !== 'YOUR_EMAILJS_TEMPLATE_ID' &&
    emailjsConfig.publicKey  !== 'YOUR_EMAILJS_PUBLIC_KEY'
  );
}

/**
 * Build a mailto: URL so the visitor's default email client picks up the
 * subject and a pre-filled body. Used as a fallback when EmailJS isn't set up.
 */
function buildMailtoUrl(name, email, message) {
  const subject = encodeURIComponent('Portfolio contact');
  const body = encodeURIComponent(
    `Name: ${name}\nEmail: ${email}\n\n${message}`
  );
  return `mailto:${personalInfo.email}?subject=${subject}&body=${body}`;
}

// First name derived from personalInfo — lower-cased for the terminal prompt.
const firstName = personalInfo.name.split(' ')[0].toLowerCase();

// ── shared field style ────────────────────────────────────────────────────────
// Transparent bg, only a bottom border that turns signal on focus.
// No rounded corners, no outline ring.
const fieldClass =
  'w-full bg-transparent border-b border-bone/20 focus:border-signal ' +
  'font-mono text-sm text-bone placeholder:text-dim/40 ' +
  'py-3 outline-none transition-colors duration-200';

// ── Contact ───────────────────────────────────────────────────────────────────
/**
 * Contact — last main section.
 *
 * Left col : heading, email link, phone, social links.
 * Right col : terminal-style EmailJS form with mailto fallback.
 *
 * Sending logic:
 *   - If emailjsConfig credentials look like placeholders → open a mailto link
 *     in a new tab, show success, reset form.
 *   - If configured → dynamically import @emailjs/browser and call sendForm.
 */
export default function Contact() {
  const formRef = useRef(null);
  // 'idle' | 'sending' | 'success' | 'error'
  const [status, setStatus] = useState('idle');

  /** Show a status message and auto-clear it after ~4 s. */
  function showStatus(s) {
    setStatus(s);
    setTimeout(() => setStatus('idle'), 4000);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (status === 'sending') return;
    setStatus('sending');

    const form = formRef.current;
    const name    = form.user_name.value.trim();
    const email   = form.user_email.value.trim();
    const message = form.message.value.trim();

    // ── Mailto fallback ───────────────────────────────────────────────────
    if (!emailjsIsConfigured()) {
      window.open(buildMailtoUrl(name, email, message), '_blank', 'noopener,noreferrer');
      form.reset();
      showStatus('success');
      return;
    }

    // ── EmailJS send ──────────────────────────────────────────────────────
    try {
      const emailjs = await import('@emailjs/browser');
      await emailjs.sendForm(
        emailjsConfig.serviceId,
        emailjsConfig.templateId,
        form,
        emailjsConfig.publicKey
      );
      form.reset();
      showStatus('success');
    } catch (err) {
      console.error('[Contact] EmailJS error:', err);
      showStatus('error');
    }
  }

  return (
    <section
      id="contact"
      /* HUD grid texture fills the background */
      className="hud-grid px-5 md:px-10 py-28 md:py-40"
    >
      <div className="max-w-[1440px] mx-auto grid lg:grid-cols-2 gap-14 lg:gap-20">

        {/* ══════════════════════════════════════════════════════════════
            LEFT — heading + direct contact details
        ══════════════════════════════════════════════════════════════ */}
        <div className="flex flex-col gap-8">

          {/* Label */}
          <ScrambleText
            text={contactContent.label}
            className="block font-mono text-xs uppercase tracking-[0.3em] text-signal"
          />

          {/* Heading */}
          <h2
            className="font-bold leading-[0.95] tracking-[-0.04em] text-bone"
            style={{ fontSize: 'clamp(2.6rem, 7vw, 6rem)' }}
          >
            {contactContent.heading}
          </h2>

          {/* Note */}
          <p className="text-lg text-bone/70 max-w-md leading-relaxed">
            {contactContent.note}
          </p>

          {/* Email — thick signal underline */}
          <a
            href={`mailto:${personalInfo.email}`}
            className="
              font-mono text-lg md:text-2xl text-bone
              underline decoration-signal decoration-2 underline-offset-8
              hover:text-signal transition-colors duration-200
              break-all
            "
          >
            {personalInfo.email}
          </a>

          {/* Phone — only when set */}
          {personalInfo.phone && (
            <p className="font-mono text-sm text-dim">
              {personalInfo.phone}
            </p>
          )}

          {/* Social links — skip empty strings */}
          <div className="flex flex-wrap gap-6 pt-2">
            {socialLinks.github && (
              <a
                href={socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs uppercase tracking-[0.2em] text-dim hover:text-bone transition-colors duration-200"
              >
                GitHub ↗
              </a>
            )}
            {socialLinks.linkedin && (
              <a
                href={socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs uppercase tracking-[0.2em] text-dim hover:text-bone transition-colors duration-200"
              >
                LinkedIn ↗
              </a>
            )}
            {socialLinks.instagram && (
              <a
                href={socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs uppercase tracking-[0.2em] text-dim hover:text-bone transition-colors duration-200"
              >
                Instagram ↗
              </a>
            )}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            RIGHT — terminal-style form
        ══════════════════════════════════════════════════════════════ */}
        <div className="hud-frame border border-bone/10 bg-ink/70 backdrop-blur p-6 md:p-10">

          {/* Terminal prompt line */}
          <p className="font-mono text-xs text-dim mb-8 select-none">
            <span className="text-signal">$</span>
            {` new message --to ${firstName}`}
          </p>

          <form
            ref={formRef}
            onSubmit={handleSubmit}
            noValidate
            className="flex flex-col gap-8"
          >
            {/* ── Name ── */}
            <div>
              <label
                htmlFor="contact-name"
                className="block font-mono text-[11px] uppercase tracking-[0.25em] text-signal mb-3"
              >
                &gt; name
              </label>
              <input
                id="contact-name"
                name="user_name"
                type="text"
                required
                placeholder="Your full name"
                className={fieldClass}
              />
            </div>

            {/* ── Email ── */}
            <div>
              <label
                htmlFor="contact-email"
                className="block font-mono text-[11px] uppercase tracking-[0.25em] text-signal mb-3"
              >
                &gt; email
              </label>
              <input
                id="contact-email"
                name="user_email"
                type="email"
                required
                placeholder="you@example.com"
                className={fieldClass}
              />
            </div>

            {/* ── Message ── */}
            <div>
              <label
                htmlFor="contact-message"
                className="block font-mono text-[11px] uppercase tracking-[0.25em] text-signal mb-3"
              >
                &gt; message
              </label>
              <textarea
                id="contact-message"
                name="message"
                rows={5}
                required
                placeholder="Tell me about the role or project…"
                className={`${fieldClass} resize-none`}
              />
            </div>

            {/* ── Submit button ── */}
            <button
              id="contact-submit"
              type="submit"
              disabled={status === 'sending'}
              className="
                w-full flex items-center justify-between
                font-mono text-xs font-semibold uppercase tracking-[0.25em]
                px-6 py-4
                bg-signal text-ink
                hover:bg-bone
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-colors duration-200
              "
            >
              <span>{status === 'sending' ? 'Sending…' : 'Send message'}</span>
              <span aria-hidden="true">↗</span>
            </button>

            {/* ── Status line (auto-clears after 4 s) ── */}
            {(status === 'success' || status === 'error') && (
              <p
                role="status"
                className={`font-mono text-xs ${
                  status === 'success' ? 'text-emerald-400' : 'text-red-400'
                }`}
              >
                {status === 'success'
                  ? '✓ Message sent. Talk soon.'
                  : '✕ Something went wrong. Please try again.'}
              </p>
            )}
          </form>
        </div>

      </div>
    </section>
  );
}
