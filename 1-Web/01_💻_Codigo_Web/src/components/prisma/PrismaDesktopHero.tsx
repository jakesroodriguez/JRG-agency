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

        {/* Hero bottom-aligned content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 lg:p-14 z-10">
          <div className="grid grid-cols-12 items-end gap-6 md:gap-8">
            {/* Left 8 columns: Giant Heading */}
            <div className="col-span-12 lg:col-span-8 flex flex-col justify-end">
              <WordsPullUp
                text="JRG"
                showAsterisk={true}
                className="text-[26vw] sm:text-[24vw] md:text-[22vw] lg:text-[20vw] xl:text-[19vw] 2xl:text-[20vw] font-medium leading-[0.85] tracking-[-0.07em]"
              />
            </div>

            {/* Right 4 columns: Description + CTA Button */}
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
                  className="inline-flex items-center justify-between gap-2 hover:gap-3 group bg-[#DEDBC8] text-black rounded-full pl-5 pr-2 py-2 sm:pl-6 sm:pr-2 sm:py-2 text-sm sm:text-base font-medium transition-all duration-300 shadow-xl cursor-pointer"
                  style={{ backgroundColor: "#DEDBC8" }}
                >
                  <span className="tracking-tight text-black font-semibold">Iniciar proyecto</span>
                  <div className="bg-black rounded-full w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ml-2">
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-[#E1E0CC]" />
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
