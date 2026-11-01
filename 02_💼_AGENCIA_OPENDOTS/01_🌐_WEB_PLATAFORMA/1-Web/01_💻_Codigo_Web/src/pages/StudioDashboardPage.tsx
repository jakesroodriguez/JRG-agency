import React, { useState, useRef } from "react";
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
  ArrowRight,
  MousePointer,
  Crosshair,
} from "lucide-react";
import { useLandingConfig, LandingConfigProvider } from "../context/LandingConfigContext";
import WordsPullUp from "../components/prisma/WordsPullUp";

type ElementType = "logo" | "subtitle" | "cta";

const CanvaStudioInner: React.FC = () => {
  const {
    config,
    updateHero,
    updatePosition,
    toggleSection,
    moveSection,
    resetToDefaults,
    saveToCloud,
    isDirty,
    isSaving,
  } = useLandingConfig();

  const [activeTab, setActiveTab] = useState<"hero" | "sections" | "presets">("hero");
  const [viewport, setViewport] = useState<"mobile" | "tablet" | "desktop">("mobile");
  const [selectedElement, setSelectedElement] = useState<ElementType>("logo");
  const [copied, setCopied] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Dragging state
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{
    startX: number;
    startY: number;
    initialElemX: number;
    initialElemY: number;
  }>({ startX: 0, startY: 0, initialElemX: 0, initialElemY: 0 });

  const { hero, sections } = config;

  const positions = hero.positionsMobile || {
    logo: { x: 6, y: 5 },
    subtitle: { x: 6, y: 26.5 },
    cta: { x: 6, y: 88 },
  };

  // Pointer drag handler for Canva-style free movement
  const handlePointerDown = (e: React.PointerEvent, elem: ElementType) => {
    e.stopPropagation();
    e.preventDefault();
    setSelectedElement(elem);
    setIsDragging(true);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const targetEl = e.currentTarget as HTMLElement;
    try {
      targetEl.setPointerCapture(e.pointerId);
    } catch {}

    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialElemX: positions[elem]?.x ?? 6,
      initialElemY: positions[elem]?.y ?? 10,
    };

    const handlePointerMove = (moveEvent: PointerEvent) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const deltaX = moveEvent.clientX - dragStartRef.current.startX;
      const deltaY = moveEvent.clientY - dragStartRef.current.startY;

      // Convert delta pixels to percentage of container
      const deltaXPercent = (deltaX / rect.width) * 100;
      const deltaYPercent = (deltaY / rect.height) * 100;

      const newX = Math.max(0, Math.min(85, dragStartRef.current.initialElemX + deltaXPercent));
      const newY = Math.max(0, Math.min(92, dragStartRef.current.initialElemY + deltaYPercent));

      updatePosition(elem, newX, newY);
    };

    const handlePointerUp = () => {
      setIsDragging(false);
      try {
        targetEl.releasePointerCapture(e.pointerId);
      } catch {}
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerUp);
  };

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

  const applyPreset = (preset: string) => {
    switch (preset) {
      case "split-sky":
        updateHero({
          logoFontSizeMobile: 30,
          showSubtitle: true,
          subtitleFontSizeMobile: 13,
          subtitleMaxWidthMobile: 290,
          showCta: true,
          positionsMobile: {
            logo: { x: 6, y: 5 },
            subtitle: { x: 6, y: 26.5 },
            cta: { x: 6, y: 88 },
          },
        });
        break;
      case "center-zen":
        updateHero({
          logoFontSizeMobile: 28,
          showSubtitle: true,
          subtitleFontSizeMobile: 13,
          subtitleMaxWidthMobile: 300,
          showCta: true,
          positionsMobile: {
            logo: { x: 26, y: 7 },
            subtitle: { x: 12, y: 22 },
            cta: { x: 26, y: 88 },
          },
        });
        break;
      case "massive-top":
        updateHero({
          logoFontSizeMobile: 34,
          showSubtitle: true,
          subtitleFontSizeMobile: 12,
          subtitleMaxWidthMobile: 290,
          showCta: true,
          positionsMobile: {
            logo: { x: 5, y: 6 },
            subtitle: { x: 6, y: 46 },
            cta: { x: 6, y: 88 },
          },
        });
        break;
      case "clean-bottom":
        updateHero({
          logoFontSizeMobile: 24,
          showSubtitle: true,
          subtitleFontSizeMobile: 12,
          subtitleMaxWidthMobile: 280,
          showCta: true,
          positionsMobile: {
            logo: { x: 6, y: 65 },
            subtitle: { x: 6, y: 76 },
            cta: { x: 6, y: 88 },
          },
        });
        break;
      default:
        break;
    }
  };

  const currentPos = positions[selectedElement] || { x: 6, y: 10 };

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
              JRG Canva Studio
            </span>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hidden md:inline-block">
              Free Drag Active
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

      {/* 2. BODY: LEFT SIDEBAR (CANVA INSPECTOR) + LIVE DRAGGABLE CANVAS */}
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
              <Move className="w-3.5 h-3.5" />
              Posición Libre
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
            {activeTab === "hero" && (
              <div className="space-y-5">
                {/* ELEMENT SELECTOR PILLS */}
                <div>
                  <label className="text-[11px] text-stone-400 mb-1.5 block font-medium">
                    1. Selecciona el elemento para mover o editar:
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { id: "logo", label: "Logo JRG" },
                      { id: "subtitle", label: "Texto" },
                      { id: "cta", label: "Botón CTA" },
                    ].map((el) => (
                      <button
                        key={el.id}
                        onClick={() => setSelectedElement(el.id as ElementType)}
                        className={`py-2 px-1 rounded-xl border text-xs font-semibold text-center transition-all ${
                          selectedElement === el.id
                            ? "bg-[#C2A88F] text-black border-[#C2A88F] shadow-lg shadow-[#C2A88F]/20"
                            : "bg-white/5 border-white/10 text-stone-300 hover:bg-white/10"
                        }`}
                      >
                        {el.label}
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-stone-400 mt-2 flex items-center gap-1">
                    <MousePointer className="w-3 h-3 text-[#C2A88F]" />
                    <span>También puedes <strong>arrastrarlo directamente</strong> en la pantalla del móvil.</span>
                  </p>
                </div>

                {/* 2. CANVA POSITION SLIDERS FOR SELECTED ELEMENT */}
                <div className="bg-white/5 p-4 rounded-2xl border border-white/15 space-y-4">
                  <div className="flex items-center justify-between text-stone-200 font-bold border-b border-white/10 pb-2">
                    <span className="flex items-center gap-2">
                      <Crosshair className="w-4 h-4 text-[#C2A88F]" />
                      Coordenadas de {selectedElement === "logo" ? "Logo JRG" : selectedElement === "subtitle" ? "Texto Descriptivo" : "Botón CTA"}
                    </span>
                    <span className="text-[11px] font-mono text-[#C2A88F] bg-[#C2A88F]/15 px-2 py-0.5 rounded-full">
                      X: {currentPos.x}% · Y: {currentPos.y}%
                    </span>
                  </div>

                  {/* Horizontal X Slider */}
                  <div>
                    <div className="flex justify-between text-[11px] text-stone-300 mb-1.5">
                      <span>Posición Horizontal (X)</span>
                      <span className="font-mono text-white font-bold">{currentPos.x}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={80}
                      step={0.5}
                      value={currentPos.x}
                      onChange={(e) => updatePosition(selectedElement, Number(e.target.value), currentPos.y)}
                      className="w-full accent-[#C2A88F] bg-white/15 h-2 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-stone-500 mt-1">
                      <span>Izquierda (0%)</span>
                      <span>Centro (30%)</span>
                      <span>Derecha (60%)</span>
                    </div>
                  </div>

                  {/* Vertical Y Slider */}
                  <div>
                    <div className="flex justify-between text-[11px] text-stone-300 mb-1.5">
                      <span>Posición Vertical (Y)</span>
                      <span className="font-mono text-white font-bold">{currentPos.y}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={92}
                      step={0.5}
                      value={currentPos.y}
                      onChange={(e) => updatePosition(selectedElement, currentPos.x, Number(e.target.value))}
                      className="w-full accent-[#C2A88F] bg-white/15 h-2 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-stone-500 mt-1">
                      <span>Cielo (5%)</span>
                      <span>En medio (45%)</span>
                      <span>Abajo (88%)</span>
                    </div>
                  </div>

                  {/* Quick Snap Alignment Buttons */}
                  <div className="pt-2 border-t border-white/5 space-y-2">
                    <label className="text-[10px] uppercase font-mono tracking-wider text-stone-400 block">
                      Alineación Rápida
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      <button
                        onClick={() => updatePosition(selectedElement, 6, currentPos.y)}
                        className="py-1 px-1 rounded bg-black/40 hover:bg-white/10 text-stone-300 text-[10px] border border-white/5"
                      >
                        ⬅ Pegar Izq (6%)
                      </button>
                      <button
                        onClick={() => updatePosition(selectedElement, 25, currentPos.y)}
                        className="py-1 px-1 rounded bg-black/40 hover:bg-white/10 text-stone-300 text-[10px] border border-white/5"
                      >
                        ⬛ Centrar Horiz
                      </button>
                      <button
                        onClick={() => updatePosition(selectedElement, 50, currentPos.y)}
                        className="py-1 px-1 rounded bg-black/40 hover:bg-white/10 text-stone-300 text-[10px] border border-white/5"
                      >
                        ➡ Pegar Der
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-1.5">
                      <button
                        onClick={() => updatePosition(selectedElement, currentPos.x, 6)}
                        className="py-1 px-1 rounded bg-black/40 hover:bg-white/10 text-stone-300 text-[10px] border border-white/5"
                      >
                        ⬆ En Cielo (6%)
                      </button>
                      <button
                        onClick={() => updatePosition(selectedElement, currentPos.x, 26.5)}
                        className="py-1 px-1 rounded bg-black/40 hover:bg-white/10 text-stone-300 text-[10px] border border-white/5"
                      >
                        ↕ Bajo JRG (26.5%)
                      </button>
                      <button
                        onClick={() => updatePosition(selectedElement, currentPos.x, 88)}
                        className="py-1 px-1 rounded bg-black/40 hover:bg-white/10 text-stone-300 text-[10px] border border-white/5"
                      >
                        ⬇ En Fondo (88%)
                      </button>
                    </div>
                  </div>
                </div>

                {/* 3. SIZE & STYLE CONTROLS BASED ON SELECTED ELEMENT */}
                {selectedElement === "logo" && (
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-3">
                    <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-[#C2A88F]" />
                      Propiedades del Logo JRG
                    </h4>

                    <div>
                      <div className="flex justify-between text-[11px] text-stone-300 mb-1">
                        <span>Tamaño de Escala (vw)</span>
                        <span className="font-mono text-white">{hero.logoFontSizeMobile}vw</span>
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

                    <div className="flex items-center justify-between pt-1 border-t border-white/5">
                      <span className="text-stone-300">Asterisco Dorado (*)</span>
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
                )}

                {selectedElement === "subtitle" && (
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-3">
                    <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                      <Type className="w-3.5 h-3.5 text-[#C2A88F]" />
                      Propiedades del Texto Descriptivo
                    </h4>

                    <div>
                      <label className="text-[11px] text-stone-400 mb-1 block">Contenido del Texto</label>
                      <textarea
                        rows={3}
                        value={hero.subtitleText}
                        onChange={(e) => updateHero({ subtitleText: e.target.value })}
                        className="w-full bg-black/60 border border-white/15 rounded-xl p-2.5 text-white text-xs leading-relaxed focus:border-[#C2A88F] outline-none"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] text-stone-300 mb-1">
                        <span>Tamaño de Letra</span>
                        <span className="font-mono text-white">{hero.subtitleFontSizeMobile}px</span>
                      </div>
                      <input
                        type="range"
                        min={11}
                        max={18}
                        step={1}
                        value={hero.subtitleFontSizeMobile}
                        onChange={(e) => updateHero({ subtitleFontSizeMobile: Number(e.target.value) })}
                        className="w-full accent-[#C2A88F] bg-white/10 h-1.5 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] text-stone-300 mb-1">
                        <span>Ancho Máximo</span>
                        <span className="font-mono text-white">{hero.subtitleMaxWidthMobile}px</span>
                      </div>
                      <input
                        type="range"
                        min={200}
                        max={360}
                        step={10}
                        value={hero.subtitleMaxWidthMobile}
                        onChange={(e) => updateHero({ subtitleMaxWidthMobile: Number(e.target.value) })}
                        className="w-full accent-[#C2A88F] bg-white/10 h-1.5 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>
                )}

                {selectedElement === "cta" && (
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-3">
                    <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                      <Layout className="w-3.5 h-3.5 text-[#C2A88F]" />
                      Propiedades del Botón CTA
                    </h4>

                    <div>
                      <label className="text-[11px] text-stone-400 mb-1 block">Texto del Botón</label>
                      <input
                        type="text"
                        value={hero.ctaText}
                        onChange={(e) => updateHero({ ctaText: e.target.value })}
                        className="w-full bg-black/60 border border-white/15 rounded-xl p-2.5 text-white text-xs focus:border-[#C2A88F] outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-stone-400 mb-1.5 block">Estilo Visual</label>
                      <div className="grid grid-cols-3 gap-1.5">
                        {[
                          { id: "gold-gradient", label: "Oro Champán" },
                          { id: "dark-glass", label: "Liquid Glass" },
                          { id: "champagne-outline", label: "Borde Fino" },
                        ].map((st) => (
                          <button
                            key={st.id}
                            onClick={() => updateHero({ ctaStyle: st.id as any })}
                            className={`py-1.5 px-1 rounded-lg border text-[11px] text-center transition-all ${
                              hero.ctaStyle === st.id
                                ? "bg-[#C2A88F] text-black font-bold border-[#C2A88F]"
                                : "bg-black/40 border-white/10 text-stone-400 hover:text-white"
                            }`}
                          >
                            {st.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. BACKGROUND OVERLAY */}
                <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-stone-200 font-bold">
                    <span className="flex items-center gap-1.5">
                      <Sun className="w-3.5 h-3.5 text-[#C2A88F]" />
                      Sombra del Fondo (Overlay)
                    </span>
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
            )}

            {/* TAB 2: SECTIONS REORDER & TOGGLE */}
            {activeTab === "sections" && (
              <div className="space-y-3">
                <p className="text-stone-400 text-[11px] leading-relaxed">
                  Activa, desactiva o reordena las secciones de tu página:
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
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          disabled={idx === sections.length - 1}
                          onClick={() => moveSection(idx, "down")}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 disabled:opacity-20 text-stone-300 transition-colors"
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
                  Aplica disposiciones rápidas con 1 clic:
                </p>

                <div className="space-y-2.5">
                  {[
                    {
                      id: "split-sky",
                      title: "1. Split Editorial (Cielo + Texto + Botón Abajo)",
                      desc: "JRG grande en el cielo, texto debajo del logo y botón abajo.",
                    },
                    {
                      id: "center-zen",
                      title: "2. JRG Centrado en el Cielo",
                      desc: "JRG y texto perfectamente centrados en el eje horizontal.",
                    },
                    {
                      id: "massive-top",
                      title: "3. JRG Masivo (34vw) + Texto en Rocas",
                      desc: "Logo masivo ocupando el cielo con texto flotando en medio.",
                    },
                    {
                      id: "clean-bottom",
                      title: "4. Clásico Bottom-Heavy",
                      desc: "Todo anclado abajo sobre las rocas oscuras.",
                    },
                  ].map((p) => (
                    <div
                      key={p.id}
                      onClick={() => applyPreset(p.id)}
                      className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#C2A88F]/50 transition-all cursor-pointer group"
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

        {/* 3. CENTER: LIVE CANVA-STYLE INTERACTIVE DRAGGABLE CANVAS */}
        <main className="flex-1 bg-[#050608] flex items-center justify-center p-2 sm:p-6 overflow-hidden relative">
          {/* Subtle blueprint grid */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(#FFFFFF 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />

          {/* Canvas bounds instruction tooltip */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/80 border border-white/15 px-4 py-1.5 rounded-full text-[11px] text-[#E1E0CC] flex items-center gap-2 z-40 backdrop-blur-md shadow-xl pointer-events-none">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Haz clic en cualquier elemento y <strong>arrástralo libremente</strong> por la pantalla.</span>
          </div>

          {/* DEVICE PREVIEW CONTAINER */}
          <div
            className={`transition-all duration-300 ease-out flex flex-col ${
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

            {/* INTERACTIVE DRAG-AND-DROP CANVAS */}
            <div
              ref={canvasRef}
              className="w-full h-full relative overflow-hidden bg-black select-none touch-none cursor-default"
              onClick={() => setSelectedElement("logo")}
            >
              {/* Background Video */}
              <video
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
                style={{
                  filter: `brightness(${hero.videoBrightness}) contrast(${hero.videoContrast})`,
                }}
              >
                <source src="/videos/hero-bg.mp4" type="video/mp4" />
                <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_170732_8a9ccda6-5cff-4628-b164-059c500a2b41.mp4" type="video/mp4" />
              </video>

              {/* Gradient overlay */}
              <div
                className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/85 pointer-events-none z-[2]"
                style={{ opacity: hero.overlayOpacity }}
              />

              {/* -----------------------------------------------------------------
                  DRAGGABLE ELEMENT 1: LOGO JRG
                  ----------------------------------------------------------------- */}
              <div
                onPointerDown={(e) => handlePointerDown(e, "logo")}
                className={`absolute z-30 transition-shadow touch-none select-none ${
                  isDragging && selectedElement === "logo" ? "cursor-grabbing" : "cursor-grab"
                } ${
                  selectedElement === "logo"
                    ? "ring-2 ring-[#C2A88F] ring-dashed rounded-xl p-1 bg-[#C2A88F]/10 shadow-[0_0_20px_rgba(194,168,143,0.3)]"
                    : "hover:ring-1 hover:ring-white/40 rounded-xl p-1"
                }`}
                style={{
                  left: `${positions.logo.x}%`,
                  top: `${positions.logo.y}%`,
                  fontSize:
                    viewport === "mobile"
                      ? `${hero.logoFontSizeMobile * 3.7}px`
                      : viewport === "tablet"
                      ? `${hero.logoFontSizeMobile * 7.4}px`
                      : `${hero.logoFontSizeDesktop}vw`,
                  letterSpacing: hero.logoTracking,
                }}
              >
                {/* Canva Tag pill */}
                {selectedElement === "logo" && (
                  <div className="absolute -top-6 left-0 bg-[#C2A88F] text-black text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md pointer-events-none uppercase font-mono">
                    <Move className="w-2.5 h-2.5" />
                    <span>Logo JRG · {Math.round(positions.logo.x)}%, {Math.round(positions.logo.y)}%</span>
                  </div>
                )}

                {/* 4 Corner Resize Dots */}
                {selectedElement === "logo" && (
                  <>
                    <div className="absolute -top-1.5 -left-1.5 w-3 h-3 rounded-full bg-white border-2 border-[#C2A88F] pointer-events-none" />
                    <div className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-white border-2 border-[#C2A88F] pointer-events-none" />
                    <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 rounded-full bg-white border-2 border-[#C2A88F] pointer-events-none" />
                    <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 rounded-full bg-white border-2 border-[#C2A88F] pointer-events-none" />
                  </>
                )}

                <WordsPullUp
                  text={hero.logoText || "JRG"}
                  showAsterisk={hero.showAsterisk}
                  className="font-medium leading-[0.85] pointer-events-none"
                />
              </div>

              {/* -----------------------------------------------------------------
                  DRAGGABLE ELEMENT 2: SUBTITLE TEXT
                  ----------------------------------------------------------------- */}
              {hero.showSubtitle && (
                <div
                  onPointerDown={(e) => handlePointerDown(e, "subtitle")}
                  className={`absolute z-30 transition-shadow touch-none select-none ${
                    isDragging && selectedElement === "subtitle" ? "cursor-grabbing" : "cursor-grab"
                  } ${
                    selectedElement === "subtitle"
                      ? "ring-2 ring-[#C2A88F] ring-dashed rounded-xl p-2 bg-[#C2A88F]/10 shadow-[0_0_20px_rgba(194,168,143,0.3)]"
                      : "hover:ring-1 hover:ring-white/40 rounded-xl p-2"
                  }`}
                  style={{
                    left: `${positions.subtitle.x}%`,
                    top: `${positions.subtitle.y}%`,
                    maxWidth: `${hero.subtitleMaxWidthMobile}px`,
                  }}
                >
                  {/* Canva Tag pill */}
                  {selectedElement === "subtitle" && (
                    <div className="absolute -top-6 left-0 bg-[#C2A88F] text-black text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md pointer-events-none uppercase font-mono">
                      <Type className="w-2.5 h-2.5" />
                      <span>Texto · {Math.round(positions.subtitle.x)}%, {Math.round(positions.subtitle.y)}%</span>
                    </div>
                  )}

                  {/* 4 Corner Resize Dots */}
                  {selectedElement === "subtitle" && (
                    <>
                      <div className="absolute -top-1.5 -left-1.5 w-3 h-3 rounded-full bg-white border-2 border-[#C2A88F] pointer-events-none" />
                      <div className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-white border-2 border-[#C2A88F] pointer-events-none" />
                      <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 rounded-full bg-white border-2 border-[#C2A88F] pointer-events-none" />
                      <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 rounded-full bg-white border-2 border-[#C2A88F] pointer-events-none" />
                    </>
                  )}

                  <p
                    className="leading-[1.35] font-normal drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] pointer-events-none"
                    style={{
                      fontSize: `${hero.subtitleFontSizeMobile}px`,
                      color: hero.subtitleColor,
                    }}
                  >
                    {hero.subtitleText}
                  </p>
                </div>
              )}

              {/* -----------------------------------------------------------------
                  DRAGGABLE ELEMENT 3: CTA BUTTON
                  ----------------------------------------------------------------- */}
              {hero.showCta && (
                <div
                  onPointerDown={(e) => handlePointerDown(e, "cta")}
                  className={`absolute z-30 transition-shadow touch-none select-none ${
                    isDragging && selectedElement === "cta" ? "cursor-grabbing" : "cursor-grab"
                  } ${
                    selectedElement === "cta"
                      ? "ring-2 ring-[#C2A88F] ring-dashed rounded-full p-1 bg-[#C2A88F]/10 shadow-[0_0_20px_rgba(194,168,143,0.3)]"
                      : "hover:ring-1 hover:ring-white/40 rounded-full p-1"
                  }`}
                  style={{
                    left: `${positions.cta.x}%`,
                    top: `${positions.cta.y}%`,
                  }}
                >
                  {/* Canva Tag pill */}
                  {selectedElement === "cta" && (
                    <div className="absolute -top-6 left-0 bg-[#C2A88F] text-black text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md pointer-events-none uppercase font-mono">
                      <Layout className="w-2.5 h-2.5" />
                      <span>Botón CTA · {Math.round(positions.cta.x)}%, {Math.round(positions.cta.y)}%</span>
                    </div>
                  )}

                  <div
                    className={`inline-flex items-center justify-between gap-2 group rounded-full pl-5 pr-2 py-2 text-sm font-medium transition-all duration-300 pointer-events-none ${
                      hero.ctaStyle === "dark-glass"
                        ? "bg-black/60 backdrop-blur-xl border border-white/20 text-[#E1E0CC] shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
                        : hero.ctaStyle === "champagne-outline"
                        ? "border-2 border-[#C2A88F] text-[#C2A88F] shadow-[0_10px_30px_rgba(194,168,143,0.15)]"
                        : "bg-gradient-to-r from-[#DEDBC8] via-[#C2A88F] to-[#A8896C] text-black shadow-[0_10px_30px_rgba(194,168,143,0.25)]"
                    }`}
                  >
                    <span className="font-alata tracking-tight font-bold">{hero.ctaText || "Iniciar proyecto"}</span>
                    {hero.showCtaArrow && (
                      <div className="bg-black rounded-full w-9 h-9 flex items-center justify-center transition-transform duration-300 ml-2 shadow-md">
                        <ArrowRight className="w-4 h-4 text-[#EFE8E1]" />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export const StudioDashboardPage: React.FC = () => {
  return (
    <LandingConfigProvider>
      <CanvaStudioInner />
    </LandingConfigProvider>
  );
};

export default StudioDashboardPage;
