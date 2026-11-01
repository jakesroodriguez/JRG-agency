import React, { useState } from "react";
import {
  MessageSquare,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  Clock,
  ShieldCheck,
  Calendar,
  Gauge,
  Lock,
} from "lucide-react";
import WordsPullUpMultiStyle, { TextSegment } from "./WordsPullUpMultiStyle";
import sounds from "./soundEffects";

export const PrismaDesktopContact: React.FC = () => {
  // Micro-intake states
  const [selectedService, setSelectedService] = useState("Web 3D & Alto Impacto");
  const [selectedBudget, setSelectedBudget] = useState("5.000€ - 12.000€ (Despliegue Full)");
  const [selectedTimeline, setSelectedTimeline] = useState("Sprint Ágil (3 semanas)");

  const [formData, setFormData] = useState({
    name: "",
    currentUrl: "",
    notes: "",
  });

  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [commercialAccepted, setCommercialAccepted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [status, setStatus] = useState<"idle" | "success">("idle");

  const services = [
    { title: "Web 3D & Alto Impacto", desc: "Retención visual con Three.js y 60 FPS" },
    { title: "Plataforma Web / E-Commerce", desc: "Arquitectura Headless ultrarrápida" },
    { title: "Sistema de Agentes IA", desc: "Automatización y orquestación inteligente" },
    { title: "Rediseño & Auditoría CRO", desc: "Optimización de embudos y conversión" },
  ];

  const budgetTiers = [
    { label: "2.500€ - 5.000€", desc: "Sprint Ágil" },
    { label: "5.000€ - 12.000€", desc: "Despliegue Full" },
    { label: "> 12.000€", desc: "Enterprise / A Medida" },
  ];

  const timelines = [
    "Sprint Ágil (3 semanas)",
    "1 a 2 meses",
    "Planificando Q1 2027",
  ];

  const handleWhatsAppSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!privacyAccepted) {
      setErrorMsg("Debes aceptar la Política de Privacidad para iniciar el diagnóstico.");
      return;
    }
    setErrorMsg("");

    const message = encodeURIComponent(
      `Hola Jakes, he completado el diagnóstico en la web de JRG Agency.\n\n` +
      `• Nombre/Empresa: ${formData.name || "Cliente interesado"}\n` +
      `• Solución requerida: ${selectedService}\n` +
      `• Escala de inversión: ${selectedBudget}\n` +
      `• Plazo estimado: ${selectedTimeline}\n` +
      `${formData.currentUrl ? `• Web actual: ${formData.currentUrl}\n` : ""}` +
      `${formData.notes ? `• Objetivo: ${formData.notes}\n` : ""}\n` +
      `Me gustaría coordinar la sesión de viabilidad técnica.`
    );

    setStatus("success");
    sounds.playClick();

    setTimeout(() => {
      window.open(`https://wa.me/34688849495?text=${message}`, "_blank");
      setStatus("idle");
    }, 450);
  };

  const line1Segments: TextSegment[] = [
    {
      text: "¿Listo para",
      className: "text-[#E1E0CC] font-normal tracking-tight",
    },
    {
      text: "destacar",
      className: "italic font-serif text-[#C2A88F] font-normal px-2.5",
    },
    {
      text: "en el mundo digital?",
      className: "text-[#E1E0CC] font-normal tracking-tight",
    },
  ];

  const line2Segments: TextSegment[] = [
    {
      text: "Dejemos de hablar de diseño genérico. Hablemos de números, arquitectura y retorno.",
      className: "text-zinc-400 font-light",
    },
  ];

  return (
    <section className="bg-black py-28 md:py-40 px-4 md:px-8 relative select-none overflow-hidden" id="contact">
      {/* Background ambient lighting in champagne/bone */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[450px] bg-gradient-to-tr from-[#C2A88F]/[0.06] via-[#DEDBC8]/[0.03] to-transparent blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-20">
          <div className="flex justify-center mb-5">
            <div className="relative group">
              <div className="absolute -inset-1.5 bg-gradient-to-r from-[#DEDBC8] to-[#C2A88F] rounded-full blur-md opacity-25 group-hover:opacity-50 transition duration-500" />
              <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border border-[#C2A88F]/50 shadow-[0_0_20px_rgba(194,168,143,0.3)] bg-black/80 backdrop-blur-md p-1 flex items-center justify-center">
                <img
                  src="/logoJRG.png"
                  alt="JRG Agency"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            </div>
          </div>

          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-[#C2A88F]/40 bg-black/70 backdrop-blur-xl shadow-[0_0_20px_rgba(194,168,143,0.18)] mb-4">
            <span className="w-2 h-2 rounded-full bg-[#C2A88F] animate-pulse" />
            <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] text-[#C2A88F] font-semibold">
              DISPONIBILIDAD ESTUDIO Q4 2026 // 2 CUPOS ABIERTOS
            </span>
          </div>

          <div className="text-3xl sm:text-5xl md:text-6xl font-medium tracking-tight leading-[1.1] mb-3">
            <WordsPullUpMultiStyle segments={line1Segments} />
          </div>
          <div className="text-lg sm:text-2xl md:text-3xl font-normal text-zinc-400">
            <WordsPullUpMultiStyle segments={line2Segments} delay={0.15} />
          </div>
        </div>

        {/* High-Ticket Conversion Terminal Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left 5 Columns: Founder Authority & Risk Reversal Guarantees */}
          <div className="lg:col-span-5 rounded-3xl p-7 sm:p-9 md:p-10 border border-white/10 bg-[#0A0A0B]/90 backdrop-blur-2xl shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-[#C2A88F] mb-3">
                <ShieldCheck className="w-4 h-4 text-[#C2A88F]" />
                <span>DESPACHO DIRECTO // JAKES RODRIGUEZ</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-normal text-white mb-3 tracking-tight">
                Hablas con el ingeniero, no con un comercial.
              </h3>

              <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed mb-6">
                Sin intermediarios ni juniors subcontratados. Trato directo de principio a fin, asegurando código de autor nativo y dirección de arte cinematográfica.
              </p>

              {/* 3 Contractual Guarantees (Risk Reversal) */}
              <div className="space-y-3 mb-8">
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-[#C2A88F]/30 transition-colors flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-xl bg-[#C2A88F]/10 border border-[#C2A88F]/25 flex items-center justify-center shrink-0 text-[#C2A88F]">
                    <Gauge className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-[#EFE8E1]">Garantía Core Web Vitals 95+</div>
                    <div className="text-[11px] text-zinc-400 font-light mt-0.5">
                      Puntuación verde certificada en Google Lighthouse oficial o se optimiza sin coste.
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-[#C2A88F]/30 transition-colors flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-xl bg-[#C2A88F]/10 border border-[#C2A88F]/25 flex items-center justify-center shrink-0 text-[#C2A88F]">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-[#EFE8E1]">SLA Cerrado de 21 Días</div>
                    <div className="text-[11px] text-zinc-400 font-light mt-0.5">
                      Despliegue navegable en entorno privado de Staging en la semana 3 laborable.
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-[#C2A88F]/30 transition-colors flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-xl bg-[#C2A88F]/10 border border-[#C2A88F]/25 flex items-center justify-center shrink-0 text-[#C2A88F]">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-[#EFE8E1]">Propiedad Total & Código Limpio</div>
                    <div className="text-[11px] text-zinc-400 font-light mt-0.5">
                      El código fuente completo en React y Vite te pertenece al 100%. Sin ataduras.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Concierge Status Card (Replacing the 3D lab seal with pure architectural elegance) */}
            <div className="p-5 rounded-2xl bg-black/60 border border-[#C2A88F]/20 shadow-[0_0_20px_rgba(194,168,143,0.06)] space-y-3.5">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#C2A88F] font-semibold">
                  CONCIERGE DE ESTUDIO
                </span>
                <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  EN LÍNEA
                </span>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-center gap-3 text-xs text-zinc-300">
                  <Mail className="w-3.5 h-3.5 text-[#C2A88F] shrink-0" />
                  <a href="mailto:jakessrodriguezz@gmail.com" className="hover:text-white transition-colors truncate">
                    jakessrodriguezz@gmail.com
                  </a>
                </div>

                <div className="flex items-center gap-3 text-xs text-zinc-300">
                  <Phone className="w-3.5 h-3.5 text-[#C2A88F] shrink-0" />
                  <a href="tel:+34688849495" className="hover:text-white transition-colors">
                    +34 688 84 94 95
                  </a>
                </div>

                <div className="flex items-center gap-3 text-xs text-zinc-300">
                  <MapPin className="w-3.5 h-3.5 text-[#C2A88F] shrink-0" />
                  <span>Urretxu, Gipuzkoa &middot; Cobertura Global</span>
                </div>
              </div>

              <div className="pt-2 text-[10px] font-mono text-zinc-500 flex items-center justify-between border-t border-white/5">
                <span>Tiempo de respuesta habitual:</span>
                <span className="text-[#C2A88F] font-semibold">&lt; 15 min</span>
              </div>
            </div>
          </div>

          {/* Right 7 Columns: Interactive Micro-Intake Qualification Terminal */}
          <div className="lg:col-span-7 rounded-3xl p-7 sm:p-9 md:p-10 border border-white/10 bg-[#0A0A0B]/90 backdrop-blur-2xl shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#C2A88F]">
                  DIAGNÓSTICO INTERACTIVO // SELECCIÓN EN 3 CLICS
                </span>
                <span className="text-xs font-mono text-zinc-500">
                  SIN FORMULARIOS FRÍOS
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-normal text-white mb-2 tracking-tight">
                Configura los Parámetros de tu Proyecto
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 font-light mb-8">
                Selecciona tus objetivos y generaremos una auditoría de arquitectura preliminary sin compromiso.
              </p>

              <form onSubmit={handleWhatsAppSubmit} className="space-y-6">
                {/* Step 1: Solution Requirement */}
                <div>
                  <label className="text-xs font-mono uppercase tracking-wider text-zinc-300 block mb-3 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#C2A88F]/15 border border-[#C2A88F]/40 flex items-center justify-center text-[10px] text-[#C2A88F] font-bold">
                      1
                    </span>
                    ¿Qué solución técnica necesitas?
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {services.map((srv, idx) => {
                      const isSelected = selectedService === srv.title;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            sounds.playClick();
                            setSelectedService(srv.title);
                          }}
                          className={`p-3.5 rounded-2xl text-left transition-all duration-200 cursor-pointer border ${
                            isSelected
                              ? "bg-gradient-to-r from-[#DEDBC8] via-[#C2A88F] to-[#A8896C] text-black font-semibold border-transparent shadow-[0_4px_20px_rgba(194,168,143,0.25)]"
                              : "bg-white/[0.02] border-white/10 text-zinc-300 hover:bg-white/[0.05] hover:border-[#C2A88F]/40"
                          }`}
                        >
                          <div className="text-xs sm:text-sm font-semibold">{srv.title}</div>
                          <div className={`text-[11px] mt-0.5 font-light ${isSelected ? "text-black/80" : "text-zinc-500"}`}>
                            {srv.desc}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Step 2: Budget Scale */}
                <div>
                  <label className="text-xs font-mono uppercase tracking-wider text-zinc-300 block mb-3 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#C2A88F]/15 border border-[#C2A88F]/40 flex items-center justify-center text-[10px] text-[#C2A88F] font-bold">
                      2
                    </span>
                    Rango de inversión estimado:
                  </label>
                  <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
                    {budgetTiers.map((tier, idx) => {
                      const isSelected = selectedBudget.includes(tier.label);
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            sounds.playClick();
                            setSelectedBudget(`${tier.label} (${tier.desc})`);
                          }}
                          className={`p-3 rounded-2xl text-center transition-all duration-200 cursor-pointer border ${
                            isSelected
                              ? "bg-gradient-to-r from-[#DEDBC8] via-[#C2A88F] to-[#A8896C] text-black font-semibold border-transparent shadow-[0_4px_16px_rgba(194,168,143,0.2)]"
                              : "bg-white/[0.02] border-white/10 text-zinc-300 hover:bg-white/[0.05] hover:border-[#C2A88F]/40"
                          }`}
                        >
                          <div className="text-xs font-mono font-bold">{tier.label}</div>
                          <div className={`text-[10px] font-mono mt-0.5 ${isSelected ? "text-black/80" : "text-zinc-500"}`}>
                            {tier.desc}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Step 3: Timeline */}
                <div>
                  <label className="text-xs font-mono uppercase tracking-wider text-zinc-300 block mb-3 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#C2A88F]/15 border border-[#C2A88F]/40 flex items-center justify-center text-[10px] text-[#C2A88F] font-bold">
                      3
                    </span>
                    Plazo ideal de lanzamiento:
                  </label>
                  <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
                    {timelines.map((time, idx) => {
                      const isSelected = selectedTimeline === time;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            sounds.playClick();
                            setSelectedTimeline(time);
                          }}
                          className={`p-2.5 rounded-2xl text-center transition-all duration-200 cursor-pointer border text-xs font-mono ${
                            isSelected
                              ? "bg-[#C2A88F] text-black font-bold border-transparent shadow-sm"
                              : "bg-white/[0.02] border-white/10 text-zinc-400 hover:bg-white/[0.05] hover:border-[#C2A88F]/40"
                          }`}
                        >
                          {time}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Step 4: Contact Credentials */}
                <div className="space-y-4 pt-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-zinc-300 block mb-1 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#C2A88F]/15 border border-[#C2A88F]/40 flex items-center justify-center text-[10px] text-[#C2A88F] font-bold">
                      4
                    </span>
                    Datos para remitir el diagnóstico:
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <input
                        type="text"
                        required
                        placeholder="Tu nombre o empresa *"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/10 text-[#EFE8E1] placeholder-zinc-500 text-xs sm:text-sm focus:outline-none focus:border-[#C2A88F] focus:ring-1 focus:ring-[#C2A88F]/30 transition-colors"
                      />
                    </div>

                    <div>
                      <input
                        type="text"
                        placeholder="Web actual (opcional)"
                        value={formData.currentUrl}
                        onChange={(e) => setFormData({ ...formData, currentUrl: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/10 text-[#EFE8E1] placeholder-zinc-500 text-xs sm:text-sm focus:outline-none focus:border-[#C2A88F] focus:ring-1 focus:ring-[#C2A88F]/30 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <textarea
                      rows={2}
                      placeholder="Breve objetivo de negocio o enlace a referencias (opcional)"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/10 text-[#EFE8E1] placeholder-zinc-500 text-xs sm:text-sm focus:outline-none focus:border-[#C2A88F] focus:ring-1 focus:ring-[#C2A88F]/30 transition-colors resize-none"
                    />
                  </div>
                </div>

                {/* RGPD Strict Verification Checkboxes */}
                <div className="pt-2 space-y-2.5">
                  <label className="flex items-start gap-2.5 text-xs text-zinc-300 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      required
                      checked={privacyAccepted}
                      onChange={(e) => {
                        setPrivacyAccepted(e.target.checked);
                        if (e.target.checked) setErrorMsg("");
                      }}
                      className="mt-0.5 w-4 h-4 rounded border-white/20 bg-black/60 text-[#C2A88F] focus:ring-0 cursor-pointer"
                    />
                    <span>
                      He leído y acepto la{" "}
                      <a
                        href="/privacidad"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#C2A88F] underline hover:text-white font-medium"
                      >
                        Política de Privacidad
                      </a>{" "}
                      para la gestión de mi consulta. <span className="text-[#C2A88F] font-bold">*</span>
                    </span>
                  </label>

                  <label className="flex items-start gap-2.5 text-[11px] text-zinc-500 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={commercialAccepted}
                      onChange={(e) => setCommercialAccepted(e.target.checked)}
                      className="mt-0.5 w-3.5 h-3.5 rounded border-white/20 bg-black/60 text-[#C2A88F] focus:ring-0 cursor-pointer"
                    />
                    <span>
                      Deseo recibir actualizaciones de ingeniería web y casos de estudio de JRG Agency (opcional).
                    </span>
                  </label>

                  {errorMsg && (
                    <p className="text-xs text-rose-400 font-medium">{errorMsg}</p>
                  )}
                </div>

                {/* The Luxury Call to Action Lockup */}
                <div className="space-y-4 pt-2">
                  <button
                    type="submit"
                    className="w-full group p-2 pl-6 pr-2.5 rounded-full bg-gradient-to-r from-[#DEDBC8] via-[#C2A88F] to-[#A8896C] hover:brightness-110 text-black font-bold transition-all duration-300 shadow-[0_12px_36px_rgba(194,168,143,0.3)] hover:shadow-[0_16px_48px_rgba(194,168,143,0.5)] flex items-center justify-between cursor-pointer hover:scale-[1.01]"
                  >
                    <div className="flex items-center gap-3">
                      <MessageSquare className="w-5 h-5 text-black" />
                      <span className="font-alata tracking-wider text-xs sm:text-sm uppercase">
                        {status === "success" ? "Generando Enlace con WhatsApp..." : "Iniciar Diagnóstico Inmediato por WhatsApp"}
                      </span>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-[#EFE8E1] group-hover:scale-110 transition-transform shrink-0 shadow-md">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </button>

                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={() => {
                        sounds.playClick();
                        const calMsg = encodeURIComponent(
                          `Hola Jakes, me gustaría agendar una llamada de viabilidad técnica de 15 minutos en Google Meet para mi proyecto de ${selectedService}.`
                        );
                        window.open(`https://wa.me/34688849495?text=${calMsg}`, "_blank");
                      }}
                      className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-[#C2A88F]/30 bg-black/40 hover:bg-[#C2A88F]/10 hover:border-[#C2A88F]/60 text-zinc-300 hover:text-white transition-all text-xs font-mono tracking-wider cursor-pointer shadow-sm"
                    >
                      <Calendar className="w-3.5 h-3.5 text-[#C2A88F]" />
                      <span>¿Prefieres agendar videollamada de 15 min en Google Meet?</span>
                    </button>
                  </div>
                </div>

                {/* First-Layer RGPD Legal Disclosure */}
                <div className="p-3.5 rounded-2xl bg-white/[0.01] border border-white/5 text-[10px] text-zinc-500 space-y-1">
                  <div className="font-mono uppercase text-zinc-400 font-semibold mb-1">
                    Protección de Datos & Confidencialidad
                  </div>
                  <div>&bull; <strong>Responsable:</strong> Jakes Rodriguez &middot; JRG Agency</div>
                  <div>&bull; <strong>Finalidad:</strong> Elaborar el diagnóstico de arquitectura y propuesta técnica.</div>
                  <div>&bull; <strong>Legitimación:</strong> Consentimiento explícito del interesado (Art. 6.1.a RGPD).</div>
                  <div>&bull; <strong>Derechos:</strong> Acceso, rectificación y supresión en jakessrodriguezz@gmail.com.</div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PrismaDesktopContact;
