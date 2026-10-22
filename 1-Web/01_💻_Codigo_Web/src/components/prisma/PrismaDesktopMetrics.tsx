import React from "react";
import { motion } from "framer-motion";
import { Star, Award, ShieldCheck, Quote } from "lucide-react";
import WordsPullUpMultiStyle, { TextSegment } from "./WordsPullUpMultiStyle";
import TiltCard from "./TiltCard";
import PredictiveArc from "./PredictiveArc";

export const PrismaDesktopMetrics: React.FC = () => {
  const line1Segments: TextSegment[] = [
    {
      text: "Métricas de impacto.",
      className: "text-[#E1E0CC] font-normal",
    },
    {
      text: "Resultados reales,",
      className: "italic font-serif text-[#E1E0CC]",
    },
  ];

  const line2Segments: TextSegment[] = [
    {
      text: "no promesas vacías.",
      className: "text-gray-400 font-normal",
    },
  ];

  const metrics = [
    {
      value: "100/100",
      label: "Puntuación Google Lighthouse",
      detail: "Optimización en Rendimiento, Accesibilidad y SEO técnico.",
    },
    {
      value: "< 0.8s",
      label: "First Contentful Paint",
      detail: "Carga instantánea en cualquier red y dispositivo.",
    },
    {
      value: "60 FPS",
      label: "Fluidez Constante",
      detail: "Animaciones y micro-interacciones sin tirones visuales.",
    },
    {
      value: "24 Horas",
      label: "Tiempo de Respuesta",
      detail: "Atención directa de fundador a cliente, sin intermediarios.",
    },
  ];

  const testimonials = [
    {
      quote:
        "El cambio fue brutal. La gente entra al restaurante con el móvil en la mano mirando los pintxos en la web antes de pedir. La estética oscura y la velocidad han subido el nivel de nuestro local.",
      author: "Equipo Gure Trena",
      role: "Restauración & Hostelería · Urretxu",
      rating: 5,
    },
    {
      quote:
        "Desde que estrenamos la plataforma web, el 80% de las consultas de reparación y presupuestos nos llegan directamente preparadas por WhatsApp. Ha multiplicado la conversión del negocio.",
      author: "Dirección Urkulu Móviles",
      role: "Servicio Técnico Oficial · Alto Urola",
      rating: 5,
    },
    {
      quote:
        "Buscábamos un diseño que transmitiera sofisticación y buen gusto sin perder sencillez. Jakes entendió perfectamente nuestra identidad y el catálogo online ha sido un éxito rotundo.",
      author: "Otxaran Denda",
      role: "Boutique de Moda · Zumarraga",
      rating: 5,
    },
    {
      quote:
        "La integración del entorno 3D y los agentes inteligentes nos permitió presentar un producto complejo de forma interactiva y futurista. Nos ha abierto puertas con inversores internacionales.",
      author: "Venture Digital Lab",
      role: "Startups & Soluciones 3D · Euskadi",
      rating: 5,
    },
  ];

  return (
    <section className="bg-black py-24 md:py-36 px-4 md:px-8 relative select-none overflow-hidden" id="metrics">
      {/* Dynamic Predictive Arc Mathematical Wave Shader Background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-30 overflow-hidden">
        <PredictiveArc
          background="transparent"
          baseColor="#121212"
          accentColor="#DEDBC8"
          highlight="#E5B869"
          density={75}
          speed={40}
        />
        {/* Soft edge gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black pointer-events-none" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.02] mb-4">
            <Award className="w-3.5 h-3.5 text-[#DEDBC8]" />
            <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-[#DEDBC8]">
              MÉTRICAS & CONFIANZA PROBADA
            </span>
          </div>
          <div className="text-2xl sm:text-3xl md:text-5xl font-medium tracking-tight leading-tight mb-2">
            <WordsPullUpMultiStyle segments={line1Segments} />
          </div>
          <div className="text-xl sm:text-2xl md:text-3xl font-normal text-gray-400">
            <WordsPullUpMultiStyle segments={line2Segments} delay={0.15} />
          </div>
        </div>

        {/* 4 Big Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-20">
          {metrics.map((m, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-[#121212] rounded-3xl p-6 sm:p-8 border border-white/10 hover:border-white/20 transition-all duration-300 text-center flex flex-col justify-between shadow-xl"
            >
              <div>
                <div
                  className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-3"
                  style={{ color: "#E1E0CC" }}
                >
                  {m.value}
                </div>
                <div className="text-xs sm:text-sm font-semibold text-gray-200 mb-2">
                  {m.label}
                </div>
              </div>
              <p className="text-[11px] sm:text-xs text-gray-400 font-light mt-2 leading-relaxed">
                {m.detail}
              </p>
            </motion.div>
          ))}
        </div>

        {/* 4 Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {testimonials.map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: idx * 0.12 }}
              className="h-full"
            >
              <TiltCard maxTilt={6} glare={true} className="h-full">
                <div className="bg-[#101010] rounded-3xl p-6 sm:p-7 border border-white/10 flex flex-col justify-between shadow-xl relative overflow-hidden group hover:border-white/20 transition-colors h-full">
                  <div>
                    {/* 5 Stars */}
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-3.5 h-3.5 fill-[#DEDBC8] text-[#DEDBC8]"
                        />
                      ))}
                    </div>

                    <Quote className="w-7 h-7 text-white/[0.08] mb-2" />

                    <p className="text-xs text-gray-300 leading-relaxed font-light mb-6 italic">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold text-[#E1E0CC]">
                        {t.author}
                      </div>
                      <div className="text-[10px] text-gray-400 font-mono mt-0.5">
                        {t.role}
                      </div>
                    </div>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PrismaDesktopMetrics;
