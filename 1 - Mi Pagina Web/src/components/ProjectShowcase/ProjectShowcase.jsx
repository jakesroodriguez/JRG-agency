import React, { useState, useEffect, useRef } from 'react';
import ProjectCard from './ProjectCard';
import { PROJECTS_DATA, SHOWCASE_UI_TEXT } from './projectData';
import './showcase.css';

/**
 * ProjectShowcase
 * Ultra-premium showcase component inspired by Apple, Vercel, Linear, and Webflow.
 * Features 3D interactive previews, multi-layer parallax, dynamic lighting,
 * and editorial case study presentations.
 */
export default function ProjectShowcase({ lang = 'es' }) {
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const sectionRef = useRef(null);
  const t = SHOWCASE_UI_TEXT[lang] || SHOWCASE_UI_TEXT.es;

  // Track currently active project on scroll using IntersectionObserver
  useEffect(() => {
    const items = document.querySelectorAll('.showcase-project-item');
    if (!items.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-project-id');
            const idx = PROJECTS_DATA.findIndex((p) => p.id === id);
            if (idx !== -1) {
              setActiveProjectIndex(idx);
            }
          }
        });
      },
      {
        root: null,
        rootMargin: '-20% 0px -40% 0px',
        threshold: 0.2
      }
    );

    items.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  const scrollToProject = (index) => {
    const project = PROJECTS_DATA[index];
    if (!project) return;
    const el = document.getElementById(`project-item-${project.slug}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const activeProject = PROJECTS_DATA[activeProjectIndex] || PROJECTS_DATA[0];

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="project-showcase-section"
      aria-label={t.eyebrow}
      style={{
        '--active-accent': activeProject?.accentColor || '#3b82f6',
        '--active-glow': activeProject?.glowColor || 'rgba(59, 130, 246, 0.2)',
      }}
    >
      {/* Anchor for existing #work links */}
      <div id="work" className="showcase-scroll-anchor" />

      {/* Dynamic Background Ambient Lighting Mesh & Orbs */}
      <div className="showcase-bg-grid" aria-hidden="true" />
      <div className="showcase-bg-glow-orb orb-top" aria-hidden="true" />
      <div className="showcase-bg-glow-orb orb-bottom" aria-hidden="true" />
      <div className="showcase-bg-center-glow" aria-hidden="true" />

      <div className="showcase-container">
        
        {/* Editorial Section Header */}
        <header className="showcase-header">
          
          {/* Eyebrow & Status */}
          <div className="showcase-eyebrow-row">
            <span className="showcase-eyebrow">
              <span className="eyebrow-dot" />
              {t.eyebrow}
            </span>
            <span className="showcase-counter-badge">
              {String(activeProjectIndex + 1).padStart(2, '0')} / {String(PROJECTS_DATA.length).padStart(2, '0')}
            </span>
          </div>

          {/* Main Title & Subtitle */}
          <h2 className="showcase-title">
            <span className="title-line-1">{t.titleLine1}</span>
            <span className="title-line-2">{t.titleLine2}</span>
          </h2>

          <p className="showcase-subtitle">
            {t.subtitle}
          </p>

          {/* Project Quick Selector Tabs */}
          <nav className="showcase-nav-bar" aria-label="Proyectos">
            <div className="showcase-tabs-track">
              {PROJECTS_DATA.map((p, idx) => (
                <button
                  key={p.id}
                  type="button"
                  className={`showcase-tab-btn ${activeProjectIndex === idx ? 'is-active' : ''}`}
                  onClick={() => scrollToProject(idx)}
                  aria-label={`Ver proyecto ${p.title}`}
                >
                  <span className="tab-num">{p.id}</span>
                  <span className="tab-title">{p.title}</span>
                  {activeProjectIndex === idx && (
                    <span className="tab-active-indicator" />
                  )}
                </button>
              ))}
            </div>
          </nav>
        </header>

        {/* Vertical Case Studies List */}
        <div className="showcase-projects-list">
          {PROJECTS_DATA.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              totalProjects={PROJECTS_DATA.length}
              lang={lang}
              isActive={activeProjectIndex === index}
            />
          ))}
        </div>

        {/* Footer Editorial Note */}
        <div className="showcase-footer-note">
          <div className="footer-note-line" />
          <div className="footer-note-text">
            <span>{t.allProjectsBadge}</span>
            <span>·</span>
            <span>PORTFOLIO © {new Date().getFullYear()}</span>
          </div>
          <div className="footer-note-line" />
        </div>

      </div>
    </section>
  );
}
