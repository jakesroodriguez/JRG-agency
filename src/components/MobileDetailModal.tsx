import { useState } from "react";
import { config } from "../config";
import { lenis } from "./Navbar";
import "./styles/MobileDetailModal.css";

export type ModalType = "about" | "develop" | "design" | null;

interface MobileDetailModalProps {
  type: ModalType;
  onClose: () => void;
}

export const MobileDetailModal = ({ type, onClose }: MobileDetailModalProps) => {
  const [activeTab, setActiveTab] = useState<"overview" | "tech" | "actions">("overview");
  const [copiedEmail, setCopiedEmail] = useState(false);

  if (!type) return null;

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(config.contact.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2200);
  };

  const handleScrollTo = (selector: string) => {
    onClose();
    setTimeout(() => {
      const target = document.querySelector(selector) as HTMLElement;
      if (target) {
        if (lenis) {
          lenis.scrollTo(target, { offset: -30, duration: 1.2 });
        } else {
          target.scrollIntoView({ behavior: "smooth" });
        }
      }
    }, 200);
  };

  const getContent = () => {
    switch (type) {
      case "about":
        return {
          badge: "AGENCIA & VISIÓN",
          title: "Sobre JRG Agency",
          subtitle: "Ingeniería Web & Narrativa Tridimensional Inmersiva",
          description: config.about.description,
          metrics: [
            { label: "Lighthouse", value: "100/100" },
            { label: "Ubicación", value: "Urretxu, País Vasco" },
            { label: "Enfoque", value: "Webs 3D & Alto Rendimiento" },
          ],
          points: [
            "Fusión única de arquitectura frontend de última generación y gráficos 3D en tiempo real.",
            "Desarrollo sin plantillas genéricas: cada proyecto se modela y programa a medida.",
            "Enfoque implacable en conversión de clientes, posicionamiento SEO local y velocidad extrema.",
          ],
          techs: ["React", "TypeScript", "Three.js", "WebGL", "Vite", "GSAP", "Tailwind CSS", "Vercel Edge"],
        };
      case "develop":
        return {
          badge: "INGENIERÍA FRONTEND",
          title: config.skills.develop.title,
          subtitle: config.skills.develop.description,
          description: config.skills.develop.details,
          metrics: [
            { label: "Core Web Vitals", value: "Aprobado (Verde)" },
            { label: "Tiempo de Carga", value: "< 0.8s" },
            { label: "Stack", value: "React + TS + Vite" },
          ],
          points: [
            "Arquitectura modular escalable optimizada para velocidad instantánea.",
            "Accesibilidad, semántica HTML5 y SEO técnico estructurado para destacar en Google.",
            "Integración de APIs seguras, despliegues continuos CI/CD en servidores Edge globales.",
          ],
          techs: config.skills.develop.tools,
        };
      case "design":
        return {
          badge: "3D & MOTION DESIGN",
          title: config.skills.design.title,
          subtitle: config.skills.design.description,
          description: config.skills.design.details,
          metrics: [
            { label: "Tecnología", value: "Three.js & WebGL" },
            { label: "Animación", value: "GSAP ScrollTrigger" },
            { label: "Fluidez", value: "60 FPS en móvil" },
          ],
          points: [
            "Escenas tridimensionales interactivas optimizadas para rendimiento en smartphones.",
            "Shaders personalizados, luces cinemáticas y sincronización milimétrica con el scroll.",
            "Diseño de interfaces vanguardistas que generan un impacto visual inolvidable.",
          ],
          techs: config.skills.design.tools,
        };
      default:
        return null;
    }
  };

  const data = getContent();
  if (!data) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-sheet"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Grab Handle */}
        <div className="modal-drag-handle-bar">
          <div className="modal-drag-handle" />
        </div>

        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <span className="modal-badge">{data.badge}</span>
            <h2 className="modal-title">{data.title}</h2>
            <p className="modal-subtitle">{data.subtitle}</p>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Cerrar ventana"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Tabs Bar */}
        <div className="modal-tabs">
          <button
            type="button"
            className={`modal-tab ${activeTab === "overview" ? "modal-tab-active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            Detalles
          </button>
          <button
            type="button"
            className={`modal-tab ${activeTab === "tech" ? "modal-tab-active" : ""}`}
            onClick={() => setActiveTab("tech")}
          >
            Tecnologías
          </button>
          <button
            type="button"
            className={`modal-tab ${activeTab === "actions" ? "modal-tab-active" : ""}`}
            onClick={() => setActiveTab("actions")}
          >
            Acciones
          </button>
        </div>

        {/* Tab Body */}
        <div className="modal-body">
          {activeTab === "overview" && (
            <div className="modal-tab-pane">
              <p className="modal-description">{data.description}</p>
              
              <div className="modal-metrics-grid">
                {data.metrics.map((m, idx) => (
                  <div key={idx} className="modal-metric-card">
                    <span className="metric-val">{m.value}</span>
                    <span className="metric-lbl">{m.label}</span>
                  </div>
                ))}
              </div>

              <div className="modal-highlights-list">
                <h4>Puntos Clave</h4>
                <ul>
                  {data.points.map((pt, idx) => (
                    <li key={idx}>
                      <span className="bullet-point">✦</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="modal-quick-action-row">
                <button
                  type="button"
                  className="modal-action-btn primary"
                  onClick={() => handleScrollTo("#contact")}
                >
                  <span>Trabajemos juntos</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
                <button
                  type="button"
                  className="modal-action-btn secondary"
                  onClick={() => setActiveTab("actions")}
                >
                  Más opciones
                </button>
              </div>
            </div>
          )}

          {activeTab === "tech" && (
            <div className="modal-tab-pane">
              <p className="modal-description">
                Stack moderno seleccionado rigurosamente para garantizar fluidez nativa a 60 FPS, puntuación 100/100 en Google Lighthouse y código mantenible.
              </p>

              <div className="modal-tech-chips">
                {data.techs.map((tech, idx) => (
                  <div key={idx} className="modal-chip">
                    <span className="chip-dot" />
                    <span>{tech}</span>
                  </div>
                ))}
              </div>

              <div className="modal-tech-box">
                <h5>¿Por qué este stack?</h5>
                <p>
                  Eliminamos sobrecargas innecesarias y dependencias pesadas. Cada byte que enviamos al cliente está optimizado para renderizar interfaces cinemáticas de impacto sin sacrificar velocidad ni batería en dispositivos móviles.
                </p>
              </div>

              <div className="modal-quick-action-row">
                <button
                  type="button"
                  className="modal-action-btn primary"
                  onClick={() => handleScrollTo("#work")}
                >
                  Ver Proyectos Hechos
                </button>
              </div>
            </div>
          )}

          {activeTab === "actions" && (
            <div className="modal-tab-pane">
              <p className="modal-description">
                Elige cómo prefieres comunicarte o explorar el trabajo de JRG Agency:
              </p>

              <div className="modal-action-buttons-group">
                <a
                  href={config.social.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="modal-big-action-btn whatsapp-btn"
                  onClick={onClose}
                >
                  <div className="btn-icon">💬</div>
                  <div className="btn-text">
                    <strong>Chat por WhatsApp Directo</strong>
                    <small>Respuesta rápida y asesoramiento sin compromiso</small>
                  </div>
                  <span className="btn-arrow">→</span>
                </a>

                <button
                  type="button"
                  className="modal-big-action-btn copy-btn"
                  onClick={handleCopyEmail}
                >
                  <div className="btn-icon">📋</div>
                  <div className="btn-text">
                    <strong>{copiedEmail ? "¡Email Copiado al portapapeles!" : "Copiar Email"}</strong>
                    <small>{config.contact.email}</small>
                  </div>
                  <span className="btn-arrow">{copiedEmail ? "✓" : "→"}</span>
                </button>

                <button
                  type="button"
                  className="modal-big-action-btn navigate-btn"
                  onClick={() => handleScrollTo("#work")}
                >
                  <div className="btn-icon">📂</div>
                  <div className="btn-text">
                    <strong>Explorar Proyectos</strong>
                    <small>Gure Trena, Urkulu Móviles, Otxaran Denda...</small>
                  </div>
                  <span className="btn-arrow">→</span>
                </button>

                <button
                  type="button"
                  className="modal-big-action-btn contact-btn"
                  onClick={() => handleScrollTo("#contact")}
                >
                  <div className="btn-icon">✉️</div>
                  <div className="btn-text">
                    <strong>Ir al Formulario de Contacto</strong>
                    <small>Envía tu consulta directamente</small>
                  </div>
                  <span className="btn-arrow">→</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
