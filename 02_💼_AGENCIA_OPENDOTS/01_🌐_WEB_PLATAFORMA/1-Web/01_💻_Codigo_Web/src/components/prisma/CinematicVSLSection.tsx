import React, { useState, useRef } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize2, Sparkles, ArrowRight, Zap } from "lucide-react";

interface VSLProps {
  title?: string;
  subtitle?: string;
  videoSrc?: string;
  ctaText?: string;
  ctaLink?: string;
}

export const CinematicVSLSection: React.FC<VSLProps> = ({
  title = "CÓMO AUTOMATIZAMOS LA OPERATIVA DE TU EMPRESA Y MULTIPLICAMOS TUS VENTAS",
  subtitle = "En este vídeo de 3 minutos te mostramos el proceso exacto que aplicamos en negocios reales: desde la captación en WhatsApp hasta la eliminación total de tareas repetitivas.",
  videoSrc = "/videos/hero-bg.mp4",
  ctaText = "Solicitar Auditoría de 15 Minutos Sin Compromiso",
  ctaLink = "https://wa.me/34613448185?text=Hola%20Jakes%2C%20he%20visto%20el%20vídeo%20explicativo%20(VSL)%20y%20quiero%20agendar%20una%20auditoría%20gratuita."
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleFullscreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  return (
    <section className="py-20 md:py-28 px-4 sm:px-6 relative overflow-hidden">
      {/* Ambient background glow */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[500px] bg-[radial-gradient(ellipse_at_center,rgba(194,168,143,0.15)_0%,rgba(0,0,0,0)_70%)] pointer-events-none -z-10"
      />

      <div className="max-w-5xl mx-auto">
        {/* Header Hook */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-[#C2A88F]/30 backdrop-blur-md mb-6 shadow-[0_0_15px_rgba(194,168,143,0.2)]">
            <Sparkles className="w-3.5 h-3.5 text-[#C2A88F]" />
            <span className="font-mono text-[11px] tracking-widest text-[#E1E0CC] uppercase">
              Demostración en Vídeo // Arquitectura JRG Agency
            </span>
          </div>

          <h2 className="font-alata text-2xl sm:text-4xl md:text-5xl font-bold text-white uppercase tracking-wide leading-tight mb-4">
            {title}
          </h2>

          <p className="text-zinc-300 text-sm sm:text-base font-light leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Cinematic VSL Video Frame */}
        <div className="relative rounded-3xl md:rounded-[2.5rem] overflow-hidden bg-zinc-950 border border-[#C2A88F]/40 shadow-[0_25px_70px_rgba(0,0,0,0.85),inset_0_1px_1px_rgba(255,255,255,0.25)] group">
          {/* Top Bar inside player */}
          <div className="absolute top-0 left-0 right-0 p-4 sm:p-6 flex items-center justify-between z-20 pointer-events-none bg-gradient-to-b from-black/80 via-black/30 to-transparent">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
              <span className="font-mono text-[10px] sm:text-xs text-zinc-300 uppercase tracking-widest">
                Vídeo de Demostración Operativa
              </span>
            </div>
            <div className="px-3 py-1 rounded-full bg-black/60 border border-white/10 text-[10px] font-mono text-[#C2A88F] backdrop-blur-md">
              4K UHD · Vídeo Oficial
            </div>
          </div>

          {/* Video Element */}
          <div className="relative aspect-video w-full bg-black flex items-center justify-center cursor-pointer" onClick={togglePlay}>
            <video
              ref={videoRef}
              src={videoSrc}
              loop
              playsInline
              preload="metadata"
              className="w-full h-full object-cover"
              onEnded={() => setIsPlaying(false)}
            />

            {/* Custom Play Button Overlay when paused */}
            {!isPlaying && (
              <div className="absolute inset-0 bg-black/55 backdrop-blur-[2px] flex flex-col items-center justify-center z-10 transition-all group-hover:bg-black/45">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePlay();
                  }}
                  className="w-18 h-18 sm:w-22 sm:h-22 rounded-full bg-[#C2A88F] hover:bg-[#D4BEA7] text-black flex items-center justify-center shadow-[0_0_40px_rgba(194,168,143,0.6)] transition-all hover:scale-110 active:scale-95 group/btn"
                  aria-label="Reproducir vídeo"
                >
                  <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-black translate-x-0.5" />
                </button>
                <span className="mt-4 font-mono text-xs sm:text-sm uppercase tracking-wider text-white font-medium bg-black/60 px-4 py-1.5 rounded-full border border-white/15 backdrop-blur-md">
                  Reproducir demostración con audio
                </span>
              </div>
            )}

            {/* Bottom Controls Bar when playing or hovered */}
            <div className={`absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex items-center justify-between z-20 transition-opacity duration-300 ${isPlaying ? "opacity-0 hover:opacity-100" : "opacity-100"}`}>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePlay();
                  }}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleMute();
                  }}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleFullscreen();
                }}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* VSL Conversion Ribbon below video */}
          <div className="p-6 sm:p-8 bg-zinc-950/95 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-left">
              <div className="flex items-center gap-2 text-xs font-mono text-[#C2A88F] uppercase tracking-wider mb-1">
                <Zap className="w-3.5 h-3.5" /> Sin Permanencias · Resultados Demostrables
              </div>
              <div className="text-sm sm:text-base font-semibold text-white">
                ¿Quieres ver cómo aplicamos esto exactamente en tu negocio?
              </div>
            </div>

            <a
              href={ctaLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#C2A88F] hover:bg-[#D4BEA7] text-black font-semibold text-xs sm:text-sm tracking-wide transition-all shadow-[0_0_20px_rgba(194,168,143,0.4)] hover:scale-105 active:scale-95 shrink-0"
            >
              <span>{ctaText}</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* 3 Metric Badges under VSL */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-10 text-center">
          <div className="p-5 rounded-2xl bg-zinc-950/60 border border-white/10 backdrop-blur-xl">
            <div className="font-mono text-3xl font-bold text-[#C2A88F]">&lt; 2s</div>
            <div className="text-xs text-zinc-300 font-medium mt-1">Tiempo de respuesta a leads en WhatsApp</div>
          </div>
          <div className="p-5 rounded-2xl bg-zinc-950/60 border border-white/10 backdrop-blur-xl">
            <div className="font-mono text-3xl font-bold text-[#C2A88F]">+120h</div>
            <div className="text-xs text-zinc-300 font-medium mt-1">Ahorradas al mes en tareas repetitivas</div>
          </div>
          <div className="p-5 rounded-2xl bg-zinc-950/60 border border-white/10 backdrop-blur-xl">
            <div className="font-mono text-3xl font-bold text-[#C2A88F]">100%</div>
            <div className="text-xs text-zinc-300 font-medium mt-1">Servidores en la Unión Europea y RGPD</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CinematicVSLSection;
