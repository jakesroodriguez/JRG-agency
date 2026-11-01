import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Compass,
  Layers,
  LayoutGrid,
  Send,
} from "lucide-react";
import sounds from "./soundEffects";

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  isCta?: boolean;
}

const navItems: NavItem[] = [
  { id: "hero", label: "Inicio", href: "#hero", icon: Home },
  { id: "about", label: "Estudio", href: "#about", icon: Compass },
  { id: "features", label: "Servicios", href: "#features", icon: Layers },
  { id: "portfolio", label: "Proyectos", href: "#portfolio", icon: LayoutGrid },
  { id: "contact", label: "Contactar", href: "#contact", icon: Send, isCta: true },
];

export const PrismaMobileBottomDock: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>("hero");
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [lastScrollY, setLastScrollY] = useState<number>(0);

  // Scroll direction detection (hide on rapid scroll down, show on scroll up)
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;

          // Always visible near top or bottom
          if (currentScrollY < 100 || currentScrollY + window.innerHeight >= document.body.scrollHeight - 100) {
            setIsVisible(true);
          } else if (currentScrollY > lastScrollY && currentScrollY - lastScrollY > 12) {
            // Scrolling down fast -> hide dock to give maximum reading area
            setIsVisible(false);
          } else if (lastScrollY - currentScrollY > 8) {
            // Scrolling up -> reveal dock immediately
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
    const sectionIds = ["hero", "about", "features", "portfolio", "method", "process", "metrics", "contact"];
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              if (id === "method" || id === "process") {
                setActiveSection("features");
              } else if (id === "metrics") {
                setActiveSection("portfolio");
              } else {
                setActiveSection(id);
              }
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
          initial={{ y: 80, opacity: 0, x: "-50%" }}
          animate={{ y: 0, opacity: 1, x: "-50%" }}
          exit={{ y: 80, opacity: 0, x: "-50%" }}
          transition={{ type: "spring", stiffness: 380, damping: 28 }}
          className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 md:hidden pointer-events-auto"
          aria-label="Navegación táctil móvil"
        >
          {/* Liquid Glass Pill Dock */}
          <div className="relative flex items-center gap-1.5 p-1.5 sm:p-2 rounded-full bg-[#0A0A0B]/85 backdrop-blur-2xl border border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.85),0_0_20px_rgba(194,168,143,0.12)]">
            {/* Top specular reflection rim */}
            <div className="absolute top-0 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-[#C2A88F]/40 to-transparent pointer-events-none" />

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;

              if (item.isCta) {
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.href)}
                    className="relative flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-gradient-to-r from-[#C2A88F] to-[#DEDBC8] text-black font-semibold text-xs tracking-wide shadow-[0_0_15px_rgba(194,168,143,0.4)] active:scale-95 transition-all"
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span className="font-sans text-[11px] font-bold">Contactar</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-700 animate-pulse" />
                  </button>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.href)}
                  className={`relative flex flex-col items-center justify-center w-11 h-11 rounded-full transition-all duration-300 active:scale-90 ${
                    isActive
                      ? "text-[#C2A88F] bg-white/[0.08]"
                      : "text-zinc-400 hover:text-white"
                  }`}
                  aria-label={item.label}
                >
                  <Icon className="w-4 h-4 transition-transform duration-200" />
                  <span className="text-[9px] font-mono tracking-tight mt-0.5 scale-90">
                    {item.label}
                  </span>

                  {/* Active dot indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeDockDot"
                      className="absolute -bottom-1 w-1 h-1 rounded-full bg-[#C2A88F] shadow-[0_0_6px_#C2A88F]"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};

export default PrismaMobileBottomDock;
