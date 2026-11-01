import React from "react";
import LegalLayout from "./LegalLayout";
import { config } from "../../config";

export const PoliticaPrivacidad: React.FC = () => {
  return (
    <LegalLayout
      title="Política de Privacidad"
      subtitle="Tratamiento de datos personales conforme al Reglamento General de Protección de Datos (RGPD UE 2016/679) y la Ley Orgánica 3/2018 (LOPDGDD)."
      lastUpdated="Octubre 2026"
    >
      <section>
        <h2 className="text-base font-semibold text-white tracking-tight mb-3">
          1. Responsable del tratamiento
        </h2>
        <div className="space-y-1.5 py-3 px-4 rounded-xl bg-white/[0.02] border border-white/[0.06] text-xs font-mono text-zinc-300">
          <div><span className="text-zinc-500">Identidad:</span> {config.developer.name} (JRG Agency)</div>
          <div><span className="text-zinc-500">Domicilio:</span> {config.social.location}</div>
          <div><span className="text-zinc-500">Contacto:</span> <a href={`mailto:${config.social.email}`} className="text-white hover:underline">{config.social.email}</a></div>
        </div>
      </section>

      <section>
        <h2 className="text-base font-semibold text-white tracking-tight mb-3">
          2. Finalidad y legitimación
        </h2>
        <p className="text-zinc-400 mb-3">
          Los datos recabados mediante formularios de contacto o comunicaciones directas se utilizan con los siguientes fines:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-zinc-400 text-xs sm:text-sm">
          <li>
            <strong className="text-zinc-200">Gestión de consultas y propuestas:</strong> Atención a solicitudes de presupuesto y dudas técnicas. Base legal: consentimiento del interesado (Art. 6.1.a RGPD).
          </li>
          <li>
            <strong className="text-zinc-200">Ejecución del servicio:</strong> En caso de contratación, desarrollo del proyecto y facturación. Base legal: ejecución de contrato y obligaciones fiscales (Art. 6.1.b y c RGPD).
          </li>
          <li>
            <strong className="text-zinc-200">Métricas técnicas anónimas:</strong> Medición de estabilidad y velocidad de carga con su consentimiento mediante cookies.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-base font-semibold text-white tracking-tight mb-3">
          3. Conservación de datos
        </h2>
        <p className="text-zinc-400">
          Los datos se conservarán durante el tiempo necesario para resolver la consulta o, en caso de relación contractual, durante los plazos legalmente exigidos por la normativa tributaria y mercantil (hasta 5-6 años).
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold text-white tracking-tight mb-3">
          4. Destinatarios
        </h2>
        <p className="text-zinc-400">
          No se ceden datos a terceros salvo imperativo legal. Los servicios de infraestructura técnica (alojamiento en Vercel, correo electrónico) se prestan bajo acuerdos conformes al Marco de Privacidad de Datos UE-EE.UU. y Cláusulas Contractuales Tipo.
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold text-white tracking-tight mb-3">
          5. Derechos del usuario
        </h2>
        <p className="text-zinc-400 mb-3">
          Puedes ejercer en cualquier momento tus derechos de acceso, rectificación, supresión, limitación, oposición y portabilidad escribiendo a <a href={`mailto:${config.social.email}`} className="text-white underline">{config.social.email}</a> con el asunto "Protección de Datos".
        </p>
        <p className="text-zinc-400">
          Si consideras que tus derechos no han sido atendidos, puedes formular una reclamación ante la Agencia Española de Protección de Datos (<a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer" className="text-zinc-300 underline">aepd.es</a>).
        </p>
      </section>
    </LegalLayout>
  );
};

export default PoliticaPrivacidad;
