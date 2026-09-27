import React, { useState, useEffect, useRef, useCallback } from "react";
import gsap from "gsap";

const MAX_VISIBLE = 7;
const HALF = 3;

const FAN_POSITIONS = [
  { rot: -21, scale: 0.7756, x: -30, y: 7.3, zIndex: 1 },
  { rot: -14, scale: 0.8498, x: -22, y: 4.0, zIndex: 2 },
  { rot: -7,  scale: 0.9346, x: -11, y: 1.3, zIndex: 3 },
  { rot: 0,   scale: 1.0,    x: 0,   y: 0.0, zIndex: 10 },
  { rot: 7,   scale: 0.9346, x: 11,  y: 1.3, zIndex: 3 },
  { rot: 14,  scale: 0.8498, x: 22,  y: 4.0, zIndex: 2 },
  { rot: 21,  scale: 0.7756, x: 30,  y: 7.3, zIndex: 1 },
];

function getResponsiveMultiplier(width) {
  if (width < 480) return 0.28;
  if (width < 640) return 0.38;
  if (width < 768) return 0.5;
  if (width < 1024) return 0.75;
  return 1.0;
}

function getHeightMultiplier(width) {
  let idealPx;
  if (width < 480) idealPx = 22 * 16;
  else if (width < 640) idealPx = 26 * 16;
  else if (width < 768) idealPx = 28 * 16;
  else if (width < 1024) idealPx = 34 * 16;
  else idealPx = 38 * 16;

  const available = window.innerHeight * 0.7;
  if (available >= idealPx) return 1;
  return available / idealPx;
}

function getSlotConfig(totalCards, slot) {
  // Center the cards using the predefined FAN_POSITIONS.
  // For 3 cards, offset = 2 (slots 2, 3, 4) -> x: -11, 0, 11
  const offset = Math.max(0, Math.floor((MAX_VISIBLE - totalCards) / 2));
  let actualSlot = slot + offset;
  
  if (actualSlot < 0) actualSlot = 0;
  if (actualSlot >= FAN_POSITIONS.length) actualSlot = FAN_POSITIONS.length - 1;
  
  // Custom tighter spacing if there are very few cards (e.g. 3) to look more compact
  const pos = { ...FAN_POSITIONS[actualSlot] };
  if (totalCards <= 3) {
    pos.x = pos.x * 0.7; // Bring them closer
    pos.rot = pos.rot * 0.6; // Less rotation
  }
  
  return pos;
}

export default function CardFanCarousel({ cards }) {
  const containerRef = useRef(null);
  const isAnimating = useRef(false);
  const hasEntered = useRef(false);
  const directionRef = useRef(null);
  const prevVisible = useRef(new Set());

  const totalCards = cards.length;
  const needsPagination = totalCards > MAX_VISIBLE;
  const [centerIndex, setCenterIndex] = useState(needsPagination ? HALF : totalCards >> 1);

  const getVisibleMap = useCallback((center) => {
    const map = new Map();
    if (!needsPagination) {
      cards.forEach((_, i) => map.set(i, i));
      return map;
    }
    for (let slot = 0; slot < MAX_VISIBLE; slot++) {
      map.set(((center + slot - HALF) % totalCards + totalCards) % totalCards, slot);
    }
    return map;
  }, [totalCards, needsPagination, cards]);

  const cycle = useCallback((direction) => {
    if (isAnimating.current || !needsPagination) return;
    isAnimating.current = true;
    directionRef.current = direction;
    setCenterIndex(prev =>
      direction === "right" ? (prev + 1) % totalCards : (prev - 1 + totalCards) % totalCards
    );
  }, [totalCards, needsPagination]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !totalCards) return;

    const cardElements = Array.from(container.querySelectorAll(".fan-card"));
    if (!cardElements.length) return;

    const visibleMap = getVisibleMap(centerIndex);
    const previouslyVisible = prevVisible.current;
    const direction = directionRef.current;
    const isFirstMount = !hasEntered.current;
    const multiplier = getResponsiveMultiplier(window.innerWidth);
    const hMult = getHeightMultiplier(window.innerWidth);
    const slotCount = needsPagination ? MAX_VISIBLE : totalCards;
    const config = (slot) => getSlotConfig(slotCount, slot);

    if (isFirstMount) isAnimating.current = true;

    let completedCount = 0;
    const visibleCount = visibleMap.size;
    const onCardDone = () => {
      if (++completedCount >= visibleCount) {
        isAnimating.current = false;
        if (isFirstMount) hasEntered.current = true;
      }
    };

    cardElements.forEach((card, cardIndex) => {
      const slot = visibleMap.get(cardIndex);
      const wasVisible = previouslyVisible.has(cardIndex);

      if (slot !== undefined) {
        const { x, y, rot, scale, zIndex } = config(slot);
        const target = {
          x: `${x * multiplier}rem`,
          y: `${y * hMult}rem`,
          rotation: rot,
          scale,
          opacity: 1,
          zIndex,
        };

        if (isFirstMount) {
          gsap.set(card, { x: 0, y: `${12 * hMult}rem`, rotation: 0, scale: 0.5, opacity: 0 });
          gsap.to(card, { ...target, duration: 1.2, ease: "elastic.out(1.05,.78)", delay: 0.2 + slot * 0.06, onComplete: onCardDone });
        } else if (!wasVisible) {
          const enterX = direction === "right" ? 40 : -40;
          gsap.set(card, { x: `${enterX}rem`, y: `${y * hMult}rem`, rotation: direction === "right" ? 30 : -30, scale: 0.5, opacity: 0 });
          gsap.to(card, { ...target, duration: 0.6, ease: "power2.out", onComplete: onCardDone });
        } else {
          gsap.to(card, { ...target, duration: 0.5, ease: "power2.out", onComplete: onCardDone });
        }
      } else if (wasVisible) {
        const exitX = direction === "right" ? -40 : 40;
        gsap.to(card, { x: `${exitX}rem`, opacity: 0, scale: 0.5, rotation: direction === "right" ? -30 : 30, duration: 0.4, ease: "power2.in", zIndex: 0 });
      } else if (isFirstMount) {
        gsap.set(card, { opacity: 0, scale: 0.3, x: 0, y: 0, zIndex: 0 });
      }
    });

    prevVisible.current = new Set(visibleMap.keys());

    // Hover interactions
    const visibleEntries = [];
    cardElements.forEach((el, i) => {
      const slot = visibleMap.get(i);
      if (slot !== undefined) visibleEntries.push({ el, slot });
    });
    visibleEntries.sort((a, b) => a.slot - b.slot);

    let activeSlot = null;
    let leaveTimer = null;
    const centerSlot = visibleEntries.length >> 1;

    const updateHoverLayout = (hoveredSlot) => {
      const mult = getResponsiveMultiplier(window.innerWidth);
      const hM = getHeightMultiplier(window.innerWidth);

      visibleEntries.forEach(({ el, slot }) => {
        const base = config(slot);
        let targetX = base.x * mult;
        let targetY = base.y * hM;
        let targetRot = base.rot;
        let targetScale = base.scale;
        let delay = 0;

        if (hoveredSlot !== null) {
          const distance = Math.abs(slot - hoveredSlot);
          delay = distance * 0.02;

          if (slot === hoveredSlot) {
            targetY -= 2.5 * hM;
            targetScale *= 1.08;
          } else {
            const normalized = centerSlot > 0 ? (slot - centerSlot) / centerSlot : 0;
            const pushFactor = totalCards <= 3 ? 3 : 8; // less push for 3 cards
            const pushStrength = pushFactor * (1 - Math.abs(normalized)) * (1 + 0.2 * Math.max(0, 3 - distance));

            if (slot < hoveredSlot) {
              targetX -= pushStrength * mult;
              targetRot -= 2 / (distance + 1);
            } else {
              targetX += pushStrength * mult;
              targetRot += 2 / (distance + 1);
            }

            if (slot === visibleEntries.length - 1 && hoveredSlot < centerSlot) targetY -= 1 * hM;
            if (slot === 0 && hoveredSlot > centerSlot) targetY -= 1 * hM;
          }
        } else {
          delay = Math.abs(slot - centerSlot) * 0.02;
        }

        gsap.to(el, {
          x: `${targetX}rem`, y: `${targetY}rem`, rotation: targetRot, scale: targetScale,
          duration: 0.5, delay, ease: "elastic.out(1,.75)", overwrite: "auto",
        });
        gsap.set(el, { zIndex: base.zIndex });
      });
    };

    const enterHandlers = visibleEntries.map(({ el, slot }) => {
      const handler = () => {
        if (isAnimating.current) return;
        if (leaveTimer) { clearTimeout(leaveTimer); leaveTimer = null; }
        if (activeSlot !== slot) { activeSlot = slot; updateHoverLayout(slot); }
      };
      el.addEventListener("mouseenter", handler);
      return { el, handler };
    });

    const onMouseLeave = () => {
      if (isAnimating.current) return;
      if (leaveTimer) clearTimeout(leaveTimer);
      leaveTimer = setTimeout(() => { activeSlot = null; updateHoverLayout(null); }, 50);
    };
    container.addEventListener("mouseleave", onMouseLeave);

    const onResize = () => { if (!isAnimating.current) updateHoverLayout(activeSlot); };
    window.addEventListener("resize", onResize);

    return () => {
      enterHandlers.forEach(({ el, handler }) => el.removeEventListener("mouseenter", handler));
      container.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("resize", onResize);
      if (leaveTimer) clearTimeout(leaveTimer);
    };
  }, [centerIndex, totalCards, getVisibleMap, needsPagination]);

  if (!totalCards) return null;

  const chevron = (direction) => (
    <svg className="fc-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points={direction === "left" ? "15 18 9 12 15 6" : "9 18 15 12 9 6"} />
    </svg>
  );

  return (
    <>
      <style>{`
        .fc-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          padding: 2rem 1rem;
          position: relative;
          z-index: 20;
          min-height: 500px;
        }
        .fc-layout-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          max-width: 90rem;
        }
        .fan-layout {
          display: flex;
          position: relative;
          justify-content: center;
          align-items: center;
          width: 100%;
          max-width: 80rem;
          height: 450px;
          margin-top: 2rem;
        }
        .fan-layout::before {
          content: "";
          position: absolute;
          width: 70%;
          height: 70%;
          background: radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 0;
          pointer-events: none;
        }
        .fan-card {
          position: absolute;
          display: block;
          width: 280px;
          height: 400px;
          border-radius: 20px;
          overflow: hidden;
          cursor: pointer;
          box-shadow: 0 20px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.2);
          border: 1px solid rgba(255,255,255,0.15);
          background: #111;
          will-change: transform;
        }
        .fan-card img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          z-index: 10;
          transition: transform 0.5s ease;
        }
        .fan-card:hover img {
          transform: scale(1.05);
        }
        .fc-card-content {
          position: absolute;
          inset: 0;
          z-index: 20;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 1.5rem;
          background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 50%, transparent 100%);
        }
        .fc-card-title {
          color: #fff;
          font-size: 1.25rem;
          font-weight: 700;
          margin: 0 0 0.5rem 0;
          line-height: 1.2;
        }
        .fc-card-desc {
          color: rgba(255,255,255,0.8);
          font-size: 0.9rem;
          line-height: 1.4;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .fc-pagination {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          margin-top: 2rem;
          z-index: 30;
        }
        .fc-arrow {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          border: 1.5px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.05);
          backdrop-filter: blur(16px);
          color: rgba(255,255,255,0.7);
          cursor: pointer;
          flex-shrink: 0;
          z-index: 30;
          outline: none;
          box-shadow: 0 4px 20px rgba(0,0,0,0.4);
          transition: all 0.3s;
          width: 3rem;
          height: 3rem;
        }
        .fc-arrow:hover {
          border-color: rgba(255,255,255,0.3);
          color: #fff;
          background: rgba(255,255,255,0.1);
        }
        .fc-chevron {
          width: 1.25rem;
          height: 1.25rem;
          position: relative;
          z-index: 2;
        }
        .fc-dots {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .fc-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          transition: all 0.3s;
        }
        .fc-dot.active {
          background: rgba(255,255,255,0.9);
          transform: scale(1.3);
        }
        .fc-dot.inactive {
          background: rgba(255,255,255,0.2);
        }
      `}</style>

      <section className="fc-container">
        <div className="fc-layout-wrapper">
          <div ref={containerRef} className="fan-layout">
            {cards.map((card, index) => {
              const imageContent = (
                <>
                  <img src={card.imgUrl} loading="lazy" alt={card.alt || card.title || `Card ${index}`} />
                  {(card.title || card.desc) && (
                    <div className="fc-card-content">
                      {card.title && <h3 className="fc-card-title">{card.title}</h3>}
                      {card.desc && <p className="fc-card-desc">{card.desc}</p>}
                    </div>
                  )}
                </>
              );
              return card.linkUrl ? (
                <a key={index} href={card.linkUrl} target="_blank" rel="noopener noreferrer" className="fan-card">
                  {imageContent}
                </a>
              ) : (
                <div key={index} className="fan-card">
                  {imageContent}
                </div>
              );
            })}
          </div>
        </div>

        {needsPagination && (
          <div className="fc-pagination">
            <button className="fc-arrow" onClick={() => cycle("left")} aria-label="Previous">
              {chevron("left")}
            </button>
            <div className="fc-dots">
              {cards.map((_, i) => (
                <span key={i} className={`fc-dot ${i === centerIndex ? "active" : "inactive"}`} />
              ))}
            </div>
            <button className="fc-arrow" onClick={() => cycle("right")} aria-label="Next">
              {chevron("right")}
            </button>
          </div>
        )}
      </section>
    </>
  );
}
