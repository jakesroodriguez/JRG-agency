import React from "react";
import LegalLayout from "./LegalLayout";

export const PoliticaCookies: React.FC = () => {
  return (
    <LegalLayout
      title="Política de Cookies"
      subtitle="Compromiso de privacidad desde el diseño: sitio web 100% libre de cookies de rastreo y publicidad conforme al Art. 22.2 de la LSSI-CE."
      lastUpdated="Noviembre 2026"
    >
      <section>
        <h2 className="text-base font-semibold text-white tracking-tight mb-3">
          1. Filosofía Cookie-Free (Sin Rastreo de Terceros)
        </h2>
        <p className="text-zinc-400 mb-3 leading-relaxed">
          En <strong>JRG Agency</strong> creemos en la privacidad y en una experiencia de navegación limpia y sin fricciones. Por este motivo, este sitio web <strong>NO utiliza cookies de seguimiento publicitario, cookies analíticas de terceros ni perfiles comerciales</strong>.
        </p>
        <p className="text-zinc-400 mb-3 leading-relaxed">
          Al no instalarse elementos de rastreo sujetos a consentimiento previo conforme al artículo 22.2 de la Ley 34/2002 de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE), <strong>este sitio web no requiere mostrar molestos banners o paneles emergentes de cookies</strong>, permitiendo una navegación directa y respetuosa con tus derechos digitales.
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold text-white tracking-tight mb-3">
          2. Almacenamiento técnico estrictamente necesario
        </h2>
        <p className="text-zinc-400 mb-3 leading-relaxed">
          Únicamente se hace uso de mecanismos de almacenamiento local técnico (HTML5 LocalStorage) en tu propio dispositivo, con la exclusiva finalidad de recordar tus elecciones de uso durante la sesión o visitas posteriores:
        </p>
        <div className="overflow-x-auto border border-white/[0.06] rounded-xl mb-4">
          <table className="w-full text-xs text-left">
            <thead className="bg-white/[0.02] text-zinc-400 font-mono border-b border-white/[0.06]">
              <tr>
                <th className="p-3">Identificador</th>
                <th className="p-3">Tecnología</th>
                <th className="p-3">Finalidad</th>
                <th className="p-3">Tipo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] text-zinc-400 font-mono">
              <tr>
                <td className="p-3 text-zinc-200 font-medium">jrg_lang_pref</td>
                <td className="p-3">LocalStorage</td>
                <td className="p-3">Guardar el idioma seleccionado (ES, EU, EN)</td>
                <td className="p-3 text-emerald-400">Técnica (Exenta)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-base font-semibold text-white tracking-tight mb-3">
          3. Control del usuario desde el navegador
        </h2>
        <p className="text-zinc-400 mb-2 leading-relaxed">
          Aunque no instalamos cookies de seguimiento, puedes inspeccionar, bloquear o borrar cualquier dato almacenado en cualquier momento a través de la configuración de privacidad y almacenamiento de tu navegador (Chrome, Safari, Firefox o Edge).
        </p>
      </section>
    </LegalLayout>
  );
};

export default PoliticaCookies;
