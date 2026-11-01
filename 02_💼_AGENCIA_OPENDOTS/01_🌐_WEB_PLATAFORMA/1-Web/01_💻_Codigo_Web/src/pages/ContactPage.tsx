import React, { useState, useCallback, useEffect } from "react";
import {
  ArrowRight,
  Check,
  Copy,
  Mail,
  Sparkles,
  ShieldCheck,
  Bot,
  Zap,
  Layout
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { config } from "../config";
import { Link } from "react-router-dom";
import BottomServiceDock from "../components/prisma/BottomServiceDock";
import PrismaHarvestFooter from "../components/prisma/PrismaHarvestFooter";
import CinematicCursor from "../components/prisma/CinematicCursor";

interface ProjectType {
  id: string;
  label: string;
  badge: string;
  icon: React.ReactNode;
  message: string;
}

const PROJECT_TYPES: ProjectType[] = [
  {
    id: "automatizaciones",
    label: "Automatizaciones con IA",
    badge: "Eficiencia Operativa",
    icon: <Zap className="w-4 h-4 text-[#C2A88F]" />,
    message: "Hola Jakes! Me interesa automatizar tareas repetitivas y conectar mis herramientas con IA en mi empresa. ¿Podemos agendar una auditoría?"
  },
  {
    id: "chatbots",
    label: "Chatbots IA & WhatsApp",
    badge: "Atención 24/7",
    icon: <Bot className="w-4 h-4 text-[#C2A88F]" />,
    message: "Hola Jakes! Quiero implementar un chatbot con IA para WhatsApp y web con atención 24/7 y reservas automáticas."
  },
  {
    id: "desarrollo-web",
    label: "Desarrollo Web de Alto Rendimiento",
    badge: "Lighthouse 100/100",
    icon: <Layout className="w-4 h-4 text-[#C2A88F]" />,
    message: "Hola Jakes! Necesito una página web profesional de alto rendimiento para mi marca/negocio. ¿Podemos hablar de plazos y presupuesto?"
  },
  {
    id: "auditoria",
    label: "Auditoría Express 15 Min",
    badge: "Consultoría Gratuita",
    icon: <Sparkles className="w-4 h-4 text-[#C2A88F]" />,
    message: "Hola Jakes! Me gustaría agendar una auditoría estratégica de 15 minutos para analizar cómo potenciar mi negocio con tecnología e IA."
  }
];

export const ContactPage: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<ProjectType>(PROJECT_TYPES[0]);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [formSent, setFormSent] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Contacto & Consultoría Estratégica | JRG Agency";
  }, []);

  const whatsappUrl = `https://wa.me/34613448185?text=${encodeURIComponent(selectedProject.message)}`;

  const handleCopyEmail = useCallback(() => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(config.contact.email).then(() => {
        setCopiedEmail(true);
        setTimeout(() => setCopiedEmail(false), 2200);
      });
    }
  }, []);

  const handleCopyAddress = useCallback(() => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText("Urretxu, Gipuzkoa, País Vasco, España").then(() => {
        setCopiedAddress(true);
        setTimeout(() => setCopiedAddress(false), 2200);
      });
    }
  }, []);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mailtoBody = encodeURIComponent(
      `Nombre: ${name}\nEmail: ${email}\nTeléfono/WhatsApp: ${phone}\nTipo de Proyecto: ${selectedProject.label}\n\nMensaje:\n${notes}`
    );
    window.location.href = `mailto:${config.contact.email}?subject=Solicitud de Proyecto: ${selectedProject.label} - ${name}&body=${mailtoBody}`;
    setFormSent(true);
  };

  return (
    <div className="prisma-scope min-h-screen bg-black text-[#E1E0CC] selection:bg-[#DEDBC8] selection:text-black relative overflow-hidden pb-28 sm:pb-36">
      {/* 00. Cinematic Cursor */}
      <CinematicCursor />

      {/* 01. Minimal Luxury Brand Top Bar */}
      <header className="fixed top-3 sm:top-5 left-1/2 -translate-x-1/2 z-40 w-full max-w-6xl px-4 pointer-events-none">
        <div className="pointer-events-auto flex items-center justify-between py-2 px-4 rounded-full bg-black/70 border border-white/10 backdrop-blur-xl shadow-lg">
          <Link to="/" className="flex items-center gap-2 group" title="Volver a la Home">
            <img src="/logoJRG.png" alt="Logo JRG Agency" className="w-6 h-6 rounded-full border border-[#C2A88F]/50 group-hover:scale-105 transition-transform" />
            <span className="font-alata text-xs font-bold tracking-wider text-white">
              JRG <span className="text-[#C2A88F] font-normal">AGENCY</span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[10px] font-mono text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Contacto Prioritario
            </span>
            <a
              href={`https://wa.me/34613448185?text=${encodeURIComponent(selectedProject.message)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C2A88F] hover:bg-[#D4BEA7] text-black text-[11px] font-semibold transition-all hover:scale-105 active:scale-95"
            >
              <span>WhatsApp Directo</span>
            </a>
          </div>
        </div>
      </header>

      {/* 02. SVG Film Grain Filter */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none opacity-[0.035] z-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Ambient Glows */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[850px] h-[450px] bg-[radial-gradient(ellipse_at_center,rgba(194,168,143,0.15)_0%,rgba(0,0,0,0)_70%)] pointer-events-none -z-10"
      />

      {/* Main Terminal Container */}
      <main className="pt-32 pb-24 md:pt-44 md:pb-32 px-4 sm:px-6 max-w-6xl mx-auto relative z-10">
        {/* Header Hook */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-[#C2A88F]/30 backdrop-blur-md mb-6 shadow-[0_0_15px_rgba(194,168,143,0.15)]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-[11px] tracking-widest text-[#E1E0CC] uppercase">
              Terminal de Contacto // Respuesta en &lt; 2 Horas
            </span>
          </div>

          <h1 className="font-alata text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white mb-6 uppercase leading-[1.08]">
            Hablemos de tu <br />
            <span className="font-serif italic font-normal tracking-normal text-[#C2A88F] lowercase">
              próximo proyecto o automatización
            </span>
          </h1>

          <p className="text-base sm:text-lg text-zinc-300 font-light max-w-2xl mx-auto leading-relaxed">
            Sin rodeos ni presupuestos inflados. Analizamos tu modelo de negocio y te presentamos una propuesta técnica cerrada con plazos garantizados.
          </p>
        </div>

        {/* Project Selector Pills */}
        <div className="mb-12">
          <div className="text-xs font-mono text-zinc-400 uppercase tracking-widest text-center mb-4">
            Paso 1: Selecciona el servicio que te interesa
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 max-w-5xl mx-auto">
            {PROJECT_TYPES.map((p) => {
              const isSelected = selectedProject.id === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedProject(p)}
                  className={`p-4 rounded-2xl text-left transition-all duration-300 border flex flex-col justify-between gap-3 ${
                    isSelected
                      ? "bg-zinc-900 border-[#C2A88F] shadow-[0_0_20px_rgba(194,168,143,0.25)] ring-1 ring-[#C2A88F]"
                      : "bg-zinc-950/60 border-white/10 hover:border-white/20 hover:bg-zinc-900/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    {p.icon}
                    <span className="text-[10px] font-mono text-zinc-400 uppercase">{p.badge}</span>
                  </div>
                  <div className="font-alata text-sm font-semibold text-white">{p.label}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2-Column Conversion Bento */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Column A: Fast-track WhatsApp & Instant Channels (Span 6) */}
          <div className="lg:col-span-6 p-8 sm:p-10 rounded-3xl bg-zinc-950/80 border border-white/10 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.7)] flex flex-col justify-between gap-8">
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-mono text-[#C2A88F] uppercase tracking-widest font-semibold flex items-center gap-2">
                  <FaWhatsapp className="w-4 h-4 text-emerald-400" /> Vía Rápida // WhatsApp Directo
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                  Respuesta Inmediata
                </span>
              </div>

              <h2 className="font-alata text-2xl font-bold text-white mb-3">
                ¿Prefieres hablar directamente?
              </h2>
              <p className="text-zinc-300 text-sm font-light leading-relaxed mb-6">
                Haz clic abajo para abrir WhatsApp con un mensaje preconfigurado según tu proyecto seleccionado:
              </p>

              {/* Pre-filled Message Preview Box */}
              <div className="p-4 rounded-2xl bg-black/60 border border-white/10 mb-6 text-xs text-zinc-300 font-mono italic">
                "{selectedProject.message}"
              </div>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 px-6 rounded-full bg-[#10B981] hover:bg-[#0ea371] text-black font-bold text-sm tracking-wide transition-all shadow-[0_0_25px_rgba(16,185,129,0.35)] flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-98"
              >
                <FaWhatsapp className="w-5 h-5" />
                <span>Abrir WhatsApp con esta consulta</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </a>
            </div>

            {/* Direct Details Breakdown */}
            <div className="pt-6 border-t border-white/10 space-y-4">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-400">Email Corporativo:</span>
                <div className="flex items-center gap-2">
                  <span className="text-white font-medium">{config.contact.email}</span>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="p-1 rounded-md bg-white/[0.05] hover:bg-white/10 text-zinc-300"
                    title="Copiar email"
                  >
                    {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-400">Ubicación Física:</span>
                <div className="flex items-center gap-2">
                  <span className="text-white font-medium">Urretxu (Gipuzkoa)</span>
                  <button
                    type="button"
                    onClick={handleCopyAddress}
                    className="p-1 rounded-md bg-white/[0.05] hover:bg-white/10 text-zinc-300"
                    title="Copiar dirección"
                  >
                    {copiedAddress ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-400">Teléfono Directo:</span>
                <a href={`tel:${config.contact.phone}`} className="text-[#C2A88F] font-bold hover:underline">
                  {config.contact.phone}
                </a>
              </div>
            </div>
          </div>

          {/* Column B: Direct Inquiry Proposal Form (Span 6) */}
          <div className="lg:col-span-6 p-8 sm:p-10 rounded-3xl bg-zinc-950/80 border border-white/10 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.7)]">
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs font-mono text-[#C2A88F] uppercase tracking-widest font-semibold flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#C2A88F]" /> Formulario Oficial // Propuesta Cerrada
              </span>
              <span className="text-[10px] font-mono text-zinc-400">Paso 2</span>
            </div>

            <h2 className="font-alata text-2xl font-bold text-white mb-2">
              Solicitud de Propuesta Técnica
            </h2>
            <p className="text-zinc-300 text-xs sm:text-sm font-light mb-6">
              Rellena tus datos y te contactaremos en menos de 24 horas laborables.
            </p>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-zinc-300 mb-1.5 uppercase">
                  Tu Nombre o Empresa *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej: Mikel Aranguren (Restaurante Donosti)"
                  className="w-full px-4 py-3 rounded-2xl bg-black/60 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-[#C2A88F] transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-zinc-300 mb-1.5 uppercase">
                    Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="mikel@empresa.com"
                    className="w-full px-4 py-3 rounded-2xl bg-black/60 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-[#C2A88F] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-300 mb-1.5 uppercase">
                    Teléfono / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+34 600 000 000"
                    className="w-full px-4 py-3 rounded-2xl bg-black/60 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-[#C2A88F] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-300 mb-1.5 uppercase">
                  Detalles del Proyecto o Cuello de Botella Actual
                </label>
                <textarea
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Explícanos brevemente qué herramientas utilizas, qué proceso quieres automatizar o qué objetivos tienes para tu web..."
                  className="w-full px-4 py-3 rounded-2xl bg-black/60 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-[#C2A88F] transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-full bg-[#C2A88F] hover:bg-[#D4BEA7] text-black font-semibold text-sm tracking-wide transition-all shadow-[0_0_20px_rgba(194,168,143,0.35)] hover:scale-[1.01] active:scale-98"
              >
                {formSent ? "✓ Solicitud Lista para Enviar" : "Enviar Solicitud de Proyecto"}
              </button>

              <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-400 justify-center pt-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C2A88F]" />
                <span>Tus datos están protegidos bajo estricto cumplimiento RGPD. Cero spam.</span>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* Floating Bottom Service Dock Navigation */}
      <BottomServiceDock currentService="contacto" />

      {/* 03. Luxury Master Footer */}
      <PrismaHarvestFooter />
    </div>
  );
};

export default ContactPage;
