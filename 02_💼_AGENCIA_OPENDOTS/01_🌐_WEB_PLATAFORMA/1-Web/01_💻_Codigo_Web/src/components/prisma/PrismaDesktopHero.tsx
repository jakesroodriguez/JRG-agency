import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import WordsPullUp from "./WordsPullUp";

interface PrismaDesktopHeroProps {
  onContactClick?: () => void;
}

export const PrismaDesktopHero: React.FC<PrismaDesktopHeroProps> = ({
  onContactClick,
}) => {
  return (
    <section className="h-screen w-full p-4 md:p-6 bg-black relative box-border select-none" id="hero">
      <div className="relative w-full h-full rounded-2xl md:rounded-[2rem] overflow-hidden bg-black border border-white/5 shadow-2xl">
        {/* Background video - high bitrate 1080p */}
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src="/videos/hero-bg.mp4" type="video/mp4" />
          <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_170732_8a9ccda6-5cff-4628-b164-059c500a2b41.mp4" type="video/mp4" />
        </video>

        {/* Cinematic gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80 pointer-events-none z-[2]" />

        {/* Top Floating Glass Navigation Header: Unified Centered Island Dock */}
        <header className="absolute top-0 left-0 right-0 p-5 sm:p-7 md:p-8 flex items-center justify-center z-20 pointer-events-none">
          <div className="pointer-events-auto inline-flex items-center gap-2 sm:gap-3 p-1.5 pl-2.5 sm:pl-3 pr-2.5 sm:pr-3 rounded-full bg-black/45 hover:bg-black/60 border border-white/10 hover:border-[#C2A88F]/40 backdrop-blur-2xl transition-all duration-300 shadow-[0_10px_35px_rgba(0,0,0,0.5)]">
            {/* Brand Logo & Studio Name */}
            <a
              href="#hero"
              className="group flex items-center gap-2.5 py-1 px-2.5 rounded-full hover:bg-white/[0.06] transition-all cursor-pointer"
            >
              <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden border border-[#C2A88F]/50 shadow-[0_0_12px_rgba(194,168,143,0.35)] shrink-0 group-hover:scale-105 transition-transform">
                <img
                  src="/logoJRG.png"
                  alt="Logo JRG Agency"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-alata text-xs sm:text-sm font-bold tracking-wider text-white group-hover:text-[#EFE8E1]">
                JRG <span className="text-[#C2A88F] font-normal">AGENCY</span>
              </span>
            </a>

            {/* Subtle Vertical Divider (desktop only) */}
            <div className="w-px h-4 bg-white/15 hidden md:block" />

            {/* Quick Nav Links (desktop only, mobile uses Bottom App Dock) */}
            <nav className="hidden md:flex items-center gap-0.5 sm:gap-1 text-xs font-mono tracking-wider">
              <a
                href="#about"
                className="px-3 py-1.5 rounded-full text-zinc-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                ESTUDIO
              </a>
              <a
                href="#features"
                className="px-3 py-1.5 rounded-full text-zinc-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                SERVICIOS
              </a>
              <a
                href="#portfolio"
                className="px-3 py-1.5 rounded-full text-zinc-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                PROYECTOS
              </a>
              <a
                href="#process"
                className="px-3 py-1.5 rounded-full text-zinc-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                PIPELINE
              </a>
            </nav>

            {/* Mobile Studio Status Badge */}
            <div className="md:hidden flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-mono text-emerald-300 tracking-wider">CORE LIVE</span>
            </div>
          </div>
        </header>

        {/* Hero bottom-aligned content */}
        <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8 md:p-10 lg:p-14 pb-24 sm:pb-8 md:pb-10 lg:pb-14 z-10">
          <div className="grid grid-cols-12 items-end gap-6 md:gap-8">
            {/* Left 8 columns: Giant Heading with DaVinci HUD & Gold Accent */}
            <div className="col-span-12 lg:col-span-8 flex flex-col justify-end">
              <div className="flex items-center gap-2.5 sm:gap-3.5 mb-2 sm:mb-4">
                <span className="font-alata text-[10px] sm:text-xs tracking-[0.28em] uppercase text-[#C2A88F] border border-[#C2A88F]/30 bg-black/60 backdrop-blur-md px-3 sm:px-4 py-1 sm:py-1.5 rounded-full shadow-[0_0_15px_rgba(194,168,143,0.15)] flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C2A88F] animate-pulse" />
                  EST. 2026 // URRETXU · GIPUZKOA
                </span>
                <span className="hidden sm:inline-flex items-center gap-1.5 font-mono text-[10px] tracking-widest text-[#E1E0CC]/70 bg-white/[0.04] px-3 py-1.5 rounded-full border border-white/5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                  STUDIO CORE
                </span>
              </div>
              <WordsPullUp
                text="JRG"
                showAsterisk={true}
                className="text-[26vw] sm:text-[24vw] md:text-[22vw] lg:text-[20vw] xl:text-[19vw] 2xl:text-[20vw] font-medium leading-[0.85] tracking-[-0.07em]"
              />
            </div>

            {/* Right 4 columns: Description + Iniciar proyecto Button */}
            <div className="col-span-12 lg:col-span-4 flex flex-col gap-6 justify-end pb-2">
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  duration: 0.8,
                  delay: 0.5,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="text-xs sm:text-sm md:text-base leading-[1.2] max-w-md font-normal"
                style={{ color: "rgba(222, 219, 200, 0.7)" }}
              >
                JRG Agency es un estudio de desarrollo web de alto impacto, experiencias interactivas 3D y sistemas de agentes inteligentes, enfocado en desbloquear el potencial ilimitado de proyectos visionarios.
              </motion.p>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  duration: 0.8,
                  delay: 0.7,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <a
                  href="#contact"
                  onClick={(e) => {
                    if (onContactClick) {
                      e.preventDefault();
                      onContactClick();
                    }
                  }}
                  className="inline-flex items-center justify-between gap-2 hover:gap-3 group bg-gradient-to-r from-[#DEDBC8] via-[#C2A88F] to-[#A8896C] hover:brightness-110 text-black rounded-full pl-5 pr-2 py-2 sm:pl-6 sm:pr-2 sm:py-2 text-sm sm:text-base font-medium transition-all duration-300 shadow-[0_10px_30px_rgba(194,168,143,0.25)] hover:shadow-[0_12px_36px_rgba(194,168,143,0.4)] cursor-pointer"
                >
                  <span className="font-alata tracking-tight text-black font-bold">Iniciar proyecto</span>
                  <div className="bg-black rounded-full w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ml-2 shadow-md">
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-[#EFE8E1]" />
                  </div>
                </a>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PrismaDesktopHero;
