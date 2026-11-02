import { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import {
  personalInfo,
  contactContent,
  socialLinks,
  emailjsConfig,
} from '../data/portfolioData';

/**
 * Contact — two-column layout with an EmailJS-powered form on the left
 * and direct contact details on the right.
 */
export default function Contact() {
  const formRef = useRef(null);
  // idle | sending | success | error
  const [status, setStatus] = useState('idle');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await emailjs.sendForm(
        emailjsConfig.serviceId,
        emailjsConfig.templateId,
        formRef.current,
        { publicKey: emailjsConfig.publicKey }
      );
      setStatus('success');
      formRef.current.reset();
    } catch {
      setStatus('error');
    }
  };

  // Shared classes for text inputs and textarea
  const inputClass =
    'w-full bg-panel border border-bone/10 text-bone font-sans text-sm px-4 py-3 ' +
    'placeholder:text-dim/40 focus:outline-none focus:border-signal transition-colors';

  return (
    <section id="contact" className="py-28 border-t border-bone/10">
      <div className="mx-auto max-w-7xl px-6">

        {/* Label */}
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-signal mb-8 flex items-center gap-3">
          <span className="w-6 h-px bg-signal inline-block" />
          {contactContent.label}
        </p>

        <h2 className="font-sans text-4xl sm:text-5xl font-bold text-bone mb-6 leading-tight">
          {contactContent.heading}
        </h2>

        <p className="font-sans text-dim text-lg mb-16 max-w-lg leading-relaxed">
          {contactContent.note}
        </p>

        <div className="grid lg:grid-cols-2 gap-16">

          {/* ── Contact form ── */}
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-5" noValidate>

            <div>
              <label
                htmlFor="contact-name"
                className="font-mono text-xs uppercase tracking-widest text-dim block mb-2"
              >
                Name
              </label>
              <input
                id="contact-name"
                name="user_name"
                type="text"
                required
                className={inputClass}
                placeholder="Your name"
              />
            </div>

            <div>
              <label
                htmlFor="contact-email"
                className="font-mono text-xs uppercase tracking-widest text-dim block mb-2"
              >
                Email
              </label>
              <input
                id="contact-email"
                name="user_email"
                type="email"
                required
                className={inputClass}
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label
                htmlFor="contact-message"
                className="font-mono text-xs uppercase tracking-widest text-dim block mb-2"
              >
                Message
              </label>
              <textarea
                id="contact-message"
                name="message"
                rows={5}
                required
                className={`${inputClass} resize-none`}
                placeholder="Tell me about the role or project…"
              />
            </div>

            <button
              id="contact-submit"
              type="submit"
              disabled={status === 'sending'}
              className="hud-frame font-mono text-xs uppercase tracking-widest px-8 py-3.5 bg-signal text-ink hover:bg-signal/85 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'sending' ? 'Sending…' : 'Send message →'}
            </button>

            {/* Feedback messages */}
            {status === 'success' && (
              <p className="font-mono text-xs text-signal uppercase tracking-widest" role="status">
                ✓ Message sent — I&apos;ll reply soon.
              </p>
            )}
            {status === 'error' && (
              <p className="font-mono text-xs text-bone/50 uppercase tracking-widest" role="alert">
                Something went wrong — please email me directly.
              </p>
            )}
          </form>

          {/* ── Contact details ── */}
          <div className="space-y-8 lg:pt-2">

            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-signal mb-2">Email</p>
              <a
                href={`mailto:${personalInfo.email}`}
                className="font-sans text-bone hover:text-signal transition-colors break-all"
              >
                {personalInfo.email}
              </a>
            </div>

            {personalInfo.phone && (
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-signal mb-2">Phone</p>
                <a
                  href={`tel:${personalInfo.phone.replace(/\s/g, '')}`}
                  className="font-sans text-bone hover:text-signal transition-colors"
                >
                  {personalInfo.phone}
                </a>
              </div>
            )}

            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-signal mb-2">Location</p>
              <p className="font-sans text-bone">{personalInfo.city}</p>
            </div>

            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-signal mb-2">Status</p>
              <p className="font-sans text-signal/90 text-sm">{personalInfo.availability}</p>
            </div>

            {/* Social links */}
            <div className="flex gap-5 pt-4 border-t border-bone/10">
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
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
