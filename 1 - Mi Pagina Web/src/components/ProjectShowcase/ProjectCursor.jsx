import React, { useRef, useEffect } from 'react';

/**
 * ProjectCursor
 * Contextual floating glass badge that follows cursor inside project preview.
 */
export default function ProjectCursor({ isVisible, label = "OPEN ↗", position }) {
  const cursorRef = useRef(null);
  const posRef = useRef({
    currentX: 0,
    currentY: 0,
    targetX: 0,
    targetY: 0,
    rafId: null
  });

  useEffect(() => {
    if (!position) return;
    posRef.current.targetX = position.x;
    posRef.current.targetY = position.y;

    const lerp = (start, end, factor) => start + (end - start) * factor;

    const animate = () => {
      const pos = posRef.current;
      pos.currentX = lerp(pos.currentX, pos.targetX, 0.25);
      pos.currentY = lerp(pos.currentY, pos.targetY, 0.25);

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${pos.currentX.toFixed(2)}px, ${pos.currentY.toFixed(2)}px, 0) translate(-50%, -50%) scale(${isVisible ? 1 : 0.4})`;
      }

      if (isVisible || Math.hypot(pos.targetX - pos.currentX, pos.targetY - pos.currentY) > 0.1) {
        pos.rafId = requestAnimationFrame(animate);
      }
    };

    cancelAnimationFrame(posRef.current.rafId);
    posRef.current.rafId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(posRef.current.rafId);
  }, [position, isVisible]);

  return (
    <div
      ref={cursorRef}
      className={`project-context-cursor ${isVisible ? 'is-visible' : ''}`}
      aria-hidden="true"
    >
      <div className="context-cursor-glass">
        <span className="context-cursor-text">{label}</span>
      </div>
    </div>
  );
}
