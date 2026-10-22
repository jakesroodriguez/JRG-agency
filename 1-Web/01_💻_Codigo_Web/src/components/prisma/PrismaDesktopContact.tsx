import React, { useState } from "react";
import { MessageSquare, Mail, Phone, MapPin, ArrowRight, CheckCircle2, Clock, Sparkles } from "lucide-react";
import WordsPullUpMultiStyle, { TextSegment } from "./WordsPullUpMultiStyle";
import ThickClearGlass from "./ThickClearGlass";

export const PrismaDesktopContact: React.FC = () => {
  const [selectedService, setSelectedService] = useState("Web 3D & Alto Impacto");
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "success">("idle");

  const services = [
    "Web 3D & Alto Impacto",
    "Plataforma Web / E-Commerce",
    "Sistema de Agentes IA",
    "Rediseño & Optimización",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Pre-build WhatsApp text
    const text = encodeURIComponent(
      `Hola Jakes, soy ${formData.name || "un cliente"}. Me interesa un proyecto de ${selectedService}. Email: ${formData.email}. Mensaje: ${formData.message}`
    );
    setStatus("success");
    // Open WhatsApp directly
    setTimeout(() => {
      window.open(`https://wa.me/34688849495?text=${text}`, "_blank");
    }, 600);
  };

  const line1Segments: TextSegment[] = [
    {
      text: "¿Listo para destacar",
      className: "text-[#E1E0CC] font-normal",
    },
    {
      text: "en el mundo digital?",
      className: "italic font-serif text-[#E1E0CC]",
    },
  ];

  const line2Segments: TextSegment[] = [
    {
      text: "Hablemos de tu proyecto. Respuesta garantizada en menos de 24 horas.",
      className: "text-gray-400 font-normal",
    },
  ];

  return (
    <section className="bg-black py-24 md:py-36 px-4 md:px-8 relative select-none" id="contact">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 mb-4">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold">
              DISPONIBLE Q4 2026 // 2 CUPOS ABIERTOS
            </span>
          </div>
          <div className="text-2xl sm:text-3xl md:text-5xl font-medium tracking-tight leading-tight mb-2">
            <WordsPullUpMultiStyle segments={line1Segments} />
          </div>
          <div className="text-xl sm:text-2xl md:text-3xl font-normal text-gray-400">
            <WordsPullUpMultiStyle segments={line2Segments} delay={0.15} />
          </div>
        </div>

        {/* Contact Console Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left 5 Columns: Direct WhatsApp & Studio Info */}
          <div className="lg:col-span-5 bg-[#121212] rounded-3xl p-8 md:p-10 border border-white/10 shadow-2xl flex flex-col justify-between h-full">
            <div>
              <h3 className="text-2xl font-bold text-[#E1E0CC] mb-3">
                Canal Directo de Fundador
              </h3>
              <p className="text-xs sm:text-sm text-gray-400 font-light leading-relaxed mb-8">
                Sin intermediarios ni comerciales. Hablas directamente con quien va a diseñar y programar tu web de principio a fin.
              </p>

              {/* Fast WhatsApp CTA Card */}
              <div className="p-6 rounded-2xl bg-emerald-950/30 border border-emerald-500/20 mb-8">
                <div className="flex items-center gap-2.5 text-emerald-400 text-xs font-mono font-semibold mb-2">
                  <Clock className="w-4 h-4" />
                  <span>RESPUESTA MEDIA: &lt; 30 MINUTOS</span>
                </div>
                <div className="text-sm font-medium text-white mb-4">
                  ¿Prefieres una conversación rápida por WhatsApp?
                </div>
                <a
                  href="https://wa.me/34688849495?text=Hola%20Jakes,%20quiero%20hablar%20sobre%20un%20proyecto%20para%20mi%20negocio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 shadow-lg"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Abrir chat de WhatsApp</span>
                </a>
              </div>

              {/* Direct channels */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-xs sm:text-sm text-gray-300">
                  <div className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-[#DEDBC8]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-500 font-mono">CORREO ELECTRÓNICO</div>
                    <a href="mailto:jakessrodriguezz@gmail.com" className="hover:text-white transition-colors">
                      jakessrodriguezz@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs sm:text-sm text-gray-300">
                  <div className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-[#DEDBC8]">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-500 font-mono">TELÉFONO / WHATSAPP</div>
                    <a href="tel:+34688849495" className="hover:text-white transition-colors">
                      +34 688 84 94 95
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs sm:text-sm text-gray-300">
                  <div className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-[#DEDBC8]">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-500 font-mono">UBICACIÓN</div>
                    <span>Urretxu, País Vasco &middot; Cobertura Global</span>
                  </div>
                </div>
              </div>

              {/* Interactive 3D Studio Seal */}
              <div className="mt-8 pt-6 border-t border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#DEDBC8]" />
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#DEDBC8] font-semibold">
                      SELLO DE AUTOR // 3D LAB
                    </span>
                  </div>
                  <span className="text-[10px] font-mono tracking-widest text-emerald-400 font-medium">
                    RAYMARCHING
                  </span>
                </div>
                <div className="relative w-full h-[200px] sm:h-[220px] rounded-2xl overflow-hidden border border-white/10 bg-[#070707] shadow-inner group">
                  <ThickClearGlass
                    text="JRG AGENCY"
                    baseColor="#DEDBC8"
                    advanced={{
                      coilRadius: 40,
                      tubeRadius: 16,
                      pitch: 72,
                      startAngle: 200,
                      turnMs: 14000,
                      cameraDistance: 320,
                      letterHeight: 46,
                      letterDepth: 30,
                      faceColor: "#DEDBC8",
                      edgeColor: "#E5B869",
                      fringeColor: "#C5A059",
                      interiorColor: "#050505",
                      sheenColor: "#F5F2E4",
                    }}
                  />
                  <div className="absolute bottom-2 left-3 right-3 pointer-events-none flex items-center justify-between text-[9px] font-mono tracking-widest uppercase text-white/50">
                    <span className="text-[#DEDBC8]">JRG &middot; 2026</span>
                    <span className="text-gray-400 hidden sm:inline">PULSA Y ARRASTRA</span>
                    <span className="text-emerald-400/90 font-bold">INTERACTIVO</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right 7 Columns: Interactive Inquiry Form */}
          <div className="lg:col-span-7 bg-[#121212] rounded-3xl p-8 md:p-10 border border-white/10 shadow-2xl">
            <h3 className="text-xl sm:text-2xl font-bold text-[#E1E0CC] mb-2">
              Configura tu Consulta
            </h3>
            <p className="text-xs sm:text-sm text-gray-400 font-light mb-6">
              Selecciona el tipo de solución que buscas y te prepararemos un presupuesto preliminar sin compromiso.
            </p>

            {/* Service selector chips */}
            <div className="mb-6">
              <label className="text-[11px] font-mono uppercase tracking-wider text-gray-400 block mb-3">
                1. ¿Qué tipo de proyecto necesitas?
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {services.map((srv, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedService(srv)}
                    className={`p-3 rounded-xl text-xs font-medium text-left transition-all duration-200 cursor-pointer ${
                      selectedService === srv
                        ? "bg-[#DEDBC8] text-black font-semibold shadow-md"
                        : "bg-white/[0.03] border border-white/5 text-gray-300 hover:bg-white/[0.08]"
                    }`}
                  >
                    {srv}
                  </button>
                ))}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[11px] font-mono uppercase tracking-wider text-gray-400 block mb-1.5">
                  2. Tu nombre o empresa
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Martin Zubeldia / Restaurante..."
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/10 text-white placeholder-gray-500 text-xs sm:text-sm focus:outline-none focus:border-[#DEDBC8] transition-colors"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono uppercase tracking-wider text-gray-400 block mb-1.5">
                  3. Correo electrónico de contacto
                </label>
                <input
                  type="email"
                  required
                  placeholder="nombre@empresa.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/10 text-white placeholder-gray-500 text-xs sm:text-sm focus:outline-none focus:border-[#DEDBC8] transition-colors"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono uppercase tracking-wider text-gray-400 block mb-1.5">
                  4. Cuéntanos brevemente sobre la web
                </label>
                <textarea
                  rows={3}
                  placeholder="¿Cuál es el objetivo principal de la web? ¿Tienes ya una fecha límite estimada?"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/10 text-white placeholder-gray-500 text-xs sm:text-sm focus:outline-none focus:border-[#DEDBC8] transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-[#DEDBC8] hover:bg-white text-black font-bold text-sm tracking-tight transition-all duration-300 shadow-xl flex items-center justify-center gap-2 cursor-pointer group mt-4"
              >
                {status === "success" ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Conectando con WhatsApp...</span>
                  </>
                ) : (
                  <>
                    <span>Enviar consulta de proyecto</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PrismaDesktopContact;
