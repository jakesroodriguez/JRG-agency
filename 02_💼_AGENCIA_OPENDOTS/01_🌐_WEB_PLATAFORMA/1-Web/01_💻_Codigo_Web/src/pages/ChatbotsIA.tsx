import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  ShieldCheck,
  Clock,
  ChevronDown,
  ChevronUp,
  Smartphone,
  Globe,
  Calendar,
  Users2,
  MessageCircle
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
    q: "¿Cómo se asegura que el chatbot con IA no invente datos o se equivoque?",
    a: "Utilizamos técnicas de RAG (Generación Aumentada por Recuperación) y barreras de seguridad estrictas (system prompts herméticos). El chatbot solo tiene acceso a la documentación oficial, precios, menús o catálogos que tú apruebes. Si un usuario hace una pregunta fuera de su conocimiento, el bot responde con honestidad e invita a contactar con una persona del equipo."
  },
  {
    q: "¿Se puede integrar el chatbot directamente en WhatsApp?",
    a: "Sí. Realizamos la integración oficial con la API de WhatsApp Business, permitiendo que tu empresa tenga un número verificado con respuestas instantáneas 24/7 sin que nadie tenga que tener un teléfono encendido."
  },
  {
    q: "¿Qué sucede si un cliente necesita hablar con una persona de verdad?",
    a: "El bot cuenta con derivación inteligente ('handoff'). Cuando detecta que el cliente requiere atención personalizada o solicita hablar con un comercial, transfiere la conversación de forma limpia al equipo humano avisando por correo, Slack o notificación de WhatsApp."
  },
  {
    q: "¿El chatbot puede registrar citas o reservas en mi calendario?",
    a: "Totalmente. Conectamos el asistente con Google Calendar, Calendly o tu software de reservas para verificar huecos disponibles en tiempo real y agendar citas de forma 100% automática."
  },
  {
    q: "¿En qué idiomas puede responder el chatbot?",
    a: "De forma nativa puede comunicarse perfectamente en español, euskera, inglés, francés y otros idiomas, adaptándose de forma automática al idioma en el que le escriba tu cliente."
  }
];

export const ChatbotsIA: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    window.scrollTo(0, 0);

    // Dynamic SEO Metadata for /chatbots-ia
    document.title = "Chatbots con IA para Empresas y Atención 24/7 | JRG Agency";

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        "content",
        "Desarrollo de chatbots con IA y asistentes virtuales para empresas. Atención al cliente 24/7 en WhatsApp y web, captación de leads y reservas automáticas."
      );
    }

    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute("href", "https://www.jrgagency.eus/chatbots-ia");
    }

    return () => {
      document.title = "JRG Agency | Agencia de Inteligencia Artificial, Automatizaciones y Desarrollo Web";
      if (canonical) {
        canonical.setAttribute("href", "https://www.jrgagency.eus/");
      }
    };
  }, []);

  const whatsappMessage = encodeURIComponent(
    "Hola JRG Agency! He visto vuestra página de Chatbots con IA y me gustaría valorar un asistente virtual para mi empresa."
  );

  return (
    <div className="prisma-scope min-h-screen bg-black text-[#E1E0CC] selection:bg-[#DEDBC8] selection:text-black relative overflow-hidden">
      {/* 00. Desktop Cinematic Cursor */}
      <CinematicCursor />

      {/* 01. Unified Luxury Floating Island Header */}
      <ServiceIslandHeader currentService="chatbots" />

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
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-[radial-gradient(ellipse_at_center,rgba(194,168,143,0.12)_0%,rgba(0,0,0,0)_70%)] pointer-events-none -z-10"
      />
      <div
        aria-hidden="true"
        className="absolute top-[1200px] left-0 w-[600px] h-[500px] bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.12)_0%,rgba(0,0,0,0)_70%)] pointer-events-none -z-10"
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
                "@id": "https://www.jrgagency.eus/chatbots-ia/#service",
                "name": "Chatbots con IA y Asistentes Virtuales para Empresas",
                "serviceType": "Desarrollo de Chatbots con Inteligencia Artificial",
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
                  "Implementación de chatbots inteligentes para empresas con conexión a WhatsApp Business, integración web y automatización de atención al cliente 24/7.",
                "url": "https://www.jrgagency.eus/chatbots-ia"
              },
              {
                "@type": "FAQPage",
                "@id": "https://www.jrgagency.eus/chatbots-ia/#faq",
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
                    "name": "Chatbots con IA",
                    "item": "https://www.jrgagency.eus/chatbots-ia"
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
              Asistentes Cognitivos // WhatsApp API & Web
            </span>
          </div>

          <h1 className="font-alata text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white mb-6 uppercase leading-[1.08]">
            Chatbots con IA <br />
            <span className="font-serif italic font-normal tracking-normal text-[#C2A88F] lowercase">
              para atención y ventas 24/7
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-zinc-300 font-light max-w-2xl mx-auto mb-10 leading-relaxed">
            Atiende a tus clientes al segundo, cualifica oportunidades de venta en caliente y automatiza reservas y consultas en WhatsApp y en tu web con un asistente entrenado para tu negocio.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={`https://wa.me/34613448185?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#C2A88F] hover:bg-[#D4BEA7] text-black font-semibold text-sm tracking-wide transition-all shadow-[0_0_25px_rgba(194,168,143,0.35)] hover:scale-105 active:scale-95"
            >
              <span>Probar demo en WhatsApp</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <Link
              to="/contacto"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-zinc-200 border border-white/10 hover:border-white/20 text-sm font-mono tracking-wider transition-all backdrop-blur-md"
            >
              <span>Presupuesto a medida</span>
            </Link>
          </div>

          {/* 3 Trust points */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-16 pt-8 border-t border-white/10 text-left">
            <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
              <CheckCircle2 className="w-5 h-5 text-[#C2A88F] shrink-0" />
              <span className="text-xs text-zinc-300 font-medium">Meta WhatsApp Business API Oficial</span>
            </div>
            <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
              <ShieldCheck className="w-5 h-5 text-[#C2A88F] shrink-0" />
              <span className="text-xs text-zinc-300 font-medium">Respuestas controladas sin alucinaciones</span>
            </div>
            <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
              <Clock className="w-5 h-5 text-[#C2A88F] shrink-0" />
              <span className="text-xs text-zinc-300 font-medium">Tiempo de respuesta inferior a 2s</span>
            </div>
          </div>
        </div>
      </section>

      {/* 03. High-Converting VSL Video Presentation */}
      <CinematicVSLSection
        title="CÓMO UN ASISTENTE CON IA CUALIFICA LEADS Y AGENDA RESERVAS EN WHATSAPP 24/7"
        subtitle="Mira en 3 minutos una demostración real: cómo responde a preguntas de clientes, consulta huecos disponibles en Google Calendar y formaliza reservas sin intervención humana."
        videoSrc="/videos/hero-bg.mp4"
        ctaText="Probar Asistente en WhatsApp Directo"
        ctaLink={`https://wa.me/34613448185?text=${whatsappMessage}`}
      />

      {/* 04. Verified Client Social Proof */}
      <PrismaSocialProofSection />

      {/* Solutions Bento Grid */}
      <section className="py-24 px-6 border-t border-white/10 bg-zinc-950/40 relative">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-14">
            <span className="text-xs font-mono uppercase text-[#C2A88F] tracking-widest">Formatos de Despliegue</span>
            <h2 className="font-alata text-3xl sm:text-5xl font-bold text-white mt-2 uppercase tracking-wide">
              El asistente perfecto para cada canal
            </h2>
            <p className="text-zinc-400 text-sm mt-3 font-light leading-relaxed">
              Diseñados con lenguaje natural, tono corporativo profesional y capacidad de tomar acciones reales.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1: WhatsApp Bot */}
            <div className="p-8 rounded-3xl bg-zinc-950/70 border border-white/10 backdrop-blur-2xl relative overflow-hidden group hover:border-emerald-400/40 transition-all shadow-[0_15px_40px_rgba(0,0,0,0.6)]">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-6 shadow-inner">
                <Smartphone className="w-6 h-6 text-[#C2A88F]" />
              </div>
              <h3 className="font-alata text-xl sm:text-2xl font-bold text-white mb-3">
                Chatbot de WhatsApp Business Oficial
              </h3>
              <p className="text-zinc-300 text-sm leading-relaxed mb-6 font-light">
                El 90% de tus clientes prefiere escribir por WhatsApp antes que rellenar un formulario o llamar. Conecta un asistente con API oficial que responda consultas al instante, envíe catálogos y capture teléfonos de clientes potenciales las 24 horas.
              </p>
              <div className="flex flex-wrap gap-2 text-xs font-mono text-zinc-300">
                <span className="px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10">Meta WhatsApp API</span>
                <span className="px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10">Envío de PDFs y Mapas</span>
                <span className="px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10">Cualificación de Leads</span>
              </div>
            </div>

            {/* Card 2: Web Widget */}
            <div className="p-8 rounded-3xl bg-zinc-950/70 border border-white/10 backdrop-blur-2xl relative overflow-hidden group hover:border-[#C2A88F]/40 transition-all shadow-[0_15px_40px_rgba(0,0,0,0.6)]">
              <div className="w-12 h-12 rounded-2xl bg-[#C2A88F]/15 border border-[#C2A88F]/30 flex items-center justify-center text-[#C2A88F] mb-6 shadow-inner">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="font-alata text-xl sm:text-2xl font-bold text-white mb-3">
                Asistente Web Inteligente Liquid Glass
              </h3>
              <p className="text-zinc-300 text-sm leading-relaxed mb-6 font-light">
                Un widget moderno que se integra en tu página web con diseño premium. Guía a los usuarios a la sección adecuada, explica los servicios con detalle y aumenta la conversión resolviendo dudas de compra en caliente.
              </p>
              <div className="flex flex-wrap gap-2 text-xs font-mono text-zinc-300">
                <span className="px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10">Diseño Liquid Glass</span>
                <span className="px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10">Entrenamiento RAG</span>
                <span className="px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10">Carga Ultrarrápida</span>
              </div>
            </div>

            {/* Card 3: Reservas & Citas */}
            <div className="p-8 rounded-3xl bg-zinc-950/70 border border-white/10 backdrop-blur-2xl relative overflow-hidden group hover:border-purple-400/40 transition-all shadow-[0_15px_40px_rgba(0,0,0,0.6)]">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-300 mb-6 shadow-inner">
                <Calendar className="w-6 h-6 text-[#C2A88F]" />
              </div>
              <h3 className="font-alata text-xl sm:text-2xl font-bold text-white mb-3">
                Gestión de Reservas y Citas Automáticas
              </h3>
              <p className="text-zinc-300 text-sm leading-relaxed mb-6 font-light">
                Ideal para hostelería, clínicas, barberías o despachos profesionales. El bot verifica disponibilidad en tu calendario, confirma la reserva y envía recordatorios automáticos para reducir cancelaciones.
              </p>
              <div className="flex flex-wrap gap-2 text-xs font-mono text-zinc-300">
                <span className="px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10">Google Calendar / Calendly</span>
                <span className="px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10">Anti-Cancelación</span>
              </div>
            </div>

            {/* Card 4: Soporte Interno */}
            <div className="p-8 rounded-3xl bg-zinc-950/70 border border-white/10 backdrop-blur-2xl relative overflow-hidden group hover:border-[#1B365D]/80 transition-all shadow-[0_15px_40px_rgba(0,0,0,0.6)]">
              <div className="w-12 h-12 rounded-2xl bg-[#1B365D]/30 border border-[#1B365D]/60 flex items-center justify-center text-cyan-300 mb-6 shadow-inner">
                <Users2 className="w-6 h-6 text-[#C2A88F]" />
              </div>
              <h3 className="font-alata text-xl sm:text-2xl font-bold text-white mb-3">
                Asistente de Base de Conocimiento Interno
              </h3>
              <p className="text-zinc-300 text-sm leading-relaxed mb-6 font-light">
                Permite a tus propios empleados consultar normativas, fichas técnicas de producto o protocolos internos en segundos a través de Slack o un panel web privado, eliminando cuellos de botella formativos.
              </p>
              <div className="flex flex-wrap gap-2 text-xs font-mono text-zinc-300">
                <span className="px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10">Búsqueda Semántica</span>
                <span className="px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10">Privacidad y RGPD</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Simulated Chat Showcase: Luxury Floating Device Console */}
      <section className="py-24 px-6 relative">
        <div className="max-w-4xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="text-xs font-mono uppercase text-[#C2A88F] tracking-widest">Demostración Interactiva</span>
            <h2 className="font-alata text-2xl sm:text-4xl font-bold text-white mt-2 uppercase tracking-wide">
              Cómo experimenta la conversación tu cliente
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm mt-2 font-light">
              Naturalidad, rapidez y enfoque en conseguir la reserva o los datos del cliente.
            </p>
          </div>

          <div className="max-w-md mx-auto p-7 rounded-[2rem] bg-gradient-to-b from-zinc-950/90 to-black border border-[#C2A88F]/40 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.85),inset_0_1px_1px_rgba(255,255,255,0.25)]">
            {/* Header chat mock */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-black/60 border border-[#C2A88F]/50 shadow-[0_0_12px_rgba(194,168,143,0.35)] flex items-center justify-center text-[#C2A88F]">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-alata font-bold text-white tracking-wide">Asistente IA JRG</div>
                  <div className="text-[10px] font-mono text-emerald-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    En línea · Responde al instante
                  </div>
                </div>
              </div>
              <div className="px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[10px] font-mono text-zinc-400">
                Meta API
              </div>
            </div>

            {/* Messages */}
            <div className="space-y-3.5 text-xs leading-relaxed font-light">
              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-zinc-200 max-w-[88%] shadow-sm">
                ¡Hola! Bienvenido a Gure Trena. 🍽️ ¿Te gustaría reservar mesa para hoy o prefieres consultar nuestra carta de raciones y pintxos?
              </div>

              <div className="p-4 rounded-2xl bg-[#C2A88F] text-black ml-auto max-w-[82%] text-right font-medium shadow-md">
                Hola, quiero reservar mesa para 4 personas esta noche a las 21:30.
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-zinc-200 max-w-[88%] shadow-sm">
                Perfecto, tenemos disponibilidad en el comedor interior a las 21:30 para 4 personas. ¿A qué nombre y teléfono formalizamos la reserva?
              </div>

              <div className="p-4 rounded-2xl bg-[#C2A88F] text-black ml-auto max-w-[82%] text-right font-medium shadow-md">
                A nombre de Mikel, teléfono 612 345 678.
              </div>

              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 max-w-[92%] shadow-sm">
                ✅ <strong>¡Mesa confirmada!</strong> Te esperamos hoy a las 21:30 en C/ Mayor 12. Te he enviado la confirmación con el enlace para modificarla si lo necesitas. ¡Buen provecho!
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="py-24 px-6 bg-zinc-950/50 border-t border-white/10 relative">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-mono uppercase text-[#C2A88F] tracking-widest">Preguntas Habituales</span>
            <h2 className="font-alata text-2xl sm:text-4xl font-bold text-white mt-2 uppercase tracking-wide">
              Dudas frecuentes sobre Chatbots con IA
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
            <MessageCircle className="w-4 h-4 text-[#C2A88F]" />
            <span>Implementación sin Fricción</span>
          </div>

          <h2 className="font-alata text-3xl sm:text-5xl font-bold text-white mb-4 uppercase">
            Pon a trabajar un asistente virtual en tu negocio
          </h2>

          <p className="text-zinc-300 text-sm sm:text-base max-w-xl mx-auto mb-10 leading-relaxed font-light">
            Sin contratos de permanencia ni cuotas ocultas. Analizamos tus canales actuales y desplegamos tu chatbot listo para operar.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={`https://wa.me/34613448185?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#C2A88F] hover:bg-[#D4BEA7] text-black font-semibold text-sm transition-all shadow-[0_0_25px_rgba(194,168,143,0.35)] hover:scale-105 active:scale-95"
            >
              <span>Hablar ahora por WhatsApp</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <Link
              to="/contacto"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-white font-mono text-sm tracking-wide transition-all border border-white/10"
            >
              <span>Solicitar presupuesto formal</span>
            </Link>
          </div>

          {/* Related services navigation */}
          <div className="mt-12 pt-8 border-t border-white/10 flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-zinc-400">
            <span>Servicios complementarios:</span>
            <Link to="/automatizaciones-ia" className="text-zinc-300 hover:text-[#C2A88F] underline underline-offset-4 transition-colors">
              Automatizaciones con IA
            </Link>
            <span className="text-zinc-600">·</span>
            <Link to="/desarrollo-web" className="text-zinc-300 hover:text-[#C2A88F] underline underline-offset-4 transition-colors">
              Desarrollo Web Profesional
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

export default ChatbotsIA;
