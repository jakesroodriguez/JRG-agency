import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  Eye,
  Globe,
  Box,
  ShieldCheck,
  Zap,
  Camera,
} from "lucide-react";
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

interface NfcStudioShot {
  id: string;
  number: string;
  title: string;
  shortLabel: string;
  badge: string;
  focal: string;
  description: string;
  image: string;
  image1x1?: string;
}

export const PrismaDesktopPortfolio: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<"web" | "hardware">("web");
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const [activeShotIndex, setActiveShotIndex] = useState(0);

  const webProjects: ProjectItem[] = [
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
      image: "/images/guretrena_web.png",
      liveUrl: "https://guretrenaurretxu.com/",
      accentGlow: "rgba(222, 219, 200, 0.35)",
    },
    {
      id: "korta-taberna",
      number: "02",
      title: "Korta Taberna",
      client: "Taberna & Terraza · Zumarraga",
      category: "Hostelería & Pintxos Artesanos",
      badge: "WEB & CARTA BILINGÜE",
      description:
        "Presencia digital moderna para una de las tabernas con mayor historia de Zumarraga. Carta digital bilingüe (Euskera / Castellano), terraza, geolocalización directa y optimización mobile de máxima velocidad.",
      metrics: [
        { label: "Lighthouse", value: "99/100" },
        { label: "Velocidad Carga", value: "0.48s" },
        { label: "Consultas Directas", value: "+310%" },
      ],
      technologies: ["HTML5", "CSS3 Liquid Glass", "JavaScript", "SEO Local"],
      image: "/images/korta_web.png",
      liveUrl: "https://kortataberna.eus/",
      accentGlow: "rgba(180, 83, 9, 0.35)",
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
      technologies: ["HTML5", "Tailwind CSS", "JavaScript", "Vercel"],
      image: "/images/otxaran_web.png",
      liveUrl: "https://otxaran-denda.vercel.app/",
      accentGlow: "rgba(217, 180, 150, 0.35)",
    },
    {
      id: "urkulu-moviles",
      number: "04",
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
      image: "/images/urkulu_web.png",
      liveUrl: "https://urkulumovilesurretxu.com/",
      accentGlow: "rgba(79, 172, 254, 0.35)",
    },
  ];

  const nfcStudioShots: NfcStudioShot[] = [
    {
      id: "hero-glass",
      number: "01",
      title: "Perspectiva Hero 3/4 · Soporte Cristal K9",
      shortLabel: "Hero Cristal K9",
      badge: "PEDESTAL ÓPTICO K9",
      focal: "75mm · f/4.5",
      description:
        "Encuadre angular en escorzo mostrando la integración del disco NFC de porcelana blanca mate y relieve negro azabache sobre el soporte de cristal óptico K9 biselado con refracción translúcida en ciclorama blanco de estudio.",
      image: "/images/nfc/nfc_hero_glass_stand_4_3.png",
      image1x1: "/images/nfc/nfc_hero_glass_stand_1_1.png",
    },
    {
      id: "macro-relief",
      number: "02",
      title: "Macro Táctil · Relieve y Chip Contactless",
      shortLabel: "Macro Relieve",
      badge: "RELIEVE BICAPA 0.5MM",
      focal: "90mm · f/6.3",
      description:
        "Plano detalle ultra-cercano que destaca el grabado volumétrico bicapa de alta resolución en negro azabache sobre base blanca mate, la tipografía bilingüe y el tacto premium del polímero técnico antimanchas.",
      image: "/images/nfc/nfc_macro_relief_4_3.png",
      image1x1: "/images/nfc/nfc_macro_relief_1_1.png",
    },
    {
      id: "frontal-pedestal",
      number: "03",
      title: "Frontal Arquitectónica · Pedestal Reflectante",
      shortLabel: "Frontal Pedestal",
      badge: "SIMETRÍA PURA",
      focal: "70mm · f/5.0",
      description:
        "Composición frontal a nivel de ojos revelando el brillo especular de las aristas del cristal tallado y el contraste puro entre la base blanca mate y las letras en relieve negro.",
      image: "/images/nfc/nfc_frontal_glass_pedestal_4_3.png",
      image1x1: "/images/nfc/nfc_frontal_glass_pedestal_1_1.png",
    },
    {
      id: "isometric-catalog",
      number: "04",
      title: "Isométrica Comercial · Ángulo 45° de Catálogo",
      shortLabel: "Isométrica 45°",
      badge: "VISTA EN MESA",
      focal: "70mm · f/6.8",
      description:
        "Perspectiva de usuario real que simula cómo percibe el comensal la pieza bicolor blanco/negro sobre la mesa de la terraza o barra antes de acercar el teléfono móvil.",
      image: "/images/nfc/nfc_flatlay_topdown_4_3.png",
      image1x1: "/images/nfc/nfc_flatlay_topdown_1_1.png",
    },
    {
      id: "gold-luxury",
      number: "05",
      title: "Edición Especial Champagne Gold · Alta Hostelería",
      shortLabel: "Champagne Gold",
      badge: "ORO CEPILLADO",
      focal: "75mm · f/4.0",
      description:
        "Variante exclusiva combinando base blanca cerámica con relieve metalizado oro champán para restaurantes gastronómicos, vinotecas selectas y barras de autor.",
      image: "/images/nfc/nfc_gold_luxury_edition_4_3.png",
      image1x1: "/images/nfc/nfc_gold_luxury_edition_1_1.png",
    },
  ];

  const currentProject = webProjects[activeProjectIndex];
  const currentShot = nfcStudioShots[activeShotIndex];

  const handleSelectProject = (idx: number) => {
    if (idx !== activeProjectIndex) {
      sounds.playSwoosh();
      setActiveProjectIndex(idx);
    }
  };

  const handleSelectShot = (idx: number) => {
    if (idx !== activeShotIndex) {
      sounds.playSwoosh();
      setActiveShotIndex(idx);
    }
  };

  const handleSwitchCategory = (category: "web" | "hardware") => {
    if (category !== activeCategory) {
      sounds.playSwoosh();
      setActiveCategory(category);
    }
  };

  const line1Segments: TextSegment[] = [
    {
      text: "Portfolio seleccionado.",
      className: "text-[#E1E0CC] font-normal",
    },
    {
      text: "Donde el arte visual",
      className: "italic font-serif text-[#C2A88F]",
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
        <div className="text-center mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.02] mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#DEDBC8]" />
            <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-[#DEDBC8]">
              CASOS DE ÉXITO & HARDWARE 3D
            </span>
          </div>
          <div className="text-2xl sm:text-3xl md:text-5xl font-medium tracking-tight leading-tight mb-2">
            <WordsPullUpMultiStyle segments={line1Segments} />
          </div>
          <div className="text-xl sm:text-2xl md:text-3xl font-normal text-gray-400">
            <WordsPullUpMultiStyle segments={line2Segments} delay={0.15} />
          </div>

          {/* Liquid Glass Category Selector Tabs */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 mt-8">
            <button
              onClick={() => handleSwitchCategory("web")}
              className={`inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 cursor-pointer ${
                activeCategory === "web"
                  ? "bg-[#DEDBC8] text-black shadow-lg shadow-[#DEDBC8]/15 border border-white"
                  : "bg-white/[0.04] text-gray-400 hover:text-white hover:bg-white/[0.08] border border-white/10"
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>Webs de Clientes (04)</span>
            </button>

            <button
              onClick={() => handleSwitchCategory("hardware")}
              className={`inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 cursor-pointer relative ${
                activeCategory === "hardware"
                  ? "bg-[#DEDBC8] text-black shadow-lg shadow-[#DEDBC8]/15 border border-white"
                  : "bg-white/[0.04] text-gray-400 hover:text-white hover:bg-white/[0.08] border border-white/10"
              }`}
            >
              <Box className="w-4 h-4" />
              <span>Hardware 3D & Placas NFC</span>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold tracking-wider uppercase bg-emerald-500 text-black">
                NUEVO
              </span>
            </button>
          </div>
        </div>

        {/* ============================================================== */}
        {/* VIEW A: WEBS DE CLIENTES (4 Proyectos)                        */}
        {/* ============================================================== */}
        {activeCategory === "web" && (
          <motion.div
            key="web-category"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="bg-[#121212] rounded-3xl border border-white/10 overflow-hidden shadow-2xl p-6 sm:p-8 md:p-12"
          >
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
                        PROYECTO {currentProject.number} / {webProjects.length.toString().padStart(2, "0")}
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
                      <div className="relative aspect-[16/10] overflow-hidden bg-[#0d0d0d]">
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

            {/* Bottom Interactive Project Switcher Rail (4 Client Websites) */}
            <div className="mt-12 pt-8 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
              {webProjects.map((proj, idx) => {
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
          </motion.div>
        )}

        {/* ============================================================== */}
        {/* VIEW B: HARDWARE 3D & PLACAS NFC (Studio Photoshoot)          */}
        {/* ============================================================== */}
        {activeCategory === "hardware" && (
          <motion.div
            key="hardware-category"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="bg-[#121212] rounded-3xl border border-white/10 overflow-hidden shadow-2xl p-6 sm:p-8 md:p-12"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center">
              {/* Left 5-6 Columns: Hardware Story & Specs */}
              <div className="lg:col-span-5 flex flex-col justify-between h-full">
                <div>
                  {/* Status & Badge */}
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-xs font-mono font-bold tracking-widest text-emerald-400 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      SESIÓN DE ESTUDIO · BLENDER 5.2
                    </span>
                    <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full border border-white/10 bg-white/[0.04] text-gray-300">
                      SOPORTE CRISTAL K9
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-2 text-[#E1E0CC]">
                    Placas NFC Bicolor
                  </h3>
                  <div className="text-sm sm:text-base font-serif italic text-gray-400 mb-6">
                    Hardware tangible para cartas digitales & branding en mesa
                  </div>

                  {/* Narrative */}
                  <p className="text-xs sm:text-sm md:text-[15px] leading-relaxed text-gray-300 mb-6 font-light">
                    Fusionamos fabricación aditiva de precisión en polímero bicapa con microchips contactless de grado industrial <strong className="text-white font-medium">NTAG213</strong> y pedestales mecanizados en <strong className="text-white font-medium">cristal óptico K9</strong>. El comensal solo aproxima su teléfono y accede al menú interactivo en menos de 0.2 segundos, sin instalar aplicaciones.
                  </p>

                  {/* Technical Specifications Matrix */}
                  <div className="grid grid-cols-2 gap-3 mb-6 p-4 rounded-2xl bg-black/50 border border-white/5">
                    <div className="flex items-start gap-2.5">
                      <div className="p-2 rounded-xl bg-white/[0.05] border border-white/10 text-emerald-400 mt-0.5">
                        <Zap className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#E1E0CC]">Chip NTAG213</div>
                        <div className="text-[11px] text-gray-400 font-mono">Lectura en 0.2s sin batería</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <div className="p-2 rounded-xl bg-white/[0.05] border border-white/10 text-[#DEDBC8] mt-0.5">
                        <Box className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#E1E0CC]">Cristal Óptico K9</div>
                        <div className="text-[11px] text-gray-400 font-mono">Soporte pesado biselado</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <div className="p-2 rounded-xl bg-white/[0.05] border border-white/10 text-cyan-400 mt-0.5">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#E1E0CC]">Polímero Lavable</div>
                        <div className="text-[11px] text-gray-400 font-mono">Resiste alcohol & agua</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <div className="p-2 rounded-xl bg-white/[0.05] border border-white/10 text-amber-400 mt-0.5">
                        <Camera className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#E1E0CC]">Relieve Táctil</div>
                        <div className="text-[11px] text-gray-400 font-mono">0.5mm alta definición</div>
                      </div>
                    </div>
                  </div>

                  {/* Active Shot Description */}
                  <div className="mb-6 p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
                    <div className="flex items-center justify-between text-xs font-mono text-gray-400 mb-1">
                      <span className="text-[#DEDBC8] font-bold">{currentShot.title}</span>
                      <span className="text-emerald-400">{currentShot.focal}</span>
                    </div>
                    <p className="text-xs text-gray-300 font-light">{currentShot.description}</p>
                  </div>

                  {/* CTAs */}
                  <div className="flex flex-wrap items-center gap-4">
                    <a
                      href="https://wa.me/34613448185?text=Hola%20Jakes,%20quiero%20conocer%20mas%20y%20pedir%20presupuesto%20sobre%20las%20Placas%20NFC%20con%20soporte%20de%20cristal"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-[#DEDBC8] hover:bg-white text-black font-semibold text-sm transition-all duration-300 group shadow-lg"
                    >
                      <span>Pedir presupuesto / Muestra</span>
                      <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </a>

                    <a
                      href="#contact"
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs sm:text-sm font-medium text-gray-300 transition-colors"
                    >
                      <span>Personalizar para mi negocio</span>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Right 6-7 Columns: TiltCard Studio Render Showcase */}
              <div className="lg:col-span-7">
                <TiltCard maxTilt={8} glare={true}>
                  <div className="relative group rounded-2xl md:rounded-3xl overflow-hidden border border-white/15 bg-[#0a0a0a] shadow-2xl">
                    {/* Studio Camera Monitor Topbar */}
                    <div className="h-10 bg-[#141414] border-b border-white/10 px-4 flex items-center justify-between select-none">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                        <span className="text-[11px] font-mono text-gray-300 font-semibold">
                          CYCLES GPU OPTIX · BLENDER 5.2 · RATIO 4:3 (1920×1440)
                        </span>
                      </div>
                      <div className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/[0.05] border border-white/10 text-[#DEDBC8]">
                        FOTOGRAMA {currentShot.number} / {nfcStudioShots.length.toString().padStart(2, "0")} · {currentShot.focal}
                      </div>
                    </div>

                    {/* Image Viewport */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-[#e8e8e8]">
                      <AnimatePresence mode="wait">
                        <motion.img
                          key={currentShot.id}
                          src={currentShot.image}
                          alt={currentShot.title}
                          initial={{ opacity: 0, scale: 0.98 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.98 }}
                          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                          className="w-full h-full object-cover"
                        />
                      </AnimatePresence>

                      {/* Floating Angle Badge */}
                      <div className="absolute top-4 left-4 z-10 pointer-events-none">
                        <span className="text-[10px] font-mono px-3 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-[#DEDBC8] shadow-lg">
                          {currentShot.badge}
                        </span>
                      </div>

                      {/* Open Full Image Overlay */}
                      <a
                        href={currentShot.image}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute bottom-4 right-4 z-10 px-3.5 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-white/20 text-[11px] font-medium text-white flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-xl"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#DEDBC8]" />
                        <span>Ver foto en alta resolución</span>
                      </a>
                    </div>
                  </div>
                </TiltCard>
              </div>
            </div>

            {/* Bottom 5-Shot Studio Selector Rail */}
            <div className="mt-12 pt-8 border-t border-white/10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3">
              {nfcStudioShots.map((shot, idx) => {
                const isActive = idx === activeShotIndex;
                return (
                  <button
                    key={shot.id}
                    onClick={() => handleSelectShot(idx)}
                    className={`p-3 rounded-2xl text-left transition-all duration-300 cursor-pointer relative overflow-hidden flex items-center gap-3 ${
                      isActive
                        ? "bg-white/[0.08] border border-white/25 shadow-lg"
                        : "bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/15"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeStudioRail"
                        className="absolute inset-0 bg-gradient-to-r from-white/[0.08] to-transparent pointer-events-none"
                      />
                    )}
                    <img
                      src={shot.image}
                      alt={shot.shortLabel}
                      className="w-12 h-12 rounded-xl object-cover border border-white/10 flex-shrink-0 bg-white"
                    />
                    <div className="truncate">
                      <div className="flex items-center justify-between mb-0.5">
                        <span
                          className={`text-[10px] font-mono font-bold ${
                            isActive ? "text-[#DEDBC8]" : "text-gray-500"
                          }`}
                        >
                          SHOT {shot.number}
                        </span>
                        {isActive && (
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        )}
                      </div>
                      <div className="font-semibold text-xs text-[#E1E0CC] truncate">
                        {shot.shortLabel}
                      </div>
                      <div className="text-[10px] text-gray-400 font-mono truncate">
                        {shot.focal}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default PrismaDesktopPortfolio;
