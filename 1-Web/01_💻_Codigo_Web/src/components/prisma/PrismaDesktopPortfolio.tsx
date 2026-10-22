import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, ExternalLink, Sparkles, CheckCircle2, ChevronRight, Eye } from "lucide-react";
import WordsPullUpMultiStyle, { TextSegment } from "./WordsPullUpMultiStyle";
import TiltCard from "./TiltCard";
import sounds from "./soundEffects";
import DitherReveal from "./DitherReveal";

interface ProjectItem {
  id: string;
  number: string;
  title: string;
  client: string;
  category: string;
  badge: string;
  description: string;
  metrics: { label: string; value: string }[];
  technologies: string[];
  image: string;
  liveUrl: string;
  accentGlow: string;
}

export const PrismaDesktopPortfolio: React.FC = () => {
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);

  const projects: ProjectItem[] = [
    {
      id: "gure-trena",
      number: "01",
      title: "Gure Trena",
      client: "Bar & Restaurante Tradicional · Urretxu",
      category: "Hostelería & Carta Gourmet",
      badge: "WEB CORPORATIVA & CARTA",
      description:
        "Rediseño integral de la identidad digital y carta de pintxos interactiva para uno de los templos gastronómicos de Urretxu. Carga instantánea, optimización para smartphones y embudo directo a pedidos.",
      metrics: [
        { label: "Lighthouse", value: "100/100" },
        { label: "Tiempo Carga", value: "0.58s" },
        { label: "Contacto WhatsApp", value: "+340%" },
      ],
      technologies: ["React", "TypeScript", "Tailwind CSS", "Vite", "Local SEO"],
      image: "/images/Prodesk.png",
      liveUrl: "https://guretrenaurretxu.com/",
      accentGlow: "rgba(222, 219, 200, 0.35)",
    },
    {
      id: "urkulu-moviles",
      number: "02",
      title: "Urkulu Móviles",
      client: "Servicio Técnico Oficial · Alto Urola",
      category: "Retail Tecnológico & Reparaciones",
      badge: "SISTEMA DE PRESUPUESTOS",
      description:
        "Plataforma comercial y catálogo técnico para el taller líder en reparación de smartphones y tablets. Sistema de cotización en 1 clic y conversión instantánea vía WhatsApp API sin fricción.",
      metrics: [
        { label: "Lighthouse", value: "98/100" },
        { label: "Conversión Directa", value: "+280%" },
        { label: "First Contentful Paint", value: "0.45s" },
      ],
      technologies: ["React", "Tailwind CSS", "WhatsApp API", "Edge Hosting"],
      image: "/images/VoteChain.png",
      liveUrl: "https://urkulumovilesurretxu.com/",
      accentGlow: "rgba(79, 172, 254, 0.35)",
    },
    {
      id: "otxaran-denda",
      number: "03",
      title: "Otxaran Denda",
      client: "Boutique de Moda · Zumarraga",
      category: "Moda Femenina & Showroom",
      badge: "LOOKBOOK EDITORIAL",
      description:
        "Showcase editorial con estética minimalista de alta costura para la prestigiosa tienda de moda de Zumarraga. Navegación fluida por colecciones de temporada y presentación visual sofisticada.",
      metrics: [
        { label: "Retención de Usuario", value: "+190%" },
        { label: "Lighthouse Performance", value: "99/100" },
        { label: "Optimización Imágenes", value: "-75% peso" },
      ],
      technologies: ["React", "Motion Design", "Catálogo Interactivo", "Vercel"],
      image: "/images/Drishti.png",
      liveUrl: "https://otxaran-denda.vercel.app/",
      accentGlow: "rgba(247, 148, 164, 0.35)",
    },
    {
      id: "jrg-3d-hub",
      number: "04",
      title: "JRG 3D Interactive Hub",
      client: "JRG Agency Lab",
      category: "Experiencia WebGL & Entorno Virtual",
      badge: "3D REAL-TIME ENGINE",
      description:
        "Penthouse y centro de control 3D en tiempo real con avatar interactivo (WASD), iluminación dinámica y shaders cinemáticos. Demostración de las capacidades máximas de la web moderna en el navegador.",
      metrics: [
        { label: "Framerate", value: "60 FPS" },
        { label: "Física en Tiempo Real", value: "Rapier 3D" },
        { label: "Inmersión de Marca", value: "Máxima" },
      ],
      technologies: ["Three.js", "React Three Fiber", "GLSL Shaders", "GSAP"],
      image: "/images/Phoenix3.0.png",
      liveUrl: "/agentes",
      accentGlow: "rgba(0, 242, 254, 0.4)",
    },
    {
      id: "nfc-3d-menu",
      number: "05",
      title: "NFC Smart 3D Menu",
      client: "Innovación para Hostelería",
      category: "Hardware 3D + Visor WebGL",
      badge: "DISCO NFC FÍSICO + DIGITAL",
      description:
        "Discos físicos grabados en 3D con chip NFC integrado y visor web interactivo en tiempo real. Los comensales acercan su móvil y acceden al instante a modelos 3D y platos giratorios sin descargar apps.",
      metrics: [
        { label: "Tiempo de Acceso", value: "0.2s NFC" },
        { label: "Interactividad 3D", value: "WebGL Bicolor" },
        { label: "Atracción en Mesa", value: "100% Wow" },
      ],
      technologies: ["Three.js", "NFC NTAG213", "Impressión 3D", "WebGL"],
      image: "/images/render_3d_preview.png",
      liveUrl: "https://wa.me/34688849495?text=Hola%20Jakes,%20quiero%20conocer%20mas%20sobre%20el%20Menu%203D%20NFC",
      accentGlow: "rgba(245, 158, 11, 0.35)",
    },
    {
      id: "guerrilla-50",
      number: "06",
      title: "Campaña Guerrilla 50€",
      client: "Estrategia Viral JRG",
      category: "Marketing Físico-Digital",
      badge: "CONVERSIÓN DE CALLE",
      description:
        "Campaña de marketing de guerrilla con billetes de 50€ desplegables hiperrealistas y código QR de alta resolución. Convierte el asombro físico en la calle en tráfico digital directo a la web.",
      metrics: [
        { label: "Tasa de Apertura", value: "98.4%" },
        { label: "Escaneos QR", value: "+450/día" },
        { label: "Impacto en Redes", value: "Viral" },
      ],
      technologies: ["Diseño Gráfico", "Dynamic QR", "Storytelling", "Conversión"],
      image: "/images/billete_mockup_calle.png",
      liveUrl: "https://wa.me/34688849495?text=Hola%20Jakes,%20he%20visto%20la%20campana%20del%20billete%20y%20quiero%20informacion",
      accentGlow: "rgba(16, 185, 129, 0.35)",
    },
  ];

  const currentProject = projects[activeProjectIndex];

  const handleSelectProject = (idx: number) => {
    if (idx !== activeProjectIndex) {
      sounds.playSwoosh();
      setActiveProjectIndex(idx);
    }
  };

  const line1Segments: TextSegment[] = [
    {
      text: "Portfolio seleccionado.",
      className: "text-[#E1E0CC] font-normal",
    },
    {
      text: "Donde el arte visual",
      className: "italic font-serif text-[#E1E0CC]",
    },
  ];

  const line2Segments: TextSegment[] = [
    {
      text: "se encuentra con el rendimiento de grado militar.",
      className: "text-gray-400 font-normal",
    },
  ];

  return (
    <section className="bg-black py-24 md:py-36 px-4 md:px-8 relative select-none overflow-hidden" id="portfolio">
      {/* Subtle ambient lighting */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-white/[0.02] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-white/[0.02] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.02] mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#DEDBC8]" />
            <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-[#DEDBC8]">
              CASOS DE ÉXITO & WEBS RECIENTES
            </span>
          </div>
          <div className="text-2xl sm:text-3xl md:text-5xl font-medium tracking-tight leading-tight mb-2">
            <WordsPullUpMultiStyle segments={line1Segments} />
          </div>
          <div className="text-xl sm:text-2xl md:text-3xl font-normal text-gray-400">
            <WordsPullUpMultiStyle segments={line2Segments} delay={0.15} />
          </div>
        </div>

        {/* Master Project Showcase Console */}
        <div className="bg-[#121212] rounded-3xl border border-white/10 overflow-hidden shadow-2xl p-6 sm:p-8 md:p-12">
          {/* Main Grid: Info + Interactive Mockup */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center">
            {/* Left 5 Columns: Project Details */}
            <div className="lg:col-span-5 flex flex-col justify-between h-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentProject.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                >
                  {/* Top indicator & Badge */}
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-xs font-mono font-bold tracking-widest text-emerald-400 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      PROYECTO {currentProject.number} / 06
                    </span>
                    <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full border border-white/10 bg-white/[0.04] text-gray-300">
                      {currentProject.badge}
                    </span>
                  </div>

                  {/* Project Title & Category */}
                  <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-2 text-[#E1E0CC]">
                    {currentProject.title}
                  </h3>
                  <div className="text-sm sm:text-base font-serif italic text-gray-400 mb-6">
                    {currentProject.category} &middot; {currentProject.client}
                  </div>

                  {/* Story Description */}
                  <p className="text-xs sm:text-sm md:text-[15px] leading-relaxed text-gray-300 mb-8 font-light">
                    {currentProject.description}
                  </p>

                  {/* Metrics Badge Grid */}
                  <div className="grid grid-cols-3 gap-3 mb-8 p-4 rounded-2xl bg-black/50 border border-white/5">
                    {currentProject.metrics.map((m, idx) => (
                      <div key={idx} className="text-center">
                        <div className="text-base sm:text-lg font-bold text-[#E1E0CC]">
                          {m.value}
                        </div>
                        <div className="text-[10px] sm:text-xs text-gray-400 font-mono mt-0.5">
                          {m.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Technologies Tags */}
                  <div className="flex flex-wrap gap-2 mb-8">
                    {currentProject.technologies.map((tech, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/10 text-[#DEDBC8]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* CTA Action Buttons */}
                  <div className="flex flex-wrap items-center gap-4">
                    <a
                      href={currentProject.liveUrl}
                      target={currentProject.liveUrl.startsWith("http") ? "_blank" : "_self"}
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-[#DEDBC8] hover:bg-white text-black font-semibold text-sm transition-all duration-300 group shadow-lg"
                    >
                      <span>Ver proyecto en vivo</span>
                      <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </a>

                    <a
                      href="#contact"
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs sm:text-sm font-medium text-gray-300 transition-colors"
                    >
                      <span>Pedir web similar</span>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                    </a>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right 7 Columns: 3D Tilt Device Browser Mockup */}
            <div className="lg:col-span-7">
              <AnimatePresence mode="wait">
                <TiltCard maxTilt={8} glare={true}>
                  <motion.div
                    key={currentProject.id}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    data-cursor="view"
                    className="relative group rounded-2xl md:rounded-3xl overflow-hidden border border-white/15 bg-black shadow-2xl cursor-pointer"
                    style={{
                      boxShadow: `0 30px 80px -20px ${currentProject.accentGlow}`,
                    }}
                  >
                    {/* Browser Chrome Header */}
                    <div className="h-10 bg-[#1a1a1a] border-b border-white/10 px-4 flex items-center justify-between select-none">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                        <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                        <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                      </div>
                      {/* Simulated Address Bar */}
                      <div className="flex items-center gap-2 px-4 py-1 rounded-md bg-black/60 border border-white/10 text-[11px] font-mono text-gray-400 max-w-xs w-full truncate">
                        <span className="text-emerald-400">https://</span>
                        <span className="text-gray-300 truncate">
                          {currentProject.liveUrl.replace("https://", "")}
                        </span>
                      </div>
                      <div className="text-gray-500">
                        <ExternalLink className="w-3.5 h-3.5" />
                      </div>
                    </div>

                    {/* Browser Viewport with Interactive DitherReveal WebGL */}
                    <div className="relative aspect-[16/10] sm:aspect-[16/9] overflow-hidden bg-[#0d0d0d]">
                      <DitherReveal
                        image={currentProject.image}
                        dotSize={4}
                        revealRadius={220}
                        revealSoftness={50}
                        wave={true}
                        waveSpeed={45}
                        waveDensity={16}
                        className="w-full h-full"
                      >
                        {/* Gradient overlay for depth */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none" />

                        {/* Floating pill link on hover */}
                        <div className="absolute bottom-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <a
                            href={currentProject.liveUrl}
                            target={currentProject.liveUrl.startsWith("http") ? "_blank" : "_self"}
                            rel="noopener noreferrer"
                            className="px-4 py-2 rounded-full bg-black/80 backdrop-blur-md border border-white/20 text-xs font-medium text-white flex items-center gap-2 shadow-xl hover:bg-black cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5 text-[#DEDBC8]" />
                            <span>Abrir en directo</span>
                          </a>
                        </div>

                        {/* Interactive Hint Indicator */}
                        <div className="absolute top-3 right-3 z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-[#DEDBC8]">
                            DITHER SHADER 60FPS
                          </span>
                        </div>
                      </DitherReveal>
                    </div>
                  </motion.div>
                </TiltCard>
              </AnimatePresence>
            </div>
          </div>

          {/* Bottom Interactive Project Switcher Rail (6 Projects) */}
          <div className="mt-12 pt-8 border-t border-white/10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
            {projects.map((proj, idx) => {
              const isActive = idx === activeProjectIndex;
              return (
                <button
                  key={proj.id}
                  onClick={() => handleSelectProject(idx)}
                  className={`p-3.5 rounded-2xl text-left transition-all duration-300 cursor-pointer relative overflow-hidden ${
                    isActive
                      ? "bg-white/[0.08] border border-white/25 shadow-lg"
                      : "bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/15"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activePortfolioRail"
                      className="absolute inset-0 bg-gradient-to-r from-white/[0.08] to-transparent pointer-events-none"
                    />
                  )}
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-xs font-mono font-bold ${
                        isActive ? "text-[#DEDBC8]" : "text-gray-500"
                      }`}
                    >
                      {proj.number}
                    </span>
                    {isActive && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    )}
                  </div>
                  <div className="font-semibold text-xs sm:text-sm text-[#E1E0CC] truncate">
                    {proj.title}
                  </div>
                  <div className="text-[10px] text-gray-400 font-serif italic truncate">
                    {proj.client.split("·")[0]}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PrismaDesktopPortfolio;
