import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { projects } from '../data/portfolioData';

// Load any images placed in src/assets/projects/ at build time.
// Returns an empty object if the folder is empty — no crash.
const projectImages = import.meta.glob(
  '../assets/projects/*.{png,jpg,webp}',
  { eager: true }
);

/** Returns the imported image module for a given project id, or null. */
function getImage(id) {
  const key = Object.keys(projectImages).find((k) => k.includes(id));
  return key ? projectImages[key].default : null;
}

/**
 * ProjectCard — one project entry with image/placeholder, title,
 * description, tag pills, and GitHub / live / video links.
 */
function ProjectCard({ project }) {
  const image = getImage(project.id);

  return (
    <article
      data-project-card
      className="hud-frame group border border-bone/10 bg-panel flex flex-col overflow-hidden"
    >
      {/* ── Image / placeholder ── */}
      <div className="relative aspect-video bg-ink overflow-hidden flex-shrink-0">
        {image ? (
          <img
            src={image}
            alt={`Screenshot of ${project.title}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          // Grid placeholder when no screenshot has been added yet
          <div className="w-full h-full hud-grid flex items-center justify-center">
            <span className="font-mono text-6xl font-bold text-bone/8 select-none">
              {project.number}
            </span>
          </div>
        )}

        {/* Year badge */}
        <span className="absolute top-3 right-3 font-mono text-[10px] uppercase tracking-widest text-dim bg-ink/80 px-2 py-1 border border-bone/10">
          {project.year}
        </span>
      </div>

      {/* ── Text content ── */}
      <div className="p-6 flex flex-col flex-1">
        <p className="font-mono text-xs text-signal mb-2">{project.number}</p>

        <h3 className="font-sans text-xl font-bold text-bone mb-3 group-hover:text-signal transition-colors">
          {project.title}
        </h3>

        <p className="font-sans text-sm text-dim leading-relaxed mb-5 flex-1">
          {project.description}
        </p>

        {/* Tag pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="font-mono text-[10px] uppercase tracking-widest text-dim border border-bone/10 px-2.5 py-1"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Links row */}
        <div className="flex gap-5 mt-auto">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs uppercase tracking-widest text-dim hover:text-bone transition-colors"
            >
              GitHub ↗
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs uppercase tracking-widest text-dim hover:text-bone transition-colors"
            >
              Live ↗
            </a>
          )}
          {/* video field is optional — only rendered when present */}
          {project.video && (
            <a
              href={project.video}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs uppercase tracking-widest text-dim hover:text-signal transition-colors"
            >
              Video ↗
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

/**
 * Projects — section listing all portfolio projects in a responsive grid.
 */
export default function Projects() {
  const sectionRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      gsap.from('[data-project-card]', {
        y: 48,
        opacity: 0,
        duration: 0.85,
        stagger: 0.18,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 78%',
          once: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="projects" ref={sectionRef} className="py-28 border-t border-bone/10">
      <div className="mx-auto max-w-7xl px-6">

        {/* Label */}
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-signal mb-8 flex items-center gap-3">
          <span className="w-6 h-px bg-signal inline-block" />
          03 / Work
        </p>

        <h2 className="font-sans text-4xl sm:text-5xl font-bold text-bone mb-16 leading-tight">
          Selected projects.
        </h2>

        {/* Project cards — 2-up on ≥ md */}
        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
