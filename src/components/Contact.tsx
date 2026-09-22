import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { MdArrowOutward, MdCopyright, MdContentCopy, MdCheck } from "react-icons/md";
import { FaWhatsapp, FaGithub, FaLinkedinIn, FaInstagram } from "react-icons/fa";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { config } from "../config";
import "./styles/Contact.css";

gsap.registerPlugin(ScrollTrigger);

const projectTypes = [
  {
    id: "3d",
    label: "Web 3D Inmersiva",
    icon: "🌐",
    message:
      "Hola JRG! Me interesa una web 3D inmersiva con Three.js/WebGL para mi negocio. ¿Podemos hablar?",
  },
  {
    id: "corp",
    label: "Web Corporativa",
    icon: "🏢",
    message:
      "Hola JRG! Necesito una web corporativa profesional y de alto rendimiento. ¿Hablamos?",
  },
  {
    id: "shop",
    label: "Catálogo / Tienda",
    icon: "🛒",
    message:
      "Hola JRG! Quiero un catálogo online o tienda web para mi negocio. ¿Podemos hablar?",
  },
  {
    id: "seo",
    label: "Optimización & SEO",
    icon: "📈",
    message:
      "Hola JRG! Me interesa optimizar mi web actual (velocidad, SEO, Core Web Vitals). ¿Hablamos?",
  },
];

const socialLinks = [
  { name: "GitHub", url: config.contact.github, icon: <FaGithub /> },
  { name: "LinkedIn", url: config.contact.linkedin, icon: <FaLinkedinIn /> },
  { name: "Instagram", url: config.contact.instagram, icon: <FaInstagram /> },
  {
    name: "Web JRG Estudio",
    url: config.contact.website,
    icon: <MdArrowOutward />,
  },
];

const Contact = () => {
  const [selectedProject, setSelectedProject] = useState(projectTypes[0]);
  const [copied, setCopied] = useState(false);

  const whatsappUrl = `${config.contact.whatsapp}?text=${encodeURIComponent(selectedProject.message)}`;

  const handleCopy = useCallback(() => {
    const fallbackCopy = () => {
      try {
        const textArea = document.createElement("textarea");
        textArea.value = config.contact.email;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      } catch {
        /* ignore */
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(config.contact.email)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2200);
        })
        .catch(() => {
          fallbackCopy();
        });
    } else {
      fallbackCopy();
    }
  }, []);

  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".contact-section",
        start: "top 85%",
        toggleActions: "play none none none",
      },
    });

    tl.fromTo(
      ".contact-frame",
      { opacity: 0, y: 35 },
      { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }
    )
      .fromTo(
        ".contact-status",
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.4 },
        "-=0.4"
      )
      .fromTo(
        ".contact-headline",
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 0.5 },
        "-=0.2"
      )
      .fromTo(
        ".contact-subheadline",
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.4 },
        "-=0.2"
      )
      .fromTo(
        ".bento-card",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: "power2.out",
        },
        "-=0.2"
      )
      .fromTo(
        ".contact-footer",
        { opacity: 0 },
        { opacity: 1, duration: 0.4 },
        "-=0.2"
      );

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section className="contact-section" id="contact">
      <div className="contact-wrapper">
        <div className="contact-frame">
          {/* Subtle ambient light gradient inside frame */}
          <div className="frame-ambient-light" />

          {/* ─── CABECERA DE IMPACTO ─── */}
          <div className="contact-header">
            <div className="contact-status">
              <span className="status-dot" />
              <span className="status-text">
                DISPONIBLE PARA NUEVOS PROYECTOS · RESPUESTA EN &lt; 2H
              </span>
            </div>
            <h2 className="contact-headline">
              ¿Listo para llevar tu marca
              <br />a otra dimensión?
            </h2>
            <p className="contact-subheadline">
              Cuéntanos tu idea y la transformamos en una experiencia web que se
              siente, se recuerda y convierte.
            </p>
          </div>

          {/* ─── BENTO GRID ─── */}
          <div className="contact-bento">
            {/* Tarjeta WhatsApp — columna izquierda */}
            <div className="bento-card bento-whatsapp">
              <div className="bento-card-inner">
                <div className="wa-top">
                  <h4 className="bento-label">WHATSAPP DIRECTO</h4>
                  <p className="bento-hint">Selecciona tu tipo de proyecto:</p>
                  <div className="project-selector">
                    {projectTypes.map((p) => (
                      <button
                        key={p.id}
                        className={`project-pill ${selectedProject.id === p.id ? "active" : ""}`}
                        onClick={() => setSelectedProject(p)}
                        type="button"
                      >
                        <span className="pill-icon">{p.icon}</span>
                        <span className="pill-text">{p.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="wa-bottom">
                  <a
                    href={whatsappUrl}
                    className="bento-cta-whatsapp"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="disable"
                  >
                    <FaWhatsapp className="wa-icon" />
                    Abrir WhatsApp con esta consulta →
                  </a>
                  <span className="bento-phone">
                    <FaWhatsapp className="phone-icon" /> {config.contact.phone} ·
                    Horario CET (País Vasco)
                  </span>
                </div>
              </div>
            </div>

            {/* Tarjeta Email + Teléfono + Ubicación */}
            <div className="bento-card bento-email">
              <div className="bento-card-inner">
                <h4 className="bento-label">EMAIL</h4>
                <div className="email-row">
                  <a
                    href={`mailto:${config.contact.email}`}
                    className="email-address"
                    data-cursor="disable"
                  >
                    {config.contact.email}
                  </a>
                  <button
                    className={`copy-btn ${copied ? "copied" : ""}`}
                    onClick={handleCopy}
                    aria-label="Copiar email"
                    type="button"
                  >
                    {copied ? (
                      <>
                        <MdCheck className="copy-icon check-icon" /> ¡Copiado!
                      </>
                    ) : (
                      <>
                        <MdContentCopy className="copy-icon" /> Copiar
                      </>
                    )}
                  </button>
                </div>

                <div className="details-grid">
                  <div className="detail-item">
                    <h4 className="bento-label">TELÉFONO</h4>
                    <a
                      href={`tel:${config.contact.phone}`}
                      className="bento-value"
                      data-cursor="disable"
                    >
                      {config.contact.phone}
                    </a>
                  </div>
                  <div className="detail-item">
                    <h4 className="bento-label">UBICACIÓN</h4>
                    <span className="bento-value">{config.social.location}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tarjeta Redes & Enlaces */}
            <div className="bento-card bento-links">
              <div className="bento-card-inner">
                <h4 className="bento-label">REDES &amp; ENLACES</h4>
                <div className="social-list">
                  {socialLinks.map((link) => (
                    <a
                      key={link.name}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-row"
                      data-cursor="disable"
                    >
                      <span className="social-icon">{link.icon}</span>
                      <span className="social-name">{link.name}</span>
                      <MdArrowOutward className="social-arrow" />
                    </a>
                  ))}
                </div>
                <Link to="/play" className="chess-link" data-cursor="disable">
                  <span className="chess-icon">♟</span> Desafíame al ajedrez →
                </Link>
              </div>
            </div>
          </div>

          {/* ─── FOOTER ─── */}
          <div className="contact-footer">
            <div className="footer-brand">
              <img
                src="/logo.png"
                alt="JRG Agency Logo"
                className="footer-logo"
              />
              <span>
                Diseñado por <strong>JRG Agency</strong> · Fundado por{" "}
                {config.developer.founder}
              </span>
            </div>
            <span className="footer-copy">
              <MdCopyright /> {new Date().getFullYear()} JRG Agency · Todos los
              derechos reservados
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
