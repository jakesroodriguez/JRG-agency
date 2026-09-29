import { useEffect, useRef } from "react";
import "./styles/About.css";
import { config } from "../config";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const cardRef = useRef<HTMLDivElement>(null);

  const openModal = () => {
    window.dispatchEvent(new CustomEvent("open-detail-modal", { detail: "about" }));
  };

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    // Estado inicial: invisible y desplazada hacia abajo
    gsap.set(card, { opacity: 0, y: 60 });

    const trigger = ScrollTrigger.create({
      trigger: card,
      start: "top 85%",   // empieza cuando el top de la tarjeta llega al 85% del viewport
      end: "top 35%",     // completa cuando llega al 35%
      scrub: 1.2,         // sigue el scroll suavemente
      onUpdate: (self) => {
        gsap.to(card, {
          opacity: self.progress,
          y: 60 * (1 - self.progress),
          duration: 0,
          ease: "none",
        });
      },
    });

    return () => {
      trigger.kill();
      gsap.set(card, { clearProps: "all" });
    };
  }, []);

  return (
    <div className="about-section" id="about">
      <div className="about-me" ref={cardRef}>
        <div className="about-title-row">
          <img src="/logoJRG.png" alt="JRG Logo" className="about-logo-badge" />
          <h3 className="title">{config.about.title}</h3>
        </div>
        <p className="para">
          {config.about.description}
        </p>

        {/* Mobile Interactive Action */}
        <div className="about-mobile-actions">
          <div className="about-highlights-pills">
            <span className="about-pill">Lighthouse 100/100</span>
            <span className="about-pill">Three.js WebGL</span>
            <span className="about-pill">Urretxu</span>
          </div>
          <button
            type="button"
            className="about-interactive-btn"
            onClick={openModal}
          >
            <span>Conocer más sobre JRG Agency</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default About;
