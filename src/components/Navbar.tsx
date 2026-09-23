import { useEffect, useState, useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HoverLinks from "./HoverLinks";
import { gsap } from "gsap";
import Lenis from "lenis";
import "./styles/Navbar.css";

gsap.registerPlugin(ScrollTrigger);
export let lenis: Lenis | null = null;

const Navbar = () => {
  const [isIslandOpen, setIsIslandOpen] = useState(false);
  const islandRef = useRef<HTMLDivElement>(null);

  const navigateTo = (sectionSelector: string) => {
    setIsIslandOpen(false);
    if (lenis) {
      const target = document.querySelector(sectionSelector) as HTMLElement;
      if (target) {
        lenis.scrollTo(target, {
          offset: -40,
          duration: 1.2,
        });
      }
    } else {
      const target = document.querySelector(sectionSelector);
      target?.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    // Close dynamic island on outside click
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (islandRef.current && !islandRef.current.contains(e.target as Node)) {
        setIsIslandOpen(false);
      }
    };
    if (isIslandOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isIslandOpen]);

  useEffect(() => {
    // Initialize Lenis smooth scroll
    lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.15,
      touchMultiplier: 1.5,
      infinite: false,
    });

    (window as any).lenis = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const onScrollTriggerRefresh = () => {
      lenis?.resize();
    };
    ScrollTrigger.addEventListener("refresh", onScrollTriggerRefresh);

    // Start paused
    lenis.stop();

    // Handle smooth scroll animation frame
    function raf(time: number) {
      lenis?.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Handle navigation links on all screen sizes
    let links = document.querySelectorAll(".header ul a");
    links.forEach((elem) => {
      let element = elem as HTMLAnchorElement;
      element.addEventListener("click", (e) => {
        e.preventDefault();
        let elem = e.currentTarget as HTMLAnchorElement;
        let section = elem.getAttribute("data-href") || elem.getAttribute("href");
        if (section && lenis) {
          const target = document.querySelector(section) as HTMLElement;
          if (target) {
            lenis.scrollTo(target, {
              offset: -40,
              duration: 1.2,
            });
          }
        }
      });
    });

    // Handle resize
    window.addEventListener("resize", () => {
      lenis?.resize();
    });

    return () => {
      ScrollTrigger.removeEventListener("refresh", onScrollTriggerRefresh);
      lenis?.destroy();
      (window as any).lenis = null;
    };
  }, []);

  return (
    <>
      {/* Desktop Header */}
      <div className="header">
        <a href="/#" className="navbar-title" data-cursor="disable">
          <img src="/logo.png" alt="Agency Logo" className="navbar-logo-img" />
          <span>AGENCY</span>
        </a>
        <a
          href="mailto:jakessrodriguezz@gmail.com"
          className="navbar-connect"
          data-cursor="disable"
        >
          jakessrodriguezz@gmail.com
        </a>
        <ul>
          <li>
            <a data-href="#about" href="#about">
              <HoverLinks text="AGENCIA" />
            </a>
          </li>
          <li>
            <a data-href="#work" href="#work">
              <HoverLinks text="PROYECTOS" />
            </a>
          </li>
          <li>
            <a data-href="#contact" href="#contact">
              <HoverLinks text="CONTACTO" />
            </a>
          </li>
        </ul>
      </div>

      {/* Mobile Dynamic Island Navigation (Bottom Center) */}
      <div
        className={`mobile-dynamic-island-container ${isIslandOpen ? "island-expanded" : "island-collapsed"}`}
        ref={islandRef}
      >
        {!isIslandOpen ? (
          <button
            type="button"
            className="dynamic-island-trigger"
            onClick={() => setIsIslandOpen(true)}
            aria-label="Abrir menú de navegación"
          >
            <div className="dynamic-island-glow-ring" />
            <img
              src="/logo.png"
              alt="JRG Logo"
              className="dynamic-island-logo-img"
            />
            <span className="dynamic-island-status-dot" />
          </button>
        ) : (
          <div className="dynamic-island-content">
            <button
              type="button"
              className="dynamic-island-mini-logo"
              onClick={() => setIsIslandOpen(false)}
              aria-label="Cerrar navegación"
            >
              <img src="/logo.png" alt="JRG" />
            </button>

            <nav className="dynamic-island-nav">
              <button
                type="button"
                className="dynamic-island-link"
                onClick={() => navigateTo("#about")}
              >
                AGENCIA
              </button>
              <button
                type="button"
                className="dynamic-island-link"
                onClick={() => navigateTo("#work")}
              >
                PROYECTOS
              </button>
              <button
                type="button"
                className="dynamic-island-link"
                onClick={() => navigateTo("#contact")}
              >
                CONTACTO
              </button>
            </nav>

            <button
              type="button"
              className="dynamic-island-close"
              onClick={() => setIsIslandOpen(false)}
              aria-label="Cerrar menú"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        )}
      </div>

      <div className="landing-circle1"></div>
      <div className="landing-circle2"></div>
      <div className="nav-fade"></div>
    </>
  );
};

export default Navbar;
