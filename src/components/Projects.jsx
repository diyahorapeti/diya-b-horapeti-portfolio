import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { projects } from '../data/portfolioData';
import ScrambleText from './ScrambleText';

// ── Cover images ──────────────────────────────────────────────────────────────
// Eagerly loads everything in src/assets/projects/ (png, jpg, jpeg, webp, svg).
// Returns an empty object if the folder is empty — no crash at build time.
const projectImages = import.meta.glob(
  '../assets/projects/*.{png,jpg,jpeg,webp,svg}',
  { eager: true }
);

/** Return the imported image src for a project id, or null when missing. */
function getCoverSrc(id) {
  const key = Object.keys(projectImages).find((k) => k.includes(`/${id}.`));
  return key ? projectImages[key].default : null;
}

// ── ProjectCard ───────────────────────────────────────────────────────────────
/**
 * One project card.
 * - Full-width on mobile; fixed max-width on md+.
 * - Cover image: grayscale 80% → full colour + scale on hover (CSS, 700 ms).
 * - Placeholder: .hud-grid background with project id in mono when no image.
 * - Top-left badge: "<number> / <year>".
 * - Body: title, description, #TAG chips, Live ↗ / Code ↗ buttons.
 */
function ProjectCard({ project }) {
  const coverSrc = getCoverSrc(project.id);

  return (
    <article
      data-project-card
      /* Full-width mobile; fixed-width desktop; never shrinks in the scroll row */
      className="
        group hud-frame border border-bone/10 bg-panel/60
        flex flex-col overflow-hidden shrink-0
        w-full
        md:w-[min(560px,42vw)]
        data-[cursor]:cursor-none
      "
      data-cursor="hot"
    >
      {/* ── Cover ── */}
      <div className="relative aspect-[16/10] md:aspect-[16/8] border-b border-bone/10 bg-ink overflow-hidden">
        {coverSrc ? (
          <img
            src={coverSrc}
            alt={`Cover image for ${project.title}`}
            /* Grayscale 80% opacity at rest; full colour+opacity+scale on hover — 700 ms */
            className="
              w-full h-full object-cover
              grayscale opacity-80
              group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-[1.04]
              transition-all duration-700 ease-in-out
            "
          />
        ) : (
          /* Fallback placeholder — grid texture + project id in ghost text */
          <div className="w-full h-full hud-grid flex items-center justify-center">
            <span className="font-mono text-5xl font-bold text-bone/8 select-none">
              {project.id}
            </span>
          </div>
        )}

        {/* Badge — "<number> / <year>" */}
        <span className="
          absolute top-3 left-3
          bg-ink/80 font-mono text-[10px] uppercase tracking-[0.25em] text-signal
          px-2 py-1
        ">
          {project.number} / {project.year}
        </span>
      </div>

      {/* ── Body ── */}
      <div className="p-6 md:p-8 flex flex-col flex-1">
        {/* Title */}
        <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-bone mb-3 leading-tight">
          {project.title}
        </h3>

        {/* Description */}
        <p className="text-sm md:text-base text-bone/70 leading-relaxed mb-5 flex-1">
          {project.description}
        </p>

        {/* Tags — #TAG in mono */}
        <div className="flex flex-wrap gap-x-3 gap-y-1 mb-6">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="font-mono text-[11px] uppercase tracking-[0.15em] text-dim"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Action buttons — square, mono */}
        <div className="flex gap-3 mt-auto">
          {/* Live ↗ — only when liveUrl is non-empty */}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="
                font-mono text-[11px] font-semibold uppercase tracking-[0.2em]
                px-4 py-2.5
                bg-signal text-ink
                hover:bg-bone
                transition-colors duration-200
              "
            >
              Live ↗
            </a>
          )}

          {/* Code ↗ — only when githubUrl is non-empty */}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="
                font-mono text-[11px] font-semibold uppercase tracking-[0.2em]
                px-4 py-2.5
                border border-bone/30
                hover:border-signal hover:text-signal
                transition-colors duration-200
              "
            >
              Code ↗
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

// ── Projects (section) ────────────────────────────────────────────────────────
/**
 * Projects section.
 *
 * Desktop (md+ & no-reduced-motion):
 *   - Section is pinned (position: sticky via GSAP ScrollTrigger).
 *   - The card track animates on the x-axis (horizontal scroll illusion).
 *   - A thin signal-orange progress line below the track scales from 0→1.
 *
 * Mobile / reduced-motion:
 *   - Cards stack vertically with gap-6 — no pinning or horizontal scroll.
 */
export default function Projects() {
  const sectionRef  = useRef(null);
  const trackRef    = useRef(null);
  const progressRef = useRef(null); // the inner signal-coloured line

  useEffect(() => {
    // gsap.matchMedia lets us apply desktop animation and cleanly revert it
    // when the viewport shrinks or reduced-motion preference changes.
    const mm = gsap.matchMedia();

    mm.add(
      // Target: desktop viewport AND no reduced-motion preference
      '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
      () => {
        const section = sectionRef.current;
        const track   = trackRef.current;
        const bar     = progressRef.current;

        if (!section || !track) return;

        // How far the track must travel to bring the last card into view.
        // We recalculate this via invalidateOnRefresh so it stays correct
        // after fonts and images have loaded.
        const getDistance = () =>
          track.scrollWidth - window.innerWidth + 80;

        // Animate the track's x from 0 → -distance (slide cards left)
        const tween = gsap.to(track, {
          x: () => -getDistance(),
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            // end is a function so it recalculates after refresh
            end: () => '+=' + getDistance(),
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            // Scale the progress bar in sync with scroll progress
            onUpdate: (self) => {
              if (bar) {
                gsap.set(bar, { scaleX: self.progress });
              }
            },
          },
        });

        // Cleanup: returned from the matchMedia callback, called on revert
        return () => {
          tween.scrollTrigger?.kill();
          tween.kill();
        };
      }
    );

    // Revert all matchMedia animations when the component unmounts
    return () => mm.revert();
  }, []);

  return (
    <section
      id="projects"
      ref={sectionRef}
      /* Mobile: normal flow, comfortable vertical padding
         Desktop: full viewport height, flex column centred, less top-padding */
      className="
        w-full overflow-hidden
        py-24
        md:h-screen md:flex md:flex-col md:justify-center md:pt-20 md:pb-6
      "
    >
      {/* ── Header row ── */}
      <div className="max-w-[1440px] w-full mx-auto px-5 md:px-10 mb-10 md:mb-8">
        <div className="flex items-end justify-between">
          {/* Left: label + heading */}
          <div>
            {/* ScrambleText "02 / Selected work" label */}
            <ScrambleText
              text="02 / Selected work"
              className="
                block font-mono text-xs uppercase tracking-[0.3em] text-signal mb-4
              "
            />

            <h2
              className="
                font-bold leading-none tracking-[-0.03em] text-bone
              "
              style={{ fontSize: 'clamp(2.4rem, 6vw, 5.5rem)' }}
            >
              Projects
            </h2>
          </div>

          {/* Right: project count + scroll hint — desktop only */}
          <p className="hidden md:block font-mono text-xs text-dim self-end mb-1">
            {projects.length} project{projects.length !== 1 ? 's' : ''} · scroll →
          </p>
        </div>
      </div>

      {/* ── Card track ── */}
      {/*
        Mobile:  flex-col, gap-6, normal padding
        Desktop: flex-row, w-max (wide as all cards), horizontal padding;
                 GSAP will translate this element on the x-axis
      */}
      <div
        ref={trackRef}
        className="
          flex flex-col gap-6
          px-5
          md:flex-row md:w-max md:gap-8
          md:px-10
        "
      >
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      {/* ── Progress line — desktop only ── */}
      <div className="hidden md:block max-w-[1440px] w-full mx-auto px-5 md:px-10 mt-8">
        {/* Outer track */}
        <div className="w-full h-px bg-bone/10 overflow-hidden">
          {/* Inner signal bar — GSAP sets scaleX (0 → 1) */}
          <div
            ref={progressRef}
            className="w-full h-full bg-signal origin-left"
            style={{ transform: 'scaleX(0)' }}
          />
        </div>
      </div>
    </section>
  );
}
