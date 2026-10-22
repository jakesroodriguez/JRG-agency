import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import sounds from "./soundEffects";

export const CinematicCursor: React.FC = () => {
  const [isPointer, setIsPointer] = useState(false);
  const [cursorText, setCursorText] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // High-precision smooth spring physics
  const springX = useSpring(mouseX, { damping: 28, stiffness: 350 });
  const springY = useSpring(mouseY, { damping: 28, stiffness: 350 });

  // Slower ambient trail spring
  const trailX = useSpring(mouseX, { damping: 35, stiffness: 180 });
  const trailY = useSpring(mouseY, { damping: 35, stiffness: 180 });

  useEffect(() => {
    // Check if touchscreen
    if (window.matchMedia("(pointer: coarse)").matches) {
      setIsTouchDevice(true);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);

      // Check hovered element
      const target = e.target as HTMLElement | null;
      if (target) {
        const interactiveEl = target.closest("a, button, [data-cursor]");
        if (interactiveEl) {
          const cursorType = interactiveEl.getAttribute("data-cursor");
          if (cursorType === "view") {
            setIsPointer(true);
            setCursorText("VER ↗");
          } else {
            setIsPointer(true);
            setCursorText("");
          }
        } else {
          setIsPointer(false);
          setCursorText("");
        }
      }
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && target.closest("a, button, [role='button'], input, textarea")) {
        sounds.playClick();
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && target.closest("a, button, [role='button']")) {
        sounds.playHover();
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("click", handleClick);
    document.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("click", handleClick);
      document.removeEventListener("mouseover", handleMouseOver);
    };
  }, [isVisible, mouseX, mouseY]);

  if (isTouchDevice || !isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden select-none">
      {/* Dynamic Ambient Spotlight follower across dark surfaces */}
      <motion.div
        className="fixed top-0 left-0 w-[600px] h-[600px] rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2"
        style={{
          x: trailX,
          y: trailY,
          background: "radial-gradient(circle, rgba(222, 219, 200, 0.055) 0%, rgba(222, 219, 200, 0.015) 35%, transparent 70%)",
        }}
      />

      {/* Outer Halo Follower */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#DEDBC8]/40 flex items-center justify-center transition-all duration-200"
        style={{
          x: springX,
          y: springY,
          width: isPointer ? (cursorText ? 84 : 48) : 28,
          height: isPointer ? (cursorText ? 84 : 48) : 28,
          backgroundColor: isPointer ? "rgba(222, 219, 200, 0.12)" : "transparent",
          backdropFilter: isPointer ? "blur(2px)" : "none",
        }}
      >
        {cursorText && (
          <span className="text-[10px] font-mono font-bold tracking-wider text-[#E1E0CC]">
            {cursorText}
          </span>
        )}
      </motion.div>

      {/* Core Center Dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#E1E0CC] shadow-[0_0_10px_rgba(225,224,204,0.8)]"
        style={{
          x: mouseX,
          y: mouseY,
          width: isPointer ? (cursorText ? 0 : 6) : 5,
          height: isPointer ? (cursorText ? 0 : 6) : 5,
          opacity: cursorText ? 0 : 1,
        }}
      />
    </div>
  );
};

export default CinematicCursor;
