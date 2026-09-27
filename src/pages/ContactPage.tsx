import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { MdArrowOutward, MdCopyright, MdContentCopy, MdCheck } from "react-icons/md";
import { FaWhatsapp, FaGithub, FaLinkedinIn, FaInstagram } from "react-icons/fa";
import { config } from "../config";
import "./ContactPage.css";

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

const ContactPage = () => {
  const [selectedProject, setSelectedProject] = useState(projectTypes[0]);
  const [copied, setCopied] = useState(false);

  const whatsappUrl = `${config.contact.whatsapp}?text=${encodeURIComponent(selectedProject.message)}`;

  const handleCopy = useCallback(() => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(config.contact.email).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2200);
      });
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = config.contact.email;
      textArea.style.position = "fixed";
      textArea.style.left = "-9999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  }, []);

  return (
    <div className="contact-page">
      <div className="contact-page-header">
        <Link to="/" className="back-button" data-cursor="disable">
          ← Volver al Inicio
        </Link>
        <div className="contact-page-branding">
          <img src="/logo.png" alt="JRG Agency" className="contact-page-logo" />
          <span>JRG AGENCY · CONTACTO</span>
        </div>
      </div>

      <div className="contact-page-container">
        <div className="contact-frame">
          <div className="frame-ambient-light" />

          {/* Header */}
          <div className="contact-header">
            <div className="contact-status">
              <span className="status-dot" />
              <span className="status-text">
                DISPONIBLE PARA NUEVOS PROYECTOS · RESPUESTA EN &lt; 2H
              </span>
            </div>
            <h1 className="contact-headline">
              ¿Listo para llevar tu marca
              <br />a otra dimensión?
            </h1>
            <p className="contact-subheadline">
              Cuéntanos tu idea y la transformamos en una experiencia web que se
              siente, se recuerda y convierte.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="contact-bento">
            {/* WhatsApp Column */}
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

            {/* Email + Info Column */}
            <div className="bento-card bento-email">
              <div className="bento-card-inner">
                <h4 className="bento-label">EMAIL</h4>
                <div className="email-display">
                  <span className="email-address">{config.contact.email}</span>
                  <button
                    className={`copy-btn ${copied ? "copied" : ""}`}
                    onClick={handleCopy}
                    title="Copiar email"
                    type="button"
                    data-cursor="disable"
                  >
                    {copied ? (
                      <>
                        <MdCheck className="copy-icon" /> ¡Copiado!
                      </>
                    ) : (
                      <>
                        <MdContentCopy className="copy-icon" /> Copiar
                      </>
                    )}
                  </button>
                </div>

                <div className="email-details">
                  <div className="detail-item">
                    <span className="detail-label">TELÉFONO / WHATSAPP</span>
                    <a href={`tel:${config.contact.phone}`} className="detail-val">
                      {config.contact.phone}
                    </a>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">UBICACIÓN</span>
                    <span className="detail-val">{config.social.location}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">TIEMPO ESTIMADO DE RESPUESTA</span>
                    <span className="detail-val detail-highlight">Menos de 2 horas</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links Row */}
            <div className="bento-card bento-socials">
              <div className="bento-card-inner">
                <h4 className="bento-label">REDES Y PRESENCIA DIGITAL</h4>
                <div className="socials-grid">
                  {socialLinks.map((s) => (
                    <a
                      key={s.name}
                      href={s.url}
                      className="social-pill"
                      target="_blank"
                      rel="noopener noreferrer"
                      data-cursor="disable"
                    >
                      <span className="social-icon">{s.icon}</span>
                      <span className="social-name">{s.name}</span>
                      <MdArrowOutward className="social-arrow" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="contact-footer">
            <div className="footer-left">
              <span className="footer-copy">
                <MdCopyright /> {new Date().getFullYear()} {config.developer.fullName}. Todos los derechos reservados.
              </span>
              <span className="footer-origin">Diseñado y desarrollado con Three.js en el País Vasco</span>
            </div>
            <div className="footer-right">
              <Link to="/myworks" className="footer-link" data-cursor="disable">
                Proyectos →
              </Link>
              <Link to="/play" className="footer-link" data-cursor="disable">
                Ajedrez 3D →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
