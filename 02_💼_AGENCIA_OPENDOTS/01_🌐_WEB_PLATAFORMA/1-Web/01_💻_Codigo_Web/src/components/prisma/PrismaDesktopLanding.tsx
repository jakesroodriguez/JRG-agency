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
