import React, { useState } from "react";
import { ChevronDown, HelpCircle, MessageSquare } from "lucide-react";

export interface FAQItem {
  q: string;
  a: string;
}

interface LuxuryFAQAccordionProps {
  items: FAQItem[];
  title?: string;
  badge?: string;
  subtitle?: string;
}

export const LuxuryFAQAccordion: React.FC<LuxuryFAQAccordionProps> = ({
  items,
  title = "Preguntas Frecuentes",
  badge = "Resolución de Dudas",
  subtitle = "Todo lo que necesitas saber antes de empezar, explicado con total transparencia técnica."
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleItem = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-20 md:py-28 px-4 sm:px-6 relative bg-black/60 border-t border-white/10 overflow-hidden">
      {/* Ambient background glow */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[radial-gradient(ellipse_at_center,rgba(194,168,143,0.08)_0%,rgba(0,0,0,0)_70%)] pointer-events-none -z-10"
      />

      <div className="max-w-4xl mx-auto">
        {/* Header Hook */}
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-[#C2A88F]/30 backdrop-blur-md mb-4 shadow-[0_0_15px_rgba(194,168,143,0.15)]">
            <HelpCircle className="w-3.5 h-3.5 text-[#C2A88F]" />
            <span className="font-mono text-[11px] tracking-widest text-[#E1E0CC] uppercase">
              {badge}
            </span>
          </div>

          <h2 className="font-alata text-2xl sm:text-4xl font-bold text-white uppercase tracking-wide leading-tight">
            {title}
          </h2>

          <p className="text-zinc-400 text-xs sm:text-sm mt-3 font-light leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3.5 sm:space-y-4">
          {items.map((item, idx) => {
            const isOpen = openIndex === idx;
            const numStr = (idx + 1).toString().padStart(2, "0");

            return (
              <div
                key={idx}
                className={`group rounded-2xl sm:rounded-3xl transition-all duration-300 overflow-hidden border ${
                  isOpen
                    ? "bg-zinc-950/90 border-[#C2A88F]/50 shadow-[0_10px_30px_rgba(0,0,0,0.8),0_0_20px_rgba(194,168,143,0.15)] ring-1 ring-[#C2A88F]/30"
                    : "bg-zinc-950/60 hover:bg-zinc-900/80 border-white/10 hover:border-white/20"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleItem(idx)}
                  className="w-full px-5 sm:px-7 py-4 sm:py-5 flex items-center justify-between text-left cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C2A88F]"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-3.5 sm:gap-4 pr-3">
                    <span
                      className={`font-mono text-xs sm:text-sm font-bold tracking-wider shrink-0 transition-colors ${
                        isOpen ? "text-[#C2A88F]" : "text-zinc-500 group-hover:text-zinc-400"
                      }`}
                    >
                      {numStr}
                    </span>
                    <span
                      className={`font-alata text-sm sm:text-base tracking-wide transition-colors ${
                        isOpen ? "text-white font-semibold" : "text-zinc-200 group-hover:text-white"
                      }`}
                    >
                      {item.q}
                    </span>
                  </div>

                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 border transition-all duration-300 ${
                      isOpen
                        ? "bg-[#C2A88F] text-black border-[#C2A88F] rotate-180 shadow-[0_0_12px_rgba(194,168,143,0.4)]"
                        : "bg-white/[0.04] text-zinc-400 border-white/10 group-hover:border-[#C2A88F]/40 group-hover:text-white"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-7 pb-5 sm:pb-6 pt-1 text-xs sm:text-sm text-zinc-300 leading-relaxed font-light border-t border-white/[0.06] bg-black/40">
                    <p className="text-zinc-300 pl-7 sm:pl-8 border-l border-[#C2A88F]/40">
                      {item.a}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* WhatsApp Fast Question Hook */}
        <div className="mt-10 p-5 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <MessageSquare className="w-4 h-4" />
            </div>
            <p className="text-xs text-zinc-300 font-light">
              ¿Tienes una duda técnica específica sobre tu caso? Te respondemos directamente en menos de 15 minutos.
            </p>
          </div>
          <a
            href="https://wa.me/34613448185?text=Hola%20JRG%20Agency%2C%20tengo%20una%20duda%20antes%20de%20empezar%3A"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 text-xs font-mono tracking-wider transition-all hover:scale-105 active:scale-95 shrink-0"
          >
            <span>Preguntar en WhatsApp</span>
            <span className="text-emerald-400">→</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default LuxuryFAQAccordion;
