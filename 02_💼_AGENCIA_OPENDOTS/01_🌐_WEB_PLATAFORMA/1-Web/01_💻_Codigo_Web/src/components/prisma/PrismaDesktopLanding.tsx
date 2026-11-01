import React from "react";
import { Link } from "react-router-dom";
import { Sliders } from "lucide-react";
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
import { LandingConfigProvider, useLandingConfig } from "../../context/LandingConfigContext";

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
      case "portfolio":
        return <PrismaDesktopPortfolio key="portfolio" />;
      case "method":
        return <PrismaDesktopMethod key="method" />;
      case "process":
        return <PrismaDesktopProcess key="process" />;
      case "metrics":
        return <PrismaDesktopMetrics key="metrics" />;
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
    <div className="prisma-scope min-h-screen bg-black text-[#E1E0CC] selection:bg-[#DEDBC8] selection:text-black relative">
      {/* 00. PRELOADER */}
      <PrismaDesktopPreloader />

      {/* LUXURY INTERACTIVE MICRO-INTERACTIONS */}
      <CinematicCursor />

      {/* RENDER DYNAMIC ORDERED SECTIONS */}
      {sortedSections.map((sec) => renderSectionComponent(sec.id))}

      {/* FLOATING CANVA-STYLE STUDIO BUTTON */}
      <Link
        to="/studio"
        className="fixed bottom-5 right-5 z-[9999] flex items-center gap-2 px-3.5 py-2 rounded-full bg-black/75 hover:bg-black/95 text-[#E1E0CC] hover:text-white border border-[#C2A88F]/40 hover:border-[#C2A88F] shadow-[0_8px_25px_rgba(0,0,0,0.6)] backdrop-blur-xl transition-all duration-300 hover:scale-105 group text-xs font-medium cursor-pointer"
        title="Abrir JRG Studio Editor"
      >
        <Sliders className="w-3.5 h-3.5 text-[#C2A88F] group-hover:rotate-45 transition-transform duration-300" />
        <span className="tracking-wide">Studio Editor</span>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
      </Link>
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
