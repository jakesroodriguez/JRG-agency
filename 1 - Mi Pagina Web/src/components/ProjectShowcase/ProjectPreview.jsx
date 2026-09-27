import React, { useRef, useState, useEffect, useCallback } from 'react';
import ProjectCursor from './ProjectCursor';

/**
 * ProjectPreview
 * 3D Interactive Floating Mockup with Desktop browser frame,
 * multi-layer parallax, dynamic spotlight, and fluid inertia.
 */
export default function ProjectPreview({
  project,
  lang = 'es',
  onPreviewClick,
  cursorLabel = "OPEN ↗"
}) {
  const containerRef = useRef(null);
  const cardRef = useRef(null);
  
  const [isHovered, setIsHovered] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  // Physics refs for ultra smooth 3D tilt
  const physicsRef = useRef({
    currentRotX: 0,
    currentRotY: 0,
    targetRotX: 0,
    targetRotY: 0,
    currentTransZ: 0,
    targetTransZ: 0,
    spotlightX: 50,
    spotlightY: 50,
    rafId: null
  });

  const lerp = (start, end, factor) => start + (end - start) * factor;

  const updateTransform = useCallback(() => {
    const p = physicsRef.current;
    const card = cardRef.current;
    if (!card) return;

    p.currentRotX = lerp(p.currentRotX, p.targetRotX, 0.12);
    p.currentRotY = lerp(p.currentRotY, p.targetRotY, 0.12);
    p.currentTransZ = lerp(p.currentTransZ, p.targetTransZ, 0.14);

    // Apply main 3D matrix
    card.style.transform = `
      perspective(1300px)
      rotateX(${p.currentRotX.toFixed(3)}deg)
      rotateY(${p.currentRotY.toFixed(3)}deg)
      translateZ(${p.currentTransZ.toFixed(2)}px)
    `;

    // Dynamic spotlight CSS properties
    card.style.setProperty('--spotlight-x', `${p.spotlightX.toFixed(1)}%`);
    card.style.setProperty('--spotlight-y', `${p.spotlightY.toFixed(1)}%`);

    const rotDiff = Math.hypot(p.targetRotX - p.currentRotX, p.targetRotY - p.currentRotY);
    const zDiff = Math.abs(p.targetTransZ - p.currentTransZ);

    if (rotDiff > 0.01 || zDiff > 0.1 || isHovered) {
      p.rafId = requestAnimationFrame(updateTransform);
    } else {
      p.currentRotX = 0;
      p.currentRotY = 0;
      p.currentTransZ = 0;
      card.style.transform = '';
    }
  }, [isHovered]);

  const handleMouseMove = (e) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setCursorPos({ x, y });

    // Calculate normalized -1 to +1 coordinates from center
    const normalizedX = (x / rect.width - 0.5) * 2;
    const normalizedY = (y / rect.height - 0.5) * 2;

    // Max rotation angles (degrees)
    const maxRotY = 12; // horizontal rotation
    const maxRotX = -10; // vertical rotation (inverted for natural tilt)

    const p = physicsRef.current;
    p.targetRotX = normalizedY * maxRotX;
    p.targetRotY = normalizedX * maxRotY;
    p.targetTransZ = 35; // Lift up in 3D space

    // Spotlight percentage
    p.spotlightX = (x / rect.width) * 100;
    p.spotlightY = (y / rect.height) * 100;

    cancelAnimationFrame(p.rafId);
    p.rafId = requestAnimationFrame(updateTransform);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    cancelAnimationFrame(physicsRef.current.rafId);
    physicsRef.current.rafId = requestAnimationFrame(updateTransform);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    const p = physicsRef.current;
    p.targetRotX = 0;
    p.targetRotY = 0;
    p.targetTransZ = 0;
    cancelAnimationFrame(p.rafId);
    p.rafId = requestAnimationFrame(updateTransform);
  };

  // Device orientation / gyroscope support for mobile preview tilt
  useEffect(() => {
    const handleOrientation = (event) => {
      if (window.innerWidth > 768) return;
      const { gamma, beta } = event;
      if (gamma === null || beta === null) return;

      const p = physicsRef.current;
      const clampedGamma = Math.max(-25, Math.min(25, gamma));
      const clampedBeta = Math.max(-20, Math.min(20, beta - 45));

      p.targetRotY = (clampedGamma / 25) * 8;
      p.targetRotX = -(clampedBeta / 20) * 6;

      cancelAnimationFrame(p.rafId);
      p.rafId = requestAnimationFrame(updateTransform);
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation, { passive: true });
    }

    return () => {
      cancelAnimationFrame(physicsRef.current.rafId);
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, [updateTransform]);

  return (
    <div
      ref={containerRef}
      className={`showcase-preview-container ${isHovered ? 'is-hovered' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        '--project-accent': project.accentColor,
        '--project-glow': project.glowColor
      }}
    >
      {/* Contextual Floating Glass Cursor Badge */}
      <ProjectCursor isVisible={isHovered} label={cursorLabel} position={cursorPos} />

      {/* Layer 1: Ambient Background Glow with dynamic radial spotlight */}
      <div className="preview-ambient-glow" aria-hidden="true" />

      {/* Main 3D Floating Canvas */}
      <a
        ref={cardRef}
        href={project.liveUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="preview-3d-card"
        onClick={onPreviewClick}
        aria-label={`${project.title} - ${project.url}`}
      >
        {/* Dynamic Specular Spotlight / Lighting Layer */}
        <div className="preview-spotlight-overlay" aria-hidden="true" />
        <div className="preview-glass-sheen" aria-hidden="true" />

        {/* Desktop Browser Frame */}
        <div className="preview-browser-frame">
          {/* Top Window Bar */}
          <div className="browser-top-bar">
            <div className="browser-window-dots" aria-hidden="true">
              <span className="dot dot-close" />
              <span className="dot dot-minimize" />
              <span className="dot dot-expand" />
            </div>

            {/* Address bar with lock & URL */}
            <div className="browser-address-pill">
              <svg
                className="browser-lock-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span className="browser-url-text">{project.url}</span>
            </div>

            {/* Status dot / Live badge */}
            <div className="browser-status-pill">
              <span className="status-live-dot" />
              <span className="status-live-label">LIVE</span>
            </div>
          </div>

          {/* Viewport & UI Content */}
          <div className="browser-viewport" style={{ background: project.fallbackBg }}>
            {project.image ? (
              <img
                src={project.image}
                alt={`Preview of ${project.title}`}
                className="browser-screenshot"
                loading="lazy"
                decoding="async"
              />
            ) : (
              <div className="browser-screenshot-fallback">
                <div className="fallback-grid" />
                <div className="fallback-badge">{project.title}</div>
              </div>
            )}

            {/* Depth vignette inside screenshot */}
            <div className="browser-depth-vignette" aria-hidden="true" />

            {/* Parallax Floating Micro-Badges */}
            <div className="preview-floating-badges" aria-hidden="true">
              {project.previewBadges && project.previewBadges.map((badge, idx) => (
                <div
                  key={idx}
                  className={`floating-badge badge-${badge.type}`}
                  style={{
                    transform: `translateZ(${idx === 0 ? '45px' : '35px'})`,
                    animationDelay: `${idx * 0.4}s`
                  }}
                >
                  {badge.type === 'success' && <span className="badge-dot" />}
                  <span>{badge.text}</span>
                </div>
              ))}
            </div>

            {/* Key Metric overlay in bottom right */}
            {project.metrics && project.metrics.length > 0 && (
              <div className="preview-metric-overlay" aria-hidden="true">
                <div className="metric-overlay-val">{project.metrics[0].value}</div>
                <div className="metric-overlay-lbl">{project.metrics[0].label}</div>
              </div>
            )}
          </div>
        </div>

        {/* Reflection rim on border */}
        <div className="preview-border-highlight" aria-hidden="true" />
      </a>
    </div>
  );
}
