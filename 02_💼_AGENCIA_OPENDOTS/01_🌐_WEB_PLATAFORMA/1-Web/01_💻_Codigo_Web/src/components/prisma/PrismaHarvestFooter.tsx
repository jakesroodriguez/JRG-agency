import React from "react";
import { Link } from "react-router-dom";
import { ArrowUp, Cookie } from "lucide-react";
import { config } from "../../config";

export const PrismaHarvestFooter: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleOpenCookieSettings = () => {
    window.dispatchEvent(new CustomEvent("open-cookie-settings"));
  };

  const handleOpenAssistant = () => {
    window.dispatchEvent(new CustomEvent("open-legal-assistant"));
  };

  return (
    <footer className="w-full bg-[#070709] border-t border-white/[0.06] text-zinc-300 font-sans select-none z-20">
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-8 pb-28 md:pb-8">
        {/* ─── LÍNEA 1: MARCA + ESTADO EN VIVO Y CONTACTO DIRECTO ─── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.05]">
          {/* Izquierda: Identidad y disponibilidad */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden border border-[#C2A88F]/40 shadow-sm shrink-0">
              <img
                src="/logoJRG.png"
                alt="JRG Agency"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-sm sm:text-base font-bold tracking-tight text-white">
              JRG AGENCY
            </span>
            <span className="text-zinc-600">·</span>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/[0.03] border border-white/[0.06] text-[11px] font-mono text-zinc-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Disponible Q4 2026</span>
            </div>
          </div>

          {/* Derecha: Canales directos y Volver arriba */}
          <div className="flex items-center gap-4 text-xs text-zinc-400 font-medium">
            <a
              href={`mailto:${config.social.email}`}
              className="hover:text-[#C2A88F] transition-colors"
            >
              Email
            </a>
            <span className="text-zinc-700">·</span>
            <a
              href={config.social.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#C2A88F] transition-colors"
            >
              WhatsApp
            </a>
            <span className="text-zinc-700">·</span>
            <button
              type="button"
              onClick={scrollToTop}
              className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer text-zinc-400"
              title="Volver arriba"
              aria-label="Volver arriba"
            >
              <span>Subir</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* ─── LÍNEA INTERMEDIA: SERVICIOS Y CLÚSTER SEO ─── */}
        <div className="py-4 border-b border-white/[0.05] flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-500">
            Servicios Especializados:
          </span>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-zinc-400">
            <Link
              to="/automatizaciones-ia"
              className="hover:text-white transition-colors flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Automatizaciones con IA</span>
            </Link>
            <span className="text-zinc-700">·</span>
            <Link
              to="/chatbots-ia"
              className="hover:text-white transition-colors flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span>Chatbots para Empresas</span>
            </Link>
            <span className="text-zinc-700">·</span>
            <Link
              to="/desarrollo-web"
              className="hover:text-white transition-colors flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#C2A88F]" />
              <span>Desarrollo Web Profesional</span>
            </Link>
            <span className="text-zinc-700">·</span>
            <Link
              to="/myworks"
              className="hover:text-white transition-colors"
            >
              Portfolio
            </Link>
          </div>
        </div>

        {/* ─── LÍNEA 2: COPYRIGHT Y CUMPLIMIENTO LEGAL & IA ─── */}
        <div className="pt-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-zinc-500">
          <div className="flex items-center gap-2 flex-wrap">
            <span>
              &copy; {new Date().getFullYear()} JRG Agency &middot; Urretxu, Gipuzkoa
            </span>
            <span className="text-zinc-700 hidden sm:inline">&middot;</span>
            <span className="text-[10px] font-mono text-zinc-600 hidden sm:inline">
              SSL 256-bit &middot; Servidores UE
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1.5 text-[11px] text-zinc-400">
            <Link
              to="/aviso-legal"
              className="hover:text-[#C2A88F] transition-colors"
            >
              Aviso Legal
            </Link>
            <span className="text-zinc-700">&middot;</span>
            <Link
              to="/privacidad"
              className="hover:text-[#C2A88F] transition-colors"
            >
              Privacidad
            </Link>
            <span className="text-zinc-700">&middot;</span>
            <Link
              to="/cookies"
              className="hover:text-[#C2A88F] transition-colors"
            >
              Cookies
            </Link>
            <span className="text-zinc-700">&middot;</span>
            <button
              type="button"
              onClick={handleOpenCookieSettings}
              className="hover:text-[#C2A88F] transition-colors cursor-pointer inline-flex items-center gap-1 text-[11px]"
            >
              <Cookie className="w-3 h-3 text-zinc-500" />
              <span>Ajustes</span>
            </button>
            <span className="text-zinc-700">&middot;</span>
            <Link
              to="/terminos"
              className="hover:text-[#C2A88F] transition-colors"
            >
              Términos
            </Link>
            <span className="text-zinc-700">&middot;</span>
            <Link
              to="/accesibilidad"
              className="hover:text-[#C2A88F] transition-colors"
            >
              Accesibilidad
            </Link>
            <span className="text-zinc-700">&middot;</span>
            <button
              type="button"
              onClick={handleOpenAssistant}
              className="text-zinc-300 hover:text-white transition-colors cursor-pointer inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08]"
              title="Abrir Asistente Legal y de Privacidad IA"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Asistente IA</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default PrismaHarvestFooter;
