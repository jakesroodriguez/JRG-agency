import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, MessageSquare, Menu, X, Sparkles } from "lucide-react";

interface ServiceIslandHeaderProps {
  currentService: "automatizaciones" | "chatbots" | "desarrollo-web";
}

export const ServiceIslandHeader: React.FC<ServiceIslandHeaderProps> = ({ currentService }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const services = [
    {
      id: "automatizaciones",
      title: "Automatizaciones IA",
      shortTitle: "Automatizaciones",
      path: "/automatizaciones-ia",
    },
    {
      id: "chatbots",
      title: "Chatbots IA",
      shortTitle: "Chatbots",
      path: "/chatbots-ia",
    },
    {
      id: "desarrollo-web",
      title: "Desarrollo Web",
      shortTitle: "Web",
      path: "/desarrollo-web",
    },
  ];

  return (
    <>
      <header className="fixed top-3 sm:top-5 left-0 right-0 z-50 flex items-center justify-center px-3 sm:px-4 pointer-events-none select-none">
        <div className="pointer-events-auto inline-flex items-center gap-1.5 sm:gap-3 p-1.5 pl-2.5 sm:pl-3.5 pr-1.5 sm:pr-2.5 rounded-full bg-black/60 hover:bg-black/75 border border-white/10 hover:border-[#C2A88F]/40 backdrop-blur-2xl transition-all duration-300 shadow-[0_12px_40px_rgba(0,0,0,0.65)]">
          {/* 1. Logo & Brand */}
          <Link
            to="/"
            className="group flex items-center gap-2 py-1 px-1.5 sm:px-2 rounded-full hover:bg-white/[0.05] transition-all cursor-pointer"
            title="Volver a la Home Principal de JRG Agency"
          >
            <div className="relative w-7 h-7 rounded-full overflow-hidden border border-[#C2A88F]/50 shadow-[0_0_12px_rgba(194,168,143,0.35)] shrink-0 group-hover:scale-105 transition-transform">
              <img
                src="/logoJRG.png"
                alt="Logo JRG Agency"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-alata text-xs sm:text-sm font-bold tracking-wider text-white group-hover:text-[#EFE8E1] flex items-center gap-1">
              JRG <span className="text-[#C2A88F] font-normal">AGENCY</span>
            </span>
          </Link>

          {/* Divider */}
          <div className="w-px h-4 bg-white/15 hidden md:block" />

          {/* 2. Desktop Navigation Pills */}
          <nav className="hidden md:flex items-center gap-1 text-[11px] font-mono tracking-wider">
            {services.map((srv) => {
              const isActive = srv.id === currentService;
              return (
                <Link
                  key={srv.id}
                  to={srv.path}
                  className={`px-3 py-1.5 rounded-full transition-all ${
                    isActive
                      ? "bg-white/15 text-white border border-[#C2A88F]/40 shadow-[0_0_12px_rgba(194,168,143,0.2)] font-semibold"
                      : "text-zinc-400 hover:text-white hover:bg-white/[0.06]"
                  }`}
                >
                  {srv.shortTitle}
                </Link>
              );
            })}

            <span className="text-zinc-600 px-1">·</span>

            <Link
              to="/myworks"
              className="px-2.5 py-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors"
            >
              Portfolio
            </Link>
          </nav>

          {/* Divider */}
          <div className="w-px h-4 bg-white/15" />

          {/* 3. Action CTA Button */}
          <a
            href="https://wa.me/34613448185?text=Hola%20Jakes%2C%20quiero%20informaci%C3%B3n%20sobre%20los%20servicios%20de%20JRG%20Agency."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full bg-[#C2A88F] hover:bg-[#D4BEA7] text-black text-[11px] sm:text-xs font-semibold tracking-wide transition-all shadow-[0_0_16px_rgba(194,168,143,0.35)] hover:scale-105 active:scale-95"
          >
            <span>Auditoría</span>
            <ArrowRight className="w-3 h-3" />
          </a>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-full text-zinc-300 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Abrir menú de navegación"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/80 backdrop-blur-2xl md:hidden flex flex-col justify-center px-6 animate-fadeIn">
          <div className="w-full max-w-sm mx-auto bg-zinc-950/90 border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="font-alata text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#C2A88F]" /> Servicios JRG Agency
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-full text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col gap-2">
              {services.map((srv) => {
                const isActive = srv.id === currentService;
                return (
                  <Link
                    key={srv.id}
                    to={srv.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between p-3 rounded-2xl transition-all ${
                      isActive
                        ? "bg-white/15 text-white border border-[#C2A88F]/40"
                        : "bg-white/[0.03] text-zinc-300 hover:bg-white/[0.08]"
                    }`}
                  >
                    <span className="text-sm font-medium">{srv.title}</span>
                    <ArrowRight className="w-4 h-4 text-[#C2A88F]" />
                  </Link>
                );
              })}

              <Link
                to="/myworks"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.03] text-zinc-300 hover:bg-white/[0.08] transition-all"
              >
                <span className="text-sm font-medium">Ver Casos de Éxito</span>
                <ArrowRight className="w-4 h-4 text-zinc-500" />
              </Link>
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.03] text-zinc-300 hover:bg-white/[0.08] transition-all"
              >
                <span className="text-sm font-medium">Volver a la Home</span>
                <ArrowRight className="w-4 h-4 text-zinc-500" />
              </Link>
            </div>

            <a
              href="https://wa.me/34613448185?text=Hola%20Jakes%2C%20quiero%20informaci%C3%B3n%20sobre%20los%20servicios%20de%20JRG%20Agency."
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 w-full py-3 rounded-2xl bg-[#C2A88F] text-black font-semibold text-center text-sm flex items-center justify-center gap-2 shadow-lg"
            >
              <MessageSquare className="w-4 h-4" /> Hablar por WhatsApp Directo
            </a>
          </div>
        </div>
      )}
    </>
  );
};

export default ServiceIslandHeader;
