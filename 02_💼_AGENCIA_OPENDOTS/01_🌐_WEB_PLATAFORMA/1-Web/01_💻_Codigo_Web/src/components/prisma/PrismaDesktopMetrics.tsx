import React from "react";
import { motion } from "framer-motion";
import {
  Star,
  Award,
  ShieldCheck,
  Quote,
  ArrowRight,
  Gauge,
  TrendingUp,
  CheckCircle2,
  Zap,
} from "lucide-react";
import WordsPullUpMultiStyle, { TextSegment } from "./WordsPullUpMultiStyle";
import TiltCard from "./TiltCard";
import PredictiveArc from "./PredictiveArc";
import sounds from "./soundEffects";

export const PrismaDesktopMetrics: React.FC = () => {
  const line1Segments: TextSegment[] = [
    {
      text: "Métricas de impacto.",
      className: "text-[#E1E0CC] font-normal tracking-tight",
    },
    {
      text: "Resultados auditados,",
      className: "italic font-serif text-[#C2A88F] font-normal px-2.5",
    },
  ];

  const line2Segments: TextSegment[] = [
    {
      text: "no promesas vacías.",
      className: "text-zinc-500 font-normal tracking-tight",
    },
  ];

  const topMetrics = [
    {
      value: "0.48s",
      badge: "LATENCIA ZERO",
      label: "Carga Inicial (LCP)",
      desc: "Despliegue perimetral en Edge CDN sin bloqueo del hilo principal.",
      icon: Zap,
    },
    {
      value: "+340%",
      badge: "CONVERSIÓN DIRECTA",
      label: "Incremento en Leads",
      desc: "Captación cualificada canalizada directamente a WhatsApp API.",
      icon: TrendingUp,
    },
    {
      value: "100/100",
      badge: "CERTIFICADO GOOGLE",
      label: "Core Web Vitals",
      desc: "Puntuación máxima oficial en Rendimiento, SEO y Accesibilidad.",
      icon: Gauge,
    },
    {
      value: "60 FPS",
      badge: "FLUIDEZ FÍSICA",
      label: "Micro-interacciones",
      desc: "Animaciones y shaders optimizados sin caídas de frames ni jank.",
      icon: CheckCircle2,
    },
  ];

  return (
    <section className="bg-black py-28 md:py-40 px-4 md:px-8 relative select-none overflow-hidden" id="metrics">
      {/* Dynamic Predictive Arc Mathematical Wave Shader Background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-25 overflow-hidden">
        <PredictiveArc
          background="transparent"
          baseColor="#0D0D0E"
          accentColor="#C2A88F"
          highlight="#DEDBC8"
          density={65}
          speed={35}
        />
        {/* Soft edge gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black pointer-events-none" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-[#C2A88F]/40 bg-black/70 backdrop-blur-xl shadow-[0_0_20px_rgba(194,168,143,0.18)] mb-4">
            <Award className="w-3.5 h-3.5 text-[#C2A88F]" />
            <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] text-[#C2A88F] font-semibold">
              VALIDACIÓN EMPÍRICA // TELEMETRÍA DE ESTUDIO
            </span>
          </div>

          <div className="text-3xl sm:text-5xl md:text-6xl font-medium tracking-tight leading-[1.1] mb-3">
            <WordsPullUpMultiStyle segments={line1Segments} />
          </div>
          <div className="text-lg sm:text-2xl md:text-3xl font-normal text-zinc-400">
            <WordsPullUpMultiStyle segments={line2Segments} delay={0.15} />
          </div>

          <p className="mt-4 text-xs sm:text-sm md:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed font-light">
            La reputación de un estudio de ingeniería se demuestra en números tangibles: velocidad de renderizado extrema, retención en el umbral crítico y retorno comercial medible.
          </p>
        </div>

        {/* 4 Architectural Telemetry Metrics Bento */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-16 md:mb-20">
          {topMetrics.map((m, idx) => {
            const Icon = m.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="bg-[#0A0A0B]/90 rounded-3xl p-6 sm:p-8 border border-white/10 hover:border-[#C2A88F]/40 transition-all duration-300 flex flex-col justify-between shadow-2xl backdrop-blur-xl group hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.18em] text-[#C2A88F] px-2.5 py-1 rounded bg-[#C2A88F]/10 border border-[#C2A88F]/25">
                      {m.badge}
                    </span>
                    <Icon className="w-4 h-4 text-zinc-500 group-hover:text-[#C2A88F] transition-colors" />
                  </div>

                  <div className="text-3xl sm:text-4xl md:text-5xl font-mono tabular-nums font-light text-[#EFE8E1] tracking-tight mb-2">
                    {m.value}
                  </div>

                  <div className="text-xs sm:text-sm font-semibold text-white mb-2">
                    {m.label}
                  </div>
                </div>

                <p className="text-[11px] sm:text-xs text-zinc-400 font-light leading-relaxed pt-4 border-t border-white/5">
                  {m.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Asymmetric Social Proof Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch mb-12">
          {/* Featured Case 1: Gure Trena (Span 7 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
            className="md:col-span-7"
          >
            <TiltCard maxTilt={4} glare={true} className="h-full">
              <div className="bg-[#0A0A0B]/90 rounded-3xl p-7 sm:p-9 border border-white/10 hover:border-[#C2A88F]/40 flex flex-col justify-between shadow-2xl relative overflow-hidden group transition-all h-full backdrop-blur-xl">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-[#C2A88F] text-[#C2A88F]" />
                      ))}
                    </div>
                    <span className="font-mono text-[10px] tracking-widest uppercase text-emerald-400 font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                      PRODUCCIÓN VERIFICADA
                    </span>
                  </div>

                  <Quote className="w-8 h-8 text-[#C2A88F]/20 mb-3" />

                  <p className="text-sm sm:text-base text-zinc-200 leading-relaxed font-light mb-6">
                    &ldquo;El cambio fue brutal. Los clientes entran al local con el móvil en la mano mirando los pintxos en la web antes de pedir. La estética cinematográfica y la velocidad en 0.5s han elevado el estatus de nuestro establecimiento.&rdquo;
                  </p>
                </div>

                <div>
                  <div className="grid grid-cols-2 gap-3 mb-6 p-4 rounded-2xl bg-black/50 border border-white/5 text-xs font-mono">
                    <div>
                      <div className="text-zinc-500 text-[10px] uppercase">Tráfico Digital</div>
                      <div className="text-[#EFE8E1] font-bold text-sm mt-0.5">+180% Visitas Menú</div>
                    </div>
                    <div>
                      <div className="text-zinc-500 text-[10px] uppercase">Retención en 3s</div>
                      <div className="text-[#C2A88F] font-bold text-sm mt-0.5">89% Tasa Activa</div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold text-white">Equipo Directivo Gure Trena</div>
                      <div className="text-[11px] text-zinc-400 font-mono mt-0.5">Restauración & Hostelería &middot; Urretxu</div>
                    </div>
                    <ShieldCheck className="w-4 h-4 text-[#C2A88F]" />
                  </div>
                </div>
              </div>
            </TiltCard>
          </motion.div>

          {/* Case 2: Urkulu Móviles (Span 5 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="md:col-span-5"
          >
            <TiltCard maxTilt={4} glare={true} className="h-full">
              <div className="bg-[#0A0A0B]/90 rounded-3xl p-7 sm:p-8 border border-white/10 hover:border-[#C2A88F]/40 flex flex-col justify-between shadow-2xl relative overflow-hidden group transition-all h-full backdrop-blur-xl">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-[#C2A88F] text-[#C2A88F]" />
                      ))}
                    </div>
                    <span className="font-mono text-[10px] tracking-widest text-[#C2A88F] font-medium">
                      CONVERSIÓN DIRECTA
                    </span>
                  </div>

                  <Quote className="w-8 h-8 text-[#C2A88F]/20 mb-3" />

                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-light mb-6">
                    &ldquo;Desde que estrenamos la plataforma web, el 80% de las consultas de reparación y presupuestos nos llegan directamente preparadas por WhatsApp. Ha multiplicado la conversión del negocio.&rdquo;
                  </p>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <div>
                    <div className="text-xs sm:text-sm font-semibold text-white">Dirección Técnica Urkulu</div>
                    <div className="text-[10px] text-zinc-400 font-mono mt-0.5">Servicio Técnico Oficial &middot; Alto Urola</div>
                  </div>
                  <ShieldCheck className="w-4 h-4 text-[#C2A88F]" />
                </div>
              </div>
            </TiltCard>
          </motion.div>

          {/* Case 3: Otxaran Denda (Span 6 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="md:col-span-6"
          >
            <TiltCard maxTilt={4} glare={true} className="h-full">
              <div className="bg-[#0A0A0B]/90 rounded-3xl p-7 sm:p-8 border border-white/10 hover:border-[#C2A88F]/40 flex flex-col justify-between shadow-2xl relative overflow-hidden group transition-all h-full backdrop-blur-xl">
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-[#C2A88F] text-[#C2A88F]" />
                      ))}
                    </div>
                    <span className="font-mono text-[10px] tracking-widest text-zinc-500 font-medium">
                      BOUTIQUE DE AUTOR
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-light mb-6">
                    &ldquo;Buscábamos un diseño que transmitiera sofisticación y buen gusto sin perder sencillez. Jakes entendió perfectamente nuestra identidad y el catálogo online ha sido un éxito rotundo.&rdquo;
                  </p>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <div>
                    <div className="text-xs sm:text-sm font-semibold text-white">Otxaran Denda</div>
                    <div className="text-[10px] text-zinc-400 font-mono mt-0.5">Moda de Vanguardia &middot; Zumarraga</div>
                  </div>
                  <ShieldCheck className="w-4 h-4 text-[#C2A88F]" />
                </div>
              </div>
            </TiltCard>
          </motion.div>

          {/* Case 4: Venture Digital Lab (Span 6 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="md:col-span-6"
          >
            <TiltCard maxTilt={4} glare={true} className="h-full">
              <div className="bg-[#0A0A0B]/90 rounded-3xl p-7 sm:p-8 border border-white/10 hover:border-[#C2A88F]/40 flex flex-col justify-between shadow-2xl relative overflow-hidden group transition-all h-full backdrop-blur-xl">
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-[#C2A88F] text-[#C2A88F]" />
                      ))}
                    </div>
                    <span className="font-mono text-[10px] tracking-widest text-[#C2A88F] font-medium">
                      INNOVACIÓN & 3D
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-light mb-6">
                    &ldquo;La integración del entorno 3D y los agentes inteligentes nos permitió presentar un producto complejo de forma interactiva y futurista. Nos ha abierto puertas con inversores internacionales.&rdquo;
                  </p>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <div>
                    <div className="text-xs sm:text-sm font-semibold text-white">Venture Digital Lab</div>
                    <div className="text-[10px] text-zinc-400 font-mono mt-0.5">Startups & Soluciones 3D &middot; Euskadi</div>
                  </div>
                  <ShieldCheck className="w-4 h-4 text-[#C2A88F]" />
                </div>
              </div>
            </TiltCard>
          </motion.div>
        </div>

        {/* Reassurance Audit Strip */}
        <div className="p-5 sm:p-7 rounded-3xl bg-black/60 border border-white/10 backdrop-blur-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-xs sm:text-sm text-zinc-300 text-center sm:text-left">
            <div className="w-9 h-9 rounded-xl bg-[#C2A88F]/10 border border-[#C2A88F]/25 flex items-center justify-center shrink-0 text-[#C2A88F] hidden sm:flex">
              <Gauge className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[#C2A88F] font-bold">Datos 100% Auditables:</span> Cada parámetro de velocidad y Core Web Vitals es públicamente certificable con Google PageSpeed Insights.
            </div>
          </div>

          <a
            href="#contact"
            onClick={() => sounds.playClick()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-full bg-gradient-to-r from-[#DEDBC8] via-[#C2A88F] to-[#A8896C] hover:brightness-110 text-black font-bold text-xs font-mono uppercase tracking-wider transition-all duration-300 shadow-lg shrink-0 cursor-pointer hover:scale-[1.01]"
          >
            <span>Auditar mi web con JRG</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default PrismaDesktopMetrics;
