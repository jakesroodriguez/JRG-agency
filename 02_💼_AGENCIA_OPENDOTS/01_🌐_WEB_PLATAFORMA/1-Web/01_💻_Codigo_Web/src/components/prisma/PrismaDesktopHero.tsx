import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import WordsPullUp from "./WordsPullUp";
import { useLandingConfig } from "../../context/LandingConfigContext";

interface PrismaDesktopHeroProps {
  onContactClick?: () => void;
}

export const PrismaDesktopHero: React.FC<PrismaDesktopHeroProps> = ({
  onContactClick,
}) => {
  const { config } = useLandingConfig();
  const { hero } = config;

  const positions = hero.positionsMobile || {
    logo: { x: 6, y: 5 },
    subtitle: { x: 6, y: 26.5 },
    cta: { x: 6, y: 88 },
  };

  return (
    <section className="h-screen w-full p-4 md:p-6 bg-black relative box-border select-none" id="hero">
      <div className="relative w-full h-full rounded-2xl md:rounded-[2rem] overflow-hidden bg-black border border-white/5 shadow-2xl">
        {/* Background video - with dynamic brightness and contrast */}
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover z-0 transition-all duration-300"
          style={{
            filter: `brightness(${hero.videoBrightness}) contrast(${hero.videoContrast})`,
          }}
        >
          <source src="/videos/hero-bg.mp4" type="video/mp4" />
          <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_170732_8a9ccda6-5cff-4628-b164-059c500a2b41.mp4" type="video/mp4" />
        </video>

        {/* Cinematic gradient overlay with dynamic opacity */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/85 pointer-events-none z-[2] transition-opacity duration-300"
          style={{ opacity: hero.overlayOpacity }}
        />

        {/* ========================================================
            1. MOBILE FREE POSITIONING (CANVA MODE)
           ======================================================== */}
        <div className="lg:hidden absolute inset-0 z-10 pointer-events-none">
          {/* Logo JRG (Free Position) */}
          <div
            className="absolute pointer-events-auto transition-[left,top] duration-75"
            style={{
              left: `${positions.logo.x}%`,
              top: `${positions.logo.y}%`,
              fontSize: `${hero.logoFontSizeMobile}vw`,
              letterSpacing: hero.logoTracking,
            }}
          >
            <WordsPullUp
              text={hero.logoText || "JRG"}
              showAsterisk={hero.showAsterisk}
              className="font-medium leading-[0.85]"
            />
          </div>

          {/* Subtitle (Free Position) */}
          {hero.showSubtitle && (
            <motion.p
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="absolute pointer-events-auto leading-[1.35] font-normal drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] transition-[left,top] duration-75"
              style={{
                left: `${positions.subtitle.x}%`,
                top: `${positions.subtitle.y}%`,
                fontSize: `${hero.subtitleFontSizeMobile}px`,
                maxWidth: `${hero.subtitleMaxWidthMobile}px`,
                color: hero.subtitleColor,
              }}
            >
              {hero.subtitleText}
            </motion.p>
          )}

          {/* CTA Button (Free Position) */}
          {hero.showCta && (
            <div
              className="absolute pointer-events-auto transition-[left,top] duration-75"
              style={{
                left: `${positions.cta.x}%`,
                top: `${positions.cta.y}%`,
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
                className={`inline-flex items-center justify-between gap-2 hover:gap-3 group rounded-full pl-5 pr-2 py-2 sm:pl-6 sm:pr-2 sm:py-2 text-sm font-medium transition-all duration-300 cursor-pointer ${
                  hero.ctaStyle === "dark-glass"
                    ? "bg-black/60 backdrop-blur-xl border border-white/20 text-[#E1E0CC] hover:bg-black/80 shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
                    : hero.ctaStyle === "champagne-outline"
                    ? "border-2 border-[#C2A88F] text-[#C2A88F] hover:bg-[#C2A88F]/10 shadow-[0_10px_30px_rgba(194,168,143,0.15)]"
                    : "bg-gradient-to-r from-[#DEDBC8] via-[#C2A88F] to-[#A8896C] hover:brightness-110 text-black shadow-[0_10px_30px_rgba(194,168,143,0.25)] hover:shadow-[0_12px_36px_rgba(194,168,143,0.4)]"
                }`}
              >
                <span className="font-alata tracking-tight font-bold">{hero.ctaText || "Iniciar proyecto"}</span>
                {hero.showCtaArrow && (
                  <div className="bg-black rounded-full w-9 h-9 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ml-2 shadow-md">
                    <ArrowRight className="w-4 h-4 text-[#EFE8E1]" />
                  </div>
                )}
              </a>
            </div>
          )}
        </div>

        {/* ========================================================
            2. DESKTOP ORIGINAL 12-COL GRID
           ======================================================== */}
        <div className="hidden lg:grid grid-cols-12 items-end gap-8 absolute inset-0 p-10 lg:p-14 pb-10 lg:pb-14 z-10 pointer-events-none">
          {/* Left 8 columns: Giant Heading JRG */}
          <div className="col-span-8 flex flex-col justify-end pointer-events-auto">
            <div className="text-[20vw] xl:text-[19vw] 2xl:text-[20vw]">
              <WordsPullUp
                text={hero.logoText || "JRG"}
                showAsterisk={hero.showAsterisk}
                className="font-medium leading-[0.85] tracking-[-0.07em]"
              />
            </div>
          </div>

          {/* Right 4 columns: Description + CTA Button */}
          <div className="col-span-4 flex flex-col gap-6 justify-end pb-2 pointer-events-auto">
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                duration: 0.8,
                delay: 0.5,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="text-sm md:text-base leading-[1.2] max-w-md font-normal"
              style={{ color: "rgba(222, 219, 200, 0.85)" }}
            >
              JRG Agency es un estudio de desarrollo web de alto impacto, experiencias interactivas 3D y sistemas de agentes inteligentes, enfocado en desbloquear el potencial ilimitado de proyectos visionarios.
            </motion.p>

            {hero.showCta && (
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
                  className={`inline-flex items-center justify-between gap-2 hover:gap-3 group rounded-full pl-6 pr-2 py-2 text-base font-medium transition-all duration-300 cursor-pointer ${
                    hero.ctaStyle === "dark-glass"
                      ? "bg-black/60 backdrop-blur-xl border border-white/20 text-[#E1E0CC] hover:bg-black/80 shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
                      : hero.ctaStyle === "champagne-outline"
                      ? "border-2 border-[#C2A88F] text-[#C2A88F] hover:bg-[#C2A88F]/10 shadow-[0_10px_30px_rgba(194,168,143,0.15)]"
                      : "bg-gradient-to-r from-[#DEDBC8] via-[#C2A88F] to-[#A8896C] hover:brightness-110 text-black shadow-[0_10px_30px_rgba(194,168,143,0.25)] hover:shadow-[0_12px_36px_rgba(194,168,143,0.4)]"
                  }`}
                >
                  <span className="font-alata tracking-tight font-bold">{hero.ctaText || "Iniciar proyecto"}</span>
                  {hero.showCtaArrow && (
                    <div className="bg-black rounded-full w-10 h-10 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ml-2 shadow-md">
                      <ArrowRight className="w-5 h-5 text-[#EFE8E1]" />
                    </div>
                  )}
                </a>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PrismaDesktopHero;
