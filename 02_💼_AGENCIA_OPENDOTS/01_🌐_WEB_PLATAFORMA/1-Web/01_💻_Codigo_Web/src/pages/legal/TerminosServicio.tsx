import React from "react";
import LegalLayout from "./LegalLayout";
import { config } from "../../config";

export const TerminosServicio: React.FC = () => {
  return (
    <LegalLayout
      title="Términos de Servicio"
      subtitle="Condiciones generales aplicables a la prestación de servicios de desarrollo y consultoría web."
      lastUpdated="Octubre 2026"
    >
      <section>
        <h2 className="text-base font-semibold text-white tracking-tight mb-3">
          1. Alcance y objeto
        </h2>
        <p className="text-zinc-400">
          Estas condiciones regulan la contratación de servicios de diseño, desarrollo web, experiencias 3D y soluciones de software ofrecidos por JRG Agency a clientes profesionales y particulares.
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold text-white tracking-tight mb-3">
          2. Presupuestos y contratación
        </h2>
        <p className="text-zinc-400 mb-3">
          Los proyectos se inician previa aceptación formal de una propuesta técnico-económica personalizada. Dicha propuesta detalla el alcance del desarrollo, hitos de entrega, tecnologías y honorarios pactados.
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold text-white tracking-tight mb-3">
          3. Precios y condiciones de pago
        </h2>
        <p className="text-zinc-400 mb-3">
          Los precios se expresan en euros (€) e indican si incluyen o no los impuestos aplicables (IVA en España). Salvo pacto en contrario, el pago se estructura habitualmente por hitos de entrega verificables.
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold text-white tracking-tight mb-3">
          4. Desistimiento y proyectos a medida
        </h2>
        <p className="text-zinc-400 mb-3">
          En contrataciones a distancia con consumidores, asiste el derecho de desistimiento de 14 días naturales, con la excepción prevista en el artículo 103.c del TRLGDCU relativa a bienes confeccionados conforme a especificaciones del cliente o claramente personalizados (desarrollo web y software a medida).
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold text-white tracking-tight mb-3">
          5. Garantía y soporte técnico
        </h2>
        <p className="text-zinc-400">
          Los desarrollos web entregados disponen de un periodo de garantía de conformidad de 60 días para la corrección sin coste de anomalías técnicas imputables al código implementado.
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold text-white tracking-tight mb-3">
          6. Resolución de litigios
        </h2>
        <p className="text-zinc-400 mb-2">
          Conforme al Reglamento (UE) 524/2013, la Comisión Europea facilita una plataforma de resolución de litigios en línea accesible en{" "}
          <a
            href="https://ec.europa.eu/consumers/odr"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white underline"
          >
            ec.europa.eu/consumers/odr
          </a>
          . Existen asimismo hojas de reclamaciones oficiales a disposición del consumidor a través de <a href={`mailto:${config.social.email}`} className="text-white underline">{config.social.email}</a>.
        </p>
      </section>
    </LegalLayout>
  );
};

export default TerminosServicio;
