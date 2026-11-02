import React from "react";
import PrismaDesktopPreloader from "./PrismaDesktopPreloader";
import PrismaDesktopHero from "./PrismaDesktopHero";
import PrismaDesktopAbout from "./PrismaDesktopAbout";
import PrismaDesktopFeatures from "./PrismaDesktopFeatures";
import PrismaDesktopPortfolio from "./PrismaDesktopPortfolio";
import PrismaDesktopMethod from "./PrismaDesktopMethod";
import PrismaDesktopProcess from "./PrismaDesktopProcess";
import PrismaDesktopMetrics from "./PrismaDesktopMetrics";
import PrismaDesktopContact from "./PrismaDesktopContact";
import PrismaHarvestFooter from "./PrismaHarvestFooter";
import CinematicCursor from "./CinematicCursor";
import BottomServiceDock from "./BottomServiceDock";
import PrismaSocialProofSection from "./PrismaSocialProofSection";
import LuxuryFAQAccordion, { FAQItem } from "./LuxuryFAQAccordion";
import { LandingConfigProvider, useLandingConfig } from "../../context/LandingConfigContext";

const LANDING_FAQS: FAQItem[] = [
  {
    q: "¿Por qué trabajar con JRG Agency en lugar de una agencia tradicional o plantillas genéricas?",
    a: "En JRG Agency combinamos ingeniería de software de autor, experiencias interactivas 3D y sistemas de IA aplicados a negocio. No usamos plantillas de WordPress ni constructores lentos. Diseñamos con código moderno (React, Vite, TypeScript) logrando cargas en <0.5s (Lighthouse 100/100) y flujos automáticos que ahorran cientos de horas reales."
  },
  {
    q: "¿Dónde se alojan los sistemas y qué garantías de privacidad y RGPD ofrecéis?",
    a: "La privacidad y la seguridad jurídica son innegociables. Todos nuestros sistemas, agentes y automatizaciones se alojan en servidores de la Unión Europea bajo estricto cumplimiento del RGPD, con cifrado TLS 256-bit y acuerdos de procesamiento de datos transparentes."
  },
  {
    q: "¿Qué plazo requiere poner en marcha una web, automatización o chatbot?",
    a: "Trabajamos con plazos cerrados y entregas ágiles: una automatización estándar o integración de chatbot suele estar operativa en 7 a 14 días laborables, y un proyecto web completo de alto rendimiento en 2 a 3 semanas."
  },
  {
    q: "¿Qué retorno de inversión (ROI) puedo esperar para mi negocio?",
    a: "Nuestros clientes reducen más de 120 horas al mes en tareas manuales repetitivas, responden a prospectos en WhatsApp en menos de 2 segundos y aumentan significativamente su tasa de conversión web al eliminar tiempos de espera y fricción operativa."
  },
  {
    q: "¿Qué mantenimiento y soporte técnico incluye cada proyecto?",
    a: "Entregamos sistemas llave en mano con documentación técnica completa, periodo de monitorización inicial y soporte proactivo para que nunca te quedes desatendido ante actualizaciones o cambios en herramientas externas."
  }
];

const LandingContent: React.FC = () => {
  const { config } = useLandingConfig();

  // Map section IDs to components
  const renderSectionComponent = (id: string) => {
    switch (id) {
      case "hero":
        return <PrismaDesktopHero key="hero" />;
      case "about":
        return <PrismaDesktopAbout key="about" />;
      case "features":
        return <PrismaDesktopFeatures key="features" />;
      case "social-proof":
        return <PrismaSocialProofSection key="social-proof" />;
      case "portfolio":
        return (
          <React.Fragment key="portfolio-group">
            <PrismaSocialProofSection />
            <PrismaDesktopPortfolio />
          </React.Fragment>
        );
      case "method":
        return <PrismaDesktopMethod key="method" />;
      case "process":
        return <PrismaDesktopProcess key="process" />;
      case "metrics":
        return (
          <React.Fragment key="metrics-faq-group">
            <PrismaDesktopMetrics />
            <LuxuryFAQAccordion
              items={LANDING_FAQS}
              title="Preguntas Frecuentes sobre JRG Agency"
              badge="Resolución de Dudas"
              subtitle="Respuestas claras y transparentes sobre metodología, plazos cerrados, servidores en la Unión Europea y retorno de inversión."
            />
          </React.Fragment>
        );
      case "contact":
        return <PrismaDesktopContact key="contact" />;
      case "footer":
        return <PrismaHarvestFooter key="footer" />;
      default:
        return null;
    }
  };

  // Sort sections by order and filter enabled
  const sortedSections = [...config.sections]
    .sort((a, b) => a.order - b.order)
    .filter((sec) => sec.enabled);

  return (
    <div className="prisma-scope min-h-screen bg-black text-[#E1E0CC] selection:bg-[#DEDBC8] selection:text-black relative pb-28 sm:pb-36">
      {/* 00. PRELOADER */}
      <PrismaDesktopPreloader />

      {/* LUXURY INTERACTIVE MICRO-INTERACTIONS */}
      <CinematicCursor />

      {/* RENDER DYNAMIC ORDERED SECTIONS */}
      {sortedSections.map((sec) => renderSectionComponent(sec.id))}

      {/* FLOATING BOTTOM SERVICE DOCK (MOBILE & DESKTOP ERGONOMICS) */}
      <BottomServiceDock currentService="home" />
    </div>
  );
};

export const PrismaDesktopLanding: React.FC = () => {
  return (
    <LandingConfigProvider>
      <LandingContent />
    </LandingConfigProvider>
  );
};

export default PrismaDesktopLanding;
