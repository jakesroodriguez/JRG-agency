import React, { useState } from "react";
import { motion } from "framer-motion";
import { Zap, ShieldCheck, Flame, XCircle, CheckCircle, ArrowRight, Cpu, Eye } from "lucide-react";
import WordsPullUpMultiStyle, { TextSegment } from "./WordsPullUpMultiStyle";
import sounds from "./soundEffects";

export const PrismaDesktopMethod: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"comparison" | "pillars">("comparison");

  const line1Segments: TextSegment[] = [
    {
      text: "El Método JRG.",
      className: "text-[#E1E0CC] font-normal",
    },
    {
      text: "Ingeniería de conversión,",
      className: "italic font-serif text-[#E1E0CC]",
    },
  ];

  const line2Segments: TextSegment[] = [
    {
      text: "no plantillas prediseñadas.",
      className: "text-gray-400 font-normal",
    },
  ];

  const pillars = [
    {
      icon: Eye,
      number: "01",
      title: "Retención Magnética en 3 Segundos",
      subtitle: "Psicología visual y dopamina estética",
      desc: "El cerebro humano evalúa la credibilidad de un negocio en menos de 50ms. Fusionamos dirección de arte cinematográfica y micro-animaciones fluidas para capturar la atención de inmediato y reducir el rebote a mínimos históricos.",
      badge: "ALTO IMPACTO",
    },
    {
      icon: Zap,
      number: "02",
      title: "Rendimiento Obsesivo (Lighthouse 100)",
      subtitle: "Carga instantánea en el Edge",
      desc: "Cada segundo de espera reduce las conversiones un 20%. Nuestros sitios cargan en menos de 0.8s gracias a una arquitectura headless pura en React, TypeScript y distribución global en Vercel/Cloudflare.",
      badge: "< 0.8S FIRST CONTENTFUL PAINT",
    },
    {
      icon: Cpu,
      number: "03",
      title: "Agentes & Conversión Sin Fricción",
      subtitle: "Del interés a la venta directa",
      desc: "Eliminamos los formularios aburridos que nadie rellena. Diseñamos puntos de contacto interactivos, orquestadores inteligentes y conexiones directas a WhatsApp Business para cerrar leads cualificados en caliente.",
      badge: "+300% CONVERSIÓN ESTIMADA",
    },
  ];

  const comparisonRows = [
    {
      metric: "Tiempo de carga inicial",
      traditional: "4.5s – 8.0s (Plantillas lentas infladas)",
      jrg: "0.4s – 0.8s (Edge CDN + Assets optimizados)",
      isJrgSuperior: true,
    },
    {
      metric: "Tecnología y Código",
      traditional: "WordPress / Plugins que se desactualizan",
      jrg: "React 18 + Vite + TypeScript (Código de autor)",
      isJrgSuperior: true,
    },
    {
      metric: "Experiencia de Usuario",
      traditional: "Diseño plano genérico que parece una copia",
      jrg: "Animaciones cinemáticas 60fps & Entornos 3D",
      isJrgSuperior: true,
    },
    {
      metric: "Embudo de Conversión",
      traditional: "Formularios de 8 campos que nadie completa",
      jrg: "Canal directo WhatsApp + Agentes IA interactivos",
      isJrgSuperior: true,
    },
    {
      metric: "Calificación Google Lighthouse",
      traditional: "35 – 65 / 100 (Penalizado por Google)",
      jrg: "95 – 100 / 100 (Posicionamiento SEO natural)",
      isJrgSuperior: true,
    },
  ];

  return (
    <section className="bg-black py-24 md:py-36 px-4 md:px-8 relative select-none" id="method">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.02] mb-4">
            <Flame className="w-3.5 h-3.5 text-[#DEDBC8]" />
            <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-[#DEDBC8]">
              FILOSOFÍA & DIFERENCIAL COMPETITIVO
            </span>
          </div>
          <div className="text-2xl sm:text-3xl md:text-5xl font-medium tracking-tight leading-tight mb-2">
            <WordsPullUpMultiStyle segments={line1Segments} />
          </div>
          <div className="text-xl sm:text-2xl md:text-3xl font-normal text-gray-400">
            <WordsPullUpMultiStyle segments={line2Segments} delay={0.15} />
          </div>
        </div>

        {/* Tab switchers: Comparativa vs Pilares */}
        <div className="flex justify-center mb-12">
          <div className="bg-[#141414] p-1.5 rounded-full border border-white/10 inline-flex items-center gap-2 shadow-xl">
            <button
              onClick={() => {
                if (activeTab !== "comparison") {
                  sounds.playSwoosh();
                  setActiveTab("comparison");
                }
              }}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 cursor-pointer ${
                activeTab === "comparison"
                  ? "bg-[#DEDBC8] text-black shadow-md font-semibold"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Comparativa Cara a Cara
            </button>
            <button
              onClick={() => {
                if (activeTab !== "pillars") {
                  sounds.playSwoosh();
                  setActiveTab("pillars");
                }
              }}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 cursor-pointer ${
                activeTab === "pillars"
                  ? "bg-[#DEDBC8] text-black shadow-md font-semibold"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Los 3 Pilares del Método
            </button>
          </div>
        </div>

        {/* TAB 1: Comparison Card */}
        {activeTab === "comparison" && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-[#111111] rounded-3xl border border-white/10 overflow-hidden shadow-2xl p-6 sm:p-10"
          >
            {/* Table Header */}
            <div className="grid grid-cols-12 pb-6 border-b border-white/10 items-center text-xs sm:text-sm font-mono uppercase tracking-wider">
              <div className="col-span-4 text-gray-500 font-bold">Criterio Técnico</div>
              <div className="col-span-4 text-rose-400/90 font-bold flex items-center gap-2">
                <XCircle className="w-4 h-4 text-rose-500" /> Web Convencional
              </div>
              <div className="col-span-4 text-[#DEDBC8] font-bold flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" /> Estándar JRG Agency 2026
              </div>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-white/5">
              {comparisonRows.map((row, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-12 py-5 items-center hover:bg-white/[0.02] transition-colors rounded-xl px-2"
                >
                  <div className="col-span-4 text-xs sm:text-sm font-medium text-gray-300">
                    {row.metric}
                  </div>
                  <div className="col-span-4 text-xs sm:text-sm text-gray-500 pr-4">
                    {row.traditional}
                  </div>
                  <div className="col-span-4 text-xs sm:text-sm font-semibold text-[#E1E0CC] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                    <span>{row.jrg}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom summary bar */}
            <div className="mt-8 p-4 rounded-2xl bg-black/40 border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
              <div className="text-xs sm:text-sm text-gray-400">
                <span className="text-[#DEDBC8] font-semibold">Conclusión matemática:</span> Una web desarrollada con el método JRG convierte hasta 3 veces más que un sitio estándar.
              </div>
              <a
                href="#contact"
                className="px-5 py-2.5 rounded-full bg-[#DEDBC8] hover:bg-white text-black font-semibold text-xs tracking-tight transition-all duration-300 shadow-md flex-shrink-0 inline-flex items-center gap-1.5"
              >
                <span>Mejorar mi web</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </motion.div>
        )}

        {/* TAB 2: The 3 Pillars */}
        {activeTab === "pillars" && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {pillars.map((p, idx) => {
              const Icon = p.icon;
              return (
                <div
                  key={idx}
                  className="bg-[#121212] rounded-3xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300 shadow-xl flex flex-col justify-between group hover:-translate-y-1"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-[#DEDBC8] group-hover:bg-[#DEDBC8] group-hover:text-black transition-colors duration-300">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-mono font-bold text-gray-600">
                        ({p.number})
                      </span>
                    </div>

                    <div className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 mb-2">
                      {p.badge}
                    </div>

                    <h4 className="text-xl sm:text-2xl font-bold text-[#E1E0CC] mb-2">
                      {p.title}
                    </h4>

                    <div className="text-xs font-serif italic text-gray-400 mb-4">
                      {p.subtitle}
                    </div>

                    <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-light">
                      {p.desc}
                    </p>
                  </div>

                  <div className="mt-8 pt-6 border-t border-white/5 flex items-center gap-2 text-xs font-mono text-[#DEDBC8]">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Estándar certificado JRG</span>
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default PrismaDesktopMethod;
