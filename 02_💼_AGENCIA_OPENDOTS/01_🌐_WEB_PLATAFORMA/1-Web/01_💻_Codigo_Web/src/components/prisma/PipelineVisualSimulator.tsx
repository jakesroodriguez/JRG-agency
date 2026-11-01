import React, { useState } from "react";
import { Play, CheckCircle2, Cpu, RefreshCw, FileText, Send, Building2 } from "lucide-react";

interface WorkflowDemo {
  id: string;
  name: string;
  category: string;
  icon: React.ReactNode;
  source: string;
  aiTask: string;
  destination: string;
  timeSaved: string;
  description: string;
}

const WORKFLOWS: WorkflowDemo[] = [
  {
    id: "facturas",
    name: "Extracción de Facturas y Albaranes",
    category: "Administración & Finanzas",
    icon: <FileText className="w-4 h-4 text-[#C2A88F]" />,
    source: "PDF / Foto en WhatsApp o Correo",
    aiTask: "GPT-4o Vision OCR: CIF, Bases, IVA y Líneas de Producto",
    destination: "Holded ERP + Google Drive con Cifrado UE",
    timeSaved: "22h / mes",
    description: "Cada factura recibida por correo o WhatsApp se procesa en 1,4s, se valida y se sube contabilizada sin teclear un solo número."
  },
  {
    id: "leads",
    name: "Cualificación Inmediata de Clientes",
    category: "Ventas & Inmobiliaria / B2B",
    icon: <Send className="w-4 h-4 text-emerald-400" />,
    source: "Formulario Web o Mensaje WhatsApp",
    aiTask: "Agente IA: Análisis de presupuesto, zona y urgencia",
    destination: "CRM Notion / HubSpot + Aviso Prioritario en Slack",
    timeSaved: "18h / mes",
    description: "Filtra en 30 segundos si el cliente cumple tus requisitos y avisa al comercial por Slack con el resumen clave antes de llamar."
  },
  {
    id: "stock",
    name: "Sincronización de Pedidos y Proveedores",
    category: "Hostelería & Comercio Local",
    icon: <Building2 className="w-4 h-4 text-amber-400" />,
    source: "Albarán de Proveedor o Pedido Diario",
    aiTask: "Comprobación de Precios vs Tarifa + Cuadre de Almacén",
    destination: "Software TPV + Hoja de Control de Costes",
    timeSaved: "15h / mes",
    description: "Detecta subidas de precio de proveedores automáticamente y actualiza el margen de beneficio sin errores de cálculo."
  }
];

export const PipelineVisualSimulator: React.FC = () => {
  const [activeWorkflow, setActiveWorkflow] = useState<string>("facturas");
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationStep, setSimulationStep] = useState<number>(0);

  const current = WORKFLOWS.find((w) => w.id === activeWorkflow) || WORKFLOWS[0];

  const runSimulation = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setSimulationStep(1);

    setTimeout(() => setSimulationStep(2), 700);
    setTimeout(() => setSimulationStep(3), 1500);
    setTimeout(() => {
      setSimulationStep(4);
      setTimeout(() => setIsSimulating(false), 800);
    }, 2200);
  };

  return (
    <section className="py-20 md:py-28 px-4 sm:px-6 relative bg-zinc-950/70 border-t border-white/10 overflow-hidden">
      {/* Background glows */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[400px] bg-[radial-gradient(ellipse_at_center,rgba(194,168,143,0.12)_0%,rgba(0,0,0,0)_70%)] pointer-events-none -z-10"
      />

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-[#C2A88F]/30 backdrop-blur-md mb-4 shadow-[0_0_15px_rgba(194,168,143,0.15)]">
            <Cpu className="w-3.5 h-3.5 text-[#C2A88F]" />
            <span className="font-mono text-[11px] tracking-widest text-[#E1E0CC] uppercase">
              Simulador Interactivo de Flujos
            </span>
          </div>

          <h2 className="font-alata text-2xl sm:text-4xl font-bold text-white uppercase tracking-wide">
            Mira cómo fluyen los datos en tu empresa
          </h2>

          <p className="text-zinc-400 text-xs sm:text-sm mt-3 font-light leading-relaxed">
            Selecciona un caso de uso real y pulsa simular para comprobar la velocidad de ejecución y validación de extremo a extremo.
          </p>
        </div>

        {/* Workflow Selector Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10">
          {WORKFLOWS.map((wf) => {
            const isActive = wf.id === activeWorkflow;
            return (
              <button
                key={wf.id}
                type="button"
                onClick={() => {
                  setActiveWorkflow(wf.id);
                  setSimulationStep(0);
                  setIsSimulating(false);
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-mono transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#C2A88F] text-black font-semibold shadow-[0_0_15px_rgba(194,168,143,0.35)] scale-105"
                    : "bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 border border-white/10"
                }`}
              >
                <span>{wf.icon}</span>
                <span>{wf.name}</span>
              </button>
            );
          })}
        </div>

        {/* Interactive Simulator Stage */}
        <div className="rounded-3xl md:rounded-[2.5rem] bg-black/80 border border-[#C2A88F]/40 p-6 sm:p-10 shadow-[0_25px_60px_rgba(0,0,0,0.85)] relative">
          {/* Top Bar with simulation trigger */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10 mb-8">
            <div>
              <span className="text-[11px] font-mono text-[#C2A88F] uppercase tracking-wider">
                {current.category}
              </span>
              <h3 className="font-alata text-lg sm:text-xl font-bold text-white mt-1">
                {current.name}
              </h3>
            </div>

            <button
              type="button"
              onClick={runSimulation}
              disabled={isSimulating}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-mono font-semibold transition-all cursor-pointer ${
                isSimulating
                  ? "bg-emerald-500 text-black animate-pulse"
                  : "bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-[#C2A88F]/50"
              }`}
            >
              {isSimulating ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Procesando flujo...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current text-[#C2A88F]" />
                  <span>Simular Ejecución en Vivo</span>
                </>
              )}
            </button>
          </div>

          {/* 3 Steps Pipeline Nodes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Step 1: Ingesta */}
            <div
              className={`p-6 rounded-2xl border transition-all duration-300 ${
                simulationStep === 1 || simulationStep >= 1
                  ? "bg-zinc-900/90 border-[#C2A88F] shadow-[0_0_20px_rgba(194,168,143,0.2)]"
                  : "bg-zinc-950/60 border-white/10"
              }`}
            >
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-3">
                <span className="text-[#C2A88F] font-bold">FASE 01</span>
                <span>Ingesta Nativa</span>
              </div>
              <h4 className="font-alata text-base font-bold text-white mb-2">Entrada de Datos</h4>
              <p className="text-xs text-zinc-300 font-light leading-relaxed mb-4">
                {current.source}
              </p>
              <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Webhook Activo (0,2s)
              </div>
            </div>

            {/* Step 2: Extracción IA */}
            <div
              className={`p-6 rounded-2xl border transition-all duration-300 ${
                simulationStep === 2 || simulationStep >= 2
                  ? "bg-zinc-900/90 border-[#C2A88F] shadow-[0_0_20px_rgba(194,168,143,0.2)]"
                  : "bg-zinc-950/60 border-white/10"
              }`}
            >
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-3">
                <span className="text-[#C2A88F] font-bold">FASE 02</span>
                <span>Cerebro IA</span>
              </div>
              <h4 className="font-alata text-base font-bold text-white mb-2">Validación & OCR</h4>
              <p className="text-xs text-zinc-300 font-light leading-relaxed mb-4">
                {current.aiTask}
              </p>
              <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                100% Precisión Estructurada
              </div>
            </div>

            {/* Step 3: Sincronización ERP */}
            <div
              className={`p-6 rounded-2xl border transition-all duration-300 ${
                simulationStep === 3 || simulationStep === 4
                  ? "bg-zinc-900/90 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.25)]"
                  : "bg-zinc-950/60 border-white/10"
              }`}
            >
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-3">
                <span className="text-emerald-400 font-bold">FASE 03</span>
                <span>Destino Seguro</span>
              </div>
              <h4 className="font-alata text-base font-bold text-white mb-2">Acción Completada</h4>
              <p className="text-xs text-zinc-300 font-light leading-relaxed mb-4">
                {current.destination}
              </p>
              <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Cero Errores Manuales
              </div>
            </div>
          </div>

          {/* Description & Impact Footer */}
          <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-400">
            <p className="text-zinc-300 font-light max-w-xl text-center sm:text-left">
              {current.description}
            </p>
            <div className="px-4 py-2 rounded-full bg-white/[0.04] border border-[#C2A88F]/40 text-[#C2A88F] font-semibold shrink-0">
              ⚡ Ahorro estimado: {current.timeSaved}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PipelineVisualSimulator;
