import { useState, useMemo, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  FiMessageSquare,
  FiTrello,
  FiUsers,
  FiSend,
  FiPlus,
  FiLayers,
  FiActivity,
  FiArrowLeft,
  FiMaximize2,
  FiTool,
  FiVolume2,
  FiVolumeX,
  FiExternalLink,
  FiX
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import HermesOffice from "./HermesOffice3D";
import "./AgentOrchestratorPage.css";

// ============================================================================
// 1. DEFINICIÓN DE AGENTES Y MODELO DE DATOS DE JRG AGENCY
// ============================================================================

export interface Agent {
  id: string;
  name: string;
  shortName: string;
  role: string;
  floor: 1 | 2 | 3;
  status: "online" | "working" | "thinking";
  deskPos: [number, number, number];
  rotation: number;
  color: string;
  clothingColor: string;
  hairColor: string;
  emoji: string;
  description: string;
  currentTask: string;
  speechText: string;
}

const JRG_AGENTS: Agent[] = [
  {
    id: "jrg-aitor",
    name: "Aitor",
    shortName: "Aitor (CEO)",
    role: "Director de Operaciones & Estrategia",
    floor: 1,
    status: "working",
    deskPos: [0, 0, -3.2],
    rotation: 0,
    color: "#ffffff",
    clothingColor: "#181920",
    hairColor: "#111218",
    emoji: "AT",
    description: "Coordina la estrategia comercial, supervisa la asignación de metas y gestiona la entrega de proyectos en Gipuzkoa.",
    currentTask: "Supervisando el sprint semanal de digitalización para Goierri y Alto Urola.",
    speechText: "Kaixo! El pipeline de Goierri está activo. 30 leads prioritarios detectados hoy.",
  },
  {
    id: "jrg-maider",
    name: "Maider",
    shortName: "Maider",
    role: "Lead Scout & Inteligencia",
    floor: 2,
    status: "working",
    deskPos: [-4.2, 0, -0.5],
    rotation: Math.PI / 4,
    color: "#e4e4e7",
    clothingColor: "#22232a",
    hairColor: "#27272a",
    emoji: "MD",
    description: "Rastrea negocios locales en Google Maps e Instagram sin página web o con portales anticuados.",
    currentTask: "Extrayendo fichas en Zumarraga y Legazpi con más de 200 reseñas.",
    speechText: "Scraping completado en Zumarraga: 14 comercios sin menú responsive.",
  },
  {
    id: "jrg-iker",
    name: "Iker",
    shortName: "Iker",
    role: "Copywriting & Pitch Comercial",
    floor: 2,
    status: "thinking",
    deskPos: [-2.2, 0, 2.5],
    rotation: -Math.PI / 6,
    color: "#cbd5e1",
    clothingColor: "#27272a",
    hairColor: "#181920",
    emoji: "IK",
    description: "Genera argumentos de venta personalizados para WhatsApp y email marketing con alto ratio de respuesta.",
    currentTask: "Personalizando plantilla de contacto directo para restaurantes y bares locales.",
    speechText: "Mensaje listo para Restaurante Ezkiotarra con enlace a su demo interactiva.",
  },
  {
    id: "jrg-unai",
    name: "Unai",
    shortName: "Unai",
    role: "Tech Architect & Web Dev",
    floor: 3,
    status: "working",
    deskPos: [4.2, 0, -0.5],
    rotation: -Math.PI / 4,
    color: "#a1a1aa",
    clothingColor: "#16171d",
    hairColor: "#27272a",
    emoji: "UN",
    description: "Desarrolla arquitecturas web de ultra alta velocidad (React + Vite) e integraciones con n8n y WhatsApp API.",
    currentTask: "Optimizando tiempos de carga bajo 1 segundo en los bocetos digitales para clientes.",
    speechText: "Deploy en Vercel completado con 100/100 en Google Lighthouse.",
  },
  {
    id: "jrg-elena",
    name: "Elena",
    shortName: "Elena",
    role: "Data & Growth Analyst",
    floor: 1,
    status: "online",
    deskPos: [2.2, 0, 2.5],
    rotation: Math.PI / 6,
    color: "#d4d4d8",
    clothingColor: "#24252f",
    hairColor: "#3f3f46",
    emoji: "EL",
    description: "Calcula métricas de conversión, ahorro en costes para clientes y oportunidades en subvenciones Kit Digital.",
    currentTask: "Auditoría de retorno de inversión: ahorro de 142 horas mensuales estimado.",
    speechText: "Telemetría actualizada: tasa de apertura de WhatsApp proyectada en 38%.",
  },
];

// ============================================================================
// 2. LEADS REALES DE JRG AGENCY (3-LEADS / GOIERRI & ALTO UROLA)
// ============================================================================

interface LeadRecord {
  id: number;
  nombre: string;
  municipio: string;
  categoria: string;
  telefono: string;
  reviews: number;
  rating: number;
  slug: string;
  demoUrl: string;
  mensaje: string;
}

const JRG_REAL_LEADS: LeadRecord[] = [
  {
    id: 640,
    nombre: "Restaurante Ezkiotarra",
    municipio: "Zumarraga",
    categoria: "Restaurante",
    telefono: "943 72 29 64",
    reviews: 331,
    rating: 4.4,
    slug: "restaurante-ezkiotarra-zumarraga",
    demoUrl: "/demo/restaurante-ezkiotarra-zumarraga",
    mensaje: "Kaixo Restaurante Ezkiotarra! Soy Jakes de JRG Agency aquí en Urretxu. He visto vuestras excelentes reseñas pero no tenéis carta interactiva para móvil. Os preparé una demo: https://www.jrgagency.eus/demo/restaurante-ezkiotarra-zumarraga",
  },
  {
    id: 32,
    nombre: "Bar Oilarra",
    municipio: "Legazpi",
    categoria: "Bar & Pintxos",
    telefono: "605 76 49 16",
    reviews: 291,
    rating: 4.5,
    slug: "bar-oilarra-legazpi",
    demoUrl: "/demo/bar-oilarra-legazpi",
    mensaje: "Kaixo Bar Oilarra! Soy Jakes de JRG Agency. Vuestra puntuación en Google es fantástica, pero falta carta móvil y reservas online. Podéis revisar esta demo lista en 48h.",
  },
  {
    id: 54,
    nombre: "Estanko Laubide",
    municipio: "Legazpi",
    categoria: "Estanco & Prensa",
    telefono: "943 73 12 49",
    reviews: 574,
    rating: 4.4,
    slug: "estanko-laubide-legazpi",
    demoUrl: "/demo/estanko-laubide-legazpi",
    mensaje: "Kaixo Estanko Laubide! Soy Jakes de JRG Agency en Urretxu. Os he preparado un boceto móvil rápido para consulta de horarios y productos.",
  },
  {
    id: 667,
    nombre: "Urzubi Taberna",
    municipio: "Zumarraga",
    categoria: "Bar de Tapas",
    telefono: "943 55 95 04",
    reviews: 252,
    rating: 4.5,
    slug: "urzubi-taberna-zumarraga",
    demoUrl: "/demo/urzubi-taberna-zumarraga",
    mensaje: "Kaixo Urzubi Taberna! Os contacta Jakes de JRG Agency. Vuestros pintxos destacan en la zona, os preparé un escaparate digital para móvil.",
  },
  {
    id: 20,
    nombre: "Azpikoetxe Jatetxea",
    municipio: "Legazpi",
    categoria: "Restaurante Asador",
    telefono: "943 73 13 87",
    reviews: 238,
    rating: 4.4,
    slug: "azpikoetxe-jatetxea-legazpi",
    demoUrl: "/demo/azpikoetxe-jatetxea-legazpi",
    mensaje: "Kaixo Azpikoetxe Jatetxea! Desde JRG Agency os preparamos una propuesta de web y carta digital optimizada para comensales de la comarca.",
  },
  {
    id: 601,
    nombre: "Talleres Garagartza",
    municipio: "Zumarraga",
    categoria: "Automoción & Chapa",
    telefono: "943 72 18 20",
    reviews: 84,
    rating: 4.7,
    slug: "talleres-garagartza-zumarraga",
    demoUrl: "/demo/talleres-garagartza-zumarraga",
    mensaje: "Kaixo Talleres Garagartza! Soy Jakes de JRG Agency. Tenéis una valoración de 4.7 pero sin sistema de cita previa online. Aquí tenéis un prototipo.",
  },
  {
    id: 112,
    nombre: "Asesoría Goierri",
    municipio: "Urretxu",
    categoria: "Servicios Profesionales",
    telefono: "943 72 45 10",
    reviews: 42,
    rating: 4.8,
    slug: "asesoria-goierri-urretxu",
    demoUrl: "/demo/asesoria-goierri-urretxu",
    mensaje: "Kaixo Asesoría Goierri! Desde JRG Agency os hemos preparado un portal de captación de empresas y solicitudes Kit Digital.",
  },
];

// ============================================================================
// 3. TAREAS KANBAN (HERMES3D TASK PIPELINE)
// ============================================================================

interface KanbanTask {
  id: string;
  title: string;
  assignee: string;
  status: "backlog" | "in_progress" | "review" | "done";
  priority: "high" | "medium" | "low";
  category: string;
}

const INITIAL_TASKS: KanbanTask[] = [
  {
    id: "task-1",
    title: "Scrapear 50 nuevos negocios en Beasain y Ordizia",
    assignee: "Maider",
    status: "in_progress",
    priority: "high",
    category: "Scraping",
  },
  {
    id: "task-2",
    title: "Generar boceto web interactivo para Restaurante Ezkiotarra",
    assignee: "Unai",
    status: "done",
    priority: "high",
    category: "Desarrollo",
  },
  {
    id: "task-3",
    title: "Redactar 15 guiones de prospección directa por WhatsApp",
    assignee: "Iker",
    status: "in_progress",
    priority: "medium",
    category: "Copywriting",
  },
  {
    id: "task-4",
    title: "Auditoría de elegibilidad Kit Digital (Segmento III - 3.000€)",
    assignee: "Elena",
    status: "review",
    priority: "medium",
    category: "Subvenciones",
  },
  {
    id: "task-5",
    title: "Reunión de coordinación semanal y revisión de KPIs",
    assignee: "Aitor",
    status: "backlog",
    priority: "low",
    category: "Estrategia",
  },
];

// ============================================================================
// 4. JUKEBOX LO-FI SYNTHESIZER (HERMES3D SPOTIFY/JUKEBOX WEBAUDIO ENGINE)
// ============================================================================

class WebAudioLoFiSynth {
  private ctx: AudioContext | null = null;
  private isRunning: boolean = false;
  private intervalId: number | null = null;
  private chordIndex: number = 0;

  // Progresión Chillwave Pentatónica (Fmaj7 -> Em7 -> Dm7 -> Cmaj7)
  private chords: number[][] = [
    [174.61, 220.00, 261.63, 329.63], // Fmaj7
    [164.81, 196.00, 246.94, 293.66], // Em7
    [146.83, 174.61, 220.00, 261.63], // Dm7
    [130.81, 164.81, 196.00, 246.94], // Cmaj7
  ];

  public toggle(): boolean {
    if (this.isRunning) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  public start() {
    if (this.isRunning) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.isRunning = true;
      this.playNextChord();
      this.intervalId = window.setInterval(() => {
        this.playNextChord();
      }, 4000);
    } catch {
      // AudioContext bloqueado o no disponible
    }
  }

  public stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (this.ctx) {
      this.ctx.close().catch(() => {});
      this.ctx = null;
    }
    this.isRunning = false;
  }

  private playNextChord() {
    if (!this.ctx || !this.isRunning) return;
    const now = this.ctx.currentTime;
    const chord = this.chords[this.chordIndex % this.chords.length];
    this.chordIndex++;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(650, now);
    filter.Q.setValueAtTime(2.5, now);

    const masterGain = this.ctx.createGain();
    masterGain.gain.setValueAtTime(0.001, now);
    masterGain.gain.exponentialRampToValueAtTime(0.08, now + 0.8);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 3.8);

    filter.connect(masterGain);
    masterGain.connect(this.ctx.destination);

    chord.forEach((freq) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, now);
      osc.connect(filter);
      osc.start(now);
      osc.stop(now + 3.9);
    });
  }

  public getStatus(): boolean {
    return this.isRunning;
  }
}

const loFiSynth = new WebAudioLoFiSynth();

// (Mobiliario y entorno 3D implementados en HermesOffice3D.tsx)

export default function AgentOrchestratorPage() {
  const [agents] = useState<Agent[]>(JRG_AGENTS);
  const [selectedAgentId, setSelectedAgentId] = useState<string>("jrg-aitor");
  const [activeTab, setActiveTab] = useState<"chat" | "kanban" | "leads" | "skills" | "telemetry">("chat");
  const [viewMode, setViewMode] = useState<"3d" | "tactical">("3d");

  // Detección inicial de móvil
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth <= 850;
    }
    return false;
  });

  // En móvil el drawer empieza CERRADO para que la oficina 3D sea lo primero que se ve
  const [drawerOpen, setDrawerOpen] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth > 850;
    }
    return true;
  });

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 850;
      setIsMobile(mobile);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [tasks, setTasks] = useState<KanbanTask[]>(INITIAL_TASKS);
  const [newTaskInput, setNewTaskInput] = useState<string>("");
  const [isJukeboxPlaying, setIsJukeboxPlaying] = useState<boolean>(false);
  const [leadSearch, setLeadSearch] = useState<string>("");

  // Historial de Mensajes de Chat
  const [chatHistory, setChatHistory] = useState<Record<string, { role: "user" | "assistant"; text: string }[]>>({
    "jrg-aitor": [
      {
        role: "assistant",
        text: "⚡ Kaixo! Soy Aitor, Director de Operaciones en JRG Agency. Tenemos 5 agentes activos y 30 leads prioritarios detectados en Goierri y Alto Urola. ¿Qué objetivo quieres coordinar hoy?",
      },
    ],
    "jrg-maider": [
      {
        role: "assistant",
        text: "🎯 Aupa! Soy Maider, Scout de Inteligencia. He completado el rastreo de Google Maps en Zumarraga y Legazpi. He localizado 12 restaurantes y talleres con más de 200 reseñas que siguen sin carta digital ni web móvil optimizada.",
      },
    ],
    "jrg-iker": [
      {
        role: "assistant",
        text: "🧠 Egun on! Soy Iker, especialista en copy comercial. He redactado un mensaje de WhatsApp hiper-personalizado para cada lead con su enlace de demostración en vivo listo para enviar con 1 clic.",
      },
    ],
    "jrg-unai": [
      {
        role: "assistant",
        text: "💻 Kaixo! Soy Unai, Arquitecto Técnico. Todos los prototipos web de JRG están construidos con React + Vite y Three.js, cargando en menos de 0.8s en smartphones para garantizar máxima conversión.",
      },
    ],
    "jrg-elena": [
      {
        role: "assistant",
        text: "📊 Kaixo! Soy Elena, Analista de Datos. Estamos proyectando un ahorro mensual de más de 140 horas de trabajo para clientes y una tasa de respuesta inicial por WhatsApp superior al 35%.",
      },
    ],
  });

  const [inputMessage, setInputMessage] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const selectedAgent = useMemo(
    () => agents.find((a) => a.id === selectedAgentId) || agents[0],
    [agents, selectedAgentId]
  );

  // Toggle del Jukebox Lo-Fi
  const handleToggleJukebox = useCallback(() => {
    const running = loFiSynth.toggle();
    setIsJukeboxPlaying(running);
  }, []);

  useEffect(() => {
    return () => {
      loFiSynth.stop();
    };
  }, []);

  // Enviar Mensaje al Agente
  const handleSendMessage = (textToSend?: string) => {
    const message = (textToSend || inputMessage).trim();
    if (!message || isTyping) return;

    setChatHistory((prev) => ({
      ...prev,
      [selectedAgentId]: [
        ...(prev[selectedAgentId] || []),
        { role: "user", text: message },
      ],
    }));

    if (!textToSend) setInputMessage("");
    setIsTyping(true);

    setTimeout(() => {
      let reply = "";
      const lower = message.toLowerCase();

      if (selectedAgentId === "jrg-aitor") {
        if (lower.includes("lead") || lower.includes("prospecc")) {
          reply = "Perfecto. He ordenado a Maider e Iker priorizar los comercios con más de 200 reseñas en Google sin web activa. El lote de hoy incluye a Restaurante Ezkiotarra y Bar Oilarra.";
        } else if (lower.includes("kit digital") || lower.includes("subvenc")) {
          reply = "Las pymes de 0 a menos de 3 empleados en Gipuzkoa pueden solicitar hasta 3.000€ en el Segmento III. Tenemos la propuesta paquetizada para cubrir web + posicionamiento al 100%.";
        } else {
          reply = `Entendido. Asigno este objetivo al pipeline de JRG Agency. Coordinaré a Unai para la parte técnica y a Elena para la telemetría de conversión.`;
        }
      } else if (selectedAgentId === "jrg-maider") {
        reply = `He analizado la zona: detectados 30 comercios clave en Zumarraga, Urretxu y Legazpi. El 80% tiene teléfono móvil directo disponible en la pestaña de Leads CRM.`;
      } else if (selectedAgentId === "jrg-iker") {
        reply = `He generado el mensaje con gancho local: 'Kaixo! Os habla Jakes de JRG Agency en Urretxu. Vuestra puntuación es top pero falta web móvil...' Puedes enviarlo directamente desde la tabla de Leads.`;
      } else if (selectedAgentId === "jrg-unai") {
        reply = `Arquitectura lista: Web responsive en React 18, Vite y despliegue instantáneo en Vercel con CDN en París/Frankfurt para mínima latencia.`;
      } else {
        reply = `Métrica procesada: Con 30 contactos directos y un ratio conservador del 10% de cierre a 400€, el impacto de facturación proyectado es de +1.200€ esta semana.`;
      }

      setChatHistory((prev) => ({
        ...prev,
        [selectedAgentId]: [
          ...(prev[selectedAgentId] || []),
          { role: "assistant", text: reply },
        ],
      }));
      setIsTyping(false);
    }, 900);
  };

  // Filtrado de Leads
  const filteredLeads = useMemo(() => {
    if (!leadSearch.trim()) return JRG_REAL_LEADS;
    const q = leadSearch.toLowerCase();
    return JRG_REAL_LEADS.filter(
      (l) =>
        l.nombre.toLowerCase().includes(q) ||
        l.municipio.toLowerCase().includes(q) ||
        l.categoria.toLowerCase().includes(q)
    );
  }, [leadSearch]);

  // Agregar Tarea Kanban
  const handleAddTask = () => {
    if (!newTaskInput.trim()) return;
    const newTask: KanbanTask = {
      id: `task-${Date.now()}`,
      title: newTaskInput.trim(),
      assignee: selectedAgent.shortName,
      status: "in_progress",
      priority: "high",
      category: "Operaciones",
    };
    setTasks([newTask, ...tasks]);
    setNewTaskInput("");
  };

  return (
    <div className="jrg-orchestrator-root">
      {/* ====================================================================
          BARRA SUPERIOR HERMES HUD (MONOCROMO NEGRO, BLANCO Y GRIS)
          ==================================================================== */}
      <div className="hm-hud-top-bar">
        {/* Izquierda: Volver a Web + Brand Logo Oficial + Botón KANBAN */}
        <div className="hm-hud-left">
          <Link to="/" className="hm-icon-btn" title="Volver a la Web Principal">
            <FiArrowLeft />
          </Link>
          <div className="hm-hud-brand-pill">
            <img src="/logoJRG.png" alt="JRG" className="hm-hud-brand-logo" />
            <span className="hm-hud-brand-title">JRG AGENCY</span>
          </div>
          <button
            className="hm-btn-kanban"
            onClick={() => {
              setActiveTab("kanban");
              setDrawerOpen(true);
            }}
          >
            <FiTrello /> [ KANBAN ]
          </button>
        </div>

        {/* Centro: JRG HEADQUARTERS + Píldora de Agentes Monocromo */}
        <div className="hm-hud-center">
          <div className="hm-hq-title">JRG HEADQUARTERS</div>
          <div className="hm-agents-pill">
            <div className="hm-agent-dots">
              {agents.map((ag) => (
                <div
                  key={`hud-ag-${ag.id}`}
                  className="hm-agent-avatar-circle"
                  style={{
                    outline: ag.id === selectedAgentId ? "2px solid #ffffff" : "none",
                  }}
                  onClick={() => setSelectedAgentId(ag.id)}
                  title={`${ag.name} (${ag.role})`}
                >
                  {ag.emoji}
                </div>
              ))}
            </div>
            <span className="hm-count-label">5/5 ONLINE</span>
          </div>
        </div>

        {/* Derecha: + ADD Tarea, Status Conectado, Lo-Fi Audio, y Vista 2D/3D */}
        <div className="hm-hud-right">
          <button
            className="hm-icon-btn"
            title="Crear Nueva Tarea"
            onClick={() => {
              setActiveTab("kanban");
              setDrawerOpen(true);
            }}
          >
            <FiPlus />
          </button>
          <div className="hm-btn-connected">
            <span className="hm-dot-white" />
            <span>JRG-AGENT • CONECTADO</span>
          </div>
          <button
            className="hm-icon-btn"
            onClick={handleToggleJukebox}
            title={isJukeboxPlaying ? "Detener Lo-Fi Beats" : "Reproducir Lo-Fi Beats"}
          >
            {isJukeboxPlaying ? <FiVolume2 color="#ffffff" /> : <FiVolumeX color="#71717a" />}
          </button>
          {isMobile ? (
            <button
              className="hm-icon-btn"
              onClick={() => setDrawerOpen(!drawerOpen)}
              title={drawerOpen ? "Ver Oficina 3D" : "Abrir Panel"}
            >
              {drawerOpen ? <FiMaximize2 /> : <FiMessageSquare />}
            </button>
          ) : (
            <button
              className="hm-icon-btn"
              onClick={() => setViewMode(viewMode === "3d" ? "tactical" : "3d")}
              title={viewMode === "3d" ? "Ver Tablero Táctico 2D" : "Ver Oficina 3D"}
            >
              <FiLayers />
            </button>
          )}
        </div>
      </div>

      {/* Pestañas Verticales del Margen Derecho */}
      <div className="hm-side-dock">
        <button
          className="hm-side-tab"
          onClick={() => setSelectedAgentId("jrg-aitor")}
          title="Centrar en el Cuartel General"
        >
          OPEN HQ
        </button>
        <button
          className="hm-side-tab"
          onClick={() => {
            setActiveTab("skills");
            setDrawerOpen(true);
          }}
          title="Ver Capacidades de la Agencia"
        >
          CAPACIDADES
        </button>
        <button
          className="hm-side-tab"
          onClick={() => {
            setActiveTab("telemetry");
            setDrawerOpen(true);
          }}
          title="Ver Rendimiento y ROI"
        >
          RENDIMIENTO
        </button>
      </div>

      {/* Consola de Eventos Inferior */}
      <div className={`hm-event-console ${!drawerOpen ? "drawer-closed" : ""}`}>
        <span className="hm-dot-white" />
        <span className="hm-console-title">AGENT OPS</span>
        <span>5 AGENTES | PIPELINE ACTIVO</span>
        <button
          className="hm-console-btn"
          onClick={() => {
            setActiveTab("leads");
            setDrawerOpen(true);
          }}
        >
          LEADS ({filteredLeads.length})
        </button>
        <button
          className="hm-console-btn"
          onClick={() => {
            setActiveTab("chat");
            setDrawerOpen(true);
          }}
        >
          TERMINAL
        </button>
      </div>

      {/* Botón CHAT Flotante Inferior Derecho */}
      {!drawerOpen && (
        <button
          className="hm-btn-chat"
          onClick={() => {
            setActiveTab("chat");
            setDrawerOpen(true);
          }}
          title="Abrir Terminal de Comunicación"
        >
          <FiMessageSquare /> TERMINAL
        </button>
      )}

      {/* ====================================================================
          CUERPO PRINCIPAL DEL ORQUESTADOR
          ==================================================================== */}
      <div className="jrg-orchestrator-body">
        {/* ====================================================================
            PANEL DE CONTROL LATERAL (DOCK IZQUIERDO - 100% MONOCROMO)
            ==================================================================== */}
        <aside className={`jrg-orchestrator-drawer ${!drawerOpen ? "closed" : ""}`}>
          {/* Pestaña flotante para abrir/cerrar en desktop (en el lateral derecho del panel) */}
          {!isMobile && (
            <button
              className="jrg-drawer-toggle-tab"
              onClick={() => setDrawerOpen(!drawerOpen)}
              title="Abrir/Cerrar Panel"
            >
              {drawerOpen ? <FiArrowLeft /> : <FiMessageSquare />}
            </button>
          )}

          {/* Barra superior de cierre exclusiva para móvil dentro del drawer */}
          <div className="jrg-drawer-mobile-header">
            <span className="jrg-drawer-mobile-title">
              <img src="/logoJRG.png" alt="JRG" style={{ width: 22, height: 22, borderRadius: "50%", background: "#fff" }} />
              <span>{selectedAgent.name} • {selectedAgent.role}</span>
            </span>
            <button
              className="jrg-drawer-mobile-close-btn"
              onClick={() => setDrawerOpen(false)}
            >
              <FiX style={{ verticalAlign: "middle", marginRight: "4px" }} /> Oficina 3D
            </button>
          </div>

          {/* Cabecera de Marca Oficial JRG en el Panel */}
          <div className="jrg-sidebar-header">
            <div className="jrg-sidebar-brand">
              <img src="/logoJRG.png" alt="JRG Agency" className="jrg-sidebar-logo" />
              <div>
                <span className="jrg-sidebar-title">JRG AGENCY</span>
                <span className="jrg-sidebar-subtitle">AGENT ORCHESTRATION</span>
              </div>
            </div>
            <div className="jrg-sidebar-status">
              <span className="jrg-mono-pulse-dot" />
              <span>5 AGENTES</span>
            </div>
          </div>

          {/* Selector de Pestañas Segmentado */}
          <div className="jrg-drawer-tabs">
            <button
              className={`jrg-tab-item ${activeTab === "kanban" ? "active" : ""}`}
              onClick={() => setActiveTab("kanban")}
            >
              <FiTrello /> Kanban
            </button>
            <button
              className={`jrg-tab-item ${activeTab === "chat" ? "active" : ""}`}
              onClick={() => setActiveTab("chat")}
            >
              <FiMessageSquare /> Terminal
            </button>
            <button
              className={`jrg-tab-item ${activeTab === "leads" ? "active" : ""}`}
              onClick={() => setActiveTab("leads")}
            >
              <FiUsers /> Leads <span className="jrg-tab-counter">{filteredLeads.length}</span>
            </button>
            <button
              className={`jrg-tab-item ${activeTab === "skills" ? "active" : ""}`}
              onClick={() => setActiveTab("skills")}
            >
              <FiTool /> Capacidades
            </button>
            <button
              className={`jrg-tab-item ${activeTab === "telemetry" ? "active" : ""}`}
              onClick={() => setActiveTab("telemetry")}
            >
              <FiActivity /> ROI
            </button>
          </div>

          <div className="jrg-drawer-content">
            {/* TAB 1: KANBAN PIPELINE */}
            {activeTab === "kanban" && (
              <div className="jrg-kanban-container">
                {/* Input para Nueva Tarea */}
                <div className="jrg-kanban-input-bar">
                  <input
                    type="text"
                    className="jrg-kanban-input"
                    placeholder="Nueva tarea para la flota de agentes..."
                    value={newTaskInput}
                    onChange={(e) => setNewTaskInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
                  />
                  <button className="jrg-kanban-add-btn" onClick={handleAddTask}>
                    <FiPlus /> Añadir
                  </button>
                </div>

                {(["in_progress", "review", "done", "backlog"] as const).map((statusKey) => {
                  const colTasks = tasks.filter((t) => t.status === statusKey);
                  const labels = {
                    in_progress: "En Ejecución",
                    review: "En Revisión",
                    done: "Finalizadas",
                    backlog: "Cola de Tareas",
                  };
                  return (
                    <div key={statusKey} className="jrg-kanban-col">
                      <div className="jrg-kanban-col-header">
                        <div className="jrg-col-title-wrap">
                          <span className={`jrg-col-dot ${statusKey}`} />
                          <span>{labels[statusKey]}</span>
                        </div>
                        <span className="jrg-col-count-badge">{colTasks.length}</span>
                      </div>
                      {colTasks.map((task) => (
                        <div key={task.id} className="jrg-kanban-card">
                          <div className="jrg-task-title">{task.title}</div>
                          <div className="jrg-task-meta">
                            <div className="jrg-task-assignee-badge">
                              <span className="jrg-assignee-initials">
                                {task.assignee.slice(0, 2).toUpperCase()}
                              </span>
                              <span>@{task.assignee}</span>
                            </div>
                            <span className={`jrg-task-priority ${task.priority}`}>
                              {task.priority === "high" ? "ALTA" : task.priority === "medium" ? "MEDIA" : "BAJA"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            )}

            {/* TAB 2: TERMINAL / CHAT EJECUTIVO */}
            {activeTab === "chat" && (
              <div className="jrg-chat-container">
                {/* Cabecera del Agente Actual */}
                <div className="jrg-agent-header-card">
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div className="jrg-agent-avatar-badge">
                      {selectedAgent.emoji}
                    </div>
                    <div className="jrg-agent-info">
                      <h3>{selectedAgent.name}</h3>
                      <p>{selectedAgent.role}</p>
                    </div>
                  </div>
                  <span className="jrg-agent-status-tag">
                    {selectedAgent.status.toUpperCase()}
                  </span>
                </div>

                {/* Historial de Mensajes */}
                <div className="jrg-chat-messages">
                  {(chatHistory[selectedAgentId] || []).map((msg, idx) => (
                    <div key={idx} className={`jrg-chat-msg ${msg.role}`}>
                      <span className="jrg-msg-author">
                        {msg.role === "user" ? "Tú (Jakes)" : selectedAgent.name}
                      </span>
                      <div className="jrg-msg-bubble">{msg.text}</div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="jrg-chat-msg assistant">
                      <span className="jrg-msg-author">{selectedAgent.name}</span>
                      <div className="jrg-msg-bubble" style={{ color: "#a1a1aa" }}>
                        ● Procesando solicitud en tiempo real...
                      </div>
                    </div>
                  )}
                </div>

                {/* Botones de Consulta Rápida */}
                <div className="jrg-quick-prompts">
                  <button
                    className="jrg-quick-prompt-btn"
                    onClick={() => handleSendMessage("Analiza los mejores comercios en Zumarraga")}
                  >
                    Leads Zumarraga
                  </button>
                  <button
                    className="jrg-quick-prompt-btn"
                    onClick={() => handleSendMessage("¿Cómo paquetizamos el Kit Digital para hostelería?")}
                  >
                    Kit Digital 3.000€
                  </button>
                  <button
                    className="jrg-quick-prompt-btn"
                    onClick={() => handleSendMessage("Prepara el mensaje para Restaurante Ezkiotarra")}
                  >
                    Pitch WhatsApp
                  </button>
                </div>

                {/* Input Bar */}
                <div className="jrg-chat-input-bar">
                  <input
                    type="text"
                    className="jrg-chat-input"
                    placeholder={`Escribe a ${selectedAgent.name}...`}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  />
                  <button className="jrg-send-btn" onClick={() => handleSendMessage()}>
                    <FiSend />
                  </button>
                </div>
              </div>
            )}

            {/* TAB 3: LEADS & CRM ENGINE (REAL DATA) */}
            {activeTab === "leads" && (
              <div className="jrg-leads-container">
                <input
                  type="text"
                  className="jrg-lead-search-bar"
                  placeholder="Buscar por negocio o municipio (Zumarraga, Legazpi...)"
                  value={leadSearch}
                  onChange={(e) => setLeadSearch(e.target.value)}
                />

                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {filteredLeads.map((lead) => (
                    <div key={lead.id} className="jrg-lead-card">
                      <div className="jrg-lead-header">
                        <span className="jrg-lead-name">{lead.nombre}</span>
                        <span className="jrg-lead-location">
                          {lead.municipio} • {lead.rating} ★ ({lead.reviews})
                        </span>
                      </div>
                      <div className="jrg-lead-info-row">
                        {lead.categoria} • Tel: <strong>{lead.telefono}</strong>
                      </div>
                      <div className="jrg-lead-footer">
                        <Link
                          to={lead.demoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="jrg-demo-preview-link"
                        >
                          Ver Demo Web <FiExternalLink style={{ verticalAlign: "middle" }} />
                        </Link>
                        <a
                          href={`https://wa.me/34${lead.telefono.replace(/\s+/g, "")}?text=${encodeURIComponent(lead.mensaje)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="jrg-whatsapp-btn"
                        >
                          <FaWhatsapp /> Contactar
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: CAPACIDADES / SKILLS MARKETPLACE */}
            {activeTab === "skills" && (
              <div className="jrg-skills-container">
                <div className="jrg-skill-card">
                  <div className="jrg-skill-badge-icon">
                    <FiUsers />
                  </div>
                  <div className="jrg-skill-details">
                    <h4>Google Maps Intelligence Scraper</h4>
                    <p>Extracción de comercios, números de contacto y diagnóstico de páginas web en Gipuzkoa.</p>
                    <span className="jrg-skill-tag">Asignado: Maider</span>
                  </div>
                </div>

                <div className="jrg-skill-card">
                  <div className="jrg-skill-badge-icon">
                    <FiMessageSquare />
                  </div>
                  <div className="jrg-skill-details">
                    <h4>WhatsApp Conversion Copy Engine</h4>
                    <p>Redacción de propuestas personalizadas con enlace a demos interactivas en vivo.</p>
                    <span className="jrg-skill-tag">Asignado: Iker</span>
                  </div>
                </div>

                <div className="jrg-skill-card">
                  <div className="jrg-skill-badge-icon">
                    <FiLayers />
                  </div>
                  <div className="jrg-skill-details">
                    <h4>Vite & Three.js 48h Prototyper</h4>
                    <p>Arquitectura web ultra rápida (menos de 1s de carga) lista para despliegue y validación con cliente.</p>
                    <span className="jrg-skill-tag">Asignado: Unai</span>
                  </div>
                </div>

                <div className="jrg-skill-card">
                  <div className="jrg-skill-badge-icon">
                    <FiTool />
                  </div>
                  <div className="jrg-skill-details">
                    <h4>Kit Digital ROI & Subsidies Auditor</h4>
                    <p>Tramitación y auditoría de bonos digitales del Segmento III hasta 3.000€ a fondo perdido.</p>
                    <span className="jrg-skill-tag">Asignado: Elena</span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: TELEMETRÍA & MÉTRICAS ROI */}
            {activeTab === "telemetry" && (
              <div className="jrg-telemetry-container">
                <div className="jrg-kpi-grid">
                  <div className="jrg-kpi-card">
                    <div className="jrg-kpi-num">142h</div>
                    <div className="jrg-kpi-label">Horas Ahorradas / Mes</div>
                  </div>
                  <div className="jrg-kpi-card">
                    <div className="jrg-kpi-num">30</div>
                    <div className="jrg-kpi-label">Leads Cualificados</div>
                  </div>
                  <div className="jrg-kpi-card">
                    <div className="jrg-kpi-num">38%</div>
                    <div className="jrg-kpi-label">Ratio Respuesta WhatsApp</div>
                  </div>
                  <div className="jrg-kpi-card">
                    <div className="jrg-kpi-num">+4.800€</div>
                    <div className="jrg-kpi-label">Impacto Facturación Mensual</div>
                  </div>
                </div>

                <div className="jrg-telemetry-summary-card">
                  <h4>Eficiencia Operativa</h4>
                  <p>
                    El pipeline sincronizado de prospección automatizada, maquetación web en 48 horas y contacto directo reduce el ciclo comercial de 14 días a 48 horas.
                  </p>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* ====================================================================
            ESCENARIO 3D O VISTA TÁCTICA 2D
            ==================================================================== */}
        {viewMode === "3d" ? (
          <div className="jrg-canvas-container">
            {/* Selector Rápido de Agentes para Móvil (Barra Superior Flotante) */}
            {isMobile && !drawerOpen && (
              <div className="jrg-mobile-agents-bar" style={{ top: "68px" }}>
                {agents.map((ag) => (
                  <button
                    key={`mob-chip-${ag.id}`}
                    className={`jrg-mobile-agent-chip ${ag.id === selectedAgentId ? "selected" : ""}`}
                    onClick={() => setSelectedAgentId(ag.id)}
                  >
                    <span>{ag.emoji}</span>
                    <span>{ag.name}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Tarjeta Flotante en Móvil para Abrir Panel del Agente */}
            {isMobile && !drawerOpen && (
              <div className="jrg-mobile-bottom-dock">
                <div className="jrg-mobile-dock-card">
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div className="jrg-assignee-initials" style={{ width: 28, height: 28, fontSize: 11 }}>
                      {selectedAgent.emoji}
                    </div>
                    <div>
                      <strong style={{ fontSize: "13px", color: "#ffffff", display: "block" }}>
                        {selectedAgent.name}
                      </strong>
                      <span style={{ fontSize: "11px", color: "#a1a1aa" }}>
                        {selectedAgent.role}
                      </span>
                    </div>
                  </div>
                  <button
                    className="jrg-mobile-open-btn"
                    onClick={() => setDrawerOpen(true)}
                  >
                    <FiMessageSquare /> Abrir Panel
                  </button>
                </div>
              </div>
            )}

            {/* Escenario 3D Hermes Daylight Isometric HQ */}
            <HermesOffice
              agents={agents}
              selectedId={selectedAgentId}
              focusId={selectedAgentId}
              isMobile={isMobile}
              onSelect={(id) => {
                setSelectedAgentId(id);
              }}
            />
          </div>
        ) : (
          /* ====================================================================
              VISTA TÁCTICA 2D (HERMES 2D MODE)
              ==================================================================== */
          <div className="jrg-tactical-view">
            <div className="jrg-tactical-grid-card">
              <div className="jrg-tactical-header">
                <div>
                  <h2 style={{ margin: 0, fontSize: "16px", color: "#ffffff" }}>
                    Tablero Táctico de Agentes JRG
                  </h2>
                  <p style={{ margin: "4px 0 0 0", fontSize: "11.5px", color: "#71717a" }}>
                    Distribución en tiempo real de operaciones en Gipuzkoa
                  </p>
                </div>
                <span className="jrg-sidebar-status">100% OPERATIVO</span>
              </div>

              <div className="jrg-tactical-agents-grid">
                {agents.map((agent) => (
                  <div
                    key={agent.id}
                    className={`jrg-tactical-agent-item ${agent.id === selectedAgentId ? "selected" : ""}`}
                    onClick={() => {
                      setSelectedAgentId(agent.id);
                      setDrawerOpen(true);
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                      <span className="jrg-assignee-initials" style={{ width: 26, height: 26, fontSize: 11 }}>
                        {agent.emoji}
                      </span>
                      <div>
                        <strong style={{ fontSize: "13px", color: "#ffffff" }}>{agent.name}</strong>
                        <div style={{ fontSize: "11px", color: "#a1a1aa" }}>{agent.role}</div>
                      </div>
                    </div>
                    <p style={{ fontSize: "12px", color: "#d4d4d8", margin: "6px 0 0 0", lineHeight: 1.45 }}>
                      {agent.currentTask}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
