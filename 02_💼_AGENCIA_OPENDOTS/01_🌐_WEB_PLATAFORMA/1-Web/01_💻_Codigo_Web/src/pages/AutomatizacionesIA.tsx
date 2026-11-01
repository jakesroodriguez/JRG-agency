import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Bot,
  Zap,
  Cpu,
  Workflow,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Layers,
  MessageSquare,
  FileSpreadsheet,
  UtensilsCrossed
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
    q: "¿Necesito cambiar los programas o el software que ya utiliza mi empresa?",
    a: "No. En JRG Agency diseñamos automatizaciones que se conectan de forma nativa a tus herramientas actuales mediante APIs y webhooks seguros (CRM, Google Workspace, Excel, plataformas de facturación, correo o bases de datos). No tienes que cambiar tus sistemas ni reaprender a trabajar."
  },
  {
    q: "¿Qué garantías hay de que la IA no cometa errores en datos sensibles?",
    a: "Implementamos sistemas de validación estructurada y capas de 'human-in-the-loop'. Si un dato o documento tiene un grado de incertidumbre superior al umbral de seguridad, el sistema genera una alerta para aprobación manual antes de confirmar cualquier acción crítica."
  },
  {
    q: "¿Dónde se alojan los datos y cómo se cumple con el RGPD?",
    a: "La privacidad es innegociable. Todas las integraciones y flujos se ejecutan en servidores y nubes con sede o cumplimiento estricto en la Unión Europea (UE), con cifrado TLS 256-bit y acuerdos de procesamiento de datos en regla."
  },
  {
    q: "¿Cuánto tiempo se tarda en poner en marcha una automatización?",
    a: "Un flujo de automatización estándar (como conectar la entrada de leads con el CRM y WhatsApp, o procesar albaranes a hojas de cálculo) suele estar probado y funcionando en producción en un plazo de 7 a 14 días laborables."
  },
  {
    q: "¿Qué coste tiene y qué mantenimiento requiere?",
    a: "Trabajamos con presupuestos cerrados según la complejidad de la arquitectura, sin sorpresas. Además, incluimos un periodo de monitorización inicial y soporte preventivo para garantizar que cualquier cambio en las APIs externas no interrumpa la operativa."
  }
];

export const AutomatizacionesIA: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [empleados, setEmpleados] = useState<number>(3);
  const [horasSemana, setHorasSemana] = useState<number>(6);

  useEffect(() => {
    window.scrollTo(0, 0);

    // Dynamic SEO Metadata for /automatizaciones-ia
    document.title = "Automatizaciones con IA para Empresas | JRG Agency";

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        "content",
        "Automatizamos tareas repetitivas, flujos de trabajo e integraciones de software con IA para empresas y pymes. Ahorra cientos de horas al mes con JRG Agency."
      );
    }

    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute("href", "https://www.jrgagency.eus/automatizaciones-ia");
    }

    return () => {
      document.title = "JRG Agency | Agencia de Inteligencia Artificial, Automatizaciones y Desarrollo Web";
      if (canonical) {
        canonical.setAttribute("href", "https://www.jrgagency.eus/");
      }
    };
  }, []);

  const horasAhorradasMes = Math.round(empleados * horasSemana * 4.2);
  const horasAhorradasAno = horasAhorradasMes * 12;

  const whatsappMessage = encodeURIComponent(
    "Hola JRG Agency! He visto vuestra página de Automatizaciones con IA y me gustaría analizar qué tareas repetitivas podemos automatizar en mi negocio."
  );

  return (
    <div className="prisma-scope min-h-screen bg-black text-[#E1E0CC] selection:bg-[#DEDBC8] selection:text-black relative overflow-hidden">
      {/* 00. Desktop Cinematic Cursor */}
      <CinematicCursor />

      {/* 01. Unified Luxury Floating Island Header */}
      <ServiceIslandHeader currentService="automatizaciones" />

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
        className="absolute top-[1100px] right-0 w-[600px] h-[500px] bg-[radial-gradient(ellipse_at_center,rgba(27,54,93,0.18)_0%,rgba(0,0,0,0)_70%)] pointer-events-none -z-10"
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
                "@id": "https://www.jrgagency.eus/automatizaciones-ia/#service",
                "name": "Automatizaciones con IA para Empresas",
                "serviceType": "Automatización de Procesos e Inteligencia Artificial",
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
                  "Servicio profesional de automatización de tareas repetitivas, integración de herramientas e inteligencia artificial aplicada a procesos empresariales.",
                "url": "https://www.jrgagency.eus/automatizaciones-ia"
              },
              {
                "@type": "FAQPage",
                "@id": "https://www.jrgagency.eus/automatizaciones-ia/#faq",
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
                    "name": "Automatizaciones con IA",
                    "item": "https://www.jrgagency.eus/automatizaciones-ia"
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
              Sistemas Autónomos // Operativa 24/7
            </span>
          </div>

          <h1 className="font-alata text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white mb-6 uppercase leading-[1.08]">
            Automatizaciones con IA <br />
            <span className="font-serif italic font-normal tracking-normal text-[#C2A88F] lowercase">
              para empresas sin fricción
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-zinc-300 font-light max-w-2xl mx-auto mb-10 leading-relaxed">
            Conectamos tus programas, ordenamos tus datos y automatizamos los procesos mecánicos para que tu equipo dedique su jornada a clientes y decisiones estratégicas, no a tareas administrativas.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={`https://wa.me/34613448185?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#C2A88F] hover:bg-[#D4BEA7] text-black font-semibold text-sm tracking-wide transition-all shadow-[0_0_25px_rgba(194,168,143,0.35)] hover:scale-105 active:scale-95"
            >
              <span>Solicitar auditoría de automatización</span>
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
              <span className="text-xs text-zinc-300 font-medium">Sin cambiar las herramientas actuales</span>
            </div>
            <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
              <ShieldCheck className="w-5 h-5 text-[#C2A88F] shrink-0" />
              <span className="text-xs text-zinc-300 font-medium">Cumplimiento RGPD y servidores UE</span>
            </div>
            <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
              <Clock className="w-5 h-5 text-[#C2A88F] shrink-0" />
              <span className="text-xs text-zinc-300 font-medium">Despliegue operativo en 7 a 14 días</span>
            </div>
          </div>
        </div>
      </section>

      {/* 03. High-Converting VSL Video Presentation */}
      <CinematicVSLSection
        title="CÓMO AUTOMATIZAMOS LA OPERATIVA DE TU EMPRESA Y MULTIPLICAMOS TUS VENTAS"
        subtitle="En este vídeo de 3 minutos te mostramos el proceso técnico exacto que aplicamos en negocios reales: desde la captación en WhatsApp hasta la eliminación total de tareas repetitivas."
        videoSrc="/videos/hero-bg.mp4"
        ctaText="Solicitar Auditoría de 15 Minutos"
        ctaLink={`https://wa.me/34613448185?text=${whatsappMessage}`}
      />

      {/* 04. Verified Client Social Proof */}
      <PrismaSocialProofSection />

      {/* Problem Diagnostic Section */}
      <section className="py-20 px-6 border-t border-white/10 bg-zinc-950/40 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-mono uppercase text-[#C2A88F] tracking-widest">Diagnóstico Operativo</span>
            <h2 className="font-alata text-3xl sm:text-4xl font-bold text-white mt-2 uppercase tracking-wide">
              ¿Cuánto tiempo pierde tu empresa en tareas manuales?
            </h2>
            <p className="text-zinc-400 text-sm mt-3 font-light leading-relaxed">
              La mayoría de negocios no tienen un problema de ventas, sino de fricción operativa diaria.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-6 rounded-3xl bg-zinc-950/70 border border-white/10 relative overflow-hidden group hover:border-red-400/40 backdrop-blur-xl transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mb-4">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <h3 className="font-alata text-base font-semibold text-white mb-2">Duplicación de datos</h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-light">
                Copiar y pegar información entre correos, facturación, WhatsApp y hojas de cálculo a mano, con riesgo constante de errores tipográficos.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-zinc-950/70 border border-white/10 relative overflow-hidden group hover:border-amber-400/40 backdrop-blur-xl transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-alata text-base font-semibold text-white mb-2">Lentitud en presupuestos</h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-light">
                Tardar 24 o 48 horas en generar una propuesta comercial porque recopilar precios y datos de cliente requiere demasiado tiempo manual.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-zinc-950/70 border border-white/10 relative overflow-hidden group hover:border-[#1B365D]/80 backdrop-blur-xl transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
              <div className="w-10 h-10 rounded-xl bg-[#1B365D]/30 border border-[#1B365D]/60 flex items-center justify-center text-cyan-300 mb-4">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-alata text-base font-semibold text-white mb-2">Programas desconectados</h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-light">
                Tener un CRM por un lado, la tienda online por otro y el buzón de correo saturado sin comunicación automática entre ellos.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-zinc-950/70 border border-white/10 relative overflow-hidden group hover:border-[#C2A88F]/40 backdrop-blur-xl transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
              <div className="w-10 h-10 rounded-xl bg-[#C2A88F]/10 border border-[#C2A88F]/20 flex items-center justify-center text-[#C2A88F] mb-4">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="font-alata text-base font-semibold text-white mb-2">Consultas repetitivas</h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-light">
                Responder las mismas preguntas una y otra vez sobre reservas, estados de pedido, horarios o catálogo en lugar de automatizarlas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Solutions Bento Grid */}
      <section className="py-24 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-14">
            <span className="text-xs font-mono uppercase text-[#C2A88F] tracking-widest">Soluciones de Ingeniería</span>
            <h2 className="font-alata text-3xl sm:text-5xl font-bold text-white mt-2 uppercase tracking-wide">
              Flujos que diseñamos e implementamos
            </h2>
            <p className="text-zinc-400 text-sm mt-3 font-light leading-relaxed">
              Arquitecturas estables con conectores robustos, APIs oficiales y modelos de IA ajustados a tu operativa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Bento Card 1: Integración de Sistemas (Span 7) */}
            <div className="md:col-span-7 p-8 rounded-3xl bg-zinc-950/70 border border-white/10 backdrop-blur-2xl relative overflow-hidden group hover:border-[#C2A88F]/40 transition-all shadow-[0_15px_40px_rgba(0,0,0,0.6)]">
              <div className="flex items-center justify-between mb-5">
                <div className="p-3.5 rounded-2xl bg-[#1B365D]/30 border border-[#1B365D]/60 text-white shadow-inner">
                  <Workflow className="w-6 h-6 text-[#C2A88F]" />
                </div>
                <span className="text-[11px] font-mono text-zinc-400 bg-white/[0.04] px-3 py-1 rounded-full border border-white/10">
                  APIs & Webhooks
                </span>
              </div>
              <h3 className="font-alata text-xl sm:text-2xl font-bold text-white mb-3">
                Sincronización Total de Sistemas y CRMs
              </h3>
              <p className="text-zinc-300 text-sm leading-relaxed mb-6 font-light">
                Conectamos tu formulario web, campañas de publicidad, WhatsApp, CRM (HubSpot, Notion, Holded, Airtable) y facturación para que cada lead se registre al segundo sin que nadie tenga que escribir nada a mano.
              </p>
              <div className="flex flex-wrap gap-2 text-xs font-mono text-zinc-300">
                <span className="px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10">Holded / Factusol</span>
                <span className="px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10">Notion / Airtable</span>
                <span className="px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10">Google Workspace</span>
                <span className="px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10">HubSpot</span>
              </div>
            </div>

            {/* Bento Card 2: Extracción Inteligente de Documentos (Span 5) */}
            <div className="md:col-span-5 p-8 rounded-3xl bg-zinc-950/70 border border-white/10 backdrop-blur-2xl relative overflow-hidden group hover:border-[#C2A88F]/40 transition-all shadow-[0_15px_40px_rgba(0,0,0,0.6)]">
              <div className="flex items-center justify-between mb-5">
                <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  <Cpu className="w-6 h-6 text-[#C2A88F]" />
                </div>
                <span className="text-[11px] font-mono text-emerald-400/90 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  Visión & LLMs
                </span>
              </div>
              <h3 className="font-alata text-xl sm:text-2xl font-bold text-white mb-3">
                Lectura y Extracción de Documentos con IA
              </h3>
              <p className="text-zinc-300 text-sm leading-relaxed mb-6 font-light">
                Procesa facturas de proveedores, albaranes, pedidos en PDF o emails entrantes. La IA extrae los conceptos, importes y fechas, volcándolos directamente en tu base de datos o sistema contable.
              </p>
              <div className="flex flex-wrap gap-2 text-xs font-mono text-zinc-300">
                <span className="px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10">PDFs & Albaranes</span>
                <span className="px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10">Facturación Automática</span>
              </div>
            </div>

            {/* Bento Card 3: Hostelería y Negocios Físicos (Span 5) */}
            <div className="md:col-span-5 p-8 rounded-3xl bg-zinc-950/70 border border-white/10 backdrop-blur-2xl relative overflow-hidden group hover:border-[#C2A88F]/40 transition-all shadow-[0_15px_40px_rgba(0,0,0,0.6)]">
              <div className="flex items-center justify-between mb-5">
                <div className="p-3.5 rounded-2xl bg-[#C2A88F]/15 border border-[#C2A88F]/30 text-[#C2A88F]">
                  <UtensilsCrossed className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-mono text-[#C2A88F] bg-[#C2A88F]/10 px-3 py-1 rounded-full border border-[#C2A88F]/20">
                  Hostelería & Comercio
                </span>
              </div>
              <h3 className="font-alata text-xl sm:text-2xl font-bold text-white mb-3">
                Automatización de Reservas y Pedidos
              </h3>
              <p className="text-zinc-300 text-sm leading-relaxed mb-6 font-light">
                Recordatorios automáticos por WhatsApp para reducir cancelaciones ("no-shows"), confirmación de mesas en tiempo real y sincronización con el libro de reservas digital.
              </p>
              <div className="flex flex-wrap gap-2 text-xs font-mono text-zinc-300">
                <span className="px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10">WhatsApp API</span>
                <span className="px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10">Anti No-Show</span>
              </div>
            </div>

            {/* Bento Card 4: Alertas Operativas y Soporte Interno (Span 7) */}
            <div className="md:col-span-7 p-8 rounded-3xl bg-zinc-950/70 border border-white/10 backdrop-blur-2xl relative overflow-hidden group hover:border-[#C2A88F]/40 transition-all shadow-[0_15px_40px_rgba(0,0,0,0.6)]">
              <div className="flex items-center justify-between mb-5">
                <div className="p-3.5 rounded-2xl bg-purple-500/15 border border-purple-500/30 text-purple-300">
                  <Zap className="w-6 h-6 text-[#C2A88F]" />
                </div>
                <span className="text-[11px] font-mono text-purple-300 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
                  Canales Internos
                </span>
              </div>
              <h3 className="font-alata text-xl sm:text-2xl font-bold text-white mb-3">
                Alertas Proactivas y Asistentes de Equipo
              </h3>
              <p className="text-zinc-300 text-sm leading-relaxed mb-6 font-light">
                Recibe notificaciones inmediatas en Slack, Telegram o móvil cuando entra un cliente VIP, cuando un pago falla o cuando un stock baja de su umbral. Tu equipo siempre informado sin revisar 10 paneles distintos.
              </p>
              <div className="flex flex-wrap gap-2 text-xs font-mono text-zinc-300">
                <span className="px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10">Slack / Telegram Bot</span>
                <span className="px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10">Alertas de Cobro</span>
                <span className="px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10">Monitorización 24/7</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Savings Estimator Widget */}
      <section className="py-20 px-6 border-y border-white/10 bg-gradient-to-b from-black via-zinc-950/80 to-black relative">
        <div className="max-w-4xl mx-auto p-8 sm:p-14 rounded-3xl bg-zinc-950/80 border border-[#C2A88F]/30 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.2)]">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-mono uppercase text-[#C2A88F] tracking-widest">Calculadora de Impacto Operativo</span>
            <h2 className="font-alata text-2xl sm:text-4xl font-bold text-white mt-2 uppercase">
              Calcula el tiempo que tu equipo recuperará
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm mt-2 font-light">
              Ajusta los valores para estimar las horas que una automatización con IA devuelve a tu negocio.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="space-y-8">
              <div>
                <div className="flex justify-between text-xs font-mono text-zinc-300 mb-2">
                  <span>Personas haciendo tareas repetitivas:</span>
                  <span className="text-[#C2A88F] font-bold text-sm">{empleados} persona{empleados > 1 ? "s" : ""}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={empleados}
                  onChange={(e) => setEmpleados(Number(e.target.value))}
                  className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#C2A88F]"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono text-zinc-300 mb-2">
                  <span>Horas semanales perdidas por persona:</span>
                  <span className="text-[#C2A88F] font-bold text-sm">{horasSemana} h / semana</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="20"
                  value={horasSemana}
                  onChange={(e) => setHorasSemana(Number(e.target.value))}
                  className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#C2A88F]"
                />
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-black/70 border border-[#C2A88F]/30 text-center relative overflow-hidden shadow-inner">
              <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-widest mb-2">
                Tiempo recuperado para tu negocio
              </div>
              <div className="font-mono text-5xl sm:text-6xl font-bold text-[#C2A88F] tracking-tight">
                {horasAhorradasMes} h
              </div>
              <div className="text-xs font-mono text-zinc-300 mt-1">
                cada mes (~{horasAhorradasAno.toLocaleString()} h al año)
              </div>
              <p className="text-xs text-zinc-400 mt-4 leading-relaxed font-light">
                Horas que tu equipo puede reinvertir en cerrar ventas, atender clientes presenciales o mejorar tus productos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Methodology Section */}
      <section className="py-24 px-6 relative">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="text-xs font-mono uppercase text-[#C2A88F] tracking-widest">Proceso Técnico</span>
            <h2 className="font-alata text-3xl sm:text-4xl font-bold text-white mt-2 uppercase tracking-wide">
              Cómo abordamos tu proyecto paso a paso
            </h2>
            <p className="text-zinc-400 text-sm mt-3 font-light">Sin interrupciones en tu día a día ni cambios bruscos de golpe.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-7 rounded-3xl bg-zinc-950/70 border border-white/10 backdrop-blur-xl">
              <span className="text-3xl font-mono font-bold text-[#C2A88F]">01</span>
              <h3 className="font-alata text-base font-bold text-white mt-4 mb-2">Auditoría 30 min</h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-light">
                Analizamos qué tareas comen más horas en tu empresa y qué herramientas utilizas actualmente.
              </p>
            </div>

            <div className="p-7 rounded-3xl bg-zinc-950/70 border border-white/10 backdrop-blur-xl">
              <span className="text-3xl font-mono font-bold text-[#C2A88F]">02</span>
              <h3 className="font-alata text-base font-bold text-white mt-4 mb-2">Diseño del Flujo</h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-light">
                Trazamos el mapa visual de conexiones, APIs, reglas de seguridad y validaciones automáticas.
              </p>
            </div>

            <div className="p-7 rounded-3xl bg-zinc-950/70 border border-white/10 backdrop-blur-xl">
              <span className="text-3xl font-mono font-bold text-[#C2A88F]">03</span>
              <h3 className="font-alata text-base font-bold text-white mt-4 mb-2">Pruebas en Seguro</h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-light">
                Ejecutamos simulaciones reales en entorno de prueba verificando que no exista margen de error.
              </p>
            </div>

            <div className="p-7 rounded-3xl bg-zinc-950/70 border border-white/10 backdrop-blur-xl">
              <span className="text-3xl font-mono font-bold text-[#C2A88F]">04</span>
              <h3 className="font-alata text-base font-bold text-white mt-4 mb-2">Despliegue & Soporte</h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-light">
                Activamos el flujo en producción con monitorización continua para garantizar estabilidad 24/7.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="py-24 px-6 bg-zinc-950/50 border-t border-white/10 relative">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-mono uppercase text-[#C2A88F] tracking-widest">Resolución de Dudas</span>
            <h2 className="font-alata text-2xl sm:text-4xl font-bold text-white mt-2 uppercase tracking-wide">
              Preguntas Frecuentes sobre Automatizaciones con IA
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
            <Bot className="w-4 h-4 text-[#C2A88F]" />
            <span>Consultoría Técnica sin Compromiso</span>
          </div>

          <h2 className="font-alata text-3xl sm:text-5xl font-bold text-white mb-4 uppercase">
            ¿Listo para automatizar la operativa de tu empresa?
          </h2>

          <p className="text-zinc-300 text-sm sm:text-base max-w-xl mx-auto mb-10 leading-relaxed font-light">
            Cuéntanos qué proceso o tarea te quita más tiempo y te presentaremos un plan técnico de automatización adaptado a tu negocio.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={`https://wa.me/34613448185?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#C2A88F] hover:bg-[#D4BEA7] text-black font-semibold text-sm transition-all shadow-[0_0_25px_rgba(194,168,143,0.35)] hover:scale-105 active:scale-95"
            >
              <span>Escribir por WhatsApp directo</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <Link
              to="/contacto"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-white font-mono text-sm tracking-wide transition-all border border-white/10"
            >
              <span>Enviar formulario de contacto</span>
            </Link>
          </div>

          {/* Related services navigation */}
          <div className="mt-12 pt-8 border-t border-white/10 flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-zinc-400">
            <span>Servicios complementarios:</span>
            <Link to="/chatbots-ia" className="text-zinc-300 hover:text-[#C2A88F] underline underline-offset-4 transition-colors">
              Chatbots con IA
            </Link>
            <span className="text-zinc-600">·</span>
            <Link to="/desarrollo-web" className="text-zinc-300 hover:text-[#C2A88F] underline underline-offset-4 transition-colors">
              Desarrollo Web de Alto Rendimiento
            </Link>
            <span className="text-zinc-600">·</span>
            <Link to="/myworks" className="text-zinc-300 hover:text-[#C2A88F] underline underline-offset-4 transition-colors">
              Ver Trabajos Realizados
            </Link>
          </div>
        </div>
      </section>

      {/* 03. Luxury Prisma Harvest Master Footer */}
      <PrismaHarvestFooter />
    </div>
  );
};

export default AutomatizacionesIA;
