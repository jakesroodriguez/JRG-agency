/**
 * Project Showcase Data Structure
 * Easily add or edit projects here.
 */

export const PROJECTS_DATA = [
  {
    id: "01",
    slug: "korta-taberna",
    title: "KORTA TABERNA",
    tagline: {
      es: "El bar de barrio de toda la vida: bocadillos, raciones, pintxos caseros y buen ambiente.",
      en: "The classic neighborhood bar: hearty sandwiches, homemade tapas, pintxos and great atmosphere.",
      eu: "Auzoko betiko taberna: ogitartekoak, etxeko errazioak, pintxoak eta giro bikaina."
    },
    description: {
      es: "Web oficial y carta digital interactiva para Korta Taberna, el bar de barrio de referencia. Diseñada para que vecinos y cuadrillas puedan consultar al momento la carta de bocadillos, hamburguesas, platos combinados y raciones, ver el horario de cocina y contactar al instante.",
      en: "Official website and interactive digital menu for Korta Taberna, the iconic neighborhood bar. Built for locals and friends to easily browse sandwiches, tapas, homemade burgers and pintxos, check opening hours and contact instantly.",
      eu: "Korta Tabernaren webgune ofiziala eta karta digital interaktiboa, auzoko erreferentziazko taberna. Auzokideek eta koadrilek ogitartekoak, hanburgesak, plater konbinatuak eta errazioak unean bertan ikusteko, sukaldeko ordutegiak jakiteko eta harremanetan jartzeko sortua."
    },
    url: "guretrenaurretxu.com",
    liveUrl: "https://guretrenaurretxu.com/",
    image: "/portfolio-1.webp",
    fallbackBg: "linear-gradient(135deg, #181512 0%, #2a1f18 50%, #0d0a08 100%)",
    accentColor: "#f59e0b",
    glowColor: "rgba(245, 158, 11, 0.2)",
    client: "Korta Taberna",
    year: "2025",
    scope: {
      es: "Diseño Web · Carta Digital QR · Bar de Barrio",
      en: "Web Design · QR Digital Menu · Neighborhood Bar",
      eu: "Web Diseinua · QR Karta Digitala · Auzoko Taberna"
    },
    tags: ["Bar de Barrio", "Korta Taberna", "Bocadillos & Raciones", "Carta QR"],
    technologies: ["React", "Vite", "Tailwind CSS", "Google Maps", "WhatsApp"],
    metrics: [
      { label: "Carta Digital", value: "QR Móvil" },
      { label: "Bocatas & Tapas", value: "+30 Tipos" },
      { label: "Bar de Barrio", value: "Auténtico" }
    ],
    previewBadges: [
      { text: "Bar de Barrio", type: "success" },
      { text: "Carta Online QR", type: "neutral" }
    ]
  },
  {
    id: "02",
    slug: "urkulu-moviles",
    title: "URKULU MÓVILES",
    tagline: {
      es: "Plataforma web y escaparate de servicios técnicos para taller de reparación de telefonía.",
      en: "Web platform and technical service showcase for mobile phone repair shop in Urretxu.",
      eu: "Web plataforma eta zerbitzu teknikoen erakusleihoa Urretxuko mugikorren konponketa tailerrarentzat."
    },
    description: {
      es: "Portal web optimizado para captación local con desglose de reparaciones (pantallas, baterías, cámaras, conectores), catálogo de accesorios y botón de contacto directo por WhatsApp para presupuestos rápidos.",
      en: "Local conversion-focused web portal detailing repair services (screens, batteries, cameras, charging ports), accessory catalog, and direct WhatsApp contact for instant quotes.",
      eu: "Tokiko bezeroak erakartzeko web ataria, konponketa mota guztiekin (pantailak, bateriak, kamerak), osagarrien katalogoarekin eta WhatsApp bidezko berehalako aurrekontuekin."
    },
    url: "urkulumovilesurretxu.com",
    liveUrl: "https://urkulumovilesurretxu.com/",
    image: "/portfolio-2.webp",
    fallbackBg: "linear-gradient(135deg, #0e1a18 0%, #152b27 50%, #091210 100%)",
    accentColor: "#10b981",
    glowColor: "rgba(16, 185, 129, 0.2)",
    client: "Urkulu Móviles Urretxu",
    year: "2025",
    scope: {
      es: "Diseño Web · Catálogo de Reparaciones · SEO Local",
      en: "Web Design · Repair Catalog · Local SEO",
      eu: "Web Diseinua · Konponketa Katalogoa · Tokiko SEOa"
    },
    tags: ["Servicio Técnico", "Reparaciones", "SEO Local", "WhatsApp API"],
    technologies: ["React", "Vite", "Tailwind CSS", "WhatsApp API", "Local SEO"],
    metrics: [
      { label: "Búsqueda Local", value: "#1" },
      { label: "Consultas Directas", value: "+280%" },
      { label: "Velocidad Web", value: "99/100" }
    ],
    previewBadges: [
      { text: "Reparación Exprés", type: "success" },
      { text: "Presupuestos Rápidos", type: "neutral" }
    ]
  },
  {
    id: "03",
    slug: "otxaran-denda",
    title: "OTXARAN DENDA",
    tagline: {
      es: "Lookbook digital y catálogo visual de temporada para boutique de moda femenina.",
      en: "Digital lookbook and seasonal visual catalog for contemporary women's fashion boutique.",
      eu: "Lookbook digitala eta sasoiko ikus-katalogoa emakumezkoen moda boutique-arentzat."
    },
    description: {
      es: "Diseño visual limpio y elegante para presentar colecciones de temporada, prendas destacadas, novedades y complementos, permitiendo a las clientas descubrir ropa con estilo y reservar en tienda física.",
      en: "Clean and elegant visual design showcasing seasonal collections, highlighted outfits, new arrivals and accessories, making it easy for customers to explore styles and reserve in-store.",
      eu: "Diseinu garbi eta dotorea sasoiko bildumak, jantzi nabarmenduak eta osagarriak erakusteko, bezeroek estilo berriak ezagutu eta dendan erreserbatu ahal izateko."
    },
    url: "otxaran-denda.vercel.app",
    liveUrl: "https://otxaran-denda.vercel.app/",
    image: "/portfolio-otxaran.png",
    fallbackBg: "linear-gradient(135deg, #15161e 0%, #1e2235 50%, #0d0e15 100%)",
    accentColor: "#3b82f6",
    glowColor: "rgba(59, 130, 246, 0.2)",
    client: "Otxaran Denda Moda",
    year: "2026",
    scope: {
      es: "Catálogo Web · Lookbook Digital · Branding",
      en: "Web Catalog · Digital Lookbook · Branding",
      eu: "Web Katalogoa · Lookbook Digitala · Branding-a"
    },
    tags: ["Moda Mujer", "Catálogo Visual", "UI/UX Design", "Responsive"],
    technologies: ["HTML5", "CSS3", "JavaScript", "Tailwind CSS", "Vercel"],
    metrics: [
      { label: "Experiencia UI", value: "Limpia" },
      { label: "Catálogo Visual", value: "Novedades" },
      { label: "Rendimiento", value: "100/100" }
    ],
    previewBadges: [
      { text: "Colección 2026", type: "success" },
      { text: "Diseño Adaptativo", type: "neutral" }
    ]
  }
];

export const SHOWCASE_UI_TEXT = {
  es: {
    eyebrow: "PORTFOLIO SELECCIONADO",
    titleLine1: "Proyectos reales construidos",
    titleLine2: "para negocios reales.",
    subtitle: "Páginas web rápidas, atractivas y optimizadas para atraer clientes y destacar en el entorno digital.",
    scrollHint: "Explora los proyectos destacados",
    ctaText: "VISITAR SITIO WEB",
    scopeLabel: "Alcance",
    clientLabel: "Cliente",
    yearLabel: "Año",
    techLabel: "Tecnologías & Herramientas",
    allProjectsBadge: "PROYECTOS DESTACADOS",
    openPrompt: "VISITAR ↗"
  },
  en: {
    eyebrow: "SELECTED PORTFOLIO",
    titleLine1: "Real projects built",
    titleLine2: "for real businesses.",
    subtitle: "Fast, attractive and optimized websites designed to attract customers and stand out in the digital landscape.",
    scrollHint: "Explore featured projects",
    ctaText: "VISIT WEBSITE",
    scopeLabel: "Scope",
    clientLabel: "Client",
    yearLabel: "Year",
    techLabel: "Tech & Tools",
    allProjectsBadge: "FEATURED WORK",
    openPrompt: "VISIT ↗"
  },
  eu: {
    eyebrow: "AUKERATUTAKO LANAK",
    titleLine1: "Benetako negozioentzat",
    titleLine2: "eraikitako proiektuak.",
    subtitle: "Webgune azkarrak, erakargarriak eta optimizatuak bezeroak erakartzeko eta ingurune digitalean nabarmentzeko.",
    scrollHint: "Arakatu proiektu nabarmenduak",
    ctaText: "WEBGUNEA IKUSI",
    scopeLabel: "Esparrua",
    clientLabel: "Bezeroa",
    yearLabel: "Urtea",
    techLabel: "Teknologiak & Tresnak",
    allProjectsBadge: "LAN NABARMENDUAK",
    openPrompt: "IREKI ↗"
  }
};
