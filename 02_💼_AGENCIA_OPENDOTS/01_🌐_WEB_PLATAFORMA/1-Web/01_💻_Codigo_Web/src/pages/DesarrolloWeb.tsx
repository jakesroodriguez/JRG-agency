import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Clock,
  ChevronDown,
  ChevronUp,
  Layout,
  UtensilsCrossed,
  ShoppingBag,
  ExternalLink,
  Zap
} from "lucide-react";
import ServiceIslandHeader from "../components/prisma/ServiceIslandHeader";
import PrismaHarvestFooter from "../components/prisma/PrismaHarvestFooter";
import CinematicCursor from "../components/prisma/CinematicCursor";
import CinematicVSLSection from "../components/prisma/CinematicVSLSection";
import PrismaSocialProofSection from "../components/prisma/PrismaSocialProofSection";

interface FAQItem {
  q: string;
  a: string;
}

const FAQS: FAQItem[] = [
  {
    q: "¿Por qué no utilizáis plantillas genéricas de WordPress o constructores visuales lentos?",
    a: "Las plantillas prefabricadas arrastran decenas de plugins innecesarios, código inflado y tiempos de carga lentos que perjudican gravemente el posicionamiento en Google y la experiencia de usuario. En JRG Agency desarrollamos con código moderno (React, Vite, TypeScript y Tailwind CSS), logrando una velocidad extrema (Lighthouse 100/100) y un diseño 100% exclusivo para tu marca."
  },
  {
    q: "¿La página web vendrá ya optimizada para posicionar en Google (SEO)?",
    a: "Sí. Toda web que entregamos incluye de serie arquitectura semántica limpia, etiquetas Open Graph, metadatos optimizados, datos estructurados Schema.org para rich snippets en Google, sitemap.xml, robots.txt y configuración técnica completa para indexación inmediata."
  },
  {
    q: "¿Podré actualizar los contenidos, textos o cartas de mi negocio fácilmente?",
    a: "Por supuesto. Adaptamos la gestión según tus necesidades: desde paneles de administración sencillos o conexión con Google Sheets/Notion para que puedas cambiar precios o platos en 30 segundos, hasta soporte y mantenimiento continuo por nuestra parte."
  },
  {
    q: "¿Cuánto tiempo requiere el desarrollo de una web profesional?",
    a: "Una landing page o web corporativa de alto rendimiento suele completarse en un plazo de 2 a 3 semanas desde la recepción del material y la aprobación del diseño interactivo."
  },
  {
    q: "¿Incluís la adaptación a dispositivos móviles y tablets?",
    a: "El diseño es 'mobile-first'. Más del 75% del tráfico actual navega desde el móvil, por lo que cada botón, tipografía, menú y animación se optimiza específicamente para garantizar una navegación táctil perfecta en cualquier pantalla."
  }
];

export const DesarrolloWeb: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    window.scrollTo(0, 0);

    // Dynamic SEO Metadata for /desarrollo-web
    document.title = "Diseño y Desarrollo Web Profesional de Alto Rendimiento | JRG Agency";

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        "content",
        "Diseño y desarrollo web profesional en España y Gipuzkoa. Webs modernas, ultrarrápidas y optimizadas para SEO y conversión. Consulta tu proyecto con JRG Agency."
      );
    }

    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute("href", "https://www.jrgagency.eus/desarrollo-web");
    }

    return () => {
      document.title = "JRG Agency | Agencia de Inteligencia Artificial, Automatizaciones y Desarrollo Web";
      if (canonical) {
        canonical.setAttribute("href", "https://www.jrgagency.eus/");
      }
    };
  }, []);

  const whatsappMessage = encodeURIComponent(
    "Hola JRG Agency! He visto vuestra página de Desarrollo Web y me gustaría solicitar presupuesto para un nuevo sitio web profesional."
  );

  return (
    <div className="prisma-scope min-h-screen bg-black text-[#E1E0CC] selection:bg-[#DEDBC8] selection:text-black relative overflow-hidden">
      {/* 00. Desktop Cinematic Cursor */}
      <CinematicCursor />

      {/* 01. Unified Luxury Floating Island Header */}
      <ServiceIslandHeader currentService="desarrollo-web" />

      {/* 02. SVG Film Grain Filter Overlay */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none opacity-[0.035] z-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Atmospheric Radial Glows */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-[radial-gradient(ellipse_at_center,rgba(194,168,143,0.14)_0%,rgba(0,0,0,0)_70%)] pointer-events-none -z-10"
      />
      <div
        aria-hidden="true"
        className="absolute top-[1200px] right-0 w-[600px] h-[500px] bg-[radial-gradient(ellipse_at_center,rgba(194,168,143,0.10)_0%,rgba(0,0,0,0)_70%)] pointer-events-none -z-10"
      />

      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Service",
                "@id": "https://www.jrgagency.eus/desarrollo-web/#service",
                "name": "Diseño y Desarrollo Web Profesional",
                "serviceType": "Desarrollo Web de Alto Rendimiento y SEO",
                "provider": {
                  "@type": "Organization",
                  "name": "JRG Agency",
                  "url": "https://www.jrgagency.eus/"
                },
                "areaServed": [
                  { "@type": "Country", "name": "España" },
                  { "@type": "AdministrativeArea", "name": "País Vasco" },
                  { "@type": "AdministrativeArea", "name": "Gipuzkoa" }
                ],
                "description":
                  "Servicio de diseño y desarrollo web profesional con arquitectura React, rendimiento 100/100 Lighthouse, optimización SEO nativa y estética diferencial.",
                "url": "https://www.jrgagency.eus/desarrollo-web"
              },
              {
                "@type": "FAQPage",
                "@id": "https://www.jrgagency.eus/desarrollo-web/#faq",
                "mainEntity": FAQS.map((faq) => ({
                  "@type": "Question",
                  "name": faq.q,
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": faq.a
                  }
                }))
              },
              {
                "@type": "BreadcrumbList",
                "itemListElement": [
                  {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Inicio",
                    "item": "https://www.jrgagency.eus/"
                  },
                  {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "Servicios",
                    "item": "https://www.jrgagency.eus/#servicios"
                  },
                  {
                    "@type": "ListItem",
                    "position": 3,
                    "name": "Desarrollo Web",
                    "item": "https://www.jrgagency.eus/desarrollo-web"
                  }
                ]
              }
            ]
          })
        }}
      />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-44 md:pb-28 px-6 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* Micro HUD Badge */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-[#C2A88F]/30 backdrop-blur-md mb-8 shadow-[0_0_15px_rgba(194,168,143,0.15)]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-[11px] tracking-widest text-[#E1E0CC] uppercase">
              Ingeniería Web // Lighthouse 100/100
            </span>
          </div>

          <h1 className="font-alata text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white mb-6 uppercase leading-[1.08]">
            Diseño y Desarrollo Web <br />
            <span className="font-serif italic font-normal tracking-normal text-[#C2A88F] lowercase">
              de alto rendimiento y prestigio
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-zinc-300 font-light max-w-2xl mx-auto mb-10 leading-relaxed">
            Creamos páginas web ultrarrápidas, elegantes y diseñadas específicamente para transmitir autoridad, posicionar en Google y convertir visitas en clientes reales.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={`https://wa.me/34613448185?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#C2A88F] hover:bg-[#D4BEA7] text-black font-semibold text-sm tracking-wide transition-all shadow-[0_0_25px_rgba(194,168,143,0.35)] hover:scale-105 active:scale-95"
            >
              <span>Solicitar presupuesto para mi web</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <Link
              to="/myworks"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-zinc-200 border border-white/10 hover:border-white/20 text-sm font-mono tracking-wider transition-all backdrop-blur-md"
            >
              <span>Ver proyectos realizados</span>
            </Link>
          </div>

          {/* 3 Trust points */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-16 pt-8 border-t border-white/10 text-left">
            <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
              <CheckCircle2 className="w-5 h-5 text-[#C2A88F] shrink-0" />
              <span className="text-xs text-zinc-300 font-medium">Puntuación Lighthouse 100/100</span>
            </div>
            <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
              <ShieldCheck className="w-5 h-5 text-[#C2A88F] shrink-0" />
              <span className="text-xs text-zinc-300 font-medium">Optimización SEO y Schema nativos</span>
            </div>
            <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
              <Clock className="w-5 h-5 text-[#C2A88F] shrink-0" />
              <span className="text-xs text-zinc-300 font-medium">Entrega profesional en 2 a 3 semanas</span>
            </div>
          </div>
        </div>
      </section>

      {/* 03. High-Converting VSL Video Presentation */}
      <CinematicVSLSection
        title="CÓMO UNA WEB CON ARQUITECTURA REACT Y LIGHTHOUSE 100/100 DISPARA TUS CONVERSIONES"
        subtitle="Analizamos en 3 minutos la diferencia técnica entre una plantilla lenta que espanta a tus clientes y una experiencia digital premium optimizada para posicionar en Google y cerrar ventas."
        videoSrc="/videos/hero-bg.mp4"
        ctaText="Pedir Presupuesto y Auditoría Web"
        ctaLink={`https://wa.me/34613448185?text=${whatsappMessage}`}
      />

      {/* 04. Verified Client Social Proof */}
      <PrismaSocialProofSection />

      {/* Comparison: Template vs JRG Agency Architecture */}
      <section className="py-24 px-6 border-t border-white/10 bg-zinc-950/40 relative">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono uppercase text-[#C2A88F] tracking-widest">Diferenciación Técnica</span>
            <h2 className="font-alata text-3xl sm:text-5xl font-bold text-white mt-2 uppercase tracking-wide">
              ¿Por qué una web a medida supera a una plantilla?
            </h2>
            <p className="text-zinc-400 text-sm mt-3 font-light leading-relaxed">
              El 53% de los usuarios abandona una web si tarda más de 3 segundos en cargar. La arquitectura técnica importa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Generic template card */}
            <div className="p-8 sm:p-10 rounded-3xl bg-red-950/15 border border-red-500/20 text-zinc-300 text-sm backdrop-blur-xl">
              <div className="text-red-400 font-mono text-xs uppercase tracking-widest mb-3 font-bold flex items-center gap-2">
                <span>✕</span> Webs de Plantilla Tradicionales
              </div>
              <h3 className="font-alata text-xl font-bold text-white mb-5">Lentas, genéricas y vulnerables</h3>
              <ul className="space-y-4 text-xs leading-relaxed font-light text-zinc-300">
                <li className="flex items-start gap-3">
                  <span className="text-red-400 font-bold text-sm">✕</span>
                  <span>Tiempos de carga superiores a 4 segundos por acumulación de plugins pesados.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 font-bold text-sm">✕</span>
                  <span>Mismo aspecto idéntico que el de miles de competidores de tu sector.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 font-bold text-sm">✕</span>
                  <span>Puntuación Core Web Vitals baja que penaliza tu posicionamiento en Google.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 font-bold text-sm">✕</span>
                  <span>Actualizaciones constantes de plugins que rompen la web de imprevisto.</span>
                </li>
              </ul>
            </div>

            {/* JRG Agency card */}
            <div className="p-8 sm:p-10 rounded-3xl bg-zinc-950/80 border border-[#C2A88F]/50 text-zinc-200 text-sm shadow-[0_20px_50px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.2)] backdrop-blur-2xl">
              <div className="text-[#C2A88F] font-mono text-xs uppercase tracking-widest mb-3 font-bold flex items-center gap-2">
                <span>✓</span> Arquitectura JRG Agency
              </div>
              <h3 className="font-alata text-xl font-bold text-white mb-5">Rápidas, seguras y hechas para vender</h3>
              <ul className="space-y-4 text-xs leading-relaxed font-light text-zinc-200">
                <li className="flex items-start gap-3">
                  <span className="text-[#C2A88F] font-bold text-sm">✓</span>
                  <span>Carga instantánea en menos de 0.8s desplegada en red Edge global.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#C2A88F] font-bold text-sm">✓</span>
                  <span>Diseño exclusivo Liquid Glass que transmite prestigio, tecnología y seriedad.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#C2A88F] font-bold text-sm">✓</span>
                  <span>Estructura SEO limpia con Schema JSON-LD lista para conquistar Google.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#C2A88F] font-bold text-sm">✓</span>
                  <span>Código TypeScript y React robusto, sin dependencias frágiles ni hackeos.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions / Formats Bento Grid */}
      <section className="py-24 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-14">
            <span className="text-xs font-mono uppercase text-[#C2A88F] tracking-widest">Formatos de Desarrollo</span>
            <h2 className="font-alata text-3xl sm:text-5xl font-bold text-white mt-2 uppercase tracking-wide">
              Soluciones digitales adaptadas a tu negocio
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-8 rounded-3xl bg-zinc-950/70 border border-white/10 backdrop-blur-2xl relative overflow-hidden group hover:border-[#C2A88F]/40 transition-all shadow-[0_15px_40px_rgba(0,0,0,0.6)]">
              <div className="w-12 h-12 rounded-2xl bg-[#1B365D]/30 border border-[#1B365D]/60 flex items-center justify-center text-cyan-300 mb-6 shadow-inner">
                <Layout className="w-6 h-6 text-[#C2A88F]" />
              </div>
              <h3 className="font-alata text-xl sm:text-2xl font-bold text-white mb-3">Webs Corporativas para Empresas</h3>
              <p className="text-zinc-300 text-sm leading-relaxed mb-4 font-light">
                El centro neurálgico de tu presencia digital. Transmite solidez a clientes e inversores, explica tus servicios con total claridad y capta solicitudes de presupuesto cualificadas.
              </p>
              <div className="text-xs font-mono text-zinc-400">Ideal para: Empresas industriales, consultoras y servicios profesionales.</div>
            </div>

            <div className="p-8 rounded-3xl bg-zinc-950/70 border border-white/10 backdrop-blur-2xl relative overflow-hidden group hover:border-[#C2A88F]/40 transition-all shadow-[0_15px_40px_rgba(0,0,0,0.6)]">
              <div className="w-12 h-12 rounded-2xl bg-[#C2A88F]/15 border border-[#C2A88F]/30 flex items-center justify-center text-[#C2A88F] mb-6 shadow-inner">
                <UtensilsCrossed className="w-6 h-6" />
              </div>
              <h3 className="font-alata text-xl sm:text-2xl font-bold text-white mb-3">Webs para Hostelería y Restauración</h3>
              <p className="text-zinc-300 text-sm leading-relaxed mb-4 font-light">
                Cartas digitales interactivas, conexión directa con reservas de mesa por WhatsApp o motor propio, ubicación con un clic para Google Maps y optimización para búsquedas locales.
              </p>
              <div className="text-xs font-mono text-zinc-400">Ejemplo en producción: Gure Trena Urretxu.</div>
            </div>

            <div className="p-8 rounded-3xl bg-zinc-950/70 border border-white/10 backdrop-blur-2xl relative overflow-hidden group hover:border-[#C2A88F]/40 transition-all shadow-[0_15px_40px_rgba(0,0,0,0.6)]">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-300 mb-6 shadow-inner">
                <ShoppingBag className="w-6 h-6 text-[#C2A88F]" />
              </div>
              <h3 className="font-alata text-xl sm:text-2xl font-bold text-white mb-3">Catálogos Online y E-Commerce</h3>
              <p className="text-zinc-300 text-sm leading-relaxed mb-4 font-light">
                Muestra tus colecciones de producto con navegación fluida, filtros rápidos y checkout sin fricciones para maximizar la tasa de conversión en cada visita.
              </p>
              <div className="text-xs font-mono text-zinc-400">Ejemplo en producción: Otxaran Denda Moda.</div>
            </div>

            <div className="p-8 rounded-3xl bg-zinc-950/70 border border-white/10 backdrop-blur-2xl relative overflow-hidden group hover:border-[#C2A88F]/40 transition-all shadow-[0_15px_40px_rgba(0,0,0,0.6)]">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-6 shadow-inner">
                <Sparkles className="w-6 h-6 text-[#C2A88F]" />
              </div>
              <h3 className="font-alata text-xl sm:text-2xl font-bold text-white mb-3">Experiencias Digitales 3D e Inmersivas</h3>
              <p className="text-zinc-300 text-sm leading-relaxed mb-4 font-light">
                Modelos 3D interactivos, escenas WebGL con Three.js y animaciones cinemáticas para marcas que buscan un impacto visual memorable y diferencial.
              </p>
              <div className="text-xs font-mono text-zinc-400">Diferenciador radical frente a la competencia estándar.</div>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Link Showcase Section */}
      <section className="py-20 px-6 bg-zinc-950/60 border-y border-white/10 relative">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 p-8 sm:p-10 rounded-3xl bg-zinc-950/80 border border-[#C2A88F]/30 backdrop-blur-xl shadow-[0_15px_40px_rgba(0,0,0,0.6)]">
          <div>
            <span className="text-xs font-mono uppercase text-[#C2A88F] tracking-widest">Demostración en Producción</span>
            <h3 className="font-alata text-xl sm:text-2xl font-bold text-white mt-1">Explora nuestros casos de éxito reales</h3>
            <p className="text-zinc-400 text-xs sm:text-sm mt-1 font-light">
              Mira cómo rinden en vivo webs creadas para hostelería, comercios y servicios técnicos.
            </p>
          </div>
          <Link
            to="/myworks"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#C2A88F] hover:bg-[#D4BEA7] text-black font-semibold text-xs tracking-wide transition-all shadow-[0_0_20px_rgba(194,168,143,0.3)] hover:scale-105 active:scale-95 shrink-0"
          >
            <span>Ver todos los proyectos</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="py-24 px-6 relative">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-mono uppercase text-[#C2A88F] tracking-widest">Resolución de Dudas</span>
            <h2 className="font-alata text-2xl sm:text-4xl font-bold text-white mt-2 uppercase tracking-wide">
              Preguntas Frecuentes sobre Desarrollo Web
            </h2>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-3xl bg-zinc-950/70 border border-white/10 overflow-hidden transition-all duration-300"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full px-7 py-5 flex items-center justify-between text-left text-sm font-semibold text-white hover:text-[#C2A88F] transition-colors"
                    aria-expanded={isOpen}
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-[#C2A88F] shrink-0 ml-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-zinc-400 shrink-0 ml-4" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-7 pb-6 text-xs text-zinc-300 leading-relaxed border-t border-white/[0.06] pt-4 font-light">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final Conversion CTA Section */}
      <section className="py-24 px-6 relative">
        <div className="max-w-4xl mx-auto p-10 sm:p-16 rounded-[2.5rem] bg-gradient-to-b from-zinc-950/90 to-black border border-[#C2A88F]/40 text-center relative overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.9)]">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-[#C2A88F]/30 text-xs font-mono text-[#E1E0CC] mb-6">
            <Zap className="w-4 h-4 text-[#C2A88F]" />
            <span>Presupuesto Cerrado sin Sorpresas</span>
          </div>

          <h2 className="font-alata text-3xl sm:text-5xl font-bold text-white mb-4 uppercase">
            ¿Hablamos de tu próxima página web?
          </h2>

          <p className="text-zinc-300 text-sm sm:text-base max-w-xl mx-auto mb-10 leading-relaxed font-light">
            Explícanos tu idea o negocio y te enviaremos una propuesta técnica con plazos claros, presupuesto cerrado y diseño diferencial.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={`https://wa.me/34613448185?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#C2A88F] hover:bg-[#D4BEA7] text-black font-semibold text-sm transition-all shadow-[0_0_25px_rgba(194,168,143,0.35)] hover:scale-105 active:scale-95"
            >
              <span>Escribir por WhatsApp</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <Link
              to="/contacto"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-white font-mono text-sm tracking-wide transition-all border border-white/10"
            >
              <span>Pedir propuesta formal</span>
            </Link>
          </div>

          {/* Related services navigation */}
          <div className="mt-12 pt-8 border-t border-white/10 flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-zinc-400">
            <span>Servicios complementarios:</span>
            <Link to="/automatizaciones-ia" className="text-zinc-300 hover:text-[#C2A88F] underline underline-offset-4 transition-colors">
              Automatizaciones con IA
            </Link>
            <span className="text-zinc-600">·</span>
            <Link to="/chatbots-ia" className="text-zinc-300 hover:text-[#C2A88F] underline underline-offset-4 transition-colors">
              Chatbots para Empresas
            </Link>
            <span className="text-zinc-600">·</span>
            <Link to="/myworks" className="text-zinc-300 hover:text-[#C2A88F] underline underline-offset-4 transition-colors">
              Casos de Éxito
            </Link>
          </div>
        </div>
      </section>

      {/* 03. Luxury Prisma Harvest Master Footer */}
      <PrismaHarvestFooter />
    </div>
  );
};

export default DesarrolloWeb;
