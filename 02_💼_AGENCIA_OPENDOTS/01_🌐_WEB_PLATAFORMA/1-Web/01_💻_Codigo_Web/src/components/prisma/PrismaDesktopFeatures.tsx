import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { Check, ArrowRight, Sparkles, Layers, Cpu, Compass } from "lucide-react";
import WordsPullUpMultiStyle, { TextSegment } from "./WordsPullUpMultiStyle";
import TiltCard from "./TiltCard";
import TornadoVortex from "./TornadoVortex";
import ToonFireball from "./ToonFireball";
import sounds from "./soundEffects";

export const PrismaDesktopFeatures: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  const line1Segments: TextSegment[] = [
    {
      text: "Workflows de estudio para proyectos",
      className: "text-[#E1E0CC] font-normal tracking-tight",
    },
    {
      text: "visionarios.",
      className: "italic font-serif text-[#C2A88F] font-normal px-2.5",
    },
  ];

  const line2Segments: TextSegment[] = [
    {
      text: "Infraestructura de alto impacto impulsada por arte, 3D y código de autor.",
      className: "text-zinc-500 font-normal tracking-tight",
    },
  ];

  const cardsData = [
    {
      type: "video",
      videoUrl:
        "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260406_133058_0504132a-0cf3-4450-a370-8ea3b05c95d4.mp4",
      title: "Tu lienzo interactivo.",
      subtitle: "Dirección de arte cinematográfica y shaders a medida.",
      tag: "INNOVACIÓN VISUAL // 3D",
      metric: "60 FPS NATIVO",
    },
    {
      type: "content",
      number: "01",
      iconNode: Layers,
      title: "Arquitectura Web & 3D",
      badge: "FRONTEND DE AUTOR",
      metric: "LCP < 0.6S",
      items: [
        "Modelos y escenas tridimensionales con Three.js y WebGL ligero.",
        "Micro-interacciones cinéticas a 60 FPS con Framer Motion.",
        "Código nativo en React 18, Vite y TypeScript sin dependencias infladas.",
        "Optimización milimétrica para Core Web Vitals 98-100 y SEO técnico.",
      ],
      linkText: "Ver Desarrollo Web",
      linkHref: "/desarrollo-web",
    },
    {
      type: "content",
      number: "02",
      iconNode: Cpu,
      title: "Agentes & IA Autónoma",
      badge: "SISTEMAS INTELIGENTES",
      metric: "ORQUESTACIÓN LLM",
      items: [
        "Despliegue de agentes autónomos con razonamiento extendido.",
        "Automatización de captación, prospección y análisis en tiempo real.",
        "Integración con APIs externas y consolas de control interactivas.",
        "Cualificación instantánea de prospectos sin intervención manual.",
      ],
      linkText: "Explorar Automatizaciones IA",
      linkHref: "/automatizaciones-ia",
      hasFireball: true,
    },
    {
      type: "content",
      number: "03",
      iconNode: Compass,
      title: "Chatbots & Conversión 24/7",
      badge: "RETENCIÓN Y VENTAS",
      metric: "3.4X RETORNO",
      items: [
        "Diseño 'Dark & Moody' de alta gama con texturas y grano cinematográfico.",
        "Asistentes inteligentes conectados a WhatsApp Business API 24/7.",
        "Embudos de alta conversión con reservas y atención en < 2 segundos.",
        "Psicología visual orientada a captar clientes de alto valor.",
      ],
      linkText: "Explorar Chatbots IA",
      linkHref: "/chatbots-ia",
    },
  ];

  return (
    <section className="min-h-screen bg-black py-28 md:py-40 px-4 md:px-8 relative select-none overflow-hidden" id="features">
      {/* 3D Tornado WebGL Vortex Background */}
      <div className="hidden md:block absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-90">
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
            color: "#C2A88F",
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

      {/* Subtle Clean Ambient Gradient (MOBILE ONLY - ZERO LAG / ZERO NOISE) */}
      <div className="md:hidden absolute inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_at_top,rgba(194,168,143,0.08)_0%,rgba(0,0,0,0.98)_70%)]" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-[#C2A88F]/40 bg-black/70 backdrop-blur-xl shadow-[0_0_20px_rgba(194,168,143,0.18)] mb-5">
            <Sparkles className="w-3.5 h-3.5 text-[#C2A88F]" />
            <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.18em] sm:tracking-[0.25em] text-[#C2A88F] font-semibold">
              <span className="hidden sm:inline">SERVICIOS & WORKFLOWS DE AUTOR // STACK 2026</span>
              <span className="sm:hidden">WORKFLOWS DE AUTOR // 2026</span>
            </span>
          </div>

          <div className="text-3xl sm:text-5xl md:text-6xl font-medium tracking-tight leading-[1.1] mb-3">
            <WordsPullUpMultiStyle as="h2" segments={line1Segments} />
          </div>
          <div className="text-lg sm:text-2xl md:text-3xl font-normal text-zinc-400">
            <WordsPullUpMultiStyle segments={line2Segments} delay={0.2} />
          </div>
        </div>

        {/* 4-Column Card Grid (Bento Architecture) */}
        <div
          ref={containerRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:h-[520px] items-stretch"
        >
          {cardsData.map((card, idx) => (
            <motion.div
              key={idx}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0.95, opacity: 0 }}
              transition={{
                duration: 0.7,
                delay: idx * 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="h-full"
            >
              {card.type === "video" ? (
                /* Card 1: Video background card */
                <div className="relative h-full min-h-[420px] lg:min-h-0 rounded-3xl overflow-hidden group border border-white/10 hover:border-[#C2A88F]/40 transition-all duration-500 shadow-2xl flex flex-col justify-between p-5 sm:p-7">
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20 z-[1]" />

                  {/* Top Tag */}
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="text-[9px] sm:text-[10px] tracking-[0.14em] sm:tracking-[0.2em] uppercase font-mono px-2.5 sm:px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-[#C2A88F]/30 text-[#C2A88F] inline-block shadow-md">
                      {card.tag}
                    </span>
                    <span className="font-mono text-[10px] text-zinc-400 bg-white/10 px-2 py-0.5 rounded">
                      {card.metric}
                    </span>
                  </div>

                  {/* Bottom Content */}
                  <div className="relative z-10">
                    <h3 className="text-2xl sm:text-3xl font-medium tracking-tight text-[#E1E0CC] mb-2">
                      {card.title}
                    </h3>
                    <p className="text-xs text-zinc-300 font-light leading-relaxed">
                      {card.subtitle}
                    </p>
                  </div>
                </div>
              ) : (
                /* Card 2, 3, 4: Content cards with 3D Tilt */
                <TiltCard maxTilt={5} glare={true} className="h-full">
                  <div className="h-full min-h-[380px] lg:min-h-0 bg-[#0A0A0B]/90 backdrop-blur-2xl rounded-3xl p-5 sm:p-7 flex flex-col justify-between border border-white/10 hover:border-[#C2A88F]/40 transition-all duration-500 shadow-2xl group relative overflow-hidden">
                    {/* Optional ToonFireball energy core background for Card 02 (Agentes & IA) */}
                    {card.hasFireball && (
                      <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full pointer-events-none opacity-30 overflow-hidden z-0">
                        <ToonFireball
                          baseColor="#C2A88F"
                          accentColor="#DEDBC8"
                          speed={75}
                        />
                      </div>
                    )}

                    {/* Top section: Icon + Header */}
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-5">
                        <div className="w-11 h-11 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-[#C2A88F] group-hover:bg-[#C2A88F] group-hover:text-black transition-all duration-300 shadow-md">
                          {card.iconNode && <card.iconNode className="w-5 h-5" />}
                        </div>
                        <span className="font-mono text-sm tracking-wider text-[#C2A88F] font-bold">
                          ({card.number})
                        </span>
                      </div>

                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-[#C2A88F] font-semibold">
                          {card.badge}
                        </span>
                        <span className="text-[10px] font-mono text-zinc-500">
                          {card.metric}
                        </span>
                      </div>

                      <h3 className="text-lg sm:text-xl font-medium tracking-tight text-[#E1E0CC] mb-4">
                        {card.title}
                      </h3>

                      {/* Checklist items */}
                      <ul className="space-y-2.5">
                        {card.items?.map((item, itemIdx) => (
                          <li key={itemIdx} className="flex items-start gap-2.5">
                            <span className="mt-0.5 flex-shrink-0 text-[#C2A88F]">
                              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                            </span>
                            <span className="text-xs leading-relaxed text-zinc-300 font-light">
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Bottom link: Learn more with rotated arrow (-45deg) */}
                    <div className="pt-5 mt-5 border-t border-white/5 relative z-10">
                      <Link
                        to={card.linkHref || "/contacto"}
                        onClick={() => sounds.playClick()}
                        className="inline-flex items-center gap-2 text-xs font-mono tracking-wider font-semibold text-[#DEDBC8] hover:text-white transition-colors duration-200 group-hover:gap-2.5"
                      >
                        <span>{card.linkText}</span>
                        <ArrowRight className="w-3.5 h-3.5 -rotate-45 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-[#C2A88F]" />
                      </Link>
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
