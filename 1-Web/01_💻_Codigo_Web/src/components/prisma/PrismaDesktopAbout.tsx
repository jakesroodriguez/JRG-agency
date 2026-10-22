import React, { useRef } from "react";
import { useScroll } from "framer-motion";
import WordsPullUpMultiStyle, { TextSegment } from "./WordsPullUpMultiStyle";
import AnimatedLetter from "./AnimatedLetter";
import DitherReveal from "./DitherReveal";

export const PrismaDesktopAbout: React.FC = () => {
  const paragraphRef = useRef<HTMLParagraphElement>(null);

  const { scrollYProgress } = useScroll({
    target: paragraphRef,
    offset: ["start 0.85", "end 0.25"],
  });

  const headingSegments: TextSegment[] = [
    {
      text: "Soy Jakes Rodríguez García,",
      className: "font-normal text-[#E1E0CC]",
    },
    {
      text: "desarrollador creativo y de producto.",
      className: "italic font-serif text-[#E1E0CC]",
    },
    {
      text: "Especializado en experiencias interactivas, interfaces 3D y sistemas de IA.",
      className: "font-normal text-[#E1E0CC]",
    },
  ];

  const bodyText =
    "A lo largo de los últimos años he liderado el diseño y desarrollo de plataformas digitales interactivas, entornos 3D en tiempo real y sistemas de inteligencia artificial para marcas y proyectos de alta exigencia. Fusiono rigor de ingeniería de software con sensibilidad estética cinematográfica para crear experiencias que destacan y convierten.";

  // Split into words so no word is ever broken across lines
  const words = bodyText.split(" ");
  const totalChars = bodyText.length;

  let cumulativeCharCount = 0;

  return (
    <section className="bg-black py-20 md:py-32 px-4 md:px-6 relative select-none overflow-hidden" id="about">
      {/* Interactive Dither Reveal Founder Portrait Background */}
      <div className="absolute inset-0 z-0 pointer-events-auto">
        <DitherReveal
          image="/images/jakes_editorial_portrait.png"
          fit="cover"
          focusY={50}
          ditherStyle="bayer8"
          dotSize={4}
          revealRadius={320}
          revealSoftness={60}
          wave={true}
          waveSpeed={40}
          waveDensity={14}
          className="w-full h-full opacity-95"
        />
        {/* Soft edge gradients to seamlessly blend with top and bottom */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black to-transparent pointer-events-none z-[1]" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none z-[1]" />
      </div>

      {/* Liquid Glass Main Window */}
      <div className="max-w-5xl mx-auto bg-[#0a0a0a]/30 backdrop-blur-md rounded-2xl md:rounded-[2.5rem] p-8 sm:p-12 md:p-16 text-center border border-white/10 shadow-[0_30px_80px_-15px_rgba(0,0,0,0.95)] relative overflow-hidden z-10">
        {/* Subtle radial ambient glow inside card */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-white/[0.03] rounded-full blur-3xl pointer-events-none" />

        {/* Small top label */}
        <div className="mb-6 md:mb-8 relative z-10">
          <span
            className="text-[10px] sm:text-xs tracking-[0.25em] uppercase font-mono px-3 py-1 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-md inline-block"
            style={{ color: "#DEDBC8" }}
          >
            DESARROLLO WEB & EXPERIENCIAS 3D
          </span>
        </div>

        {/* Main heading with WordsPullUpMultiStyle */}
        <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl max-w-3xl mx-auto leading-[0.95] sm:leading-[0.9] text-center relative z-10">
          <WordsPullUpMultiStyle segments={headingSegments} delay={0.1} />
        </div>

        {/* Body paragraph with word-grouped letter opacity scrub */}
        <p
          ref={paragraphRef}
          className="text-xs sm:text-sm md:text-base max-w-2xl mx-auto mt-10 md:mt-14 leading-relaxed font-light text-center relative z-10"
          style={{ color: "#DEDBC8" }}
        >
          {words.map((word, wIdx) => {
            const chars = Array.from(word);
            const startCharIdx = cumulativeCharCount;
            cumulativeCharCount += chars.length + 1; // +1 for the space

            return (
              <span key={wIdx} className="inline-block whitespace-nowrap mr-[0.28em]">
                {chars.map((char, cIdx) => (
                  <AnimatedLetter
                    key={cIdx}
                    char={char}
                    index={startCharIdx + cIdx}
                    totalChars={totalChars}
                    scrollYProgress={scrollYProgress}
                  />
                ))}
              </span>
            );
          })}
        </p>

        {/* Bottom stats pill row */}
        <div className="mt-14 pt-8 border-t border-white/10 flex flex-wrap justify-center items-center gap-8 md:gap-16 text-left relative z-10">
          <div>
            <div className="text-2xl font-bold" style={{ color: "#E1E0CC" }}>
              +5 Años
            </div>
            <div className="text-xs text-gray-400 font-mono">Experiencia Web</div>
          </div>
          <div className="w-[1px] h-8 bg-white/10 hidden sm:block" />
          <div>
            <div className="text-2xl font-bold" style={{ color: "#E1E0CC" }}>
              3D & WebGL
            </div>
            <div className="text-xs text-gray-400 font-mono">Three.js / Shaders</div>
          </div>
          <div className="w-[1px] h-8 bg-white/10 hidden sm:block" />
          <div>
            <div className="text-2xl font-bold" style={{ color: "#E1E0CC" }}>
              Agentes IA
            </div>
            <div className="text-xs text-gray-400 font-mono">Orquestación LLM</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PrismaDesktopAbout;
