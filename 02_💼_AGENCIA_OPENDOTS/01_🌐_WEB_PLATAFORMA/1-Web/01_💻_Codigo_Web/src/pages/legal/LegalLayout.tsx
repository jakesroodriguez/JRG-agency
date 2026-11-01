import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { legalTranslations, LegalLang } from "../../data/legalTranslations";

interface LegalLayoutProps {
  title: string;
  subtitle: string;
  lastUpdated: string;
  children: React.ReactNode;
}

export const LegalLayout: React.FC<LegalLayoutProps> = ({
  title,
  subtitle,
  lastUpdated,
  children,
}) => {
  const location = useLocation();
  const [lang, setLang] = useState<LegalLang>(() => {
    try {
      const saved = localStorage.getItem("jrg_lang_pref") as LegalLang;
      if (saved && (saved === "es" || saved === "eu" || saved === "en")) {
        return saved;
      }
    } catch {
      // fallback
    }
    return "es";
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const handleLangSync = (e: any) => {
      if (e.detail && (e.detail === "es" || e.detail === "eu" || e.detail === "en")) {
        setLang(e.detail);
      }
    };
    window.addEventListener("jrg-lang-changed", handleLangSync);
    return () => window.removeEventListener("jrg-lang-changed", handleLangSync);
  }, []);

  const handleLangChange = (newLang: LegalLang) => {
    setLang(newLang);
    try {
      localStorage.setItem("jrg_lang_pref", newLang);
      window.dispatchEvent(new CustomEvent("jrg-lang-changed", { detail: newLang }));
    } catch (err) {
      console.warn("Could not save lang preference:", err);
    }
  };


  const handleOpenAssistant = () => {
    window.dispatchEvent(new CustomEvent("open-legal-assistant"));
  };

  const tNav = legalTranslations[lang].nav;

  const navItems = [
    { path: "/aviso-legal", label: tNav.notice },
    { path: "/privacidad", label: tNav.privacy },
    { path: "/cookies", label: tNav.cookies },
    { path: "/terminos", label: tNav.terms },
    { path: "/accesibilidad", label: tNav.a11y },
  ];

  return (
    <div className="min-h-screen bg-[#070709] text-zinc-300 font-sans selection:bg-zinc-800 selection:text-white">
      {/* Top minimal bar */}
      <header className="sticky top-0 z-40 bg-[#070709]/85 backdrop-blur-md border-b border-white/[0.06]">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between text-xs">
          <Link
            to="/"
            className="text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5"
          >
            {tNav.back}
          </Link>

          <div className="flex items-center gap-3 sm:gap-4 text-zinc-400">
            {/* Asistente IA trigger */}
            <button
              type="button"
              onClick={handleOpenAssistant}
              className="text-zinc-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 px-2 py-1 rounded bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06]"
              title={tNav.privacyAssistant}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span className="hidden sm:inline">{tNav.privacyAssistant}</span>
              <span className="sm:hidden">IA</span>
            </button>

            <span className="text-zinc-700">|</span>

            {/* Language Selector */}
            <div className="flex items-center gap-1 bg-white/[0.03] p-0.5 rounded border border-white/[0.06] font-mono text-[10px]">
              {(["es", "eu", "en"] as LegalLang[]).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => handleLangChange(l)}
                  className={`px-1.5 py-0.5 rounded uppercase transition-colors cursor-pointer ${
                    lang === l
                      ? "bg-white text-black font-semibold shadow-xs"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                  aria-label={`Cambiar idioma a ${l}`}
                >
                  {l}
                </button>
              ))}
            </div>

            <span className="hidden sm:inline text-zinc-700">|</span>

            <button
              type="button"
              onClick={() => window.print()}
              className="hidden sm:inline hover:text-white transition-colors cursor-pointer"
            >
              {tNav.print}
            </button>

          </div>
        </div>
      </header>

      {/* Main container */}
      <div className="max-w-3xl mx-auto px-6 py-16 sm:py-20">
        {/* Document navigation tabs */}
        <nav className="flex flex-wrap items-center gap-2 mb-12 pb-4 border-b border-white/[0.06]">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`text-xs px-3 py-1.5 rounded-md transition-colors ${
                  isActive
                    ? "bg-white/[0.08] text-white font-medium"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Header */}
        <header className="mb-14">
          <div className="text-[11px] font-mono text-zinc-500 mb-3 tracking-wide">
            {lang === "eu" ? "Azken eguneratzea" : lang === "en" ? "Last updated" : "Última actualización"}: {lastUpdated}
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight mb-3">
            {title}
          </h1>
          <p className="text-sm text-zinc-400 leading-relaxed max-w-2xl">
            {subtitle}
          </p>
        </header>

        {/* Document Content */}
        <main className="space-y-12 text-sm text-zinc-300 leading-relaxed font-normal">
          {children}
        </main>

        {/* Footer */}
        <footer className="mt-20 pt-8 border-t border-white/[0.06] text-xs text-zinc-600 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            &copy; {new Date().getFullYear()} JRG Agency &middot; Jakes Rodriguez
          </div>
          <div className="flex items-center gap-4 text-zinc-500">
            <Link to="/aviso-legal" className="hover:text-zinc-300 transition-colors">{tNav.notice}</Link>
            <Link to="/privacidad" className="hover:text-zinc-300 transition-colors">{tNav.privacy}</Link>
            <Link to="/cookies" className="hover:text-zinc-300 transition-colors">{tNav.cookies}</Link>
            <Link to="/terminos" className="hover:text-zinc-300 transition-colors">{tNav.terms}</Link>
            <Link to="/accesibilidad" className="hover:text-zinc-300 transition-colors">{tNav.a11y}</Link>
          </div>
        </footer>

        {/* Technical security micro-badge */}
        <div className="mt-6 pt-4 border-t border-white/[0.04] text-[10px] font-mono text-zinc-600 text-center flex items-center justify-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/80"></span>
          <span>SSL 256-bit &middot; RGPD / AEPD Verificado &middot; Servidores UE &middot; Lighthouse 100/100</span>
        </div>
      </div>
    </div>
  );
};

export default LegalLayout;