import React, { useRef, useEffect, useState } from 'react';

/**
 * MagneticButton
 * Sleek bounded magnetic hover button with physics inertia and animated arrow.
 */
export default function MagneticButton({
  href,
  onClick,
  children,
  className = '',
  target = '_blank',
  rel = 'noopener noreferrer',
  ariaLabel,
  style = {}
}) {
  const buttonRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  // Position state for physics
  const posRef = useRef({
    currentX: 0,
    currentY: 0,
    targetX: 0,
    targetY: 0,
    rafId: null
  });

  useEffect(() => {
    const el = buttonRef.current;
    if (!el) return;

    // Check if device supports fine hover (desktop vs touch)
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (!hasFinePointer) return;

    const lerp = (start, end, factor) => start + (end - start) * factor;

    const animate = () => {
      const pos = posRef.current;
      pos.currentX = lerp(pos.currentX, pos.targetX, 0.18);
      pos.currentY = lerp(pos.currentY, pos.targetY, 0.18);

      if (el) {
        el.style.transform = `translate3d(${pos.currentX.toFixed(2)}px, ${pos.currentY.toFixed(2)}px, 0) scale(${isHovered ? 1.025 : 1})`;
      }

      // Continue animating while there's still movement
      const dist = Math.hypot(pos.targetX - pos.currentX, pos.targetY - pos.currentY);
      if (dist > 0.05 || isHovered) {
        pos.rafId = requestAnimationFrame(animate);
      } else {
        pos.currentX = 0;
        pos.currentY = 0;
        if (el) el.style.transform = '';
      }
    };

    const handleMouseMove = (e) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const distanceX = e.clientX - centerX;
      const distanceY = e.clientY - centerY;

      // Bound magnetic pull strength (max 10px in X, 8px in Y)
      const maxPull = 10;
      posRef.current.targetX = Math.max(-maxPull, Math.min(maxPull, distanceX * 0.28));
      posRef.current.targetY = Math.max(-maxPull, Math.min(maxPull, distanceY * 0.28));

      cancelAnimationFrame(posRef.current.rafId);
      posRef.current.rafId = requestAnimationFrame(animate);
    };

    const handleMouseEnter = () => {
      setIsHovered(true);
      cancelAnimationFrame(posRef.current.rafId);
      posRef.current.rafId = requestAnimationFrame(animate);
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      posRef.current.targetX = 0;
      posRef.current.targetY = 0;
      cancelAnimationFrame(posRef.current.rafId);
      posRef.current.rafId = requestAnimationFrame(animate);
    };

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseenter', handleMouseEnter);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      cancelAnimationFrame(posRef.current.rafId);
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseenter', handleMouseEnter);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isHovered]);

  const Component = href ? 'a' : 'button';
  const props = href
    ? { href, target, rel, onClick }
    : { type: 'button', onClick };

  return (
    <Component
      ref={buttonRef}
      className={`showcase-magnetic-btn ${isHovered ? 'is-hovered' : ''} ${className}`}
      aria-label={ariaLabel}
      style={style}
      {...props}
    >
      <span className="magnetic-btn-glow" aria-hidden="true" />
      <span className="magnetic-btn-content">
        <span className="magnetic-btn-text">{children}</span>
        <span className="magnetic-btn-arrow-wrap">
          <svg
            className="magnetic-btn-arrow"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="7" y1="17" x2="17" y2="7" />
            <polyline points="7 7 17 7 17 17" />
          </svg>
        </span>
      </span>
    </Component>
  );
}
