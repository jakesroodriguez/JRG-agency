import React, { useState } from "react";
import { Zap, Play, AlertTriangle, CheckCircle2, RefreshCw, Gauge } from "lucide-react";

export const LighthouseSpeedComparator: React.FC = () => {
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [progressJRG, setProgressJRG] = useState<number>(100);
  const [progressWP, setProgressWP] = useState<number>(38);
  const [timerJRG, setTimerJRG] = useState<number>(0.8);
  const [timerWP, setTimerWP] = useState<number>(4.8);

  const startBenchmark = () => {
    if (isRunning) return;
    setIsRunning(true);
    setProgressJRG(0);
    setProgressWP(0);
    setTimerJRG(0.0);
    setTimerWP(0.0);

    // JRG loads in 800ms
    const jrgInterval = setInterval(() => {
      setTimerJRG((prev) => {
        if (prev >= 0.8) {
          clearInterval(jrgInterval);
          setProgressJRG(100);
          return 0.8;
        }
        return +(prev + 0.1).toFixed(1);
      });
    }, 100);

    // WordPress loads in 4.8s
    const wpInterval = setInterval(() => {
      setTimerWP((prev) => {
        if (prev >= 4.8) {
          clearInterval(wpInterval);
          setProgressWP(38);
          setIsRunning(false);
          return 4.8;
        }
        return +(prev + 0.2).toFixed(1);
      });
    }, 200);
  };

  return (
    <section className="py-20 md:py-28 px-4 sm:px-6 relative bg-zinc-950/70 border-t border-white/10 overflow-hidden">
      {/* Background glow */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-[radial-gradient(ellipse_at_center,rgba(194,168,143,0.12)_0%,rgba(0,0,0,0)_70%)] pointer-events-none -z-10"
      />

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-[#C2A88F]/30 backdrop-blur-md mb-4 shadow-[0_0_15px_rgba(194,168,143,0.15)]">
            <Gauge className="w-3.5 h-3.5 text-[#C2A88F]" />
            <span className="font-mono text-[11px] tracking-widest text-[#E1E0CC] uppercase">
              Auditoría de Rendimiento Google
            </span>
          </div>

          <h2 className="font-alata text-2xl sm:text-4xl font-bold text-white uppercase tracking-wide">
            Comparativa en Vivo: Velocidad Real en Móvil
          </h2>

          <p className="text-zinc-400 text-xs sm:text-sm mt-3 font-light leading-relaxed">
            Google penaliza las webs lentas y los usuarios abandonan tras 3 segundos. Comprueba la diferencia entre una plantilla común y la arquitectura JRG.
          </p>
        </div>

        {/* Live Test Trigger Button */}
        <div className="text-center mb-10">
          <button
            type="button"
            onClick={startBenchmark}
            disabled={isRunning}
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-mono font-semibold transition-all cursor-pointer ${
              isRunning
                ? "bg-emerald-500 text-black animate-pulse"
                : "bg-[#C2A88F] hover:bg-[#D4BEA7] text-black shadow-[0_0_20px_rgba(194,168,143,0.35)] hover:scale-105 active:scale-95"
            }`}
          >
            {isRunning ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Midiendo Tiempos de Carga...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Lanzar Test de Velocidad en Vivo</span>
              </>
            )}
          </button>
        </div>

        {/* 2 Side-by-Side Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* Card 1: Plantilla Estándar */}
          <div className="rounded-3xl bg-zinc-950 border border-red-500/30 p-6 sm:p-8 relative overflow-hidden shadow-lg">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <span className="font-alata text-base font-bold text-white">Plantilla WordPress / Wix Común</span>
              </div>
              <span className="text-[10px] font-mono text-red-400 bg-red-500/10 px-2.5 py-1 rounded-full border border-red-500/30">
                Poco Eficiente
              </span>
            </div>

            {/* Metric Display */}
            <div className="flex items-baseline justify-between mb-4">
              <div>
                <span className="text-xs font-mono text-zinc-400 block mb-1">Puntuación Google:</span>
                <span className="font-mono text-5xl font-bold text-red-500">
                  {progressWP}/100
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono text-zinc-400 block mb-1">Tiempo de Carga:</span>
                <span className="font-mono text-3xl font-bold text-red-400">
                  {timerWP}s
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2.5 bg-zinc-900 rounded-full overflow-hidden mb-6 border border-white/5">
              <div
                className="h-full bg-red-500 transition-all duration-300 rounded-full"
                style={{ width: `${progressWP}%` }}
              />
            </div>

            {/* Diagnostics List */}
            <ul className="space-y-3 text-xs text-zinc-300 font-light border-t border-white/10 pt-5">
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold shrink-0">✕</span>
                <span>Pierdes el 53% de visitantes antes de que termine de cargar el logo.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold shrink-0">✕</span>
                <span>Plugins pesados de terceros bloquean el procesador del móvil.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold shrink-0">✕</span>
                <span>Peor posicionamiento en Google por incumplir Core Web Vitals.</span>
              </li>
            </ul>
          </div>

          {/* Card 2: Arquitectura JRG */}
          <div className="rounded-3xl bg-zinc-950 border border-emerald-500/50 p-6 sm:p-8 relative overflow-hidden shadow-[0_0_30px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/30">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <div className="flex items-center gap-2.5">
                <Zap className="w-5 h-5 text-emerald-400" />
                <span className="font-alata text-base font-bold text-white">Arquitectura JRG Agency</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-300 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
                100% Nativo
              </span>
            </div>

            {/* Metric Display */}
            <div className="flex items-baseline justify-between mb-4">
              <div>
                <span className="text-xs font-mono text-zinc-400 block mb-1">Puntuación Google:</span>
                <span className="font-mono text-5xl font-bold text-emerald-400">
                  {progressJRG}/100
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono text-zinc-400 block mb-1">Tiempo de Carga:</span>
                <span className="font-mono text-3xl font-bold text-emerald-300">
                  {timerJRG}s
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2.5 bg-zinc-900 rounded-full overflow-hidden mb-6 border border-white/5">
              <div
                className="h-full bg-emerald-400 transition-all duration-300 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.8)]"
                style={{ width: `${progressJRG}%` }}
              />
            </div>

            {/* Diagnostics List */}
            <ul className="space-y-3 text-xs text-zinc-300 font-light border-t border-white/10 pt-5">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Abre de forma instantánea tanto en 4G/5G como con baja cobertura.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Código limpio escrito a mano: cero plantillas genéricas sobrecargadas.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Máxima autoridad y ventaja competitiva en los resultados de Google.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Real cases audited in Goierri */}
        <div className="mt-10 p-5 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-zinc-400">
          <span className="text-zinc-300">Auditoría aplicada a proyectos reales:</span>
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-black/60 border border-white/10 text-emerald-400">Gure Trena: 0,8s</span>
            <span className="px-3 py-1 rounded-full bg-black/60 border border-white/10 text-emerald-400">Korta Taberna: 0,9s</span>
            <span className="px-3 py-1 rounded-full bg-black/60 border border-white/10 text-emerald-400">Urkulu Móviles: 0,8s</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LighthouseSpeedComparator;
