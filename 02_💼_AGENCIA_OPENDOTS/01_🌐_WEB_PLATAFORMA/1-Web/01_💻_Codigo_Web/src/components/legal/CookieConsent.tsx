import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Shield, SlidersHorizontal, Check, X, Download } from "lucide-react";
import { legalTranslations, LegalLang } from "../../data/legalTranslations";

export interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  preferences: boolean;
  timestamp: string;
}

const STORAGE_KEY = "jrg_cookie_consent";

export const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasStoredConsent, setHasStoredConsent] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);
  const [preferencesEnabled, setPreferencesEnabled] = useState(false);

  const [lang, setLang] = useState<LegalLang>(() => {
    try {
      const saved = localStorage.getItem("jrg_lang_pref") as LegalLang;
      if (saved === "es" || saved === "eu" || saved === "en") return saved;
    } catch {}
    return "es";
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        setHasStoredConsent(false);
        const timer = setTimeout(() => setIsVisible(true), 700);
        return () => clearTimeout(timer);
      } else {
        setHasStoredConsent(true);
        const parsed: CookiePreferences = JSON.parse(stored);
        setAnalyticsEnabled(!!parsed.analytics);
        setPreferencesEnabled(!!parsed.preferences);
      }
    } catch {
      setIsVisible(true);
    }
  }, []);

  // Scroll listener para atenuar el cuadro o disparador persistente durante el scroll
  useEffect(() => {
    let timeoutId: any;
    const handleScroll = () => {
      setIsScrolled(true);
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsScrolled(false);
      }, 1000);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    const handleOpenSettings = () => {
      setIsModalOpen(true);
      setIsVisible(false);
    };

    const handleLangSync = (e: any) => {
      if (e.detail && (e.detail === "es" || e.detail === "eu" || e.detail === "en")) {
        setLang(e.detail);
      }
    };

    window.addEventListener("open-cookie-settings", handleOpenSettings);
    window.addEventListener("jrg-lang-changed", handleLangSync);
    return () => {
      window.removeEventListener("open-cookie-settings", handleOpenSettings);
      window.removeEventListener("jrg-lang-changed", handleLangSync);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isModalOpen) {
        setIsModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen]);

  const saveConsent = (prefs: CookiePreferences) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
      setAnalyticsEnabled(prefs.analytics);
      setPreferencesEnabled(prefs.preferences);
      setHasStoredConsent(true);
      setIsVisible(false);
      setIsModalOpen(false);
      setIsMinimized(false);

      window.dispatchEvent(new CustomEvent("cookie-consent-updated", { detail: prefs }));
    } catch (e) {
      console.error(e);
    }
  };

  const handleAcceptAll = () => {
    saveConsent({
      necessary: true,
      analytics: true,
      preferences: true,
      timestamp: new Date().toISOString(),
    });
  };

  const handleRejectNonEssential = () => {
    saveConsent({
      necessary: true,
      analytics: false,
      preferences: false,
      timestamp: new Date().toISOString(),
    });
  };

  const handleSaveCustom = () => {
    saveConsent({
      necessary: true,
      analytics: analyticsEnabled,
      preferences: preferencesEnabled,
      timestamp: new Date().toISOString(),
    });
  };

  const handleDownloadProof = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const prefs = stored
      ? JSON.parse(stored)
      : {
          necessary: true,
          analytics: analyticsEnabled,
          preferences: preferencesEnabled,
          timestamp: new Date().toISOString(),
        };

    const receipt = {
      issuer: "JRG Agency (Jakes Rodriguez)",
      location: "Urretxu, Gipuzkoa (Spain)",
      domain: "https://www.jrgagency.eus",
      legal_framework: "RGPD (UE 2016/679) & LSSI-CE 34/2002",
      consent_reference: "urn:jrg:consent:" + Math.random().toString(36).substring(2, 10),
      recorded_at: prefs.timestamp || new Date().toISOString(),
      consents: {
        technical_security: {
          status: "granted",
          legal_basis: "Art. 22.2 LSSI-CE (Exempt / Strictly Necessary)",
        },
        analytics_performance: {
          status: prefs.analytics ? "granted" : "denied",
          engine: "Vercel Analytics & Speed Insights",
        },
        preferences: {
          status: prefs.preferences ? "granted" : "denied",
          scope: "LocalStorage (Theme & Language)",
        },
      },
      audit: "Certified electronic consent record compliant with AEPD 2024-2026 guidelines.",
    };

    const blob = new Blob([JSON.stringify(receipt, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `jrg-consent-proof-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const t = legalTranslations[lang].cookies;

  return (
    <>
      {/* 1. DISPARADOR 1:1 COMPACTO EN LA ESQUINA INFERIOR IZQUIERDA */}
      {(hasStoredConsent || isMinimized) && !isVisible && !isModalOpen && (
        <aside
          className={`fixed bottom-5 left-4 sm:bottom-6 sm:left-6 z-40 select-none transition-all duration-300 ${
            isScrolled ? "opacity-35 hover:opacity-100" : "opacity-90 hover:opacity-100"
          }`}
        >
          <button
            type="button"
            onClick={() => {
              if (isMinimized) {
                setIsMinimized(false);
                setIsVisible(true);
              } else {
                setIsModalOpen(true);
              }
            }}
            className="group relative w-10 h-10 rounded-xl bg-[#0c0c10]/85 hover:bg-[#14141a] border border-white/12 hover:border-[#C2A88F]/50 backdrop-blur-2xl shadow-[0_8px_24px_-4px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.18)] flex items-center justify-center cursor-pointer transition-all duration-300 aspect-square hover:scale-105 active:scale-95"
            title={isMinimized ? "Abrir aviso de privacidad" : t.modalTitle}
            aria-label={isMinimized ? "Abrir aviso de privacidad" : t.modalTitle}
          >
            <Shield className="w-4 h-4 text-[#C2A88F] group-hover:scale-110 transition-transform" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400/90 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
          </button>
        </aside>
      )}

      {/* 2. CUADRO 1:1 COMPACTO & REFINADO - DARK LIQUID GLASS & BEIGE CÁLIDO */}
      {isVisible && !isMinimized && !isModalOpen && (
        <aside
          role="dialog"
          aria-label={t.title}
          className="fixed z-50 bottom-5 left-4 sm:bottom-6 sm:left-6 w-[240px] h-[240px] sm:w-[256px] sm:h-[256px] max-w-[calc(100vw-2rem)] aspect-square select-none font-sans transition-all duration-300"
        >
          <div className="relative w-full h-full overflow-hidden rounded-2xl bg-[#0c0c10]/92 backdrop-blur-2xl border border-white/12 shadow-[0_16px_40px_-8px_rgba(0,0,0,0.85),inset_0_1px_1px_rgba(255,255,255,0.18)] p-3.5 sm:p-4 text-zinc-300 flex flex-col justify-between">
            {/* Resplandor óptico especular sutil */}
            <div
              className="absolute -top-10 -left-10 w-28 h-28 bg-[#C2A88F]/12 blur-2xl rounded-full pointer-events-none"
              aria-hidden="true"
            />

            {/* Cabecera ultra-compacta */}
            <div className="flex items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-6 h-6 rounded-lg bg-white/[0.06] border border-white/10 flex items-center justify-center shrink-0">
                  <Shield className="w-3.5 h-3.5 text-[#C2A88F]" />
                </div>
                <div className="min-w-0 flex items-center gap-1.5">
                  <span className="text-[12px] font-semibold text-white tracking-tight truncate">
                    {t.title}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                </div>
              </div>

              {/* Minimizar */}
              <button
                type="button"
                onClick={() => setIsMinimized(true)}
                className="w-6 h-6 rounded-lg flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/5 transition-colors cursor-pointer shrink-0"
                title="Minimizar aviso"
                aria-label="Minimizar aviso"
              >
                <X className="w-3 h-3" />
              </button>
            </div>

            {/* Cuerpo proporcional: Micro-copy + chips de categorías */}
            <div className="my-auto py-1">
              <p className="text-[11px] text-zinc-400 leading-[1.4] line-clamp-2">
                {t.desc}
              </p>

              {/* Micro-indicadores de cookies */}
              <div className="flex items-center gap-1.5 my-2">
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-white/[0.03] border border-white/5 text-[9.5px] font-mono text-zinc-300">
                  <span className="w-1 h-1 rounded-full bg-emerald-400" />
                  {t.technical}
                </span>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-white/[0.03] border border-white/5 text-[9.5px] font-mono text-zinc-400">
                  <span className="w-1 h-1 rounded-full bg-zinc-500" />
                  {t.analytics}
                </span>
              </div>

              {/* Enlaces de configuración y legal */}
              <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-1.5 border-t border-white/5">
                <Link
                  to="/cookies"
                  className="hover:text-zinc-300 underline underline-offset-2 transition-colors"
                >
                  {t.moreInfo}
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(true);
                    setIsVisible(false);
                  }}
                  className="hover:text-[#C2A88F] text-zinc-400 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <SlidersHorizontal className="w-2.5 h-2.5 text-[#C2A88F]" />
                  <span>{t.configure}</span>
                </button>
              </div>
            </div>

            {/* Botones de acción equilibrados en cuadrícula 2 columnas */}
            <div className="grid grid-cols-2 gap-2 pt-1 shrink-0">
              {/* Botón Secundario: Rechazar / Solo esenciales */}
              <button
                type="button"
                onClick={handleRejectNonEssential}
                className="h-8 px-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-zinc-300 hover:text-white text-[11px] font-medium transition-all text-center cursor-pointer active:scale-95 flex items-center justify-center truncate"
                title={t.reject}
              >
                {t.reject}
              </button>

              {/* Botón Primario: Aceptar en Beige Cálido */}
              <button
                type="button"
                onClick={handleAcceptAll}
                className="h-8 px-2 rounded-xl bg-[#C2A88F] hover:bg-[#d4bca4] text-[#141414] font-semibold text-[11px] transition-all text-center cursor-pointer shadow-[0_2px_10px_rgba(194,168,143,0.35)] hover:shadow-[0_4px_16px_rgba(194,168,143,0.5)] active:scale-95 flex items-center justify-center gap-1 truncate"
                title={t.accept}
              >
                <Check className="w-3 h-3 stroke-[2.5]" />
                <span>{t.accept}</span>
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* 3. MODAL DE CONFIGURACIÓN GRANULAR - DARK FROSTED GLASS & BEIGE TOGGLES */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md font-sans select-none"
        >
          <div
            className="absolute inset-0 -z-10"
            onClick={() => setIsModalOpen(false)}
            aria-hidden="true"
          />

          <div className="bg-[#0c0c10]/95 border border-white/12 rounded-3xl max-w-md w-full p-6 shadow-[0_24px_64px_-12px_rgba(0,0,0,0.85),inset_0_1px_1px_rgba(255,255,255,0.18)] text-zinc-300 relative">
            <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center">
                  <Shield className="w-3.5 h-3.5 text-[#C2A88F]" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">{t.modalTitle}</h3>
                  <p className="text-[11px] text-zinc-500 mt-0.5">{t.modalSubtitle}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-500 hover:text-white p-1 rounded-full hover:bg-white/5 transition-colors cursor-pointer"
                aria-label="Cerrar modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs mb-5">
              {/* Técnicas */}
              <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-medium text-white text-xs">{t.technical}</span>
                    <span className="text-[10px] text-zinc-500">({t.active})</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-normal">
                    {t.technicalDesc}
                  </p>
                </div>
                <span className="text-[11px] text-emerald-400 font-mono pt-0.5 shrink-0">
                  {t.active}
                </span>
              </div>

              {/* Analíticas */}
              <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-medium text-white text-xs">{t.analytics}</span>
                    <span className="text-[10px] text-zinc-500">({t.optional})</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-normal">
                    {t.analyticsDesc}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setAnalyticsEnabled(!analyticsEnabled)}
                  className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer p-0.5 flex items-center shrink-0 ${
                    analyticsEnabled
                      ? "bg-[#C2A88F] shadow-[0_0_10px_rgba(194,168,143,0.4)]"
                      : "bg-zinc-800 border border-white/10"
                  }`}
                  role="switch"
                  aria-checked={analyticsEnabled}
                  aria-label="Toggle analytics cookies"
                >
                  <div
                    className={`w-4 h-4 rounded-full transition-transform ${
                      analyticsEnabled ? "translate-x-4 bg-[#141414]" : "translate-x-0 bg-zinc-400"
                    }`}
                  />
                </button>
              </div>

              {/* Preferencias */}
              <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-medium text-white text-xs">{t.preferences}</span>
                    <span className="text-[10px] text-zinc-500">({t.optional})</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-normal">
                    {t.preferencesDesc}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setPreferencesEnabled(!preferencesEnabled)}
                  className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer p-0.5 flex items-center shrink-0 ${
                    preferencesEnabled
                      ? "bg-[#C2A88F] shadow-[0_0_10px_rgba(194,168,143,0.4)]"
                      : "bg-zinc-800 border border-white/10"
                  }`}
                  role="switch"
                  aria-checked={preferencesEnabled}
                  aria-label="Toggle preferences cookies"
                >
                  <div
                    className={`w-4 h-4 rounded-full transition-transform ${
                      preferencesEnabled ? "translate-x-4 bg-[#141414]" : "translate-x-0 bg-zinc-400"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Acciones del pie */}
            <div className="flex flex-col sm:flex-row items-center justify-between pt-3 border-t border-white/5 gap-3">
              <div className="flex items-center gap-3 text-[11px]">
                <Link
                  to="/cookies"
                  onClick={() => setIsModalOpen(false)}
                  className="text-zinc-400 hover:text-white underline underline-offset-4"
                >
                  {t.moreInfo}
                </Link>
                <span className="text-zinc-700">|</span>
                <button
                  type="button"
                  onClick={handleDownloadProof}
                  className="text-zinc-400 hover:text-white underline underline-offset-4 cursor-pointer flex items-center gap-1"
                  title="Descargar comprobante de consentimiento en formato JSON"
                >
                  <Download className="w-3 h-3 text-[#C2A88F]" />
                  <span>{t.downloadProof}</span>
                </button>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleRejectNonEssential}
                  className="flex-1 sm:flex-initial px-3.5 py-1.5 rounded-full text-xs text-zinc-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer text-center"
                >
                  {t.reject}
                </button>
                <button
                  type="button"
                  onClick={handleSaveCustom}
                  className="flex-1 sm:flex-initial px-4 py-1.5 rounded-full bg-[#C2A88F] text-[#141414] hover:bg-[#d4bca4] text-xs font-medium transition-all cursor-pointer text-center shadow-[0_2px_10px_rgba(194,168,143,0.3)] active:scale-95"
                >
                  {t.save}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CookieConsent;
