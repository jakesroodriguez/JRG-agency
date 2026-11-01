import React from "react";
import { Link } from "react-router-dom";
import { Zap, Bot, Layout, ArrowRight } from "lucide-react";

interface BottomServiceDockProps {
  currentService: "automatizaciones" | "chatbots" | "desarrollo-web" | "contacto";
}

export const BottomServiceDock: React.FC<BottomServiceDockProps> = ({ currentService }) => {
  const services = [
    {
      id: "automatizaciones",
      title: "Automatizaciones IA",
      shortTitle: "Automatizaciones",
      mobileTitle: "IA",
      path: "/automatizaciones-ia",
      icon: <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />,
    },
    {
      id: "chatbots",
      title: "Chatbots IA",
      shortTitle: "Chatbots",
      mobileTitle: "Chatbots",
      path: "/chatbots-ia",
      icon: <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4" />,
    },
    {
      id: "desarrollo-web",
      title: "Desarrollo Web",
      shortTitle: "Web",
      mobileTitle: "Web",
      path: "/desarrollo-web",
      icon: <Layout className="w-3.5 h-3.5 sm:w-4 sm:h-4" />,
    },
  ];

  return (
    <nav
      aria-label="Navegación rápida de servicios"
      className="fixed bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none select-none max-w-[96vw] sm:max-w-max"
    >
      <div className="pointer-events-auto inline-flex items-center gap-1 sm:gap-2 p-1.5 pl-2.5 sm:pl-3 pr-1.5 sm:pr-2 rounded-full bg-zinc-950/85 hover:bg-black border border-white/15 hover:border-[#C2A88F]/50 backdrop-blur-2xl transition-all duration-300 shadow-[0_20px_50px_rgba(0,0,0,0.9),inset_0_1px_1px_rgba(255,255,255,0.25)]">
        {/* Brand Home Link */}
        <Link
          to="/"
          className="group flex items-center gap-1.5 py-1 px-1.5 sm:px-2 rounded-full hover:bg-white/[0.08] transition-all cursor-pointer"
          title="Volver a la Home Principal de JRG Agency"
        >
          <div className="relative w-6 h-6 sm:w-7 sm:h-7 rounded-full overflow-hidden border border-[#C2A88F]/50 shadow-[0_0_10px_rgba(194,168,143,0.35)] shrink-0 group-hover:scale-105 transition-transform">
            <img
              src="/logoJRG.png"
              alt="Logo JRG Agency"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="hidden md:inline-block font-alata text-xs font-bold tracking-wider text-white group-hover:text-[#EFE8E1]">
            JRG <span className="text-[#C2A88F] font-normal">AGENCY</span>
          </span>
        </Link>

        {/* Divider */}
        <div className="w-px h-4 bg-white/20" />

        {/* Service Switcher Tabs */}
        <div className="flex items-center gap-1 font-mono text-[11px] sm:text-xs">
          {services.map((srv) => {
            const isActive = srv.id === currentService;
            return (
              <Link
                key={srv.id}
                to={srv.path}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full transition-all duration-200 ${
                  isActive
                    ? "bg-white/15 text-white border border-[#C2A88F]/60 shadow-[0_0_12px_rgba(194,168,143,0.3)] font-semibold"
                    : "text-zinc-400 hover:text-white hover:bg-white/[0.08]"
                }`}
              >
                <span className={isActive ? "text-[#C2A88F]" : "text-zinc-500"}>{srv.icon}</span>
                <span className="hidden sm:inline">{srv.shortTitle}</span>
                <span className="sm:hidden">{srv.mobileTitle}</span>
              </Link>
            );
          })}
        </div>

        {/* Divider */}
        <div className="w-px h-4 bg-white/20" />

        {/* Fast-track Contact Action Button */}
        <Link
          to="/contacto"
          className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full bg-[#C2A88F] hover:bg-[#D4BEA7] text-black text-[11px] sm:text-xs font-semibold tracking-wide transition-all shadow-[0_0_15px_rgba(194,168,143,0.4)] hover:scale-105 active:scale-95 shrink-0"
        >
          <span className="hidden sm:inline">Contacto</span>
          <span className="sm:hidden">Auditoría</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </nav>
  );
};

export default BottomServiceDock;
