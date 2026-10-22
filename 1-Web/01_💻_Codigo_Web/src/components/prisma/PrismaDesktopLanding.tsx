import React from "react";
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

export const PrismaDesktopLanding: React.FC = () => {

  return (
    <div className="prisma-scope min-h-screen bg-black text-[#E1E0CC] selection:bg-[#DEDBC8] selection:text-black scroll-smooth">
      {/* LUXURY INTERACTIVE MICRO-INTERACTIONS */}
      <CinematicCursor />

      {/* 01. HERO */}
      <PrismaDesktopHero />

      {/* 02. ABOUT */}
      <PrismaDesktopAbout />

      {/* 03. FEATURES & SERVICIOS */}
      <PrismaDesktopFeatures />

      {/* 04. PORTFOLIO & WEBS RECIENTES */}
      <PrismaDesktopPortfolio />

      {/* 05. EL MÉTODO JRG */}
      <PrismaDesktopMethod />

      {/* 06. PROCESO PASO A PASO */}
      <PrismaDesktopProcess />

      {/* 07. MÉTRICAS & SOCIAL PROOF */}
      <PrismaDesktopMetrics />

      {/* 08. TERMINAL DE CONTACTO & CONVERSIÓN */}
      <PrismaDesktopContact />

      {/* 09. HARVEST HALL-INSPIRED EDITORIAL FOOTER & PHYSICS PLAYGROUND */}
      <PrismaHarvestFooter />
    </div>
  );
};

export default PrismaDesktopLanding;
