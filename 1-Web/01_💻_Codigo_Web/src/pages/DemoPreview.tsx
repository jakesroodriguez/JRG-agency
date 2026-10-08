import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  FaWhatsapp, 
  FaPhoneAlt, 
  FaStar, 
  FaMapMarkerAlt, 
  FaCheckCircle, 
  FaClock, 
  FaArrowRight,
  FaBolt,
  FaCamera,
  FaCompass,
  FaQuoteLeft
} from "react-icons/fa";
import demosDataRaw from "../data/demosData.json";
import "./DemoPreview.css";

interface DemoItem {
  titulo: string;
  desc: string;
}

interface DemoData {
  slug: string;
  nombre: string;
  nombreOriginal: string;
  municipio: string;
  categoria: string;
  badge: string;
  telefono: string;
  telefonoLimpio: string;
  rating: number;
  reviews: number;
  tagline: string;
  heroImage: string;
  photos?: string[];
  items: DemoItem[];
  highlights: string[];
  demoUrl: string;
}

const demosDb = demosDataRaw as Record<string, DemoData>;

const DemoPreview = () => {
  const { slug } = useParams<{ slug?: string }>();
  const demo = slug ? demosDb[slug.toLowerCase()] : null;

  // Active photo state (for businesses with multiple Google Maps photos)
  const photosList = demo?.photos && demo.photos.length > 0 ? demo.photos : demo ? [demo.heroImage] : [];
  const [selectedPhoto, setSelectedPhoto] = useState<string>(demo?.heroImage || "");

  // Fallback if demo slug is not found or visitor enters /demo
  if (!demo) {
    const sampleSlugs = Object.keys(demosDb).slice(0, 8);

    return (
      <div className="demo-preview-root">
        <header className="demo-vip-bar">
          <div className="demo-vip-left">
            <span className="demo-vip-agency-badge">JRG Agency</span>
            <span className="demo-vip-text">Estudio Web & Automatización · Urretxu</span>
          </div>
          <Link to="/" className="demo-vip-cta">
            Web Oficial <FaArrowRight />
          </Link>
        </header>

        <div className="demo-container" style={{ textAlign: "center", paddingTop: "60px" }}>
          <span className="demo-closer-badge">Demos Activas</span>
          <h1 className="demo-business-title" style={{ fontSize: "2.1rem", marginBottom: "14px" }}>
            Bocetos Digitales para Comercios Locales
          </h1>
          <p className="demo-business-tagline">
            Páginas web ultrarrápidas (Lighthouse 100/100) y adaptadas a móviles creadas para negocios de Goierri y Urola Garaia.
          </p>

          <div style={{ margin: "36px 0" }}>
            <h3 style={{ fontSize: "1.1rem", marginBottom: "16px", color: "#c9d1d9" }}>
              Ejemplos con fotografías reales de Google Maps:
            </h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center" }}>
              {sampleSlugs.map((s) => (
                <Link
                  key={s}
                  to={`/demo/${s}`}
                  style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    padding: "10px 18px",
                    borderRadius: "10px",
                    color: "#58a6ff",
                    textDecoration: "none",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                  }}
                >
                  {demosDb[s].nombre} ({demosDb[s].municipio})
                </Link>
              ))}
            </div>
          </div>

          <div className="demo-agency-closer-box" style={{ marginTop: "40px" }}>
            <h3>¿Quieres tu propia web oficial?</h3>
            <p>
              Por 400€ dejamos tu web montada en 48 horas, optimizada para Google y lista para recibir clientes.
            </p>
            <a
              href="https://wa.me/34613448185?text=Kaixo%20Jakes!%20Quiero%20solicitar%20un%20boceto%20web%20para%20mi%20negocio"
              target="_blank"
              rel="noopener noreferrer"
              className="demo-close-btn-cta"
            >
              <FaWhatsapp style={{ fontSize: "1.2rem" }} /> Solicitar Demo Gratuita
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Pre-configured URLs
  const whatsappJrgUrl = `https://wa.me/34613448185?text=${encodeURIComponent(
    `Kaixo Jakes! He visto el boceto web de ${demo.nombre} y me gustaría activarla para mi negocio por 400€.`
  )}`;

  const whatsappCustomerUrl = `https://wa.me/34${demo.telefonoLimpio}?text=${encodeURIComponent(
    `Hola ${demo.nombre}, he visto vuestra web y me gustaría consultar información/hacer una reserva.`
  )}`;

  const gmapsDirectionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${demo.nombre} ${demo.municipio}`
  )}`;

  const currentDisplayPhoto = selectedPhoto || demo.heroImage;

  return (
    <div className="demo-preview-root">
      {/* 1. Top Sticky VIP Agency Bar */}
      <header className="demo-vip-bar">
        <div className="demo-vip-left">
          <span className="demo-vip-agency-badge">
            <FaBolt /> JRG Agency
          </span>
          <span className="demo-vip-text">
            Boceto exclusivo para <span>{demo.nombre}</span>
          </span>
        </div>
        <a
          href={whatsappJrgUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="demo-vip-cta"
          title="Activar esta web por 400€"
        >
          <FaBolt /> Activar por 400€
        </a>
      </header>

      <main className="demo-container">
        {/* 2. Hero Section */}
        <section className="demo-hero-section">
          <div className="demo-pills-row">
            <span className="demo-pill-location">
              <FaMapMarkerAlt /> {demo.municipio}, Gipuzkoa
            </span>
            <span className="demo-pill-badge">{demo.badge}</span>
            <span className="demo-pill-status">
              ● Abierto al público
            </span>
          </div>

          <h1 className="demo-business-title">{demo.nombre}</h1>
          <p className="demo-business-tagline">{demo.tagline}</p>

          {/* Verified Google Maps Rating Badge */}
          <div className="demo-google-verified-box">
            <span className="demo-google-g">G</span>
            <span className="demo-google-score">
              <FaStar /> {demo.rating.toFixed(1)}
            </span>
            <span className="demo-google-count">
              {demo.reviews > 0
                ? `basado en ${demo.reviews} opiniones en Google Maps`
                : "Negocio local de confianza"}
            </span>
          </div>

          {/* Hero Action CTA Buttons */}
          <div className="demo-hero-cta-grid">
            <a
              href={whatsappCustomerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="demo-btn-whatsapp"
            >
              <FaWhatsapp style={{ fontSize: "1.25rem" }} /> Contactar por WhatsApp
            </a>
            <a href={`tel:${demo.telefonoLimpio}`} className="demo-btn-call">
              <FaPhoneAlt /> Llamar: {demo.telefono}
            </a>
          </div>

          {/* 3. Real Photo Showcase from Google Maps */}
          <div className="demo-photo-showcase">
            <div className="demo-main-photo-wrap">
              <img 
                src={currentDisplayPhoto} 
                alt={`${demo.nombre} en ${demo.municipio}`} 
                loading="eager" 
              />
              <span className="demo-photo-badge">
                <FaCamera /> Foto real de Google Maps
              </span>
            </div>

            {/* Gallery Thumbnails if multiple real photos exist */}
            {photosList.length > 1 && (
              <div className="demo-thumbnails-row">
                {photosList.map((photoUrl, index) => (
                  <div
                    key={index}
                    className={`demo-thumb-item ${currentDisplayPhoto === photoUrl ? "active" : ""}`}
                    onClick={() => setSelectedPhoto(photoUrl)}
                    title={`Ver foto ${index + 1}`}
                  >
                    <img src={photoUrl} alt={`Foto ${index + 1} de ${demo.nombre}`} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* 4. Highlights / Value Props */}
        {demo.highlights && demo.highlights.length > 0 && (
          <section className="demo-features-grid">
            {demo.highlights.map((h, i) => (
              <div className="demo-feature-card" key={i}>
                <FaCheckCircle className="demo-feature-icon" />
                <span>{h}</span>
              </div>
            ))}
          </section>
        )}

        {/* 5. Services / Menu / Specialties */}
        <section className="demo-services-section">
          <div className="demo-section-header">
            <h2>Especialidades & Servicios</h2>
            <p>Conoce lo más destacado de {demo.nombre}</p>
          </div>

          <div className="demo-cards-list">
            {demo.items.map((item, idx) => (
              <article className="demo-service-card" key={idx}>
                <div className="demo-service-top">
                  <h3>{item.titulo}</h3>
                </div>
                <p className="demo-service-desc">{item.desc}</p>
                <a
                  href={`https://wa.me/34${demo.telefonoLimpio}?text=${encodeURIComponent(
                    `Hola ${demo.nombre}, os contacto para consultar sobre: ${item.titulo}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="demo-service-action"
                >
                  <FaWhatsapp /> Consultar por WhatsApp
                </a>
              </article>
            ))}
          </div>
        </section>

        {/* 6. Real Google Maps Customer Praise */}
        <section className="demo-reviews-card">
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
            <FaStar style={{ color: "#f5a623", fontSize: "1.1rem" }} />
            <FaStar style={{ color: "#f5a623", fontSize: "1.1rem" }} />
            <FaStar style={{ color: "#f5a623", fontSize: "1.1rem" }} />
            <FaStar style={{ color: "#f5a623", fontSize: "1.1rem" }} />
            <FaStar style={{ color: "#f5a623", fontSize: "1.1rem" }} />
            <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#f0f6fc", marginLeft: "6px" }}>
              {demo.rating.toFixed(1)} / 5.0
            </span>
          </div>
          <div className="demo-review-quote">
            <FaQuoteLeft style={{ marginRight: 8, opacity: 0.5 }} />
            {demo.categoria.toLowerCase().includes("restaurante") || demo.categoria.toLowerCase().includes("bar")
              ? "Excelente comida casera, raciones generosas y un trato cercano inmejorable. El mejor sitio para disfrutar con familia o cuadrilla."
              : "Trato profesional, puntualidad impecable y máxima confianza. Sin duda el lugar de referencia en toda la zona."}
          </div>
          <div className="demo-review-author">
            — Cliente verificado en Google Maps ({demo.municipio})
          </div>
        </section>

        {/* 7. Location & Schedule Card */}
        <section className="demo-location-card">
          <div className="demo-loc-item">
            <FaClock className="demo-loc-icon" />
            <div className="demo-loc-content">
              <h4>Horario de atención</h4>
              <p>Lunes a Sábado · Abierto para atenderte en {demo.municipio}</p>
            </div>
          </div>
          <div className="demo-loc-item">
            <FaMapMarkerAlt className="demo-loc-icon" />
            <div className="demo-loc-content">
              <h4>Ubicación en {demo.municipio}</h4>
              <p>{demo.municipio}, Gipuzkoa</p>
              <a
                href={gmapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="demo-maps-direct-btn"
              >
                <FaCompass /> Abrir ruta en Google Maps →
              </a>
            </div>
          </div>
        </section>

        {/* 8. JRG Agency Conversion Closer Box */}
        <section className="demo-agency-closer-box">
          <span className="demo-closer-badge">Iniciativa Digital JRG Agency</span>
          <h3>¿Quieres activar esta web para {demo.nombre}?</h3>
          <p>
            Esta propuesta está lista para publicarse en 48 horas bajo tu propio dominio oficial (.eus / .com),
            optimizada para búsquedas locales en Google y con carga instantánea en móviles.
          </p>

          <div className="demo-price-tag-wrap">
            <span className="demo-price-huge">400 €</span>
            <div className="demo-price-details">
              <strong>Precio cerrado inicial</strong><br />
              + 19 €/mes hosting, dominio y soporte
            </div>
          </div>

          <div>
            <a
              href={whatsappJrgUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="demo-close-btn-cta"
            >
              <FaWhatsapp style={{ fontSize: "1.3rem" }} /> Activar esta web por WhatsApp
            </a>
          </div>
        </section>

        {/* 9. Footer */}
        <footer className="demo-footer-bottom">
          <p>
            © {new Date().getFullYear()} {demo.nombre} · Propuesta digital desarrollada por{" "}
            <Link to="/">JRG Agency</Link> (Urretxu, Gipuzkoa).
          </p>
        </footer>
      </main>

      {/* 10. Sticky Mobile Floating Bottom Bar */}
      <nav className="demo-sticky-mobile-bar" aria-label="Contacto Rápido">
        <a
          href={whatsappCustomerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="demo-sticky-btn-wsp"
        >
          <FaWhatsapp style={{ fontSize: "1.2rem" }} /> WhatsApp
        </a>
        <a href={`tel:${demo.telefonoLimpio}`} className="demo-sticky-btn-call">
          <FaPhoneAlt /> Llamar
        </a>
      </nav>
    </div>
  );
};

export default DemoPreview;
