import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ShieldCheck,
  Terminal,
  Layers,
  Activity,
  Check,
  Minus,
} from "lucide-react";
import WordsPullUpMultiStyle, { TextSegment } from "./WordsPullUpMultiStyle";
import sounds from "./soundEffects";

type MethodView = "audit" | "vectors";

export const PrismaDesktopMethod: React.FC = () => {
  const [activeView, setActiveView] = useState<MethodView>("audit");

  const line1Segments: TextSegment[] = [
    {
      text: "El Método JRG.",
      className: "text-[#E1E0CC] font-normal tracking-tight",
    },
    {
      text: "Ingeniería de conversión,",
      className: "italic font-serif text-[#C2A88F] font-normal",
    },
  ];

  const line2Segments: TextSegment[] = [
    {
      text: "no plantillas prediseñadas.",
      className: "text-zinc-500 font-normal tracking-tight",
    },
  ];

  const engineeringSpecs = [
    {
      id: "01",
      dimension: "Tiempo hasta Primer Byte (TTFB & LCP)",
      standard: "4.2s – 7.8s (Bases de datos pesadas y CMS monolíticos)",
      jrg: "0.42s – 0.68s (Distribución estática en Edge CDN)",
      delta: "-88% LATENCIA",
      notes: "Cada 100ms de retraso reduce la tasa de conversión en un 7%.",
    },
    {
      id: "02",
      dimension: "Retención en el Umbral Crítico (0 – 3s)",
      standard: "32% (Rebote masivo por estética genérica y falta de jerarquía)",
      jrg: "86% (Dirección de arte cinematográfica y shaders a 60 FPS)",
      delta: "+54% RETENCIÓN",
      notes: "El sistema nervioso humano valida la solvencia técnica en 50 milisegundos.",
    },
    {
      id: "03",
      dimension: "Arquitectura de Código & Dependencias",
      standard: "WordPress con 25+ plugins vulnerables a fallos y brechas",
      jrg: "React 18 + Vite + TypeScript de autor compilado a producción",
      delta: "ZERO-BLOAT",
      notes: "Mantenimiento nulo, seguridad hermética y durabilidad estructural a largo plazo.",
    },
    {
      id: "04",
      dimension: "Mecanismo de Captación y Cierre",
      standard: "Formularios fríos de 7 u 8 campos con abandono del 85%",
      jrg: "Puntos de contacto interactivos y canal directo WhatsApp Business",
      delta: "3.4x CONVERSIÓN",
      notes: "Eliminamos toda fricción cognitiva para abrir conversaciones en caliente.",
    },
    {
      id: "05",
      dimension: "Indexación Orgánica (Google Core Web Vitals)",
      standard: "Puntuaciones de 35 a 60 / 100 con penalización en SERP",
      jrg: "98 a 100 / 100 certificado en Lighthouse oficial",
      delta: "TOP 1% GLOBAL",
      notes: "Google premia la velocidad pura y la ausencia de saltos de diseño (CLS).",
    },
  ];

  const vectors = [
    {
      number: "VECTOR // 01",
      title: "Arquitectura de Carga Asíncrona",
      subtitle: "Compilación quirúrgica en el Edge",
      desc: "Descartamos CMS prediseñados y librerías obsoletas. Cada proyecto se desarrolla como una aplicación web nativa en React y TypeScript, desplegada sobre servidores perimetrales ultra-rápidos que entregan el contenido antes de que el usuario parpadee.",
      metric: "< 500ms",
      metricLabel: "Time to Interactive",
    },
    {
      number: "VECTOR // 02",
      title: "Dirección de Arte de Alta Retención",
      subtitle: "Psicología visual sin saturación",
      desc: "La estética no es decoración: es un vector de conversión. Empleamos una paleta 'Dark & Moody' de alto contraste, tipografía editorial con kerning ajustado y micro-animaciones físicas que transmiten solidez de marca desde el primer segundo.",
      metric: "86%",
      metricLabel: "Tasa de Retención 3s",
    },
    {
      number: "VECTOR // 03",
      title: "Eliminación Radical de la Fricción",
      subtitle: "De la curiosidad al cierre comercial",
      desc: "Sustituimos los formularios estáticos que nadie rellena por embudos directos, micro-interacciones de presupuesto y conexión en caliente a WhatsApp con mensaje preconfigurado. Reducimos el ciclo de decisión a menos de 60 segundos.",
      metric: "3.4x",
      metricLabel: "Retorno de Conversión",
    },
  ];

  return (
    <section className="bg-black py-28 md:py-40 px-4 md:px-8 relative select-none overflow-hidden" id="method">
      {/* Subtle architectural grid lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Ambient warm specular aura */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-[#C2A88F]/[0.08] blur-[140px] pointer-events-none" />
      <div className="md:hidden absolute top-1/2 left-1/2 -translate-x-1/2 w-80 h-80 bg-[#C2A88F]/[0.06] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Editorial Eyebrow & Headline */}
        <div className="mb-14 md:mb-20 text-left md:text-center">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/[0.02] backdrop-blur-xl mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C2A88F]" />
            <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.18em] sm:tracking-[0.25em] text-[#C2A88F]">
              <span className="hidden sm:inline">METODOLOGÍA DE AUTOR // ESPECIFICACIÓN TÉCNICA</span>
              <span className="sm:hidden">METODOLOGÍA DE AUTOR</span>
            </span>
          </div>

          <div className="text-3xl sm:text-5xl md:text-6xl font-normal tracking-tight leading-[1.08] mb-3">
            <WordsPullUpMultiStyle segments={line1Segments} />
          </div>
          <div className="text-xl sm:text-3xl md:text-4xl font-normal text-zinc-500">
            <WordsPullUpMultiStyle segments={line2Segments} delay={0.15} />
          </div>

          <p className="mt-5 text-sm sm:text-base text-zinc-400 max-w-2xl md:mx-auto leading-relaxed font-light">
            Cada milisegundo de latencia y cada decisión de diseño genérica penalizan directamente la facturación de tu negocio. Tratamos la web como una pieza de ingeniería de precisión.
          </p>
        </div>

        {/* Minimalist Architectural View Switcher */}
        <div className="flex justify-center mb-10">
          <div className="w-full sm:w-auto p-1 rounded-full bg-zinc-950 border border-white/10 grid grid-cols-2 sm:flex sm:items-center gap-1 shadow-2xl">
            <button
              onClick={() => {
                if (activeView !== "audit") {
                  sounds.playClick();
                  setActiveView("audit");
                }
              }}
              className={`flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 rounded-full text-[10px] sm:text-xs font-mono tracking-wider transition-all duration-300 cursor-pointer ${
                activeView === "audit"
                  ? "bg-[#EFE8E1] text-black font-semibold shadow-md"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>MATRIZ COMPARATIVA</span>
            </button>

            <button
              onClick={() => {
                if (activeView !== "vectors") {
                  sounds.playClick();
                  setActiveView("vectors");
                }
              }}
              className={`flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 rounded-full text-[10px] sm:text-xs font-mono tracking-wider transition-all duration-300 cursor-pointer ${
                activeView === "vectors"
                  ? "bg-[#EFE8E1] text-black font-semibold shadow-md"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>3 VECTORES TÉCNICOS</span>
            </button>
          </div>
        </div>

        {/* View Content */}
        <AnimatePresence mode="wait">
          {/* VIEW 1: Matriz Técnica de Auditoría */}
          {activeView === "audit" && (
            <motion.div
              key="audit"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-3xl border border-white/10 bg-[#0A0A0B]/90 backdrop-blur-2xl shadow-2xl overflow-hidden"
            >
              {/* Table Column Headers */}
              <div className="hidden md:grid grid-cols-12 px-8 py-5 border-b border-white/10 text-[11px] font-mono uppercase tracking-[0.18em] text-zinc-500 bg-white/[0.01]">
                <div className="col-span-1">ID</div>
                <div className="col-span-4">Criterio de Rendimiento</div>
                <div className="col-span-3 text-zinc-400">Web Estándar (CMS)</div>
                <div className="col-span-4 text-[#C2A88F]">Estándar JRG Agency 2026</div>
              </div>

              {/* Rows */}
              <div className="divide-y divide-white/[0.06]">
                {engineeringSpecs.map((spec) => (
                  <div
                    key={spec.id}
                    className="p-6 md:px-8 md:py-6 grid grid-cols-1 md:grid-cols-12 items-center gap-4 md:gap-0 hover:bg-white/[0.02] transition-colors"
                  >
                    {/* Spec ID */}
                    <div className="hidden md:block col-span-1 font-mono text-xs text-zinc-600">
                      [{spec.id}]
                    </div>

                    {/* Dimension & Notes */}
                    <div className="col-span-12 md:col-span-4 pr-4">
                      <div className="text-base font-normal text-white">
                        {spec.dimension}
                      </div>
                      <div className="text-xs text-zinc-500 font-light mt-1">
                        {spec.notes}
                      </div>
                    </div>

                    {/* Standard Web */}
                    <div className="col-span-12 md:col-span-3 pr-4">
                      <div className="md:hidden font-mono text-[10px] uppercase text-zinc-500 mb-1">
                        Web Estándar
                      </div>
                      <div className="flex items-start gap-2 text-xs sm:text-sm text-zinc-400 font-light">
                        <Minus className="w-4 h-4 text-zinc-600 shrink-0 mt-0.5" />
                        <span>{spec.standard}</span>
                      </div>
                    </div>

                    {/* JRG Standard */}
                    <div className="col-span-12 md:col-span-4 pl-0 md:pl-2">
                      <div className="md:hidden font-mono text-[10px] uppercase text-[#C2A88F] mb-1">
                        Estándar JRG
                      </div>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-2 text-xs sm:text-sm text-[#EFE8E1] font-medium">
                          <Check className="w-4 h-4 text-[#C2A88F] shrink-0 mt-0.5" />
                          <span>{spec.jrg}</span>
                        </div>
                        <span className="font-mono text-[10px] tracking-wider text-[#C2A88F] px-2.5 py-1 rounded bg-[#C2A88F]/10 border border-[#C2A88F]/25 shrink-0 whitespace-nowrap">
                          {spec.delta}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Architectural Action Bar */}
              <div className="p-6 sm:p-8 bg-zinc-950/80 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-5">
                <div className="flex items-center gap-3 text-xs sm:text-sm text-zinc-400">
                  <Activity className="w-4 h-4 text-[#C2A88F] shrink-0" />
                  <span>
                    Auditoría certificable en <span className="text-white font-medium">Google PageSpeed Insights</span> y <span className="text-white font-medium">WebPageTest</span>.
                  </span>
                </div>

                <a
                  href="#contact"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-6 py-3 rounded-full bg-[#EFE8E1] hover:bg-white text-black text-xs font-mono tracking-wider font-semibold uppercase transition-all duration-300 shadow-xl cursor-pointer hover:scale-[1.02]"
                >
                  <span>Solicitar Auditoría de Rendimiento</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </motion.div>
          )}

          {/* VIEW 2: Los 3 Vectores de Conversión */}
          {activeView === "vectors" && (
            <motion.div
              key="vectors"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {vectors.map((vec, idx) => (
                <div
                  key={idx}
                  className="rounded-3xl p-8 bg-[#0A0A0B]/90 border border-white/10 hover:border-[#C2A88F]/40 transition-all duration-300 shadow-2xl flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between pb-6 mb-6 border-b border-white/[0.06]">
                      <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#C2A88F]">
                        {vec.number}
                      </span>
                      <ShieldCheck className="w-4 h-4 text-zinc-600 group-hover:text-[#C2A88F] transition-colors" />
                    </div>

                    <h3 className="text-2xl font-normal text-white mb-1.5 tracking-tight">
                      {vec.title}
                    </h3>
                    <div className="italic font-serif text-sm text-[#C2A88F] mb-4">
                      {vec.subtitle}
                    </div>

                    <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed">
                      {vec.desc}
                    </p>
                  </div>

                  <div className="mt-10 pt-6 border-t border-white/[0.06] flex items-baseline justify-between">
                    <div>
                      <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                        {vec.metricLabel}
                      </div>
                      <div className="text-3xl font-mono tabular-nums font-light text-[#EFE8E1] mt-0.5">
                        {vec.metric}
                      </div>
                    </div>

                    <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-zinc-400 group-hover:border-[#C2A88F] group-hover:text-white transition-all">
                      <ArrowRight className="w-3.5 h-3.5 -rotate-45 group-hover:rotate-0 transition-transform" />
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Global Metric Differential Strip */}
        <div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 p-6 sm:p-8 rounded-3xl border border-white/10 bg-white/[0.01] backdrop-blur-xl">
          <div className="border-b sm:border-b-0 sm:border-r border-white/5 pb-4 sm:pb-0 sm:pr-6">
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-1">
              LATENCIA MEDIA GLOBAL
            </div>
            <div className="text-3xl sm:text-4xl font-mono tabular-nums font-light text-[#EFE8E1]">
              0.45s
            </div>
            <div className="text-xs text-zinc-500 mt-1 font-light">
              Frente al promedio de la industria de 4.8s
            </div>
          </div>

          <div className="border-b sm:border-b-0 sm:border-r border-white/5 pb-4 sm:pb-0 sm:px-6">
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-1">
              RETENCIÓN INICIAL (3S)
            </div>
            <div className="text-3xl sm:text-4xl font-mono tabular-nums font-light text-[#C2A88F]">
              86%
            </div>
            <div className="text-xs text-zinc-500 mt-1 font-light">
              Frente a tasas de rebote del 68% en plantillas
            </div>
          </div>

          <div className="pt-2 sm:pt-0 sm:pl-6">
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-1">
              MULTIPLICADOR DE CONVERSIÓN
            </div>
            <div className="text-3xl sm:text-4xl font-mono tabular-nums font-light text-[#EFE8E1]">
              3.4x
            </div>
            <div className="text-xs text-zinc-500 mt-1 font-light">
              Auditoría sobre tráfico comercial cualificado
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PrismaDesktopMethod;
