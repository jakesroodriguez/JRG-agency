import React, { useState } from "react";
import { Bot, CheckCheck, ArrowRight, Sparkles, UtensilsCrossed, ShoppingBag, Stethoscope } from "lucide-react";

interface NicheChat {
  id: string;
  name: string;
  icon: React.ReactNode;
  businessName: string;
  badge: string;
  initialMessage: string;
  options: {
    question: string;
    answer: string;
    delay: string;
  }[];
}

const NICHES: NicheChat[] = [
  {
    id: "hosteleria",
    name: "Hostelería & Pintxos",
    icon: <UtensilsCrossed className="w-4 h-4 text-[#C2A88F]" />,
    businessName: "Gure Trena · Zumarraga",
    badge: "Reservas & Carta Digital",
    initialMessage: "¡Hola! Bienvenido a Gure Trena. 🍽️ ¿Te gustaría reservar mesa para hoy o prefieres consultar nuestra carta de raciones y pintxos?",
    options: [
      {
        question: "¿Tenéis mesa para 4 esta noche a las 21:30?",
        answer: "¡Sí! Tenemos disponibilidad en comedor interior a las 21:30 para 4 personas. ¿A qué nombre y teléfono formalizamos la reserva?",
        delay: "1,1s"
      },
      {
        question: "¿Tenéis opciones sin gluten o para alérgicos?",
        answer: "Por supuesto. Disponemos de pan sin gluten y adaptamos más del 80% de nuestras raciones. Indícanoslo al confirmar y la cocina estará avisada.",
        delay: "0,8s"
      },
      {
        question: "¿A qué hora cerráis la cocina hoy?",
        answer: "Nuestra cocina está abierta de 13:00 a 16:00 y de 20:00 a 23:30. ¡Te esperamos!",
        delay: "0,7s"
      }
    ]
  },
  {
    id: "comercio",
    name: "Comercio & Retail",
    icon: <ShoppingBag className="w-4 h-4 text-emerald-400" />,
    businessName: "Otxaran Denda · Urretxu",
    badge: "Catálogo & Envíos",
    initialMessage: "¡Hola! En Otxaran Denda estamos para ayudarte. 🛍️ ¿Buscas algún producto en concreto o quieres consultar disponibilidad de stock?",
    options: [
      {
        question: "¿Tenéis en stock el último modelo que publicasteis?",
        answer: "¡Hola! Sí, nos quedan 2 unidades disponibles en tienda física. Si quieres te reservamos una hasta las 20:00 para que pases a recogerla.",
        delay: "1,2s"
      },
      {
        question: "¿Hacéis envíos a toda la comarca de Goierri?",
        answer: "Sí, realizamos entregas en el mismo día para Zumarraga, Urretxu, Legazpi y comarca por compras superiores a 30 €.",
        delay: "0,9s"
      },
      {
        question: "¿Cuál es vuestro horario de apertura esta semana?",
        answer: "Abrimos de lunes a viernes de 09:30 a 13:00 y de 16:30 a 20:00. Sábados por la mañana de 10:00 a 13:30.",
        delay: "0,6s"
      }
    ]
  },
  {
    id: "clinica",
    name: "Clínicas & Servicios",
    icon: <Stethoscope className="w-4 h-4 text-sky-400" />,
    businessName: "Centro de Fisioterapia & Salud",
    badge: "Cita Previa 24/7",
    initialMessage: "¡Hola! Asistente médico de citas previas. 🩺 ¿En qué podemos ayudarte hoy?",
    options: [
      {
        question: "Necesito una cita urgente para fisioterapia esta semana.",
        answer: "Tenemos hueco disponible mañana a las 16:30 y el jueves a las 11:00 con el especialista. ¿Cuál de los dos horarios te viene mejor?",
        delay: "1,0s"
      },
      {
        question: "¿Trabajáis con seguros privados de salud?",
        answer: "Trabajamos con las principales aseguradoras (Sanitas, Adeslas, Asisa). Te emitimos la factura desglosada para reembolso inmediato.",
        delay: "0,8s"
      },
      {
        question: "¿Dónde está ubicada la clínica exactamente?",
        answer: "Estamos en C/ Iparragirre 14, bajo, con fácil aparcamiento gratuito a 50 metros. Te envío el enlace a Google Maps.",
        delay: "0,7s"
      }
    ]
  }
];

export const InteractivePhoneMockup: React.FC = () => {
  const [activeNiche, setActiveNiche] = useState<string>("hosteleria");
  const [activeChatIndex, setActiveChatIndex] = useState<number>(0);
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const current = NICHES.find((n) => n.id === activeNiche) || NICHES[0];
  const selectedOption = current.options[activeChatIndex];

  const handleSelectOption = (idx: number) => {
    setActiveChatIndex(idx);
    setIsTyping(true);
    setTimeout(() => setIsTyping(false), 600);
  };

  return (
    <section className="py-20 md:py-28 px-4 sm:px-6 relative bg-zinc-950/70 border-t border-white/10 overflow-hidden">
      {/* Background glow */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[600px] h-[400px] bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.1)_0%,rgba(0,0,0,0)_70%)] pointer-events-none -z-10"
      />

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-[#C2A88F]/30 backdrop-blur-md mb-4 shadow-[0_0_15px_rgba(194,168,143,0.15)]">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-mono text-[11px] tracking-widest text-[#E1E0CC] uppercase">
              Consola Interactiva 3D // Prueba en Vivo
            </span>
          </div>

          <h2 className="font-alata text-2xl sm:text-4xl font-bold text-white uppercase tracking-wide">
            Pon a prueba la agilidad de respuesta
          </h2>

          <p className="text-zinc-400 text-xs sm:text-sm mt-3 font-light leading-relaxed">
            Cambia de sector de negocio y haz una pregunta para experimentar la naturalidad y rapidez con la que atiende a tus clientes reales.
          </p>
        </div>

        {/* Niche Selector Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10">
          {NICHES.map((niche) => {
            const isActive = niche.id === activeNiche;
            return (
              <button
                key={niche.id}
                type="button"
                onClick={() => {
                  setActiveNiche(niche.id);
                  setActiveChatIndex(0);
                  setIsTyping(false);
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-mono transition-all cursor-pointer ${
                  isActive
                    ? "bg-emerald-500 text-black font-semibold shadow-[0_0_15px_rgba(16,185,129,0.35)] scale-105"
                    : "bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 border border-white/10"
                }`}
              >
                <span>{niche.icon}</span>
                <span>{niche.name}</span>
              </button>
            );
          })}
        </div>

        {/* 3D Smartphone Container */}
        <div className="max-w-xl mx-auto rounded-[2.5rem] bg-gradient-to-b from-zinc-900 to-black p-3.5 sm:p-5 border border-white/15 shadow-[0_30px_80px_rgba(0,0,0,0.9),inset_0_1px_1px_rgba(255,255,255,0.2)] relative">
          {/* Phone Speaker Notch */}
          <div className="w-24 h-4 bg-black rounded-full mx-auto mb-3 flex items-center justify-center">
            <div className="w-10 h-1 bg-zinc-800 rounded-full" />
          </div>

          {/* Screen Glass Container */}
          <div className="rounded-[2rem] bg-zinc-950 border border-white/10 p-4 sm:p-6 overflow-hidden">
            {/* Header chat mock */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-black/60 border border-emerald-400/50 shadow-[0_0_12px_rgba(16,185,129,0.35)] flex items-center justify-center text-emerald-400 shrink-0">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-alata font-bold text-white tracking-wide">
                    {current.businessName}
                  </div>
                  <div className="text-[10px] font-mono text-emerald-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    En línea · Latencia {selectedOption.delay}
                  </div>
                </div>
              </div>
              <div className="px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[10px] font-mono text-zinc-400">
                {current.badge}
              </div>
            </div>

            {/* Messages Thread */}
            <div className="space-y-3.5 text-xs leading-relaxed font-light min-h-[220px]">
              {/* Bot Welcome */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-zinc-200 max-w-[90%] shadow-sm">
                {current.initialMessage}
              </div>

              {/* Customer Prompt */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-[#C2A88F] text-black ml-auto max-w-[85%] text-right font-medium shadow-md">
                {selectedOption.question}
              </div>

              {/* Bot Response or Typing indicator */}
              {isTyping ? (
                <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-zinc-400 inline-flex items-center gap-1.5 text-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.4s]" />
                  <span className="ml-1 text-[11px] font-mono text-zinc-500">Generando respuesta en 0,8s...</span>
                </div>
              ) : (
                <div className="p-3.5 sm:p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 max-w-[92%] shadow-sm">
                  <div className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 mb-1">
                    <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Respuesta IA Oficial · {selectedOption.delay}</span>
                  </div>
                  {selectedOption.answer}
                </div>
              )}
            </div>

            {/* Quick Question Picker Buttons */}
            <div className="mt-6 pt-4 border-t border-white/10">
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block mb-2.5">
                👉 Pulsa una pregunta para probar:
              </span>
              <div className="space-y-2">
                {current.options.map((opt, oIdx) => {
                  const isSelected = activeChatIndex === oIdx;
                  return (
                    <button
                      key={oIdx}
                      type="button"
                      onClick={() => handleSelectOption(oIdx)}
                      className={`w-full text-left p-2.5 sm:p-3 rounded-xl text-xs font-mono transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? "bg-white/15 text-white border border-[#C2A88F]/50 shadow-sm font-semibold"
                          : "bg-white/[0.02] hover:bg-white/[0.06] text-zinc-300 border border-white/5"
                      }`}
                    >
                      <span className="truncate pr-2">{opt.question}</span>
                      <span className="text-[10px] text-zinc-500 shrink-0 font-light">
                        {opt.delay}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Action WhatsApp Direct Demo */}
        <div className="mt-8 text-center">
          <a
            href="https://wa.me/34613448185?text=Hola%20JRG%20Agency%2C%20quiero%20probar%20un%20chatbot%20con%20los%20datos%20de%20mi%20negocio."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs font-mono tracking-wider transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95"
          >
            <span>Pedir Demo para mi Negocio por WhatsApp</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default InteractivePhoneMockup;
