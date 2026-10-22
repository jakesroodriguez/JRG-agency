import React from "react";
import { motion } from "framer-motion";
import { GitBranch, Compass, Palette, Code2, Rocket, ArrowRight, Check } from "lucide-react";
import WordsPullUpMultiStyle, { TextSegment } from "./WordsPullUpMultiStyle";
import TiltCard from "./TiltCard";
import TaffyChain from "./TaffyChain";

export const PrismaDesktopProcess: React.FC = () => {
  const line1Segments: TextSegment[] = [
    {
      text: "De la primera idea",
      className: "text-[#E1E0CC] font-normal",
    },
    {
      text: "al despliegue mundial.",
      className: "italic font-serif text-[#E1E0CC]",
    },
  ];

  const line2Segments: TextSegment[] = [
    {
      text: "El pipeline de estudio en 4 etapas transparentes.",
      className: "text-gray-400 font-normal",
    },
  ];

  const steps = [
    {
      step: "01",
      time: "Semana 1",
      icon: Compass,
      title: "Discovery & Estrategia",
      subtitle: "Definición del ADN y objetivos",
      desc: "Analizamos tu modelo de negocio, tu público objetivo y los puntos ciegos de tu competencia. Definimos la arquitectura técnica óptima y los puntos clave de conversión.",
      deliverables: ["Auditoría de marca y competencia", "Mapa de arquitectura y conversión", "Definición del stack técnico"],
    },
    {
      step: "02",
      time: "Semana 2",
      icon: Palette,
      title: "Dirección de Arte & 3D",
      subtitle: "Estética visual de impacto",
      desc: "Diseñamos una interfaz única con paleta 'Dark & Moody', tipografía editorial y modelado tridimensional interactivo para que tu marca se distinga inmediatamente.",
      deliverables: ["Prototipo interactivo navegable", "Modelado 3D / Escenas interactivas", "Guía de estilos y micro-interacciones"],
    },
    {
      step: "03",
      time: "Semana 3",
      icon: Code2,
      title: "Ingeniería Frontend",
      subtitle: "Código artesanal a 60 FPS",
      desc: "Construcción en React 18, Vite, TypeScript y Framer Motion. Cada animación, transición y efecto está medido para fluir con suavidad absoluta en cualquier pantalla.",
      deliverables: ["Componentes modulares de autor", "Animaciones y shaders a 60 FPS", "Entorno privado de pruebas (Staging)"],
    },
    {
      step: "04",
      time: "Semana 4",
      icon: Rocket,
      title: "Despliegue & Optimización",
      subtitle: "Lanzamiento y conversión activa",
      desc: "Auditoría Lighthouse 100/100, despliegue global en Edge (Vercel/Cloudflare), conexión directa con WhatsApp y analítica para maximizar el retorno de inversión.",
      deliverables: ["Puntuación 100 en Google Lighthouse", "Hosting en Edge ultra rápido", "Soporte y formación personalizada"],
    },
  ];

  return (
    <section className="bg-black py-24 md:py-36 px-4 md:px-8 relative select-none overflow-hidden" id="process">
      {/* 3D Full-Screen Metallic Chain Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <TaffyChain
          speed={22}
          colors={["#DEDBC8", "#E5B869", "#C5A059", "#F5F2E4", "#212121"]}
          chain={{
            spread: 95,
            linkLength: 64,
            linkThickness: 38,
          }}
          className="w-full h-full"
        />
      </div>

      {/* Gentle top gradient: softly blends from black to chain without an abrupt cut */}
      <div className="absolute top-0 left-0 right-0 h-36 bg-gradient-to-b from-black via-black/60 to-transparent pointer-events-none z-[1]" />

      {/* Gentle bottom gradient to seamlessly blend with subsequent section */}
      <div className="absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none z-[1]" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-black/60 backdrop-blur-md mb-4">
            <GitBranch className="w-3.5 h-3.5 text-[#DEDBC8]" />
            <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-[#DEDBC8]">
              EL PIPELINE DE TRABAJO &middot; INTERACTIVO
            </span>
          </div>
          <div className="text-2xl sm:text-3xl md:text-5xl font-medium tracking-tight leading-tight mb-2">
            <WordsPullUpMultiStyle segments={line1Segments} />
          </div>
          <div className="text-xl sm:text-2xl md:text-3xl font-normal text-gray-400">
            <WordsPullUpMultiStyle segments={line2Segments} delay={0.15} />
          </div>
        </div>

        {/* 4-Column Pipeline Grid with lowered opacity to reveal the 3D chain underneath */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: idx * 0.12, ease: [0.16, 1, 0.3, 1] }}
                className="h-full"
              >
                <TiltCard maxTilt={5} glare={true} className="h-full">
                  <div className="bg-[#121212]/60 hover:bg-[#121212]/75 backdrop-blur-md rounded-3xl p-6 sm:p-7 border border-white/10 hover:border-white/25 transition-all duration-300 shadow-2xl flex flex-col justify-between group relative overflow-hidden h-full">
                    {/* Top Glowing Ambient Accents */}
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#DEDBC8]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div>
                      {/* Step Header */}
                      <div className="flex items-center justify-between mb-5">
                        <span className="text-2xl font-bold font-mono text-[#DEDBC8]">
                          {item.step}
                        </span>
                        <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 text-gray-300">
                          {item.time}
                        </span>
                      </div>

                      {/* Icon + Title */}
                      <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-[#E1E0CC] mb-4 group-hover:bg-[#DEDBC8] group-hover:text-black transition-colors duration-300">
                        <Icon className="w-5 h-5" />
                      </div>

                      <h4 className="text-lg sm:text-xl font-bold text-[#E1E0CC] mb-1">
                        {item.title}
                      </h4>
                      <div className="text-xs font-serif italic text-gray-400 mb-4">
                        {item.subtitle}
                      </div>

                      <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-light mb-6">
                        {item.desc}
                      </p>
                    </div>

                    {/* Deliverables Checklist */}
                    <div className="pt-5 border-t border-white/5">
                      <div className="text-[10px] font-mono uppercase tracking-widest text-gray-400 mb-3">
                        Entregables de la etapa:
                      </div>
                      <ul className="space-y-2">
                        {item.deliverables.map((del, dIdx) => (
                          <li key={dIdx} className="flex items-start gap-2 text-xs text-gray-300 leading-snug">
                            <Check className="w-3.5 h-3.5 text-[#DEDBC8] mt-0.5 flex-shrink-0" />
                            <span>{del}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Banner with backdrop-blur */}
        <div className="mt-12 bg-[#101010]/60 backdrop-blur-md rounded-2xl border border-white/10 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <div className="text-sm sm:text-base font-semibold text-[#E1E0CC]">
              ¿Tienes un plazo ajustado para tu proyecto?
            </div>
            <div className="text-xs text-gray-400">
              Ofrecemos modalidad sprint express para lanzamientos de alta urgencia en menos de 10 días.
            </div>
          </div>
          <a
            href="https://wa.me/34688849495?text=Hola%20Jakes,%20tengo%20un%20proyecto%20con%20plazo%20ajustado%20y%20me%20gustar%C3%ADa%20evaluar%20un%20sprint"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2.5 rounded-full bg-[#DEDBC8] hover:bg-white text-black font-semibold text-xs transition-colors shadow-md flex items-center gap-1.5 flex-shrink-0"
          >
            <span>Consultar disponibilidad</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default PrismaDesktopProcess;
