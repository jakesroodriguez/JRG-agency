import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, CheckCircle2, Star, ShieldCheck, MapPin, ExternalLink } from "lucide-react";

export const PrismaSocialProofSection: React.FC = () => {
  const cases = [
    {
      id: "guretrena",
      client: "Gure Trena",
      location: "Urretxu (Gipuzkoa)",
      sector: "Hostelería / Restauración",
      headline: "Digitalización de carta y automatización de reservas",
      quote: "Los clientes consultan la carta interactiva y reservan mesa directamente por WhatsApp en horas punta. Hemos eliminado las cancelaciones sorpresa y el personal no pierde tiempo colgado al teléfono.",
      metrics: "0 mesas perdidas · 100% cartas digitales",
      url: "https://guretrenaurretxu.com/",
      tag: "Caso Real en Producción",
      rating: 5,
    },
    {
      id: "kortataberna",
      client: "Korta Taberna",
      location: "Zumarraga (Gipuzkoa)",
      sector: "Hostelería Tradicional",
      headline: "Presencia web local y carta digital bilingüe con QR",
      quote: "Teníamos la necesidad de una carta accesible en euskera y castellano para turistas y vecinos. El cambio a JRG nos dio visibilidad inmediata en Google Maps y una imagen mucho más cuidada.",
      metrics: "+40% visibilidad local en Google",
      url: "https://kortataberna.eus/",
      tag: "Caso Real en Producción",
      rating: 5,
    },
    {
      id: "otxaran",
      client: "Otxaran Denda",
      location: "Zumarraga (Gipuzkoa)",
      sector: "Moda & Confección",
      headline: "Catálogo editorial de alta costura interactivo",
      quote: "Buscábamos una web que transmitiera exclusividad y buen gusto. El catálogo permite a nuestras clientas ver las colecciones de temporada con navegación fluida e inmediata.",
      metrics: "Lighthouse 100/100 · Navegación fluida",
      url: "https://otxaran-denda.vercel.app/",
      tag: "Caso Real en Producción",
      rating: 5,
    },
    {
      id: "urkulu",
      client: "Urkulu Móviles",
      location: "Urretxu (Gipuzkoa)",
      sector: "Comercio & Servicio Técnico",
      headline: "Presupuestos express y canal directo de averías",
      quote: "La integración del formulario con WhatsApp permite que cualquier cliente pida presupuesto para su pantalla o batería y reciba respuesta al segundo. La tasa de conversión ha crecido notablemente.",
      metrics: "Presupuestos express en < 5 minutos",
      url: "https://urkulumovilesurretxu.com/",
      tag: "Caso Real en Producción",
      rating: 5,
    },
  ];

  return (
    <section className="py-24 px-4 sm:px-6 relative overflow-hidden border-t border-white/10 bg-zinc-950/40">
      {/* Ambient background glow */}
      <div
        aria-hidden="true"
        className="absolute top-1/3 left-0 w-[500px] h-[400px] bg-[radial-gradient(ellipse_at_center,rgba(194,168,143,0.1)_0%,rgba(0,0,0,0)_70%)] pointer-events-none -z-10"
      />

      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-[#C2A88F]/30 text-xs font-mono text-[#E1E0CC] mb-4">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C2A88F]" />
              <span>Pruebas Sociales y Casos Reales // Gipuzkoa & España</span>
            </div>
            <h2 className="font-alata text-3xl sm:text-5xl font-bold text-white uppercase tracking-wide">
              Resultados Verificados con Clientes Reales
            </h2>
            <p className="text-zinc-300 text-sm sm:text-base mt-3 font-light leading-relaxed">
              No vendemos teorías vacías. Implementamos tecnología en negocios reales que necesitan atender mejor, ahorrar horas de trabajo y facturar más.
            </p>
          </div>

          <Link
            to="/myworks"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/10 text-xs font-mono tracking-wider transition-all self-start md:self-auto shrink-0"
          >
            <span>Ver todo el portfolio</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#C2A88F]" />
          </Link>
        </div>

        {/* 4 Bento Social Proof Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cases.map((item) => (
            <div
              key={item.id}
              className="p-8 sm:p-10 rounded-3xl bg-zinc-950/70 border border-white/10 backdrop-blur-2xl relative overflow-hidden group hover:border-[#C2A88F]/40 transition-all duration-300 shadow-[0_15px_40px_rgba(0,0,0,0.6)] flex flex-col justify-between"
            >
              <div>
                {/* Top Row: Client badge, location & 5 stars */}
                <div className="flex items-center justify-between gap-2 mb-6 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="font-alata text-lg font-bold text-white tracking-wide">
                      {item.client}
                    </span>
                    <span className="text-zinc-600">·</span>
                    <span className="text-xs font-mono text-zinc-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#C2A88F]" /> {item.location}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-[#C2A88F]">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#C2A88F]" />
                    ))}
                  </div>
                </div>

                <div className="text-xs font-mono text-[#C2A88F] uppercase tracking-wider mb-2 font-medium">
                  {item.sector}
                </div>

                <h3 className="font-alata text-xl font-bold text-white mb-3">
                  {item.headline}
                </h3>

                <blockquote className="text-xs sm:text-sm text-zinc-300 font-light leading-relaxed mb-6 italic border-l-2 border-[#C2A88F]/40 pl-3">
                  "{item.quote}"
                </blockquote>
              </div>

              {/* Bottom Row: Key metric pill & Live link */}
              <div className="pt-6 border-t border-white/10 flex items-center justify-between gap-4 flex-wrap">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-[11px] font-mono text-emerald-300 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{item.metrics}</span>
                </div>

                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-300 hover:text-[#C2A88F] transition-colors group/link"
                >
                  <span>Visitar web</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PrismaSocialProofSection;
