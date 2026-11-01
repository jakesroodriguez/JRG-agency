import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, LayoutGrid, Send } from "lucide-react";
import sounds from "./soundEffects";

export const PrismaMobileBottomDock: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>("hero");
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [lastScrollY, setLastScrollY] = useState<number>(0);

  // Scroll direction detection (hide on rapid scroll down, reveal on scroll up)
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;

          // Always visible near top or bottom
          if (currentScrollY < 120 || currentScrollY + window.innerHeight >= document.body.scrollHeight - 100) {
            setIsVisible(true);
          } else if (currentScrollY > lastScrollY && currentScrollY - lastScrollY > 15) {
            // Scrolling down fast -> hide dock to give maximum reading area
            setIsVisible(false);
          } else if (lastScrollY - currentScrollY > 10) {
            // Scrolling up -> reveal dock smoothly
            setIsVisible(true);
          }

          setLastScrollY(currentScrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Active section spy using IntersectionObserver
  useEffect(() => {
    const sectionIds = ["hero", "portfolio", "contact"];
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(id);
            }
          });
        },
        { threshold: 0.25, rootMargin: "-10% 0px -50% 0px" }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, []);

  const handleNavClick = (href: string) => {
    sounds.playClick();
    const targetEl = document.querySelector(href);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.aside
          initial={{ y: 60, opacity: 0, x: "-50%" }}
          animate={{ y: 0, opacity: 1, x: "-50%" }}
          exit={{ y: 60, opacity: 0, x: "-50%" }}
          transition={{ type: "spring", stiffness: 420, damping: 30 }}
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 md:hidden pointer-events-auto"
          aria-label="Navegación táctil móvil minimalista"
        >
          {/* Micro-Pill Floating Dock (Height: 38px) */}
          <div className="relative flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0A0A0B]/85 backdrop-blur-2xl border border-white/10 shadow-[0_12px_32px_rgba(0,0,0,0.85),0_0_15px_rgba(194,168,143,0.12)]">
            {/* Top specular hairline highlight */}
            <div className="absolute top-0 left-3 right-3 h-[1px] bg-gradient-to-r from-transparent via-[#C2A88F]/40 to-transparent pointer-events-none" />

            {/* 01. Inicio */}
            <button
              onClick={() => handleNavClick("#hero")}
              className={`p-2 rounded-full transition-colors active:scale-90 ${
                activeSection === "hero"
                  ? "text-[#C2A88F]"
                  : "text-zinc-400 hover:text-white"
              }`}
              aria-label="Inicio"
            >
              <Home className="w-4 h-4" />
            </button>

            {/* Vertical hairline divider */}
            <div className="w-px h-3.5 bg-white/10" />

            {/* 02. Proyectos */}
            <button
              onClick={() => handleNavClick("#portfolio")}
              className={`p-2 rounded-full transition-colors active:scale-90 ${
                activeSection === "portfolio"
                  ? "text-[#C2A88F]"
                  : "text-zinc-400 hover:text-white"
              }`}
              aria-label="Proyectos"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>

            {/* Vertical hairline divider */}
            <div className="w-px h-3.5 bg-white/10" />

            {/* 03. Contactar CTA Micro-Pill */}
            <button
              onClick={() => handleNavClick("#contact")}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-[#DEDBC8] to-[#C2A88F] text-black text-[11px] font-sans font-bold tracking-tight shadow-[0_0_12px_rgba(194,168,143,0.35)] active:scale-95 transition-transform"
              aria-label="Contactar"
            >
              <Send className="w-3 h-3 text-black" />
              <span>Contactar</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse ml-0.5" />
            </button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};

export default PrismaMobileBottomDock;
