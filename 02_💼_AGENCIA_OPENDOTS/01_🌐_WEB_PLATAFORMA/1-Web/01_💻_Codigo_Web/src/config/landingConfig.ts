export interface ElementCoordinates {
  x: number; // percentage (0 to 100)
  y: number; // percentage (0 to 100)
}

export interface HeroConfig {
  logoText: string;
  logoFontSizeMobile: number; // in vw, e.g. 28
  logoFontSizeDesktop: number; // in vw, e.g. 20
  logoTracking: string; // e.g. "-0.06em"
  logoPositionMobile: "top-left" | "top-center" | "center" | "bottom-left" | "bottom-center";
  logoColor: string;
  showAsterisk: boolean;
  asteriskColor: string;

  // Free Drag & Drop Positioning (Canva Mode)
  freeDragMobile: boolean;
  positionsMobile: {
    logo: ElementCoordinates;
    subtitle: ElementCoordinates;
    cta: ElementCoordinates;
  };

  // Subtitle / Text
  showSubtitle: boolean;
  subtitleText: string;
  subtitlePositionMobile: "under-logo" | "middle" | "above-cta";
  subtitleFontSizeMobile: number; // in px, e.g. 13
  subtitleMaxWidthMobile: number; // in px, e.g. 290
  subtitleColor: string;

  // CTA Button
  showCta: boolean;
  ctaText: string;
  ctaPositionMobile: "bottom" | "top" | "center";
  ctaStyle: "gold-gradient" | "dark-glass" | "champagne-outline";
  showCtaArrow: boolean;

  // Atmosphere & Background
  overlayOpacity: number; // 0 to 1, e.g. 0.65
  videoBrightness: number; // 0.5 to 1.5, e.g. 1
  videoContrast: number; // 0.8 to 1.4, e.g. 1
}

export interface SectionItem {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  order: number;
}

export interface LandingConfig {
  version: string;
  updatedAt: string;
  hero: HeroConfig;
  sections: SectionItem[];
}

export const defaultLandingConfig: LandingConfig = {
  version: "1.2.0",
  updatedAt: new Date().toISOString(),
  hero: {
    logoText: "JRG",
    logoFontSizeMobile: 30,
    logoFontSizeDesktop: 20,
    logoTracking: "-0.06em",
    logoPositionMobile: "top-left",
    logoColor: "#E1E0CC",
    showAsterisk: true,
    asteriskColor: "#C2A88F",

    // Canva-Style Free Drag Coordinates (JRG arriba en cielo, texto justo debajo, CTA abajo)
    freeDragMobile: true,
    positionsMobile: {
      logo: { x: 6, y: 5 },
      subtitle: { x: 6, y: 26.5 },
      cta: { x: 6, y: 88 },
    },

    showSubtitle: true,
    subtitleText: "Estudio de desarrollo web de alto impacto, experiencias 3D y sistemas de IA para marcas visionarias.",
    subtitlePositionMobile: "under-logo",
    subtitleFontSizeMobile: 13,
    subtitleMaxWidthMobile: 290,
    subtitleColor: "#DEDBC8",

    showCta: true,
    ctaText: "Iniciar proyecto",
    ctaPositionMobile: "bottom",
    ctaStyle: "gold-gradient",
    showCtaArrow: true,

    overlayOpacity: 0.6,
    videoBrightness: 1.0,
    videoContrast: 1.0,
  },
  sections: [
    { id: "hero", name: "01. Hero Cinematográfico 3D", description: "Fondo de vídeo 3D interactivo con logo y CTA", enabled: true, order: 1 },
    { id: "about", name: "02. VSL & Sobre JRG", description: "Video presentación y narrativa del estudio", enabled: true, order: 2 },
    { id: "features", name: "03. Servicios & Capacidades", description: "Webs 3D, Sistemas IA y Automatizaciones", enabled: true, order: 3 },
    { id: "portfolio", name: "04. Portafolio & Proyectos", description: "Bento interactivo de casos de éxito", enabled: true, order: 4 },
    { id: "method", name: "05. El Método JRG", description: "Ingeniería de conversión, velocidad y diseño", enabled: true, order: 5 },
    { id: "process", name: "06. Proceso Paso a Paso", description: "Timeline de 4 fases desde kickoff a producción", enabled: true, order: 6 },
    { id: "metrics", name: "07. Métricas & Resultados", description: "Lighthouse 100/100, retención y velocidad", enabled: true, order: 7 },
    { id: "contact", name: "08. Terminal de Contacto", description: "Calculadora de presupuesto y WhatsApp directo", enabled: true, order: 8 },
    { id: "footer", name: "09. Harvest Footer", description: "Firma interactiva con físicas y enlaces legales", enabled: true, order: 9 },
  ],
};
