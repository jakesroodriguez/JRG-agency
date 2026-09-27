import React, { useRef } from 'react';
import ProjectPreview from './ProjectPreview';
import MagneticButton from './MagneticButton';
import { SHOWCASE_UI_TEXT } from './projectData';

/**
 * ProjectCard
 * Full case-study presentation for each showcase project with 3D preview & editorial details.
 */
export default function ProjectCard({
  project,
  index,
  totalProjects,
  lang = 'es',
  isActive = false
}) {
  const cardRef = useRef(null);
  const t = SHOWCASE_UI_TEXT[lang] || SHOWCASE_UI_TEXT.es;

  const tagline = project.tagline[lang] || project.tagline.es;
  const description = project.description[lang] || project.description.es;
  const scope = project.scope[lang] || project.scope.es;

  return (
    <article
      ref={cardRef}
      id={`project-item-${project.slug}`}
      className={`showcase-project-item ${isActive ? 'is-active-project' : ''}`}
      data-project-id={project.id}
    >
      {/* Editorial Horizontal / Split Layout */}
      <div className="showcase-item-inner">
        
        {/* Left / Info Column */}
        <div className="showcase-item-info">
          
          {/* Top Meta Bar */}
          <div className="showcase-meta-row">
            <div className="project-index-badge">
              <span className="project-index-num">{project.id}</span>
              <span className="project-index-sep">/</span>
              <span className="project-index-total">{String(totalProjects).padStart(2, '0')}</span>
            </div>

            <div className="project-meta-pills">
              <span className="project-year-pill">{project.year}</span>
              <span className="project-client-pill">{project.client}</span>
            </div>
          </div>

          {/* Scope subtitle */}
          <div className="project-scope-text">{scope}</div>

          {/* Big Title */}
          <h3 className="project-title">
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="project-title-link">
              {project.title}
            </a>
          </h3>

          {/* Tagline & Description */}
          <p className="project-tagline">{tagline}</p>
          <p className="project-description">{description}</p>

          {/* Category Tags */}
          <div className="project-tags-list">
            {project.tags.map((tag, idx) => (
              <span key={idx} className="project-tag-chip">
                {tag}
              </span>
            ))}
          </div>

          {/* Technology Pills */}
          <div className="project-tech-stack">
            <span className="tech-stack-label">{t.techLabel}:</span>
            <div className="tech-pills-row">
              {project.technologies.map((tech, idx) => (
                <span key={idx} className="tech-pill">
                  <span className="tech-pill-dot" />
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Performance Metrics Bar */}
          {project.metrics && project.metrics.length > 0 && (
            <div className="project-metrics-grid">
              {project.metrics.map((metric, idx) => (
                <div key={idx} className="metric-cell">
                  <span className="metric-val">{metric.value}</span>
                  <span className="metric-lbl">{metric.label}</span>
                </div>
              ))}
            </div>
          )}

          {/* Magnetic CTA Button */}
          <div className="project-cta-wrap">
            <MagneticButton
              href={project.liveUrl}
              ariaLabel={`${t.ctaText} - ${project.title}`}
              className="project-action-btn"
            >
              {t.ctaText}
            </MagneticButton>

            <span className="project-url-subtext">{project.url}</span>
          </div>
        </div>

        {/* Right / 3D Interactive Preview Column */}
        <div className="showcase-item-visual">
          <ProjectPreview
            project={project}
            lang={lang}
            cursorLabel={t.openPrompt}
          />
        </div>

      </div>
    </article>
  );
}
