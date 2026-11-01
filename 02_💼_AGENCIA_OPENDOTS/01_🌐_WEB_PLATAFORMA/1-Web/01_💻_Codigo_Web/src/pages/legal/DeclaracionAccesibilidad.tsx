import React from "react";
import LegalLayout from "./LegalLayout";
import { config } from "../../config";

export const DeclaracionAccesibilidad: React.FC = () => {
  return (
    <LegalLayout
      title="Declaración de Accesibilidad"
      subtitle="Compromiso con la inclusión digital conforme a la Ley 11/2023 y la norma UNE-EN 301549 (WCAG 2.1 AA)."
      lastUpdated="Octubre 2026"
    >
      <section>
        <h2 className="text-base font-semibold text-white tracking-tight mb-3">
          1. Compromiso
        </h2>
        <p className="text-zinc-400">
          JRG Agency trabaja continuamente para hacer sus contenidos y servicios digitales accesibles al mayor número de personas, procurando el cumplimiento de los estándares de accesibilidad WCAG 2.1 nivel AA.
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold text-white tracking-tight mb-3">
          2. Estado de conformidad
        </h2>
        <p className="text-zinc-400 mb-3">
          El portal es parcialmente conforme con las directrices de accesibilidad. Las medidas activas implementadas incluyen:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-zinc-400 text-xs sm:text-sm">
          <li>Navegación completa y tabulación por teclado.</li>
          <li>Contraste tipográfico adecuado sobre fondo oscuro.</li>
          <li>Respeto a las preferencias del sistema de reducción de movimiento (<code className="text-zinc-300">prefers-reduced-motion</code>).</li>
          <li>Marcado semántico HTML5 estructurado.</li>
        </ul>
        <p className="text-zinc-500 text-xs mt-3">
          Nota: Los experimentos gráficos y canvas 3D interactivos pueden requerir descripciones textuales complementarias para tecnologías de asistencia.
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold text-white tracking-tight mb-3">
          3. Contacto e incidencias
        </h2>
        <p className="text-zinc-400">
          Si encuentras cualquier barrera de accesibilidad o necesitas información en un formato alternativo, puedes escribir a <a href={`mailto:${config.social.email}`} className="text-white underline">{config.social.email}</a> indicando "Accesibilidad Web" en el asunto.
        </p>
      </section>
    </LegalLayout>
  );
};

export default DeclaracionAccesibilidad;
