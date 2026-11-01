import React, { useState, useEffect, useRef } from "react";
import { legalTranslations, LegalLang } from "../../data/legalTranslations";
import { config } from "../../config";

interface Message {
  role: "user" | "assistant";
  text: string;
  source?: string;
}

export const LegalAssistantModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [lang, setLang] = useState<LegalLang>("es");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const savedLang = (localStorage.getItem("jrg_lang_pref") as LegalLang) || "es";
    setLang(savedLang);

    const handleOpen = (e: any) => {
      setIsOpen(true);
      if (e.detail?.initialQuery) {
        handleSendMessage(e.detail.initialQuery);
      }
    };

    const handleLangSync = (e: any) => {
      if (e.detail && (e.detail === "es" || e.detail === "eu" || e.detail === "en")) {
        setLang(e.detail);
      }
    };

    window.addEventListener("open-legal-assistant", handleOpen);
    window.addEventListener("jrg-lang-changed", handleLangSync);
    return () => {
      window.removeEventListener("open-legal-assistant", handleOpen);
      window.removeEventListener("jrg-lang-changed", handleLangSync);
    };
  }, []);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const t = legalTranslations[lang].assistant;

  const handleSendMessage = async (textToSend: string) => {
    const query = textToSend.trim();
    if (!query || loading) return;

    const userMsg: Message = { role: "user", text: query };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/legal-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: query, lang }),
      });

      if (!res.ok) throw new Error("Network error");
      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: data.reply || (lang === "eu" ? "Ezin izan da kontsulta une honetan prozesatu." : lang === "en" ? "Could not process request at this time." : "No he podido procesar la consulta en este momento."),
          source: data.source,
        },
      ]);
    } catch {
      // Fallback local en frontend si no hay conexión
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: lang === "eu"
            ? "Pribatutasun edo datu ezabaketa edozein unetan bidera dezakezu " + config.social.email + " helbidera idatziz."
            : lang === "en"
            ? "You can manage any privacy request or data deletion directly by writing to " + config.social.email + "."
            : "Puedes tramitar cualquier solicitud de privacidad o baja directamente escribiendo a " + config.social.email + ".",
          source: "offline-fallback",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleFormalErasureEmail = () => {
    const subject = encodeURIComponent(
      lang === "eu"
        ? "Ezabatzeko Eskubidea (DBEO / RGPD 17. Artikulua)"
        : lang === "en"
        ? "Formal Right to Erasure Request (GDPR Art. 17)"
        : "Ejercicio de Derecho de Supresión / Borrado (RGPD Art. 17)"
    );
    const body = encodeURIComponent(
      lang === "eu"
        ? `Kaixo Jakes (JRG Agency),\n\nDatuak Babesteko Erregelamendu Orokorraren (DBEO) 17. artikuluaren eta LOPDGDD legearen babespean, nire datu pertsonal guztiak behin betiko ezabatzea eskatzen dut formalitate osoz.\n\nIzena edo Posta Elektronikoa: \nData: ${new Date().toLocaleDateString()}\n\nMila esker.`
        : lang === "en"
        ? `Dear Jakes (JRG Agency),\n\nPursuant to Article 17 of the General Data Protection Regulation (GDPR) and applicable data protection laws, I hereby request the immediate and permanent erasure of any personal data associated with me.\n\nName or Associated Email: \nDate: ${new Date().toLocaleDateString()}\n\nThank you.`
        : `Hola Jakes (JRG Agency),\n\nPor la presente, y al amparo del Artículo 17 del Reglamento General de Protección de Datos (RGPD) y la LOPDGDD, solicito formalmente la supresión y borrado definitivo de cualquier dato personal vinculado a mi persona.\n\nNombre o Email asociado: \nFecha: ${new Date().toLocaleDateString()}\n\nMuchas gracias.`
    );
    window.location.href = `mailto:${config.social.email}?subject=${subject}&body=${body}`;
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md font-sans select-none animate-in fade-in duration-200"
    >
      <div
        className="absolute inset-0 -z-10"
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      <div className="bg-[#0a0a0d] border border-white/10 rounded-2xl max-w-lg w-full flex flex-col h-[560px] shadow-2xl text-zinc-300 relative overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-white/[0.06] flex items-center justify-between shrink-0 bg-[#0c0c10]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-white tracking-tight">
                {t.title}
              </span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/[0.05] border border-white/10 text-zinc-400">
                Gemini API
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 mt-0.5">{t.subtitle}</p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-zinc-500 hover:text-white text-xs p-1 cursor-pointer transition-colors"
            aria-label="Cerrar asistente"
          >
            ✕
          </button>
        </div>

        {/* Chat Thread */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
          {messages.length === 0 ? (
            <div className="space-y-4 py-4">
              <p className="text-zinc-400 text-xs leading-relaxed">
                {lang === "eu"
                  ? "Kaixo, JRG Agency-ko pribatutasun laguntzailea naiz. Zure datuen tratamenduari buruzko zalantzak argitu edo edozein lege-eskaera bideratzen lagunduko dizut."
                  : lang === "en"
                  ? "Hello, I am JRG Agency's automated privacy assistant. I can help clarify data protection inquiries or assist in exercising your GDPR rights."
                  : "Hola, soy el asistente de privacidad de JRG Agency. Puedo informarte sobre el tratamiento de tus datos o ayudarte a tramitar cualquier solicitud legal."}
              </p>

              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block mb-2">
                  {t.suggestionsTitle}
                </span>
                <div className="space-y-1.5">
                  {t.suggestions.map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(s.prompt)}
                      className="w-full text-left p-2.5 rounded-lg bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.05] text-zinc-300 hover:text-white text-xs transition-colors cursor-pointer"
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Botón directo de borrado formal */}
              <div className="pt-2 border-t border-white/[0.05]">
                <button
                  onClick={handleFormalErasureEmail}
                  className="w-full py-2 px-3 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-zinc-300 hover:text-white text-[11px] flex items-center justify-between transition-colors cursor-pointer"
                >
                  <span>{t.eraseRequestAction}</span>
                  <span className="font-mono text-zinc-500">mailto ↗</span>
                </button>
              </div>
            </div>
          ) : (
            messages.map((m, i) => (
              <div
                key={i}
                className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`p-3 rounded-xl max-w-[85%] leading-relaxed ${
                    m.role === "user"
                      ? "bg-zinc-800 text-white border border-white/10"
                      : "bg-white/[0.03] text-zinc-300 border border-white/[0.05]"
                  }`}
                >
                  {m.text}
                </div>
                {m.source && (
                  <span className="text-[9px] font-mono text-zinc-600 mt-1 px-1">
                    {m.source === "gemini-api" ? "● Gemini API" : "● Offline Fallback"}
                  </span>
                )}
              </div>
            ))
          )}

          {loading && (
            <div className="flex items-center gap-2 text-zinc-500 text-xs py-2">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-pulse" />
              <span>
                {lang === "eu"
                  ? "Pribatutasun politika kontsultatzen..."
                  : lang === "en"
                  ? "Consulting privacy framework..."
                  : "Consultando política de privacidad..."}
              </span>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Input bar */}
        <div className="p-3 border-t border-white/[0.06] bg-[#0c0c10] shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(input);
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.placeholder}
              className="flex-1 px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white/20 transition-colors"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-3.5 py-2 rounded-lg bg-white text-black hover:bg-zinc-200 disabled:opacity-40 text-xs font-medium transition-colors cursor-pointer"
            >
              {t.send}
            </button>
          </form>
          <p className="text-[10px] text-zinc-600 text-center mt-2">
            {t.disclaimer}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LegalAssistantModal;