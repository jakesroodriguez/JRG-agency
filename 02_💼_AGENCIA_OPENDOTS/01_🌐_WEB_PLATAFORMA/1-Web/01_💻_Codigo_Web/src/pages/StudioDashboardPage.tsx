import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Smartphone,
  Tablet,
  Monitor,
  RotateCcw,
  Copy,
  Check,
  Send,
  Sparkles,
  Sliders,
  Layers,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Move,
  Type,
  Layout,
  Sun,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import { useLandingConfig, LandingConfigProvider } from "../context/LandingConfigContext";

const StudioDashboardInner: React.FC = () => {
  const {
    config,
    updateHero,
    toggleSection,
    moveSection,
    resetToDefaults,
    saveToCloud,
    isDirty,
    isSaving,
  } = useLandingConfig();

  const [activeTab, setActiveTab] = useState<"hero" | "sections" | "presets">("hero");
  const [viewport, setViewport] = useState<"mobile" | "tablet" | "desktop">("mobile");
  const [copied, setCopied] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const { hero, sections } = config;

  // Broadcast config update to iframe live in real-time
  useEffect(() => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        { type: "JRG_CONFIG_UPDATE", config },
        "*"
      );
    }
  }, [config]);

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(config, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePublish = async () => {
    setSaveStatus("Publicando en el dominio...");
    const res = await saveToCloud();
    setSaveStatus(res.message);
    setTimeout(() => setSaveStatus(null), 5000);
  };

  const handleReloadIframe = () => {
    if (iframeRef.current) {
      iframeRef.current.src = "/?preview=true&r=" + Date.now();
    }
  };

  // Preset Handlers
  const applyPreset = (preset: string) => {
    switch (preset) {
      case "split-sky":
        updateHero({
          logoPositionMobile: "top-left",
          logoFontSizeMobile: 30,
          showSubtitle: true,
          subtitlePositionMobile: "under-logo",
          subtitleFontSizeMobile: 13,
          subtitleMaxWidthMobile: 290,
          showCta: true,
          ctaPositionMobile: "bottom",
          overlayOpacity: 0.6,
        });
        break;
      case "center-zen":
        updateHero({
          logoPositionMobile: "top-center",
          logoFontSizeMobile: 28,
          showSubtitle: true,
          subtitlePositionMobile: "under-logo",
          subtitleFontSizeMobile: 14,
          subtitleMaxWidthMobile: 320,
          showCta: true,
          ctaPositionMobile: "bottom",
          overlayOpacity: 0.65,
        });
        break;
      case "massive-top":
        updateHero({
          logoPositionMobile: "top-left",
          logoFontSizeMobile: 34,
          showSubtitle: true,
          subtitlePositionMobile: "middle",
          subtitleFontSizeMobile: 12,
          subtitleMaxWidthMobile: 300,
          showCta: true,
          ctaPositionMobile: "bottom",
          overlayOpacity: 0.55,
        });
        break;
      case "clean-bottom":
        updateHero({
          logoPositionMobile: "bottom-left",
          logoFontSizeMobile: 26,
          showSubtitle: true,
          subtitlePositionMobile: "above-cta",
          subtitleFontSizeMobile: 13,
          subtitleMaxWidthMobile: 300,
          showCta: true,
          ctaPositionMobile: "bottom",
          overlayOpacity: 0.7,
        });
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-[#07080B] text-[#E1E0CC] flex flex-col font-sans select-none overflow-hidden">
      {/* 1. TOP BAR */}
      <header className="h-14 border-b border-white/10 bg-black/60 backdrop-blur-xl px-4 flex items-center justify-between z-50 shrink-0">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="flex items-center gap-1.5 text-xs text-[#C2A88F] hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-2.5 py-1.5 rounded-lg border border-white/10"
          >
            ← Volver a la Web
          </Link>
          <div className="h-4 w-[1px] bg-white/15 hidden sm:block" />
          <div className="flex items-center gap-2">
            <span className="font-bold tracking-tight text-white flex items-center gap-1.5 text-sm">
              <Sparkles className="w-4 h-4 text-[#C2A88F]" />
              JRG Studio
            </span>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-[#C2A88F]/15 text-[#C2A88F] border border-[#C2A88F]/30 hidden md:inline-block">
              Visual Builder
            </span>
          </div>
        </div>

        {/* Viewport switchers */}
        <div className="flex items-center bg-white/5 p-1 rounded-xl border border-white/10">
          <button
            onClick={() => setViewport("mobile")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              viewport === "mobile"
                ? "bg-[#C2A88F] text-black shadow-md font-bold"
                : "text-stone-400 hover:text-white"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Móvil (390px)</span>
          </button>
          <button
            onClick={() => setViewport("tablet")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              viewport === "tablet"
                ? "bg-[#C2A88F] text-black shadow-md font-bold"
                : "text-stone-400 hover:text-white"
            }`}
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tablet (768px)</span>
          </button>
          <button
            onClick={() => setViewport("desktop")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              viewport === "desktop"
                ? "bg-[#C2A88F] text-black shadow-md font-bold"
                : "text-stone-400 hover:text-white"
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Desktop</span>
          </button>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleReloadIframe}
            className="flex items-center gap-1 text-xs text-stone-400 hover:text-white bg-white/5 hover:bg-white/10 px-2.5 py-1.5 rounded-lg border border-white/10 transition-colors"
            title="Recargar lienzo"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={resetToDefaults}
            className="flex items-center gap-1 text-xs text-stone-400 hover:text-white bg-white/5 hover:bg-white/10 px-2.5 py-1.5 rounded-lg border border-white/10 transition-colors"
            title="Restablecer a valores iniciales"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Reset</span>
          </button>

          <button
            onClick={handleCopyJson}
            className="flex items-center gap-1 text-xs text-stone-300 hover:text-white bg-white/5 hover:bg-white/10 px-2.5 py-1.5 rounded-lg border border-white/10 transition-colors"
            title="Copiar JSON de Configuración"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden md:inline">{copied ? "¡Copiado!" : "Copiar"}</span>
          </button>

          <button
            onClick={handlePublish}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-[#DEDBC8] via-[#C2A88F] to-[#A8896C] text-black hover:brightness-110 shadow-[0_4px_16px_rgba(194,168,143,0.3)] transition-all cursor-pointer disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSaving ? "Guardando..." : isDirty ? "Publicar Cambios *" : "Publicar en Dominio"}</span>
          </button>
        </div>
      </header>

      {/* TOAST NOTIFICATION */}
      {saveStatus && (
        <div className="absolute top-16 right-4 z-[9999] bg-black/90 border border-[#C2A88F] text-[#E1E0CC] px-4 py-2.5 rounded-xl shadow-2xl backdrop-blur-xl flex items-center gap-2 text-xs animate-bounce">
          <ShieldCheck className="w-4 h-4 text-[#C2A88F]" />
          <span>{saveStatus}</span>
        </div>
      )}

      {/* 2. BODY: LEFT SIDEBAR + LIVE CANVAS */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* SIDEBAR */}
        <aside className="w-80 sm:w-96 border-r border-white/10 bg-[#0B0D13]/95 backdrop-blur-2xl flex flex-col z-30 shrink-0">
          {/* Navigation tabs */}
          <div className="flex border-b border-white/10 bg-black/40">
            <button
              onClick={() => setActiveTab("hero")}
              className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-1.5 border-b-2 transition-all ${
                activeTab === "hero"
                  ? "border-[#C2A88F] text-[#C2A88F] bg-white/5"
                  : "border-transparent text-stone-400 hover:text-stone-200"
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              Hero & Logo
            </button>
            <button
              onClick={() => setActiveTab("sections")}
              className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-1.5 border-b-2 transition-all ${
                activeTab === "sections"
                  ? "border-[#C2A88F] text-[#C2A88F] bg-white/5"
                  : "border-transparent text-stone-400 hover:text-stone-200"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Secciones
            </button>
            <button
              onClick={() => setActiveTab("presets")}
              className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-1.5 border-b-2 transition-all ${
                activeTab === "presets"
                  ? "border-[#C2A88F] text-[#C2A88F] bg-white/5"
                  : "border-transparent text-stone-400 hover:text-stone-200"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Presets
            </button>
          </div>

          {/* TAB CONTENTS */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar text-xs">
            {/* TAB 1: HERO & LOGO */}
            {activeTab === "hero" && (
              <div className="space-y-6">
                {/* 1. LOGO POSITION & SIZE */}
                <div className="bg-white/5 p-3.5 rounded-xl border border-white/10 space-y-3">
                  <div className="flex items-center justify-between text-stone-200 font-bold">
                    <span className="flex items-center gap-1.5">
                      <Move className="w-3.5 h-3.5 text-[#C2A88F]" />
                      Logo JRG en Móvil
                    </span>
                    <span className="text-[10px] text-stone-400 font-mono">{hero.logoFontSizeMobile}vw</span>
                  </div>

                  <div>
                    <label className="text-[11px] text-stone-400 mb-1.5 block">Posición en Móvil</label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {[
                        { id: "top-left", label: "Cielo Izquierda" },
                        { id: "top-center", label: "Cielo Centro" },
                        { id: "center", label: "Centro Pantalla" },
                        { id: "bottom-left", label: "Abajo Izquierda" },
                        { id: "bottom-center", label: "Abajo Centro" },
                      ].map((pos) => (
                        <button
                          key={pos.id}
                          onClick={() => updateHero({ logoPositionMobile: pos.id as any })}
                          className={`py-1.5 px-2 rounded-lg border text-[11px] transition-all text-left ${
                            hero.logoPositionMobile === pos.id
                              ? "bg-[#C2A88F]/20 border-[#C2A88F] text-white font-bold"
                              : "bg-black/30 border-white/10 text-stone-400 hover:text-white"
                          }`}
                        >
                          {pos.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Font Size slider */}
                  <div>
                    <div className="flex justify-between text-[11px] text-stone-400 mb-1">
                      <span>Tamaño en Móvil</span>
                      <span className="text-white font-mono">{hero.logoFontSizeMobile}vw</span>
                    </div>
                    <input
                      type="range"
                      min={18}
                      max={38}
                      step={1}
                      value={hero.logoFontSizeMobile}
                      onChange={(e) => updateHero({ logoFontSizeMobile: Number(e.target.value) })}
                      className="w-full accent-[#C2A88F] bg-white/10 h-1.5 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  {/* Asterisk toggle */}
                  <div className="flex items-center justify-between pt-1 border-t border-white/5">
                    <span className="text-stone-300">Mostrar Asterisco Dorado (*)</span>
                    <button
                      onClick={() => updateHero({ showAsterisk: !hero.showAsterisk })}
                      className={`w-9 h-5 rounded-full transition-colors relative ${
                        hero.showAsterisk ? "bg-[#C2A88F]" : "bg-white/20"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 w-4 h-4 rounded-full bg-black transition-transform ${
                          hero.showAsterisk ? "left-4.5" : "left-0.5"
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* 2. SUBTITLE / TEXT */}
                <div className="bg-white/5 p-3.5 rounded-xl border border-white/10 space-y-3">
                  <div className="flex items-center justify-between text-stone-200 font-bold">
                    <span className="flex items-center gap-1.5">
                      <Type className="w-3.5 h-3.5 text-[#C2A88F]" />
                      Texto Descriptivo
                    </span>
                    <button
                      onClick={() => updateHero({ showSubtitle: !hero.showSubtitle })}
                      className="text-stone-400 hover:text-white"
                      title={hero.showSubtitle ? "Ocultar" : "Mostrar"}
                    >
                      {hero.showSubtitle ? <Eye className="w-3.5 h-3.5 text-emerald-400" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {hero.showSubtitle && (
                    <>
                      <div>
                        <label className="text-[11px] text-stone-400 mb-1 block">Contenido del Texto</label>
                        <textarea
                          rows={3}
                          value={hero.subtitleText}
                          onChange={(e) => updateHero({ subtitleText: e.target.value })}
                          className="w-full bg-black/50 border border-white/15 rounded-lg p-2 text-white text-xs leading-relaxed focus:border-[#C2A88F] outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] text-stone-400 mb-1.5 block">Posición en Móvil</label>
                        <div className="grid grid-cols-3 gap-1.5">
                          {[
                            { id: "under-logo", label: "Bajo Logo" },
                            { id: "middle", label: "En Centro" },
                            { id: "above-cta", label: "Sobre Botón" },
                          ].map((pos) => (
                            <button
                              key={pos.id}
                              onClick={() => updateHero({ subtitlePositionMobile: pos.id as any })}
                              className={`py-1.5 px-1.5 rounded-lg border text-[11px] text-center transition-all ${
                                hero.subtitlePositionMobile === pos.id
                                  ? "bg-[#C2A88F]/20 border-[#C2A88F] text-white font-bold"
                                  : "bg-black/30 border-white/10 text-stone-400 hover:text-white"
                              }`}
                            >
                              {pos.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Font size */}
                      <div>
                        <div className="flex justify-between text-[11px] text-stone-400 mb-1">
                          <span>Tamaño de Letra</span>
                          <span className="text-white font-mono">{hero.subtitleFontSizeMobile}px</span>
                        </div>
                        <input
                          type="range"
                          min={11}
                          max={17}
                          step={1}
                          value={hero.subtitleFontSizeMobile}
                          onChange={(e) => updateHero({ subtitleFontSizeMobile: Number(e.target.value) })}
                          className="w-full accent-[#C2A88F] bg-white/10 h-1.5 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>

                      {/* Max width */}
                      <div>
                        <div className="flex justify-between text-[11px] text-stone-400 mb-1">
                          <span>Ancho Máximo</span>
                          <span className="text-white font-mono">{hero.subtitleMaxWidthMobile}px</span>
                        </div>
                        <input
                          type="range"
                          min={220}
                          max={380}
                          step={10}
                          value={hero.subtitleMaxWidthMobile}
                          onChange={(e) => updateHero({ subtitleMaxWidthMobile: Number(e.target.value) })}
                          className="w-full accent-[#C2A88F] bg-white/10 h-1.5 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                    </>
                  )}
                </div>

                {/* 3. CTA BUTTON */}
                <div className="bg-white/5 p-3.5 rounded-xl border border-white/10 space-y-3">
                  <div className="flex items-center justify-between text-stone-200 font-bold">
                    <span className="flex items-center gap-1.5">
                      <Layout className="w-3.5 h-3.5 text-[#C2A88F]" />
                      Botón de Acción (CTA)
                    </span>
                    <button
                      onClick={() => updateHero({ showCta: !hero.showCta })}
                      className="text-stone-400 hover:text-white"
                    >
                      {hero.showCta ? <Eye className="w-3.5 h-3.5 text-emerald-400" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {hero.showCta && (
                    <>
                      <div>
                        <label className="text-[11px] text-stone-400 mb-1 block">Texto del Botón</label>
                        <input
                          type="text"
                          value={hero.ctaText}
                          onChange={(e) => updateHero({ ctaText: e.target.value })}
                          className="w-full bg-black/50 border border-white/15 rounded-lg p-2 text-white text-xs focus:border-[#C2A88F] outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] text-stone-400 mb-1.5 block">Estilo del Botón</label>
                        <div className="grid grid-cols-3 gap-1.5">
                          {[
                            { id: "gold-gradient", label: "Oro Champán" },
                            { id: "dark-glass", label: "Liquid Glass" },
                            { id: "champagne-outline", label: "Borde Fino" },
                          ].map((st) => (
                            <button
                              key={st.id}
                              onClick={() => updateHero({ ctaStyle: st.id as any })}
                              className={`py-1.5 px-1.5 rounded-lg border text-[11px] text-center transition-all ${
                                hero.ctaStyle === st.id
                                  ? "bg-[#C2A88F]/20 border-[#C2A88F] text-white font-bold"
                                  : "bg-black/30 border-white/10 text-stone-400 hover:text-white"
                              }`}
                            >
                              {st.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* 4. BACKGROUND & ATMOSPHERE */}
                <div className="bg-white/5 p-3.5 rounded-xl border border-white/10 space-y-3">
                  <div className="flex items-center justify-between text-stone-200 font-bold">
                    <span className="flex items-center gap-1.5">
                      <Sun className="w-3.5 h-3.5 text-[#C2A88F]" />
                      Fondo & Contraste
                    </span>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] text-stone-400 mb-1">
                      <span>Oscuridad del Overlay (Sombra de fondo)</span>
                      <span className="text-white font-mono">{Math.round(hero.overlayOpacity * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min={0.2}
                      max={0.9}
                      step={0.05}
                      value={hero.overlayOpacity}
                      onChange={(e) => updateHero({ overlayOpacity: Number(e.target.value) })}
                      className="w-full accent-[#C2A88F] bg-white/10 h-1.5 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: SECTIONS REORDER & TOGGLE */}
            {activeTab === "sections" && (
              <div className="space-y-3">
                <p className="text-stone-400 text-[11px] leading-relaxed">
                  Activa, desactiva o reordena las secciones de tu página. Los cambios se actualizan en el lienzo al instante.
                </p>

                <div className="space-y-2">
                  {sections.map((sec, idx) => (
                    <div
                      key={sec.id}
                      className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                        sec.enabled
                          ? "bg-white/5 border-white/15"
                          : "bg-black/40 border-white/5 opacity-50"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <button
                          onClick={() => toggleSection(sec.id, !sec.enabled)}
                          className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                            sec.enabled ? "bg-emerald-500/20 text-emerald-400" : "bg-white/10 text-stone-500"
                          }`}
                        >
                          {sec.enabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        </button>
                        <div className="min-w-0">
                          <p className="font-semibold text-white truncate text-xs">{sec.name}</p>
                          <p className="text-[10px] text-stone-400 truncate">{sec.description}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          disabled={idx === 0}
                          onClick={() => moveSection(idx, "up")}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 disabled:opacity-20 text-stone-300 transition-colors"
                          title="Subir posición"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          disabled={idx === sections.length - 1}
                          onClick={() => moveSection(idx, "down")}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 disabled:opacity-20 text-stone-300 transition-colors"
                          title="Bajar posición"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: PRESETS */}
            {activeTab === "presets" && (
              <div className="space-y-3">
                <p className="text-stone-400 text-[11px] leading-relaxed">
                  Aplica estilos preconfigurados con un solo clic para ver cuál encaja mejor con tu visión:
                </p>

                <div className="space-y-2.5">
                  {[
                    {
                      id: "split-sky",
                      title: "1. Split Editorial (Cielo + Texto + Botón Abajo)",
                      desc: "JRG grande en el cielo, texto justo debajo del logo y botón anclado abajo.",
                    },
                    {
                      id: "center-zen",
                      title: "2. JRG Centrado en el Cielo",
                      desc: "JRG centrado con texto bajo el logo, dejando los márgenes completamente simétricos.",
                    },
                    {
                      id: "massive-top",
                      title: "3. JRG Masivo (34vw) + Texto en Rocas",
                      desc: "Logo extra grande ocupando todo el ancho superior con texto flotante en el centro.",
                    },
                    {
                      id: "clean-bottom",
                      title: "4. Clásico Bottom-Heavy",
                      desc: "Todo anclado en la parte inferior como en interfaces modernas de videojuegos.",
                    },
                  ].map((p) => (
                    <div
                      key={p.id}
                      onClick={() => applyPreset(p.id)}
                      className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#C2A88F]/50 transition-all cursor-pointer group"
                    >
                      <h4 className="font-bold text-white group-hover:text-[#C2A88F] transition-colors text-xs">
                        {p.title}
                      </h4>
                      <p className="text-[11px] text-stone-400 mt-1 leading-snug">{p.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* 3. CENTER: LIVE CANVA-STYLE PREVIEW CANVAS WITH REAL ISOLATED VIEWPORT */}
        <main className="flex-1 bg-[#050608] flex items-center justify-center p-2 sm:p-6 overflow-hidden relative">
          {/* Subtle blueprint grid background */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(#FFFFFF 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />

          {/* DEVICE PREVIEW CONTAINER */}
          <div
            className={`transition-all duration-500 ease-out flex flex-col ${
              viewport === "mobile"
                ? "w-[390px] h-[844px] max-h-[92vh] rounded-[48px] border-[10px] border-[#1C1F26] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.95),0_0_0_2px_rgba(255,255,255,0.1)] overflow-hidden bg-black relative"
                : viewport === "tablet"
                ? "w-[768px] h-[1024px] max-h-[92vh] rounded-[36px] border-[12px] border-[#1C1F26] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.95)] overflow-hidden bg-black relative"
                : "w-full h-full rounded-2xl border border-white/10 shadow-2xl overflow-hidden bg-black relative"
            }`}
          >
            {/* Real device notch on mobile */}
            {viewport === "mobile" && (
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-[100] border border-white/10 flex items-center justify-center pointer-events-none">
                <div className="w-2.5 h-2.5 rounded-full bg-[#111] border border-white/20 mr-4" />
                <div className="w-2 h-2 rounded-full bg-[#0a192f]/60" />
              </div>
            )}

            {/* REAL ISOLATED VIEWPORT IFRAME */}
            <iframe
              ref={iframeRef}
              src="/?preview=true"
              className="w-full h-full border-0 bg-black select-none"
              title="Live Visual Preview"
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export const StudioDashboardPage: React.FC = () => {
  return (
    <LandingConfigProvider>
      <StudioDashboardInner />
    </LandingConfigProvider>
  );
};

export default StudioDashboardPage;
