import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import WordsPullUpMultiStyle, { TextSegment } from "./WordsPullUpMultiStyle";
import TiltCard from "./TiltCard";
import TornadoVortex from "./TornadoVortex";
import ToonFireball from "./ToonFireball";

export const PrismaDesktopFeatures: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  const line1Segments: TextSegment[] = [
    {
      text: "Workflows de estudio para proyectos visionarios.",
      className: "text-[#E1E0CC] font-normal",
    },
  ];

  const line2Segments: TextSegment[] = [
    {
      text: "Construido para alto impacto. Impulsado por arte y tecnología.",
      className: "text-gray-500 font-normal",
    },
  ];

  const cardsData = [
    {
      type: "video",
      videoUrl:
        "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260406_133058_0504132a-0cf3-4450-a370-8ea3b05c95d4.mp4",
      title: "Tu lienzo interactivo.",
      tag: "INNOVACIÓN VISUAL",
    },
    {
      type: "content",
      number: "01",
      title: "Arquitectura Web & 3D",
      icon: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171918_4a5edc79-d78f-4637-ac8b-53c43c220606.png&w=1280&q=85",
      items: [
        "Escenas y modelos 3D interactivos con Three.js y WebGL.",
        "Micro-animaciones fluidas a 60fps con Framer Motion.",
        "Código modular en React, Vite y TypeScript de alto rendimiento.",
        "Optimización exhaustiva para carga rápida y SEO técnico.",
      ],
      linkText: "Ver proyectos 3D",
      linkHref: "/myworks",
    },
    {
      type: "content",
      number: "02",
      title: "Agentes & IA Autónoma",
      icon: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171741_ed9845ab-f5b2-4018-8ce7-07cc01823522.png&w=1280&q=85",
      items: [
        "Orquestación de agentes con razonamiento extendido y LLMs.",
        "Automatización de prospección, análisis y soporte en tiempo real.",
        "Integración con APIs externas y dashboards de control 3D.",
      ],
      linkText: "Abrir orquestador",
      linkHref: "/agentes",
      hasFireball: true,
    },
    {
      type: "content",
      number: "03",
      title: "Inmersión & Conversión",
      icon: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171809_f56666dc-c099-4778-ad82-9ad4f209567b.png&w=1280&q=85",
      items: [
        "Diseño cinematográfico 'Dark & Moody' con grano y texturas de lujo.",
        "Diseño de interacción con micro-haptics y feedback sonoro.",
        "Embudos de alta conversión enfocados en clientes premium.",
      ],
      linkText: "Hablemos hoy",
      linkHref: "/contact",
    },
  ];

  return (
    <section className="min-h-screen bg-black py-24 md:py-32 px-4 md:px-6 relative select-none overflow-hidden" id="features">
      {/* 3D Tornado WebGL Vortex Background */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <TornadoVortex
          background="transparent"
          topRadius={420}
          waistRadius={60}
          waistPosition={50}
          bottomRadius={1200}
          twist={3.2}
          zoom={76}
          speed={12}
          direction="right"
          lineOptions={{
            count: 240,
            color: "#DEDBC8",
            glow: 8,
          }}
          dots={true}
          dotOptions={{
            count: 7500,
            size: 14,
            color: "#E1E0CC",
            glow: 10,
            flicker: 9,
          }}
          comets={true}
          cometOptions={{
            count: 14,
            speed: 8,
            color: "#F99B26",
            glow: 9,
            tail: 24,
            delay: 4,
            collide: 7,
          }}
          repel={true}
          repelOptions={{
            radius: 80,
            strength: 15,
          }}
        />
        {/* Deep edge gradients to seamlessly blend with top/bottom sections */}
        <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-black via-black/80 to-transparent pointer-events-none z-[1]" />
        <div className="absolute bottom-0 left-0 right-0 h-52 bg-gradient-to-t from-black via-black/85 to-transparent pointer-events-none z-[1]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/35 pointer-events-none z-[1]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16 md:mb-20">
          <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-normal leading-tight mb-2">
            <WordsPullUpMultiStyle segments={line1Segments} />
          </div>
          <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-normal leading-tight">
            <WordsPullUpMultiStyle segments={line2Segments} delay={0.2} />
          </div>
        </div>

        {/* 4-Column Card Grid */}
        <div
          ref={containerRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-2 md:gap-2 lg:gap-2 lg:h-[500px]"
        >
          {cardsData.map((card, idx) => (
            <motion.div
              key={idx}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0.95, opacity: 0 }}
              transition={{
                duration: 0.7,
                delay: idx * 0.15,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="h-full"
            >
              {card.type === "video" ? (
                /* Card 1: Video background card */
                <div className="relative h-full min-h-[380px] lg:min-h-0 rounded-2xl md:rounded-[1.75rem] overflow-hidden group border border-white/10 shadow-2xl flex flex-col justify-end p-6">
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    className="absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-700 group-hover:scale-105"
                  >
                    <source src="/videos/features-card.mp4" type="video/mp4" />
                    <source src={card.videoUrl} type="video/mp4" />
                  </video>
                  {/* Subtle dark gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-[1]" />
                  <div className="relative z-10">
                    <span className="text-[10px] tracking-widest uppercase font-mono px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white/80 inline-block mb-3">
                      {card.tag}
                    </span>
                    <h3
                      className="text-2xl sm:text-3xl font-medium tracking-tight"
                      style={{ color: "#E1E0CC" }}
                    >
                      {card.title}
                    </h3>
                  </div>
                </div>
              ) : (
                /* Card 2, 3, 4: Content cards with 3D Tilt */
                <TiltCard maxTilt={6} glare={true} className="h-full">
                  <div className="h-full min-h-[420px] lg:min-h-0 bg-[#212121]/85 backdrop-blur-xl rounded-2xl md:rounded-[1.75rem] p-6 sm:p-7 flex flex-col justify-between border border-white/10 hover:border-white/20 transition-all duration-300 shadow-2xl group relative overflow-hidden">
                    {/* Optional ToonFireball energy core background for Card 02 (Agentes & IA) */}
                    {card.hasFireball && (
                      <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full pointer-events-none opacity-45 overflow-hidden z-0">
                        <ToonFireball
                          baseColor="#E5B869"
                          accentColor="#DEDBC8"
                          speed={75}
                        />
                      </div>
                    )}

                    {/* Top section: Icon + Header */}
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-5">
                        <img
                          src={card.icon}
                          alt={card.title}
                          className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl object-cover border border-white/10 shadow-md relative z-10"
                        />
                        <span className="text-xs font-mono font-medium text-gray-500 tracking-wider">
                          ({card.number})
                        </span>
                      </div>

                      <h3
                        className="text-lg sm:text-xl font-medium tracking-tight mb-5"
                        style={{ color: "#E1E0CC" }}
                      >
                        {card.title}.
                      </h3>

                      {/* Checklist items */}
                      <ul className="space-y-3">
                        {card.items?.map((item, itemIdx) => (
                          <li key={itemIdx} className="flex items-start gap-2.5">
                            <span
                              className="mt-0.5 flex-shrink-0"
                              style={{ color: "#DEDBC8" }}
                            >
                              <Check className="w-4 h-4 stroke-[2.5]" />
                            </span>
                            <span className="text-xs sm:text-[13px] leading-snug text-gray-400">
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Bottom link: Learn more with rotated arrow (-45deg) */}
                    <div className="pt-6 mt-6 border-t border-white/5 relative z-10">
                      <a
                        href={card.linkHref}
                        className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium transition-colors duration-200 group-hover:gap-2.5"
                        style={{ color: "#DEDBC8" }}
                      >
                        <span>{card.linkText}</span>
                        <ArrowRight className="w-3.5 h-3.5 -rotate-45 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </a>
                    </div>
                  </div>
                </TiltCard>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PrismaDesktopFeatures;
