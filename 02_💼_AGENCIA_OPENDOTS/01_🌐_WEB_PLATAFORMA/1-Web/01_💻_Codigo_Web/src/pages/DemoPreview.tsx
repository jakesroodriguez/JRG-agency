import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  FaWhatsapp, 
  FaPhoneAlt, 
  FaStar, 
  FaMapMarkerAlt, 
  FaCamera, 
  FaCompass, 
  FaChevronLeft, 
  FaChevronRight,
  FaArrowRight
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

function findDemoBySlug(requestedSlug?: string): DemoData | null {
  if (!requestedSlug) return null;
  const clean = requestedSlug.toLowerCase().trim().replace(/^\/+|\/+$/g, "");
  if (demosDb[clean]) return demosDb[clean];

  const cleanNorm = clean.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const entries = Object.entries(demosDb);

  // Exact normalized key/slug match
  for (const [key, item] of entries) {
    const keyNorm = key.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (keyNorm === cleanNorm) return item;
    if (item.slug && item.slug.toLowerCase() === clean) return item;
  }

  // Token matching: ignore generic words
  const stopWords = new Set(["restaurante", "bar", "taberna", "jatetxea", "salon", "de", "belleza", "urretxu", "zumarraga", "legazpi"]);
  const tokens = cleanNorm.split(/[-_\s]+/).filter(t => t.length > 2 && !stopWords.has(t));

  if (tokens.length > 0) {
    for (const [key, item] of entries) {
      const keyNorm = key.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const nameNorm = item.nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const hasMatch = tokens.some(tok => keyNorm.includes(tok) || nameNorm.includes(tok));
      if (hasMatch) return item;
    }
  }

  for (const [key, item] of entries) {
    if (key.includes(clean) || clean.includes(key)) return item;
  }
  return null;
}

const DemoPreview = () => {
  const { slug } = useParams<{ slug?: string }>();
  const demo = findDemoBySlug(slug);

  // Real photos list from Google Maps CDN
  const photosList = demo?.photos && demo.photos.length > 0 ? demo.photos : demo ? [demo.heroImage] : [];
  
  // Carousel & Image Gallery state
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

  // Autoplay interval every 3.2 seconds
  useEffect(() => {
    if (photosList.length <= 1 || isPaused) return;

    timerRef.current = setInterval(() => {
      nextPhoto();
    }, 3200);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [photosList.length, isPaused, nextPhoto]);

  // Fallback if demo slug is not found or visitor visits /demo
  if (!demo) {
    const sampleSlugs = Object.keys(demosDb).slice(0, 12);

    return (
      <div className="demo-preview-root">
        <header className="demo-vip-bar">
          <div className="demo-vip-left">
            <div className="demo-vip-logo-container">
              <div className="demo-vip-logo-pulse-ring" />
              <img src="/logoJRG.png" alt="JRG Studio" className="demo-vip-logo" />
              <span className="demo-vip-status-dot" />
            </div>
            <div className="demo-vip-brand-wrap">
              <div className="demo-vip-brand-top">
                <span className="demo-vip-brand-name">JRG STUDIO</span>
                <span className="demo-vip-tag">DEMO HUB</span>
              </div>
              <span className="demo-vip-brand-desc">Estudio Web · Urretxu & Gipuzkoa</span>
            </div>
          </div>
          <Link to="/" className="demo-vip-cta">
            <span>Web Oficial</span> <FaArrowRight />
          </Link>
        </header>
        <div className="demo-vip-shimmer-line" />

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
                    color: "#1e293b",
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
        </div>
      </div>
    );
  }

  // Pre-configured URLs
  const whatsappCustomerUrl = `https://wa.me/34${demo.telefonoLimpio}?text=${encodeURIComponent(
    `Hola ${demo.nombre}, he visto vuestra web y me gustaría hacer una consulta/reserva.`
  )}`;

  const gmapsDirectionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${demo.nombre} ${demo.municipio}`
  )}`;

  const currentDisplayPhoto = photosList[currentIndex] || demo.heroImage;

  return (
    <div className="demo-preview-root demo-clean-layout">
      {/* 1. Imagen principal cinematográfica ocupando la mitad superior de la pantalla */}
      <div className="demo-top-hero-image-wrap">
        <div 
          className="demo-top-hero-stage"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setTimeout(() => setIsPaused(false), 3000)}
          onClick={nextPhoto}
        >
          <img 
            src={currentDisplayPhoto} 
            alt={`${demo.nombre} en ${demo.municipio}`} 
            className="demo-top-hero-img"
            loading="eager" 
          />
          <div className="demo-top-hero-gradient" />

          {/* Badge superior izquierdo: Foto real */}
          <div className="demo-photo-tag-badge">
            <FaCamera /> Foto real de Google Maps
          </div>

          {/* Contador superior derecho: NUNCA colisiona con el texto de abajo */}
          {photosList.length > 1 && (
            <div className="demo-hero-top-counter">
              📸 {currentIndex + 1} / {photosList.length}
            </div>
          )}

          {/* Flechas de navegación sutiles para explorar fotos si hay varias */}
          {photosList.length > 1 && (
            <>
              <button 
                type="button"
                className="demo-hero-nav-arrow demo-hero-nav-prev"
                onClick={(e) => { e.stopPropagation(); prevPhoto(); }}
                aria-label="Foto anterior"
              >
                <FaChevronLeft />
              </button>
              <button 
                type="button"
                className="demo-hero-nav-arrow demo-hero-nav-next"
                onClick={(e) => { e.stopPropagation(); nextPhoto(); }}
                aria-label="Siguiente foto"
              >
                <FaChevronRight />
              </button>
            </>
          )}
        </div>
      </div>

      {/* 2. Mitad inferior: Bloque perfectamente proporcionado con estado, título y botones */}
      <main className="demo-container">
        <section className="demo-business-action-tier">
          <div className="demo-tier-top">
            {/* Píldoras de estado y ubicación */}
            <div className="demo-meta-pills-row">
              <span className="demo-pill demo-pill-status">
                ● Abierto al público
              </span>
              <span className="demo-pill demo-pill-location">
                <FaMapMarkerAlt style={{ color: "#475569" }} /> {demo.municipio}
              </span>
              {demo.rating > 0 && (
                <span className="demo-pill demo-pill-rating">
                  <FaStar style={{ color: "#f59e0b" }} /> {demo.rating.toFixed(1)} {demo.reviews > 0 ? `(${demo.reviews})` : ""}
                </span>
              )}
            </div>

            <h1 className="demo-business-title">{demo.nombre}</h1>
            {demo.tagline && <p className="demo-business-tagline">{demo.tagline}</p>}
          </div>

          {/* Botones de acción directa: Cómodos, táctiles y bien proporcionados */}
          <div className="demo-action-buttons-grid">
            <a
              href={whatsappCustomerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="demo-btn-whatsapp"
            >
              <FaWhatsapp className="demo-cta-icon" />
              <div className="demo-btn-text-wrap">
                <span className="demo-btn-main-label">Contactar por WhatsApp</span>
                <span className="demo-btn-sub-label">Escribir directamente al local</span>
              </div>
            </a>
            <a href={`tel:${demo.telefonoLimpio}`} className="demo-btn-call">
              <FaPhoneAlt className="demo-cta-icon" />
              <div className="demo-btn-text-wrap">
                <span className="demo-btn-main-label">Llamar al comercio</span>
                <span className="demo-btn-sub-label">{demo.telefono}</span>
              </div>
            </a>
          </div>

          <div className="demo-tier-bottom">
            <a
              href={gmapsDirectionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="demo-maps-direct-btn"
            >
              <FaCompass /> Ver ubicación en Google Maps ({demo.municipio}) →
            </a>

            <p className="demo-footer-copy">
              © {new Date().getFullYear()} {demo.nombre} · Propuesta web por{" "}
              <Link to="/">JRG Studio</Link>
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default DemoPreview;
