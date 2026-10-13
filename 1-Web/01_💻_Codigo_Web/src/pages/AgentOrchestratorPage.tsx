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
  FiX,
  FiRotateCcw,
  FiChevronLeft,
  FiChevronRight,
  FiSearch,
  FiCamera
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import DubaiPenthouse from "./DubaiPenthouse3D";
import LeadFinderModal, { LeadMasterRecord } from "../components/LeadFinderModal";
import LEADS_MASTER_DATA from "../data/leadsMasterData.json";
import DEMOS_DATA from "../data/demosData.json";
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
// 2. BASE DE DATOS MAESTRA DE LEADS B2B (2.541 COMERCIOS - GOIERRI & ALTO UROLA)
// ============================================================================

export type { LeadMasterRecord };
const JRG_ALL_LEADS: LeadMasterRecord[] = LEADS_MASTER_DATA as LeadMasterRecord[];
const AVAILABLE_DEMOS: Record<string, boolean> = Object.keys(DEMOS_DATA).reduce(
  (acc, slug) => ({ ...acc, [slug]: true }),
  {}
);

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

  // Estados de Tareas con Persistencia LocalStorage (v2)
  const [tasks, setTasks] = useState<KanbanTask[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("jrg_agency_kanban_v2");
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.error("Error cargando tareas de kanban", e);
      }
    }
    return INITIAL_TASKS;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("jrg_agency_kanban_v2", JSON.stringify(tasks));
      } catch (e) {
        console.error("Error guardando tareas de kanban", e);
      }
    }
  }, [tasks]);

  // Estados de Leads CRM con Persistencia LocalStorage (v2)
  type LeadStatus = "nuevo" | "contactado" | "propuesta" | "cerrado";
  const [leadStatuses, setLeadStatuses] = useState<Record<number, LeadStatus>>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("jrg_leads_status_v2");
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.error("Error cargando estados de leads", e);
      }
    }
    return {};
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("jrg_leads_status_v2", JSON.stringify(leadStatuses));
      } catch (e) {
        console.error("Error guardando estados de leads", e);
      }
    }
  }, [leadStatuses]);

  const [isLeadFinderOpen, setIsLeadFinderOpen] = useState<boolean>(false);
  const [selectedMunicipality, setSelectedMunicipality] = useState<string>("Todos");
  const [newTaskInput, setNewTaskInput] = useState<string>("");
  const [newTaskAssignee, setNewTaskAssignee] = useState<string>("Aitor");
  const [isJukeboxPlaying, setIsJukeboxPlaying] = useState<boolean>(false);
  const [leadSearch, setLeadSearch] = useState<string>("");

  // Estados del Simulador de ROI & Kit Digital
  const [roiLeadsCount, setRoiLeadsCount] = useState<number>(30);
  const [roiAvgTicket, setRoiAvgTicket] = useState<number>(850);
  const [roiConvRate, setRoiConvRate] = useState<number>(15);

  const roiClientes = Math.max(1, Math.round((roiLeadsCount * roiConvRate) / 100));
  const roiFacturacion = roiClientes * roiAvgTicket;
  const roiHorasAhorradas = Math.round(roiLeadsCount * 4.5);

  // Historial de Mensajes de Chat
  const [chatHistory, setChatHistory] = useState<Record<string, { role: "user" | "assistant"; text: string }[]>>({
    "jrg-aitor": [
      {
        role: "assistant",
        text: "⚡ Kaixo Jakes! Soy Aitor, Director de Operaciones en JRG Agency. Coordinamos la flota de 5 agentes y el pipeline de 2.541 leads auditados en Goierri y Alto Urola. ¿Qué objetivo marcamos en el tablero?",
      },
    ],
    "jrg-maider": [
      {
        role: "assistant",
        text: "🎯 Aupa Jakes! Soy Maider, Scout de Inteligencia. Base de datos B2B completa: 2.541 negocios verificados en Gipuzkoa, 335 fotos reales de Google Maps y más de 2.280 teléfonos directos. Pulsa [ LEADS • 2.541 ] para abrir la consola completa.",
      },
    ],
    "jrg-iker": [
      {
        role: "assistant",
        text: "🧠 Egun on! Soy Iker, redactor de conversión comercial. He preparado los mensajes de WhatsApp personalizados con enlaces directos a las demos web en vivo de cada comercio.",
      },
    ],
    "jrg-unai": [
      {
        role: "assistant",
        text: "💻 Kaixo! Soy Unai, Arquitecto Web. Todas las demos de JRG están construidas en React 18 + Vite y Three.js, con tiempos de carga inferiores a 0.8s en móvil para garantizar retención del usuario.",
      },
    ],
    "jrg-elena": [
      {
        role: "assistant",
        text: "📊 Kaixo! Soy Elena, Analista de Datos y Subvenciones. Con el bono de 3.000€ del Kit Digital (Segmento III) y nuestra prospección proyectamos más de 140 horas de ahorro operativo mensual.",
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

  // Consultas Rápidas Contextuales por Agente
  const AGENT_QUICK_PROMPTS: Record<string, { label: string; prompt: string }[]> = {
    "jrg-aitor": [
      { label: "Plan Prospección", prompt: "Aitor, define el plan de prospección para esta semana en Goierri." },
      { label: "Kit Digital 3.000€", prompt: "¿Cómo paquetizamos el Kit Digital para hostelería y comercios de la comarca?" },
      { label: "Prioridades Semana", prompt: "¿Cuáles son las 3 prioridades operativas de la agencia hoy?" },
    ],
    "jrg-maider": [
      { label: "Lead Finder (2.541)", prompt: "Maider, ¿cuántos comercios tenemos en Beasain, Zumarraga y Ordizia?" },
      { label: "Fotos Google Maps", prompt: "Maider, lístame los comercios que tienen fotos reales de fachada en Google Maps." },
      { label: "Filtro Reseñas >50", prompt: "¿Cuáles son los 10 comercios con mayor número de reseñas en la comarca?" },
    ],
    "jrg-iker": [
      { label: "Pitch Ezkiotarra", prompt: "Iker, redacta el mensaje de WhatsApp para el Restaurante Ezkiotarra." },
      { label: "Guion Urzubi", prompt: "Prepara una propuesta directa y concisa para Urzubi Taberna." },
      { label: "Estrategia WhatsApp", prompt: "¿Cuál es la tasa de apertura y el mejor horario de envío para estos comercios?" },
    ],
    "jrg-unai": [
      { label: "Stack Vite & Three", prompt: "Unai, ¿por qué es crítico que las demos carguen en menos de 0.8s en smartphone?" },
      { label: "Demo Interactiva", prompt: "¿Cómo estructuramos la demo web para mostrar el valor en 5 segundos?" },
      { label: "Despliegue Vercel", prompt: "Confirma los tiempos de despliegue y CDN europeo para las webs de clientes." },
    ],
    "jrg-elena": [
      { label: "Simular ROI Leads", prompt: "Elena, calcula el impacto financiero si contactamos a los 30 leads de la lista." },
      { label: "Bono Kit Digital", prompt: "Desglosa la cobertura de los 3.000€ a fondo perdido por segmento empresarial." },
      { label: "Horas Ahorradas", prompt: "¿Cuánto tiempo mensual ahorra una empresa al automatizar su canal digital con JRG?" },
    ],
  };

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
        if (lower.includes("prospecc") || lower.includes("plan")) {
          reply = "Estrategia fijada: Maider rastrea los 2.541 comercios en Goierri, Iker prepara el mensaje con el hook local de Gipuzkoa y Unai tiene los entornos web listos. Contactamos en bloques de 10 por día.";
        } else if (lower.includes("kit digital") || lower.includes("subvenc") || lower.includes("3.000")) {
          reply = "Las microempresas y autónomos (0-3 trabajadores) en Euskadi disponen de hasta 3.000€ a fondo perdido por Red.es (Segmento III). Nuestra solución web + SEO local cubre el 100% sin adelanto de caja.";
        } else if (lower.includes("prioridad")) {
          reply = "Prioridades del día: 1) Prospección de restaurantes top con más de 200 reseñas; 2) Validar demos web de Urretxu; 3) Hacer seguimiento de las propuestas de Kit Digital enviadas en Beasain.";
        } else {
          reply = `Recibido, Jakes. Integrado en el panel de control de JRG Agency. He coordinado al equipo para ejecutarlo de inmediato.`;
        }
      } else if (selectedAgentId === "jrg-maider") {
        if (lower.includes("zumarraga")) {
          reply = `En Zumarraga tenemos 293 comercios indexados. Destacan Restaurante Ezkiotarra (331 reseñas, 4.4★) y Urzubi Taberna (252 reseñas, 4.5★) con fotos de fachada extraídas de Google Maps en el Lead Finder.`;
        } else if (lower.includes("beasain") || lower.includes("ordizia")) {
          reply = `En Beasain (463 comercios) y Ordizia (278 comercios) hemos localizado oportunidades prioritarias como Restaurante Dolarea, Bar Usurbe y Quesos Idiazabal Delikatuz con teléfono directo.`;
        } else {
          reply = `Base de datos de inteligencia completada: 2.541 comercios auditados en Goierri y Alto Urola, con 335 fotos de fachada reales de Google Maps y más de 2.280 teléfonos de contacto listos para WhatsApp. Tienes el Lead Finder completo disponible en el botón superior [ LEADS • 2.541 ].`;
        }
      } else if (selectedAgentId === "jrg-iker") {
        if (lower.includes("ezkiotarra")) {
          reply = `Propuesta para Ezkiotarra: 'Kaixo Restaurante Ezkiotarra! Soy Jakes de JRG Agency en Urretxu. Vuestras 331 reseñas son de 10, pero los clientes no pueden ver la carta en el móvil antes de reservar. Os preparé una demo en vivo: https://www.jrgagency.eus/demo/restaurante-ezkiotarra-zumarraga'`;
        } else if (lower.includes("urzubi")) {
          reply = `Propuesta para Urzubi: 'Kaixo Urzubi Taberna! Os contacta Jakes de JRG Agency. Vuestros pintxos destacan en la plaza; os preparé un escaparate digital ultrarrápido para smartphone listo para enseñar carta y horarios.'`;
        } else {
          reply = `Estrategia de WhatsApp: Los mensajes directos con el nombre del negocio y enlace a la demo propia consiguen un 38% de respuesta positiva cuando se envían entre las 10:30 y las 12:00.`;
        }
      } else if (selectedAgentId === "jrg-unai") {
        if (lower.includes("stack") || lower.includes("0.8s") || lower.includes("carga")) {
          reply = `Compilamos con Vite + React 18, assets Three.js comprimidos en GLB Dracos (<1.5MB) y bundle dividido con lazy loading. El First Contentful Paint es de 0.65s en redes 4G móviles.`;
        } else if (lower.includes("demo")) {
          reply = `Cada demo web incluye: selector de idioma euskera/castellano, botón de llamada directa, carta interactiva con fotos en alta resolución y geolocalización en 1 toque.`;
        } else {
          reply = `Infraestructura en la nube lista: despliegues continuos con edge caching en París y Frankfurt, asegurando latencia mínima para usuarios en el País Vasco.`;
        }
      } else {
        if (lower.includes("roi") || lower.includes("impacto") || lower.includes("simul")) {
          reply = `Cálculo de retorno: Contactando a los comercios con un ticket medio de 850€ y un ratio de cierre prudente del 15%, generamos +3.825€ de facturación mensual y ahorramos al cliente ~135 horas de gestión.`;
        } else if (lower.includes("kit digital") || lower.includes("bono")) {
          reply = `El Kit Digital otorga hasta 3.000€ a fondo perdido para autónomos y pymes de 0 a 3 trabajadores. El cliente no tiene que poner dinero de su bolsillo y la agencia cobra directamente de Red.es.`;
        } else {
          reply = `Métrica procesada: Con el flujo automatizado actual, el coste por adquisición de cliente se sitúa en menos de 18€, con un retorno sobre inversión (ROAS) de 12x.`;
        }
      }

      setChatHistory((prev) => ({
        ...prev,
        [selectedAgentId]: [
          ...(prev[selectedAgentId] || []),
          { role: "assistant", text: reply },
        ],
      }));
      setIsTyping(false);
    }, 750);
  };

  // Movimiento de Tareas en Kanban (Backlog -> In Progress -> Review -> Done)
  const handleMoveTask = (taskId: string, direction: "next" | "prev") => {
    const colOrder: ("backlog" | "in_progress" | "review" | "done")[] = [
      "backlog",
      "in_progress",
      "review",
      "done",
    ];
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const currentIndex = colOrder.indexOf(t.status);
        if (direction === "next" && currentIndex < colOrder.length - 1) {
          return { ...t, status: colOrder[currentIndex + 1] };
        }
        if (direction === "prev" && currentIndex > 0) {
          return { ...t, status: colOrder[currentIndex - 1] };
        }
        return t;
      })
    );
  };

  // Eliminar Tarea Kanban
  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  // Restablecer Tareas Predeterminadas
  const handleResetTasks = () => {
    setTasks(INITIAL_TASKS);
  };

  // Ciclar Estado de Lead CRM (nuevo -> contactado -> propuesta -> cerrado -> nuevo)
  const toggleLeadStatus = (leadId: number) => {
    const cycle: Record<LeadStatus, LeadStatus> = {
      nuevo: "contactado",
      contactado: "propuesta",
      propuesta: "cerrado",
      cerrado: "nuevo",
    };
    setLeadStatuses((prev) => {
      const current = prev[leadId] || "nuevo";
      return {
        ...prev,
        [leadId]: cycle[current],
      };
    });
  };

  // Filtrado de Leads por Municipio y Búsqueda de Texto
  const filteredLeads = useMemo(() => {
    let list = JRG_ALL_LEADS;
    if (selectedMunicipality !== "Todos") {
      list = list.filter((l) => l.municipio.toLowerCase() === selectedMunicipality.toLowerCase());
    }
    if (leadSearch.trim()) {
      const q = leadSearch.toLowerCase();
      list = list.filter(
        (l) =>
          l.nombre.toLowerCase().includes(q) ||
          l.municipio.toLowerCase().includes(q) ||
          l.categoria.toLowerCase().includes(q) ||
          l.sector.toLowerCase().includes(q)
      );
    }
    return list;
  }, [selectedMunicipality, leadSearch]);

  // Agregar Tarea Kanban
  const handleAddTask = () => {
    if (!newTaskInput.trim()) return;
    const newTask: KanbanTask = {
      id: `task-${Date.now()}`,
      title: newTaskInput.trim(),
      assignee: newTaskAssignee || selectedAgent.shortName,
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
          <button
            className="hm-btn-kanban"
            onClick={() => setIsLeadFinderOpen(true)}
            title="Abrir Lead Finder Console (2.541 Comercios de Gipuzkoa)"
            style={{
              background: isLeadFinderOpen ? "#ffffff" : "rgba(255, 255, 255, 0.08)",
              color: isLeadFinderOpen ? "#090a0f" : "#ffffff",
              borderColor: isLeadFinderOpen ? "#ffffff" : "rgba(255, 255, 255, 0.18)"
            }}
          >
            <FiSearch /> [ LEADS • 2.541 ]
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
          onClick={() => setIsLeadFinderOpen(true)}
          title="Abrir Consola Completa Lead Finder"
        >
          LEADS ({JRG_ALL_LEADS.length})
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
                  <select
                    className="jrg-roi-pill-btn"
                    style={{ width: "auto", padding: "6px 8px", background: "#111218", flex: "none" }}
                    value={newTaskAssignee}
                    onChange={(e) => setNewTaskAssignee(e.target.value)}
                  >
                    <option value="Aitor">@Aitor</option>
                    <option value="Maider">@Maider</option>
                    <option value="Iker">@Iker</option>
                    <option value="Unai">@Unai</option>
                    <option value="Elena">@Elena</option>
                  </select>
                  <button className="jrg-kanban-add-btn" onClick={handleAddTask}>
                    <FiPlus /> Añadir
                  </button>
                </div>

                {(["backlog", "in_progress", "review", "done"] as const).map((statusKey) => {
                  const colTasks = tasks.filter((t) => t.status === statusKey);
                  const labels = {
                    backlog: "Cola de Tareas",
                    in_progress: "En Ejecución",
                    review: "En Revisión",
                    done: "Finalizadas",
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
                            <div className="jrg-task-actions">
                              {statusKey !== "backlog" && (
                                <button
                                  className="jrg-task-delete-btn"
                                  title="Mover a columna anterior"
                                  onClick={() => handleMoveTask(task.id, "prev")}
                                >
                                  <FiChevronLeft />
                                </button>
                              )}
                              {statusKey !== "done" && (
                                <button
                                  className="jrg-task-delete-btn"
                                  title="Avanzar a siguiente columna"
                                  onClick={() => handleMoveTask(task.id, "next")}
                                >
                                  <FiChevronRight />
                                </button>
                              )}
                              <button
                                className="jrg-task-delete-btn"
                                title="Eliminar tarea"
                                onClick={() => handleDeleteTask(task.id)}
                              >
                                <FiX />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })}

                <button className="jrg-reset-tasks-btn" onClick={handleResetTasks}>
                  <FiRotateCcw style={{ verticalAlign: "middle", marginRight: "6px" }} />
                  Restablecer Tareas Predeterminadas
                </button>
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

                {/* Botones de Consulta Rápida Contextuales por Especialista */}
                <div className="jrg-quick-prompts">
                  {(AGENT_QUICK_PROMPTS[selectedAgentId] || []).map((qp, idx) => (
                    <button
                      key={`qp-${idx}`}
                      className="jrg-quick-prompt-btn"
                      onClick={() => handleSendMessage(qp.prompt)}
                    >
                      {qp.label}
                    </button>
                  ))}
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

            {/* TAB 3: LEADS & CRM ENGINE (BASE DE DATOS COMPLETA DE GIPUZKOA) */}
            {activeTab === "leads" && (
              <div className="jrg-leads-container">
                {/* Botón Destacado para Expandir Consola Completa */}
                <button
                  className="jrg-lf-drawer-banner-btn"
                  onClick={() => setIsLeadFinderOpen(true)}
                  title="Abrir la consola completa de inteligencia de leads"
                >
                  <FiMaximize2 /> ABRIR LEAD FINDER ({JRG_ALL_LEADS.length} LEADS)
                </button>

                <input
                  type="text"
                  className="jrg-lead-search-bar"
                  placeholder="Buscar por negocio, calle o categoría..."
                  value={leadSearch}
                  onChange={(e) => setLeadSearch(e.target.value)}
                />

                {/* Filtro por Municipio con Píldoras */}
                <div className="jrg-lead-filter-pills">
                  {["Todos", "Beasain", "Zumarraga", "Ordizia", "Legazpi", "Urretxu", "Lazkao", "Idiazabal"].map((muni) => (
                    <button
                      key={`muni-${muni}`}
                      className={`jrg-lead-filter-btn ${selectedMunicipality === muni ? "active" : ""}`}
                      onClick={() => setSelectedMunicipality(muni)}
                    >
                      {muni}
                    </button>
                  ))}
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "11px", color: "var(--jrg-gray-400)", padding: "2px 2px" }}>
                  <span>{filteredLeads.length} DE {JRG_ALL_LEADS.length} COMERCIOS AUDITADOS</span>
                  <span>{selectedMunicipality === "Todos" ? "GIPUZKOA COMPLETO" : selectedMunicipality.toUpperCase()}</span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {filteredLeads.slice(0, 30).map((lead) => {
                    const status = leadStatuses[lead.id] || "nuevo";
                    const cleanPhone = lead.telefono ? lead.telefono.replace(/\D/g, "") : "";
                    const slug = `${lead.nombre.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${lead.municipio.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`.replace(/-+/g, "-");
                    const hasDemo = Boolean(AVAILABLE_DEMOS[slug]);

                    return (
                      <div key={lead.id} className="jrg-lead-card">
                        {/* Miniatura de Fachada / Google Maps */}
                        <div
                          className="jrg-lead-thumb-wrap"
                          onClick={() => setIsLeadFinderOpen(true)}
                          title="Haz clic para ver expediente completo"
                        >
                          <img
                            src={lead.heroImage}
                            alt={lead.nombre}
                            className="jrg-lead-thumb-img"
                            loading="lazy"
                          />
                          {lead.hasRealPhoto ? (
                            <span className="jrg-lead-thumb-badge">
                              <FiCamera /> GMaps Real
                            </span>
                          ) : (
                            <span className="jrg-lead-thumb-badge">
                              {lead.categoria}
                            </span>
                          )}
                        </div>

                        <div className="jrg-lead-header">
                          <span
                            className="jrg-lead-name"
                            style={{ cursor: "pointer" }}
                            onClick={() => setIsLeadFinderOpen(true)}
                          >
                            {lead.nombre}
                          </span>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span className="jrg-lead-location">
                              {lead.municipio} {lead.reviews > 0 && `• ${lead.rating.toFixed(1)} ★ (${lead.reviews})`}
                            </span>
                            <button
                              className={`jrg-lead-status-pill ${status}`}
                              onClick={() => toggleLeadStatus(lead.id)}
                              title="Haz clic para avanzar estado: nuevo -> contactado -> propuesta -> cerrado"
                            >
                              {status.toUpperCase()}
                            </button>
                          </div>
                        </div>

                        <div className="jrg-lead-info-row">
                          {lead.categoria} {lead.telefono ? `• Tel: ${lead.telefono}` : "• Sin teléfono"}
                        </div>

                        <div className="jrg-lead-footer">
                          {hasDemo ? (
                            <Link
                              to={`/demo/${slug}`}
                              target="_blank"
                              rel="noreferrer"
                              className="jrg-demo-preview-link"
                            >
                              Ver Demo Web <FiExternalLink style={{ verticalAlign: "middle" }} />
                            </Link>
                          ) : (
                            <button
                              className="jrg-demo-preview-link"
                              onClick={() => setIsLeadFinderOpen(true)}
                            >
                              Ver Dossier <FiExternalLink style={{ verticalAlign: "middle" }} />
                            </button>
                          )}

                          {cleanPhone ? (
                            <a
                              href={`https://wa.me/34${cleanPhone}?text=${encodeURIComponent(lead.pitch)}`}
                              target="_blank"
                              rel="noreferrer"
                              className="jrg-whatsapp-btn"
                            >
                              <FaWhatsapp /> Contactar
                            </a>
                          ) : (
                            <button className="jrg-whatsapp-btn" style={{ opacity: 0.4, cursor: "not-allowed" }} disabled>
                              <FaWhatsapp /> Sin Tel
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {filteredLeads.length > 30 && (
                    <button
                      className="jrg-lf-drawer-banner-btn"
                      style={{
                        background: "#161722",
                        color: "#ffffff",
                        borderColor: "rgba(255, 255, 255, 0.16)",
                        marginTop: "4px"
                      }}
                      onClick={() => setIsLeadFinderOpen(true)}
                    >
                      Ver los {filteredLeads.length - 30} comercios restantes en Lead Finder »
                    </button>
                  )}
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
                    <div className="jrg-kpi-num">{roiHorasAhorradas}h</div>
                    <div className="jrg-kpi-label">Horas Ahorradas / Mes</div>
                  </div>
                  <div className="jrg-kpi-card">
                    <div className="jrg-kpi-num">{roiLeadsCount}</div>
                    <div className="jrg-kpi-label">Leads Cualificados</div>
                  </div>
                  <div className="jrg-kpi-card">
                    <div className="jrg-kpi-num">{roiConvRate}%</div>
                    <div className="jrg-kpi-label">Tasa Conversión Est.</div>
                  </div>
                  <div className="jrg-kpi-card">
                    <div className="jrg-kpi-num">+{roiFacturacion.toLocaleString("es-ES")}€</div>
                    <div className="jrg-kpi-label">Impacto Facturación Mensual</div>
                  </div>
                </div>

                {/* Simulador Interactivo de ROI y Kit Digital */}
                <div className="jrg-roi-simulator-box">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <h4 style={{ margin: 0, fontSize: "12.5px", fontWeight: 700, color: "var(--jrg-white)" }}>
                      SIMULADOR DE RETORNO (ROI) & KIT DIGITAL
                    </h4>
                    <span style={{ fontSize: "10px", color: "var(--jrg-gray-400)", fontFamily: "monospace" }}>
                      INTERACTIVO
                    </span>
                  </div>

                  {/* Control 1: Volumen de Leads */}
                  <div className="jrg-roi-control-group">
                    <div className="jrg-roi-control-label">
                      <span>Leads Mensuales a Prospectar</span>
                      <strong>{roiLeadsCount} comercios</strong>
                    </div>
                    <div className="jrg-roi-pills">
                      {[15, 30, 60, 100].map((count) => (
                        <button
                          key={`roi-leads-${count}`}
                          className={`jrg-roi-pill-btn ${roiLeadsCount === count ? "active" : ""}`}
                          onClick={() => setRoiLeadsCount(count)}
                        >
                          {count} leads
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Control 2: Ticket Medio */}
                  <div className="jrg-roi-control-group">
                    <div className="jrg-roi-control-label">
                      <span>Ticket Medio Proyecto</span>
                      <strong>{roiAvgTicket}€ / cliente</strong>
                    </div>
                    <div className="jrg-roi-pills">
                      {[450, 850, 1500, 3000].map((ticket) => (
                        <button
                          key={`roi-ticket-${ticket}`}
                          className={`jrg-roi-pill-btn ${roiAvgTicket === ticket ? "active" : ""}`}
                          onClick={() => setRoiAvgTicket(ticket)}
                        >
                          {ticket}€
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Control 3: Tasa de Conversión */}
                  <div className="jrg-roi-control-group">
                    <div className="jrg-roi-control-label">
                      <span>Conversión Estimada</span>
                      <strong>{roiConvRate}%</strong>
                    </div>
                    <div className="jrg-roi-pills">
                      {[10, 15, 20, 30].map((rate) => (
                        <button
                          key={`roi-rate-${rate}`}
                          className={`jrg-roi-pill-btn ${roiConvRate === rate ? "active" : ""}`}
                          onClick={() => setRoiConvRate(rate)}
                        >
                          {rate}%
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Resultado Calculado */}
                  <div style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid var(--jrg-border-subtle)", borderRadius: "8px", padding: "10px 12px", display: "flex", flexDirection: "column", gap: "6px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11.5px" }}>
                      <span style={{ color: "var(--jrg-gray-400)" }}>Clientes proyectados:</span>
                      <strong style={{ color: "var(--jrg-white)" }}>~{roiClientes} cierres / mes</strong>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11.5px" }}>
                      <span style={{ color: "var(--jrg-gray-400)" }}>Facturación estimada:</span>
                      <strong style={{ color: "var(--jrg-white)" }}>+{roiFacturacion.toLocaleString("es-ES")}€ / mes</strong>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11.5px" }}>
                      <span style={{ color: "var(--jrg-gray-400)" }}>Ahorro de horas directas:</span>
                      <strong style={{ color: "var(--jrg-white)" }}>{roiHorasAhorradas} horas / mes</strong>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11.5px", borderTop: "1px solid var(--jrg-border-subtle)", paddingTop: "6px", marginTop: "2px" }}>
                      <span style={{ color: "var(--jrg-gray-400)" }}>Bono Kit Digital Red.es:</span>
                      <strong style={{ color: "#86efac" }}>Hasta 3.000€ (100% Subvencionable)</strong>
                    </div>
                  </div>
                </div>

                <div className="jrg-telemetry-summary-card">
                  <h4>Eficiencia Operativa JRG Agency</h4>
                  <p>
                    El pipeline coordinado de prospección automatizada, maquetación web en 48 horas y contacto directo reduce el ciclo comercial tradicional de 14 días a 48 horas con 0 fricción técnica.
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

            {/* Escenario 3D Dubai Penthouse Piso 60 HQ */}
            <DubaiPenthouse
              agents={agents}
              selectedId={selectedAgentId}
              focusId={selectedAgentId}
              isMobile={isMobile}
              drawerOpen={drawerOpen}
              onSelect={(id) => {
                setSelectedAgentId(id);
                if (isMobile) {
                  setDrawerOpen(true);
                }
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

      {/* ====================================================================
          LEAD FINDER INTELLIGENCE CONSOLE (MODAL / OVERLAY HUD FULLSCREEN)
          ==================================================================== */}
      <LeadFinderModal
        isOpen={isLeadFinderOpen}
        onClose={() => setIsLeadFinderOpen(false)}
        leads={JRG_ALL_LEADS}
        leadStatuses={leadStatuses}
        onToggleStatus={toggleLeadStatus}
        onConsultAgent={(agentId, prompt) => {
          setSelectedAgentId(agentId);
          setActiveTab("chat");
          setDrawerOpen(true);
          handleSendMessage(prompt);
        }}
        availableDemos={AVAILABLE_DEMOS}
      />
    </div>
  );
}

