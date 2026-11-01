import React from "react";
import LegalLayout from "./LegalLayout";
import { config } from "../../config";

export const AvisoLegal: React.FC = () => {
  return (
    <LegalLayout
      title="Aviso Legal"
      subtitle="Información legal del titular y condiciones de uso del sitio web en cumplimiento del artículo 10 de la Ley 34/2002 (LSSI-CE)."
      lastUpdated="Octubre 2026"
    >
      <section>
        <h2 className="text-base font-semibold text-white tracking-tight mb-3">
          1. Datos identificativos
        </h2>
        <p className="text-zinc-400 mb-4">
          En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE), se informa de los datos del titular:
        </p>

        <div className="space-y-2 py-3 px-4 rounded-xl bg-white/[0.02] border border-white/[0.06] text-xs font-mono text-zinc-300">
          <div><span className="text-zinc-500">Titular:</span> {config.developer.name} (JRG Agency)</div>
          <div><span className="text-zinc-500">Domicilio:</span> {config.social.location}</div>
          <div><span className="text-zinc-500">Email:</span> <a href={`mailto:${config.social.email}`} className="text-white hover:underline">{config.social.email}</a></div>
          <div><span className="text-zinc-500">Teléfono:</span> {config.social.phone}</div>
          <div><span className="text-zinc-500">Actividad:</span> Desarrollo web, interfaces 3D interactivas y consultoría técnica.</div>
        </div>
      </section>

      <section>
        <h2 className="text-base font-semibold text-white tracking-tight mb-3">
          2. Condiciones de acceso y uso
        </h2>
        <p className="text-zinc-400 mb-3">
          El acceso y navegación por este sitio web atribuye la condición de usuario e implica la aceptación de estas condiciones. El usuario se compromete a hacer un uso adecuado de los contenidos y funcionalidades del portal, absteniéndose de actividades ilícitas o lesivas para terceros.
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold text-white tracking-tight mb-3">
          3. Propiedad intelectual e industrial
        </h2>
        <p className="text-zinc-400 mb-3">
          Todos los elementos de este sitio web —incluidos diseños, código fuente, modelos 3D, animaciones, textos y logotipos— son propiedad exclusiva de JRG Agency o de sus respectivos licenciantes, estando protegidos por la legislación española e internacional sobre propiedad intelectual (Real Decreto Legislativo 1/1996).
        </p>
        <p className="text-zinc-400">
          Queda prohibida su reproducción, distribución o modificación sin autorización previa y por escrito.
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold text-white tracking-tight mb-3">
          4. Exclusión de responsabilidad
        </h2>
        <p className="text-zinc-400 mb-3">
          JRG Agency no se responsabiliza de los daños derivados de caídas técnicas, interferencias o elementos lesivos ajenos introducidos por terceros, si bien aplica estándares técnicos de seguridad para su prevención. Los enlaces a páginas externas se proporcionan únicamente como referencia y no implican control sobre sus contenidos.
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold text-white tracking-tight mb-3">
          5. Legislación y jurisdicción
        </h2>
        <p className="text-zinc-400">
          Estas condiciones se rigen por la legislación española. Para la resolución de cualquier controversia, las partes se someten a los Juzgados y Tribunales competentes de Gipuzkoa, salvo fuero legal imperativo de consumidores.
        </p>
      </section>
    </LegalLayout>
  );
};

export default AvisoLegal;
