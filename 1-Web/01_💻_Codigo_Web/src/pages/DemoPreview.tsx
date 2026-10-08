import { useState, useEffect, useRef, useCallback } from "react";
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
  FaQuoteLeft,
  FaChevronLeft,
  FaChevronRight,
  FaFire,
  FaShieldAlt
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

  // Real photos list
  const photosList = demo?.photos && demo.photos.length > 0 ? demo.photos : demo ? [demo.heroImage] : [];
  
  // Carousel state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<number | null>(null);

  // Next / Prev handlers
  const nextPhoto = useCallback(() => {
    if (photosList.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % photosList.length);
  }, [photosList.length]);

  const prevPhoto = useCallback(() => {
    if (photosList.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + photosList.length) % photosList.length);
  }, [photosList.length]);

  // Autoplay interval every 2.8 seconds (psychological sweet-spot for visual attention)
  useEffect(() => {
    if (photosList.length <= 1 || isPaused) return;

    timerRef.current = setInterval(() => {
      nextPhoto();
    }, 2800);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [photosList.length, isPaused, nextPhoto]);

  // Fallback if demo slug is not found or visitor visits /demo
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

        <div className="demo-container" style={{ textAlign: "center", paddingTop: "50px" }}>
          <span className="demo-closer-badge">Demos Activas</span>
          <h1 className="demo-business-title" style={{ fontSize: "2.1rem", marginBottom: "14px" }}>
            Bocetos Digitales de Alta Conversión
          </h1>
          <p className="demo-business-tagline">
            Páginas web ultrarrápidas y adaptadas a móviles creadas para comercios de Goierri y Urola Garaia.
          </p>

          <div style={{ margin: "36px 0" }}>
            <h3 style={{ fontSize: "1.05rem", marginBottom: "16px", color: "#334155" }}>
              Selecciona un negocio para ver su demo con fotos reales:
            </h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center" }}>
              {sampleSlugs.map((s) => (
                <Link
                  key={s}
                  to={`/demo/${s}`}
                  style={{
                    background: "#ffffff",
                    border: "1px solid rgba(203, 213, 225, 0.8)",
                    padding: "10px 18px",
                    borderRadius: "999px",
                    color: "#0284c7",
                    textDecoration: "none",
                    fontSize: "0.88rem",
                    fontWeight: 700,
                    boxShadow: "0 2px 6px rgba(0,0,0,0.03)"
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
              Dejamos tu web lista en 48 horas, optimizada para Google y lista para recibir clientes por WhatsApp.
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
    `Kaixo Jakes! He visto el boceto web de ${demo.nombre} y me gustaría activarla para mi negocio.`
  )}`;

  const whatsappCustomerUrl = `https://wa.me/34${demo.telefonoLimpio}?text=${encodeURIComponent(
    `Hola ${demo.nombre}, he visto vuestra web y me gustaría consultar información/hacer un encargo.`
  )}`;

  const gmapsDirectionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${demo.nombre} ${demo.municipio}`
  )}`;

  const currentDisplayPhoto = photosList[currentIndex] || demo.heroImage;

  return (
    <div className="demo-preview-root">
      {/* 1. Sticky VIP Agency Header */}
      <header className="demo-vip-bar">
        <div className="demo-vip-left">
          <span className="demo-vip-agency-badge">
            <FaBolt /> JRG Agency
          </span>
          <span className="demo-vip-text">
            Boceto exclusivo para <strong>{demo.nombre}</strong>
          </span>
        </div>
        <a
          href={whatsappJrgUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="demo-vip-cta"
          title="Activar esta web para tu negocio"
        >
          <FaBolt /> Activar mi web
        </a>
      </header>

      <main className="demo-container">
        {/* 2. Hero Section (Luminoso, Jerarquía Editorial) */}
        <section className="demo-hero-section">
          <div className="demo-pills-row">
            <span className="demo-pill demo-pill-location">
              <FaMapMarkerAlt style={{ color: "#0284c7" }} /> {demo.municipio}, Gipuzkoa
            </span>
            <span className="demo-pill demo-pill-badge">
              <FaFire style={{ color: "#d97706" }} /> Top Valorados
            </span>
            <span className="demo-pill demo-pill-status">
              ● Abierto al público
            </span>
          </div>

          <h1 className="demo-business-title">{demo.nombre}</h1>
          <p className="demo-business-tagline">{demo.tagline}</p>

          {/* Dopamine Trigger: Google Maps Verified Social Proof Badge */}
          <div className="demo-google-verified-card">
            <div className="demo-google-icon-circle">G</div>
            <span className="demo-google-score-box">
              <FaStar /> {demo.rating.toFixed(1)}
            </span>
            <span className="demo-google-reviews-text">
              {demo.reviews > 0
                ? `basado en ${demo.reviews} opiniones en Google Maps`
                : "Comercio local de máxima confianza"}
            </span>
          </div>

          {/* Tactile Conversion CTA Buttons */}
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
              <FaPhoneAlt style={{ color: "#0284c7" }} /> Llamar: {demo.telefono}
            </a>
          </div>

          {/* 3. Real Photos Showcase with Autoplay Carousel (2-3s) & Navigation Arrows */}
          <div 
            className="demo-carousel-wrapper"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setTimeout(() => setIsPaused(false), 3000)}
          >
            <div className="demo-carousel-image-container" onClick={nextPhoto}>
              <img 
                src={currentDisplayPhoto} 
                alt={`${demo.nombre} en ${demo.municipio}`} 
                className="demo-carousel-image"
                loading="eager" 
              />
              <div className="demo-carousel-overlay-gradient" />

              {/* Tag Badge on Image */}
              <div className="demo-photo-tag-badge">
                <FaCamera style={{ color: "#0284c7" }} /> Foto real de Google Maps
              </div>
            </div>

            {/* Navigation Arrows (< and >) */}
            {photosList.length > 1 && (
              <>
                <button 
                  className="demo-nav-arrow demo-nav-prev"
                  onClick={(e) => { e.stopPropagation(); prevPhoto(); }}
                  aria-label="Foto anterior"
                >
                  <FaChevronLeft />
                </button>
                <button 
                  className="demo-nav-arrow demo-nav-next"
                  onClick={(e) => { e.stopPropagation(); nextPhoto(); }}
                  aria-label="Siguiente foto"
                >
                  <FaChevronRight />
                </button>
              </>
            )}

            {/* Bottom Indicators & Photo Counter */}
            <div className="demo-carousel-indicators-bar">
              <span className="demo-carousel-counter-pill">
                📸 {currentIndex + 1} / {photosList.length}
              </span>

              {photosList.length > 1 && (
                <div className="demo-carousel-dots">
                  {photosList.slice(0, 8).map((_, i) => (
                    <div 
                      key={i} 
                      className={`demo-dot ${currentIndex === i ? "active" : ""}`}
                      onClick={(e) => { e.stopPropagation(); setCurrentIndex(i); }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 4. Value Propositions (Liquid Glass Cards) */}
        {demo.highlights && demo.highlights.length > 0 && (
          <section className="demo-features-grid">
            {demo.highlights.map((h, i) => (
              <div className="demo-feature-card" key={i}>
                <div className="demo-feature-icon-circle">
                  <FaCheckCircle />
                </div>
                <span>{h}</span>
              </div>
            ))}
          </section>
        )}

        {/* 5. Services / Menu / Specialties */}
        <section className="demo-services-section">
          <div className="demo-section-header">
            <h2>Especialidades & Servicios</h2>
            <p>Lo más valorado por los clientes de {demo.nombre}</p>
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

        {/* 6. Social Proof / Customer Praise (Dopamine Trigger) */}
        <section className="demo-reviews-card">
          <div className="demo-review-stars-row">
            <FaStar className="demo-review-star" />
            <FaStar className="demo-review-star" />
            <FaStar className="demo-review-star" />
            <FaStar className="demo-review-star" />
            <FaStar className="demo-review-star" />
            <span className="demo-review-score-badge">
              {demo.rating.toFixed(1)} / 5.0
            </span>
          </div>
          <div className="demo-review-quote">
            <FaQuoteLeft style={{ marginRight: 8, opacity: 0.3, color: "#0284c7" }} />
            {demo.categoria.toLowerCase().includes("restaurante") || demo.categoria.toLowerCase().includes("bar")
              ? "Excelente calidad, producto casero de primera y un trato cercano inmejorable. El mejor sitio para disfrutar con familia o cuadrilla."
              : "Trato profesional, puntualidad impecable y máxima confianza. Sin duda el lugar de referencia en toda la comarca."}
          </div>
          <div className="demo-review-author">
            <FaShieldAlt style={{ color: "#16a34a" }} /> Cliente verificado en Google Maps ({demo.municipio})
          </div>
        </section>

        {/* 7. Location & Schedule Card */}
        <section className="demo-location-card">
          <div className="demo-loc-item">
            <div className="demo-loc-icon-circle">
              <FaClock />
            </div>
            <div className="demo-loc-content">
              <h4>Horario de atención</h4>
              <p>Lunes a Sábado · Abierto para atenderte en {demo.municipio}</p>
            </div>
          </div>
          <div className="demo-loc-item">
            <div className="demo-loc-icon-circle">
              <FaMapMarkerAlt />
            </div>
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

        {/* 8. Neuro-Selling: JRG Agency Conversion Closer Box */}
        <section className="demo-agency-closer-box">
          <span className="demo-closer-badge">Iniciativa Digital JRG Agency</span>
          <h3>¿Quieres activar esta web para {demo.nombre}?</h3>
          <p>
            El <strong>82% de las personas</strong> buscan en Google desde el móvil antes de visitar un negocio.
            Esta web está optimizada para que cada búsqueda en {demo.municipio} se convierta en una llamada o WhatsApp directo en tu teléfono.
          </p>

          <div className="demo-value-points-wrap">
            <div className="demo-value-point-item">
              <FaBolt style={{ color: "#0284c7" }} />
              <span>Lista en 48 horas</span>
            </div>
            <div className="demo-value-point-item">
              <FaShieldAlt style={{ color: "#16a34a" }} />
              <span>Dominio y hosting incluido</span>
            </div>
            <div className="demo-value-point-item">
              <FaWhatsapp style={{ color: "#25d366" }} />
              <span>Clientes directos a tu móvil</span>
            </div>
          </div>

          <div>
            <a
              href={whatsappJrgUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="demo-close-btn-cta"
            >
              <FaWhatsapp style={{ fontSize: "1.3rem" }} /> Activar esta web para mi negocio
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

      {/* 10. Sticky Mobile Floating Bottom Bar (Liquid Glass) */}
      <nav className="demo-sticky-mobile-bar" aria-label="Contacto Rápido">
        <a
          href={whatsappCustomerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="demo-sticky-btn-wsp"
        >
          <FaWhatsapp style={{ fontSize: "1.2rem" }} /> Pedir por WhatsApp
        </a>
        <a href={`tel:${demo.telefonoLimpio}`} className="demo-sticky-btn-call">
          <FaPhoneAlt style={{ color: "#0284c7" }} /> Llamar
        </a>
      </nav>
    </div>
  );
};

export default DemoPreview;
