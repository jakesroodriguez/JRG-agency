import { useParams, Link } from "react-router-dom";
import { 
  FaWhatsapp, 
  FaPhoneAlt, 
  FaStar, 
  FaMapMarkerAlt, 
  FaCheckCircle, 
  FaClock, 
  FaArrowRight,
  FaBolt
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
  items: DemoItem[];
  highlights: string[];
  demoUrl: string;
}

const demosDb = demosDataRaw as Record<string, DemoData>;

const DemoPreview = () => {
  const { slug } = useParams<{ slug?: string }>();
  const demo = slug ? demosDb[slug.toLowerCase()] : null;

  // Fallback if demo slug is not found or user visits /demo directly
  if (!demo) {
    const sampleSlugs = Object.keys(demosDb).slice(0, 6);

    return (
      <div className="demo-preview-root">
        <div className="demo-vip-bar">
          <div className="demo-vip-info">
            <span className="demo-vip-tag">JRG Agency</span>
            <span>Estudio Web & Automatización</span>
          </div>
          <Link to="/" className="demo-vip-btn">
            Ver Web Oficial <FaArrowRight />
          </Link>
        </div>

        <div className="demo-container" style={{ textAlign: "center", paddingTop: "60px" }}>
          <div className="demo-agency-badge">Demos Interactivas JRG</div>
          <h1 className="demo-title" style={{ fontSize: "2rem", marginBottom: "16px" }}>
            Bocetos Digitales para Negocios Locales
          </h1>
          <p className="demo-tagline">
            Generamos propuestas de alto impacto en 48h con rendimiento 100/100 para comercios de Goierri y Urola Garaia.
          </p>

          <div style={{ margin: "32px 0" }}>
            <h3 style={{ fontSize: "1.1rem", marginBottom: "16px", color: "#c9d1d9" }}>
              Ejemplos de Demos activas:
            </h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center" }}>
              {sampleSlugs.map((s) => (
                <Link
                  key={s}
                  to={`/demo/${s}`}
                  style={{
                    background: "rgba(255, 255, 255, 0.06)",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    padding: "10px 16px",
                    borderRadius: "8px",
                    color: "#58a6ff",
                    textDecoration: "none",
                    fontSize: "0.88rem",
                    fontWeight: 600,
                  }}
                >
                  {demosDb[s].nombre} ({demosDb[s].municipio})
                </Link>
              ))}
            </div>
          </div>

          <div className="demo-agency-cta-box" style={{ marginTop: "40px" }}>
            <h3>¿Quieres tu propia web profesional?</h3>
            <p>
              Por solo 400€ dejamos tu web montada, optimizada para Google y adaptada a móviles.
            </p>
            <a
              href="https://wa.me/34613448185?text=Kaixo%20Jakes!%20Quiero%20solicitar%20un%20boceto%20web%20para%20mi%20negocio"
              target="_blank"
              rel="noopener noreferrer"
              className="demo-activate-btn"
            >
              <FaWhatsapp /> Solicitar Demo Gratuita
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Pre-configured WhatsApp messages
  const whatsappJrgUrl = `https://wa.me/34613448185?text=${encodeURIComponent(
    `Kaixo Jakes! He visto el boceto web de ${demo.nombre} y me gustaría activarla para mi negocio por 400€.`
  )}`;

  const whatsappCustomerUrl = `https://wa.me/34${demo.telefonoLimpio}?text=${encodeURIComponent(
    `Hola ${demo.nombre}, os contacto para consultar vuestros servicios/carta.`
  )}`;

  return (
    <div className="demo-preview-root">
      {/* Top Floating VIP Agency Bar */}
      <header className="demo-vip-bar">
        <div className="demo-vip-info">
          <span className="demo-vip-tag">Propuesta JRG</span>
          <span>Boceto exclusivo para {demo.nombre}</span>
        </div>
        <a
          href={whatsappJrgUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="demo-vip-btn"
          title="Activar esta web por 400€"
        >
          <FaBolt /> Activar por 400€
        </a>
      </header>

      <main className="demo-container">
        {/* Hero Section */}
        <section className="demo-hero">
          <div className="demo-badges-row">
            <span className="demo-location-badge">
              <FaMapMarkerAlt style={{ marginRight: 4 }} /> {demo.municipio}, Gipuzkoa
            </span>
            <span className="demo-category-badge">{demo.badge}</span>
          </div>

          <h1 className="demo-title">{demo.nombre}</h1>
          <p className="demo-tagline">{demo.tagline}</p>

          {/* Real Google Reviews pill */}
          <div className="demo-google-pill">
            <span className="demo-stars">
              <FaStar /> {demo.rating.toFixed(1)}
            </span>
            <span>
              {demo.reviews > 0
                ? `${demo.reviews} reseñas verificadas en Google Maps`
                : "Negocio local destacado"}
            </span>
          </div>

          {/* Quick Action Buttons */}
          <div className="demo-action-buttons">
            <a
              href={whatsappCustomerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="demo-btn-primary"
            >
              <FaWhatsapp style={{ fontSize: "1.2rem" }} /> Contactar por WhatsApp
            </a>
            <a href={`tel:${demo.telefonoLimpio}`} className="demo-btn-secondary">
              <FaPhoneAlt /> Llamar: {demo.telefono}
            </a>
          </div>

          {/* Hero Media Image */}
          <div className="demo-hero-media">
            <img src={demo.heroImage} alt={demo.nombre} loading="eager" />
          </div>
        </section>

        {/* Highlights */}
        {demo.highlights && demo.highlights.length > 0 && (
          <section className="demo-highlights-grid">
            {demo.highlights.map((h, i) => (
              <div className="demo-highlight-card" key={i}>
                <FaCheckCircle className="demo-check-icon" />
                <span>{h}</span>
              </div>
            ))}
          </section>
        )}

        {/* Specialties / Services / Menu */}
        <section className="demo-items-section">
          <h2 className="demo-section-title">
            Especialidades & Servicios <span>· {demo.nombre}</span>
          </h2>
          <div className="demo-items-list">
            {demo.items.map((item, idx) => (
              <article className="demo-item-card" key={idx}>
                <h3 className="demo-item-title">{item.titulo}</h3>
                <p className="demo-item-desc">{item.desc}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Location & Opening Hours info */}
        <section className="demo-info-card">
          <div className="demo-info-row">
            <FaClock className="demo-info-icon" />
            <div className="demo-info-content">
              <h4>Horarios habituales</h4>
              <p>Lunes a Sábado · Abierto para atenderte en {demo.municipio}</p>
            </div>
          </div>
          <div className="demo-info-row">
            <FaMapMarkerAlt className="demo-info-icon" />
            <div className="demo-info-content">
              <h4>Ubicación</h4>
              <p>{demo.municipio}, Gipuzkoa · Fácil acceso y aparcamiento en la zona</p>
            </div>
          </div>
        </section>

        {/* JRG Agency Direct Conversion Box */}
        <section className="demo-agency-cta-box">
          <span className="demo-agency-badge">Iniciativa Digital JRG Agency</span>
          <h3>¿Quieres activar esta web para {demo.nombre}?</h3>
          <p>
            Diseño listo, ultrarrápido y optimizado para búsquedas en Google desde móviles.
            En 48 horas puede estar publicada con tu propio dominio oficial (.eus / .com).
          </p>

          <div className="demo-pricing-highlight">
            <span className="demo-price-big">400 €</span>
            <span className="demo-price-sub">entrega completa + 19 €/mes hosting y soporte</span>
          </div>

          <div>
            <a
              href={whatsappJrgUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="demo-activate-btn"
            >
              <FaWhatsapp style={{ fontSize: "1.2rem" }} /> Activar esta web por WhatsApp
            </a>
          </div>
        </section>

        {/* Footer Note */}
        <footer className="demo-footer-note">
          <p>
            © {new Date().getFullYear()} {demo.nombre} · Propuesta de diseño desarrollada por{" "}
            <Link to="/">JRG Agency</Link> (Urretxu, Gipuzkoa).
          </p>
        </footer>
      </main>
    </div>
  );
};

export default DemoPreview;
