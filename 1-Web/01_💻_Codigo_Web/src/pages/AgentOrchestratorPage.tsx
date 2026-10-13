import React, { useState, useRef, useMemo, Suspense } from "react";
import { Link } from "react-router-dom";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, Float, Grid } from "@react-three/drei";
import * as THREE from "three";
import {
  FiMessageSquare,
  FiTrello,
  FiUsers,
  FiSend,
  FiPlus,
  FiLayers,
  FiActivity,
  FiArrowLeft,
  FiMaximize2
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import "./AgentOrchestratorPage.css";

// Definición de Agentes
export interface Agent {
  id: string;
  name: string;
  shortName: string;
  role: string;
  status: "idle" | "working" | "thinking";
  position: [number, number, number];
  color: string;
  emoji: string;
  description: string;
  currentTask: string;
}

const JRG_AGENTS: Agent[] = [
  {
    id: "jrg-director",
    name: "Aitor (Director de Operaciones)",
    shortName: "Aitor",
    role: "Orchestrator & Estrategia",
    status: "working",
    position: [0, 0, -2.5],
    color: "#00f2fe",
    emoji: "⚡",
    description: "Coordina el equipo de agentes, asigna metas y supervisa el pipeline comercial y técnico.",
    currentTask: "Supervisando sprint de prospección semanal y asignación Kanban",
  },
  {
    id: "jrg-hunter",
    name: "Maider (Lead Scout)",
    shortName: "Maider",
    role: "Inteligencia & Scraping",
    status: "working",
    position: [-3.8, 0, -0.5],
    color: "#10b981",
    emoji: "🎯",
    description: "Audita comercios en Goierri, Alto Urola y España. Detecta falta de web o menú interactivo.",
    currentTask: "Filtrando 30 comercios prioritarios sin web en Zumarraga y Legazpi",
  },
  {
    id: "jrg-copywriter",
    name: "Iker (Ventas & WhatsApp)",
    shortName: "Iker",
    role: "Sales Pitch & Outbound",
    status: "thinking",
    position: [-2.5, 0, 2.8],
    color: "#f59e0b",
    emoji: "💬",
    description: "Redacta copys hiperpersonalizados de WhatsApp y guiones de llamada para clientes locales.",
    currentTask: "Redactando mensaje para Restaurante Ezkiotarra y Bar Oilarra",
  },
  {
    id: "jrg-architect",
    name: "Unai (Web & 3D Builder)",
    shortName: "Unai",
    role: "Arquitecto Técnico & Demos",
    status: "working",
    position: [3.8, 0, -0.5],
    color: "#8b5cf6",
    emoji: "💻",
    description: "Genera prototipos de landing pages con Liquid Glass, cartas 3D NFC y chatbots interactivos.",
    currentTask: "Compilando boceto móvil interactivo para carta digital NFC",
  },
  {
    id: "jrg-deployer",
    name: "Elena (Delivery Clientes)",
    shortName: "Elena",
    role: "Despliegue & Soporte AI",
    status: "idle",
    position: [2.5, 0, 2.8],
    color: "#ec4899",
    emoji: "🚀",
    description: "Empaqueta e implanta agentes de atención automática para clientes de hostelería y comercios.",
    currentTask: "Esperando confirmación de cliente para conectar WhatsApp Cloud API",
  },
];

// Leads Reales de JRG Agency
const REAL_LEADS = [
  {
    id: 640,
    nombre: "Restaurante Ezkiotarra",
    municipio: "Zumarraga",
    categoria: "Restaurante",
    reviews: 331,
    rating: 4.4,
    telefono: "943 72 29 64",
    pitch: "Kaixo Restaurante Ezkiotarra! Soy Jakes de JRG Agency en Urretxu. Vuestras 331 reseñas son excelentes pero no tenéis web para ver la carta desde el móvil. Os he preparado un boceto rápido: https://jrgagency.eus/demo/ezkiotarra",
    whatsappUrl: "https://wa.me/34943722964?text=Kaixo%20Restaurante%20Ezkiotarra!%20Soy%20Jakes%20de%20JRG%20Agency...",
  },
  {
    id: 32,
    nombre: "Bar Oilarra",
    municipio: "Legazpi",
    categoria: "Bar de Tapas",
    reviews: 291,
    rating: 4.5,
    telefono: "605 76 49 16",
    pitch: "Kaixo Bar Oilarra! Enhorabuena por vuestras valoraciones. Podemos dejaros vuestra carta interactiva y reservas en 48h con placa NFC de mesa.",
    whatsappUrl: "https://wa.me/34605764916?text=Kaixo%20Bar%20Oilarra!%20Soy%20Jakes%20de%20JRG%20Agency...",
  },
  {
    id: 54,
    nombre: "Estanko Laubide",
    municipio: "Legazpi",
    categoria: "Estanco",
    reviews: 574,
    rating: 4.4,
    telefono: "943 73 12 49",
    pitch: "Kaixo Estanko Laubide! Tenéis 574 reseñas en Google. Una web moderna y catálogo móvil os permitiría fidelizar más clientes.",
    whatsappUrl: "https://wa.me/34943731249?text=Kaixo%20Estanko%20Laubide!%20Soy%20Jakes%20de%20JRG%20Agency...",
  },
  {
    id: 667,
    nombre: "Urzubi Taberna",
    municipio: "Zumarraga",
    categoria: "Bar & Pintxos",
    reviews: 184,
    rating: 4.3,
    telefono: "943 72 15 20",
    pitch: "Kaixo Urzubi! Os hemos preparado una propuesta para digitalizar vuestra carta de pintxos con código QR y NFC de madera.",
    whatsappUrl: "https://wa.me/34943721520?text=Kaixo%20Urzubi!%20Soy%20Jakes%20de%20JRG%20Agency...",
  },
];

// Tareas Kanban
interface KanbanTask {
  id: string;
  title: string;
  agentId: string;
  status: "inbox" | "working" | "review" | "done";
  tag: string;
}

const INITIAL_TASKS: KanbanTask[] = [
  {
    id: "t-1",
    title: "Auditoría de 30 restaurantes sin web en Goierri",
    agentId: "jrg-hunter",
    status: "done",
    tag: "LEADS",
  },
  {
    id: "t-2",
    title: "Generar secuencias de WhatsApp para hostelería",
    agentId: "jrg-copywriter",
    status: "working",
    tag: "VENTAS",
  },
  {
    id: "t-3",
    title: "Prototipo de Carta Digital 3D NFC (Ezkiotarra)",
    agentId: "jrg-architect",
    status: "working",
    tag: "DEV 3D",
  },
  {
    id: "t-4",
    title: "Agente de Reservas WhatsApp (Piloto Restaurante)",
    agentId: "jrg-deployer",
    status: "review",
    tag: "DELIVERY",
  },
  {
    id: "t-5",
    title: "Reunión semanal de Standup y Estrategia de Cierre",
    agentId: "jrg-director",
    status: "inbox",
    tag: "OPS",
  },
];

// Componente 3D para la estación de trabajo de cada Agente
function AgentDeskStation({
  agent,
  isSelected,
  onSelect,
}: {
  agent: Agent;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      if (agent.status === "working") {
        meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 2 + agent.position[0]) * 0.05;
      }
    }
  });

  return (
    <group
      position={agent.position}
      ref={meshRef}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      {/* Base Escritorio */}
      <mesh position={[0, 0.45, 0]}>
        <boxGeometry args={[1.6, 0.1, 1.0]} />
        <meshStandardMaterial
          color="#0f172a"
          metalness={0.8}
          roughness={0.2}
          emissive={isSelected ? agent.color : "#000000"}
          emissiveIntensity={isSelected ? 0.35 : 0}
        />
      </mesh>

      {/* Monitor Central */}
      <mesh position={[0, 0.85, -0.3]}>
        <boxGeometry args={[0.9, 0.55, 0.05]} />
        <meshStandardMaterial
          color="#020617"
          emissive={agent.color}
          emissiveIntensity={agent.status === "working" ? 0.6 : 0.2}
        />
      </mesh>

      {/* Soporte Monitor */}
      <mesh position={[0, 0.55, -0.3]}>
        <cylinderGeometry args={[0.04, 0.06, 0.2]} />
        <meshStandardMaterial color="#334155" metalness={0.9} />
      </mesh>

      {/* Avatar Flotante del Agente */}
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.3}>
        <mesh position={[0, 1.4, 0.1]}>
          <sphereGeometry args={[0.26, 32, 32]} />
          <meshStandardMaterial
            color={agent.color}
            emissive={agent.color}
            emissiveIntensity={0.5}
            roughness={0.1}
            metalness={0.4}
          />
        </mesh>
      </Float>

      {/* Anillo de selección en el suelo */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.9, isSelected ? 1.05 : 0.95, 32]} />
        <meshBasicMaterial
          color={agent.color}
          transparent
          opacity={isSelected ? 0.8 : 0.25}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Texto 3D con Nombre del Agente */}
      <Text
        position={[0, 1.9, 0]}
        fontSize={0.24}
        color={isSelected ? "#00f2fe" : "#ffffff"}
        anchorX="center"
        anchorY="middle"
      >
        {`${agent.emoji} ${agent.shortName}`}
      </Text>

      {/* Subtexto Rol */}
      <Text
        position={[0, 1.68, 0]}
        fontSize={0.13}
        color={agent.color}
        anchorX="center"
        anchorY="middle"
      >
        {agent.role}
      </Text>
    </group>
  );
}

// Mesa Central de Reuniones / Standup
function CentralMeetingHub() {
  return (
    <group position={[0, 0, 0]}>
      <mesh position={[0, 0.35, 0]}>
        <cylinderGeometry args={[1.2, 1.2, 0.12, 32]} />
        <meshStandardMaterial color="#0b1329" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Holograma central */}
      <Float speed={1.5} floatIntensity={0.5}>
        <mesh position={[0, 0.8, 0]}>
          <octahedronGeometry args={[0.22, 0]} />
          <meshStandardMaterial
            color="#00f2fe"
            emissive="#00f2fe"
            emissiveIntensity={0.8}
            wireframe
          />
        </mesh>
      </Float>
      <Text position={[0, 1.25, 0]} fontSize={0.18} color="#00f2fe" anchorX="center">
        JRG AGENCY HQ
      </Text>
    </group>
  );
}

// Escena 3D Completa
function VirtualOfficeScene({
  agents,
  selectedAgentId,
  onSelectAgent,
}: {
  agents: Agent[];
  selectedAgentId: string;
  onSelectAgent: (id: string) => void;
}) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 15, 10]} intensity={1.2} />
      <pointLight position={[0, 5, 0]} intensity={1.5} color="#00f2fe" distance={15} />

      {/* Suelo Holográfico */}
      <Grid
        position={[0, 0, 0]}
        args={[24, 24]}
        cellSize={0.8}
        cellThickness={1}
        cellColor="#00f2fe"
        sectionSize={3.2}
        sectionThickness={1.5}
        sectionColor="#7928ca"
        fadeDistance={20}
        fadeStrength={1}
      />

      <CentralMeetingHub />

      {agents.map((agent) => (
        <AgentDeskStation
          key={agent.id}
          agent={agent}
          isSelected={agent.id === selectedAgentId}
          onSelect={() => onSelectAgent(agent.id)}
        />
      ))}

      <OrbitControls
        makeDefault
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.2}
        minDistance={4}
        maxDistance={18}
        target={[0, 0.6, 0]}
      />
    </>
  );
}

// COMPONENTE PRINCIPAL
export default function AgentOrchestratorPage() {
  const [agents] = useState<Agent[]>(JRG_AGENTS);
  const [selectedAgentId, setSelectedAgentId] = useState<string>("jrg-director");
  const [activeTab, setActiveTab] = useState<"chat" | "kanban" | "leads" | "analytics">("chat");
  const [viewMode, setViewMode] = useState<"3d" | "tactical">("3d");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [tasks, setTasks] = useState<KanbanTask[]>(INITIAL_TASKS);
  const [newTaskInput, setNewTaskInput] = useState<string>("");

  // Historial de mensajes por agente
  const [chatHistory, setChatHistory] = useState<Record<string, { role: "user" | "assistant"; text: string }[]>>({
    "jrg-director": [
      {
        role: "assistant",
        text: "⚡ Kaixo! Soy Aitor, Director de Operaciones en JRG Agency. Tenemos 5 agentes activos y 30 leads prioritarios en el pipeline de Goierri y Alto Urola. ¿Qué objetivo quieres coordinar hoy?",
      },
    ],
    "jrg-hunter": [
      {
        role: "assistant",
        text: "🎯 Maider aquí. He auditado los comercios de Zumarraga y Legazpi. Restaurante Ezkiotarra tiene 331 reviews en Google pero no tiene web ni carta móvil.",
      },
    ],
    "jrg-copywriter": [
      {
        role: "assistant",
        text: "💬 Iker al aparato. Tengo listas las secuencias de WhatsApp personalizadas para los hosteleros del sprint.",
      },
    ],
    "jrg-architect": [
      {
        role: "assistant",
        text: "💻 Unai en el Lab 3D. El visor interactivo de carta NFC en 3D está compilado y listo para enseñar a clientes.",
      },
    ],
    "jrg-deployer": [
      {
        role: "assistant",
        text: "🚀 Elena en Despliegue. Preparada para conectar el bot de reservas de WhatsApp en cuanto Iker cierre la reunión.",
      },
    ],
  });

  const [inputMessage, setInputMessage] = useState<string>("");

  const activeAgent = useMemo(() => {
    return agents.find((a) => a.id === selectedAgentId) || agents[0];
  }, [agents, selectedAgentId]);

  // Enviar mensaje en el chat
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userText = inputMessage.trim();
    setInputMessage("");

    setChatHistory((prev) => ({
      ...prev,
      [selectedAgentId]: [...(prev[selectedAgentId] || []), { role: "user", text: userText }],
    }));

    // Simulación inteligente de respuesta en streaming/contextual
    setTimeout(() => {
      let replyText = "";
      const lower = userText.toLowerCase();

      if (selectedAgentId === "jrg-hunter") {
        if (lower.includes("lead") || lower.includes("restaurante") || lower.includes("zumarraga")) {
          replyText = `🎯 **Informe de Maider**:
He extraído los datos de Restaurante Ezkiotarra (Zumarraga):
- Puntuación: 4.4 estrellas con 331 valoraciones.
- Web actual: Ninguna.
- Oportunidad: Carta digital NFC interactiva y sistema de reservas. He derivado la tarea a Iker para enviar el mensaje.`;
        } else {
          replyText = `🎯 Buscando en la base de datos de 2.400 comercios de Goierri y España... Lead identificado y catalogado.`;
        }
      } else if (selectedAgentId === "jrg-copywriter") {
        replyText = `💬 **Propuesta de Iker**:
He redactado este mensaje directo para WhatsApp:
"Kaixo! Soy Jakes de JRG Agency aquí en Urretxu. Vuestras valoraciones en Google son top, pero os falta una web móvil para reservas y carta interactiva. Os he montado un boceto rápido: https://jrgagency.eus/demo/ezkiotarra. ¿Os encaja?"`;
      } else if (selectedAgentId === "jrg-architect") {
        replyText = `💻 **Respuesta de Unai**:
He generado la arquitectura para el prototipo con Liquid Glass y Three.js. Carga en 0.8s en dispositivos móviles.`;
      } else if (selectedAgentId === "jrg-deployer") {
        replyText = `🚀 **Elena**:
Configuración preparada. Los webhooks de WhatsApp Cloud API y Google Calendar están listos para asociarse al cliente.`;
      } else {
        replyText = `⚡ **Aitor**:
Excelente iniciativa. He actualizado el tablero Kanban y notificado a los agentes correspondientes para que ejecuten el paso.`;
      }

      setChatHistory((prev) => ({
        ...prev,
        [selectedAgentId]: [...(prev[selectedAgentId] || []), { role: "assistant", text: replyText }],
      }));
    }, 600);
  };

  // Añadir tarea al Kanban
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskInput.trim()) return;
    const newTask: KanbanTask = {
      id: `task-${Date.now()}`,
      title: newTaskInput.trim(),
      agentId: selectedAgentId,
      status: "working",
      tag: "PROYECTO",
    };
    setTasks((prev) => [newTask, ...prev]);
    setNewTaskInput("");
  };

  return (
    <div className="jrg-orchestrator-root">
      {/* HEADER SUPERIOR */}
      <header className="jrg-orchestrator-header">
        <div className="jrg-header-brand">
          <Link to="/">
            <FiArrowLeft className="text-gray-400 hover:text-white" />
            <img src="/logo.png" alt="JRG" style={{ height: "24px", objectFit: "contain" }} onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
            <span style={{ fontWeight: 800, letterSpacing: "-0.02em", color: "#fff", fontSize: "15px" }}>
              JRG AGENCY
            </span>
          </Link>
          <span className="jrg-brand-badge">ORCHESTRATOR 3D</span>
        </div>

        {/* Modo de Vista */}
        <div className="jrg-header-center">
          <button
            className={`jrg-mode-btn ${viewMode === "3d" ? "active" : ""}`}
            onClick={() => setViewMode("3d")}
          >
            <FiLayers /> Vista Oficina 3D
          </button>
          <button
            className={`jrg-mode-btn ${viewMode === "tactical" ? "active" : ""}`}
            onClick={() => setViewMode("tactical")}
          >
            <FiActivity /> Modo Táctico 2D
          </button>
        </div>

        {/* Estado y Toggle */}
        <div className="jrg-header-right">
          <div className="jrg-system-status">
            <span className="jrg-pulse-dot"></span>
            <span>5 AGENTES ONLINE</span>
          </div>

          <button
            className="jrg-toggle-sidebar-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <FiMaximize2 /> {sidebarOpen ? "OCULTAR HQ" : "ABRIR HQ"}
          </button>
        </div>
      </header>

      {/* ÁREA PRINCIPAL */}
      <div className="jrg-orchestrator-main">
        {/* VIEWPORT 3D / TÁCTICO */}
        <div className="jrg-canvas-viewport">
          <div className="jrg-canvas-overlay-hints">
            <div className="jrg-overlay-card">
              <div className="jrg-overlay-title">SALA DE OPERACIONES 3D</div>
              <div className="jrg-overlay-desc">
                Haz clic en cualquier agente para abrir su terminal o arrastra con el ratón/dedo para rotar la cámara.
              </div>
            </div>
          </div>

          {viewMode === "3d" ? (
            <Suspense fallback={<div className="flex h-full w-full items-center justify-center text-cyan-400">Cargando Oficina 3D de JRG Agency...</div>}>
              <Canvas camera={{ position: [0, 8, 9], fov: 45 }}>
                <VirtualOfficeScene
                  agents={agents}
                  selectedAgentId={selectedAgentId}
                  onSelectAgent={(id) => {
                    setSelectedAgentId(id);
                    setSidebarOpen(true);
                  }}
                />
              </Canvas>
            </Suspense>
          ) : (
            /* Modo Táctico 2D alternativo */
            <div style={{ padding: "40px 24px", height: "100%", overflowY: "auto" }}>
              <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#00f2fe", marginBottom: "16px" }}>
                🗺️ Mapa Táctico de Agentes — JRG Agency
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
                {agents.map((agent) => (
                  <div
                    key={agent.id}
                    onClick={() => {
                      setSelectedAgentId(agent.id);
                      setSidebarOpen(true);
                    }}
                    style={{
                      background: selectedAgentId === agent.id ? "rgba(0, 242, 254, 0.12)" : "rgba(15, 23, 42, 0.6)",
                      border: `1px solid ${selectedAgentId === agent.id ? agent.color : "rgba(255, 255, 255, 0.1)"}`,
                      borderRadius: "16px",
                      padding: "16px",
                      cursor: "pointer",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "24px" }}>{agent.emoji}</span>
                      <span style={{ fontSize: "10px", fontFamily: "monospace", color: agent.color, padding: "2px 8px", background: "rgba(255,255,255,0.05)", borderRadius: "6px" }}>
                        {agent.role}
                      </span>
                    </div>
                    <div style={{ fontSize: "15px", fontWeight: 700, color: "#fff", marginTop: "10px" }}>
                      {agent.name}
                    </div>
                    <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>
                      {agent.description}
                    </div>
                    <div style={{ fontSize: "11px", color: agent.color, marginTop: "10px", fontFamily: "monospace" }}>
                      ⚡ {agent.currentTask}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Barra Flotante de Selección Rápida de Agente */}
          <div className="jrg-floating-agents-bar">
            {agents.map((agent) => (
              <button
                key={agent.id}
                className={`jrg-agent-pill ${selectedAgentId === agent.id ? "active" : ""}`}
                onClick={() => setSelectedAgentId(agent.id)}
              >
                <span className="jrg-agent-dot" style={{ background: agent.color }}></span>
                <span>{agent.emoji} {agent.shortName}</span>
              </button>
            ))}
          </div>
        </div>

        {/* SIDEBAR HEADQUARTERS */}
        <aside className={`jrg-hq-sidebar ${sidebarOpen ? "" : "collapsed"}`}>
          {/* TABS DE CONTROL */}
          <div className="jrg-sidebar-tabs">
            <button
              className={`jrg-sidebar-tab ${activeTab === "chat" ? "active" : ""}`}
              onClick={() => setActiveTab("chat")}
            >
              <FiMessageSquare /> Chat
            </button>
            <button
              className={`jrg-sidebar-tab ${activeTab === "kanban" ? "active" : ""}`}
              onClick={() => setActiveTab("kanban")}
            >
              <FiTrello /> Kanban
            </button>
            <button
              className={`jrg-sidebar-tab ${activeTab === "leads" ? "active" : ""}`}
              onClick={() => setActiveTab("leads")}
            >
              <FiUsers /> Leads
            </button>
            <button
              className={`jrg-sidebar-tab ${activeTab === "analytics" ? "active" : ""}`}
              onClick={() => setActiveTab("analytics")}
            >
              <FiActivity /> Métricas
            </button>
          </div>

          {/* CONTENIDO DEL TAB SELECCIONADO */}
          <div className="jrg-sidebar-body">
            {/* TAB: CHAT EN VIVO */}
            {activeTab === "chat" && (
              <div className="jrg-chat-panel">
                <div className="jrg-agent-header-card">
                  <div className="jrg-agent-meta">
                    <span className="jrg-agent-avatar-icon">{activeAgent.emoji}</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "14px", color: "#fff" }}>
                        {activeAgent.name}
                      </div>
                      <div style={{ fontSize: "11px", color: activeAgent.color, fontFamily: "monospace" }}>
                        {activeAgent.role}
                      </div>
                    </div>
                  </div>
                  <span style={{ fontSize: "10px", padding: "2px 8px", borderRadius: "999px", background: "rgba(16, 185, 129, 0.15)", color: "#10b981", fontFamily: "monospace" }}>
                    ONLINE
                  </span>
                </div>

                <div className="jrg-chat-feed">
                  {(chatHistory[selectedAgentId] || []).map((msg, idx) => (
                    <div key={idx} className={`jrg-msg-bubble ${msg.role}`}>
                      {msg.text}
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendMessage} className="jrg-chat-input-bar">
                  <input
                    type="text"
                    className="jrg-chat-input"
                    placeholder={`Enviar orden a ${activeAgent.shortName}...`}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                  />
                  <button type="submit" className="jrg-chat-send-btn">
                    <FiSend />
                  </button>
                </form>
              </div>
            )}

            {/* TAB: TABLERO KANBAN */}
            {activeTab === "kanban" && (
              <div className="jrg-kanban-board">
                <form onSubmit={handleAddTask} style={{ display: "flex", gap: "8px" }}>
                  <input
                    type="text"
                    className="jrg-chat-input"
                    placeholder="Nueva tarea de prospección / dev..."
                    value={newTaskInput}
                    onChange={(e) => setNewTaskInput(e.target.value)}
                  />
                  <button type="submit" className="jrg-chat-send-btn" style={{ padding: "0 14px" }}>
                    <FiPlus />
                  </button>
                </form>

                {/* Columna: En Proceso */}
                <div className="jrg-kanban-col">
                  <div className="jrg-col-header">
                    <span>⚡ EN PROCESO</span>
                    <span className="jrg-col-count">
                      {tasks.filter((t) => t.status === "working").length}
                    </span>
                  </div>
                  {tasks
                    .filter((t) => t.status === "working")
                    .map((task) => {
                      const agent = agents.find((a) => a.id === task.agentId);
                      return (
                        <div key={task.id} className="jrg-task-card">
                          <div className="jrg-task-title">{task.title}</div>
                          <div className="jrg-task-footer">
                            <span className="jrg-task-assignee">
                              {agent?.emoji} {agent?.shortName}
                            </span>
                            <span style={{ color: "#38bdf8" }}>{task.tag}</span>
                          </div>
                        </div>
                      );
                    })}
                </div>

                {/* Columna: Pendientes */}
                <div className="jrg-kanban-col">
                  <div className="jrg-col-header">
                    <span>📥 BANDEJA</span>
                    <span className="jrg-col-count">
                      {tasks.filter((t) => t.status === "inbox").length}
                    </span>
                  </div>
                  {tasks
                    .filter((t) => t.status === "inbox")
                    .map((task) => (
                      <div key={task.id} className="jrg-task-card">
                        <div className="jrg-task-title">{task.title}</div>
                        <div className="jrg-task-footer">
                          <span>Asignado</span>
                          <span>{task.tag}</span>
                        </div>
                      </div>
                    ))}
                </div>

                {/* Columna: Completadas */}
                <div className="jrg-kanban-col">
                  <div className="jrg-col-header">
                    <span>✅ COMPLETADAS</span>
                    <span className="jrg-col-count">
                      {tasks.filter((t) => t.status === "done").length}
                    </span>
                  </div>
                  {tasks
                    .filter((t) => t.status === "done")
                    .map((task) => (
                      <div key={task.id} className="jrg-task-card" style={{ opacity: 0.75 }}>
                        <div className="jrg-task-title">{task.title}</div>
                        <div className="jrg-task-footer">
                          <span>Finalizada</span>
                          <span style={{ color: "#10b981" }}>OK</span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* TAB: LEADS HUNTER */}
            {activeTab === "leads" && (
              <div>
                <div style={{ fontSize: "11px", color: "#94a3b8", marginBottom: "12px" }}>
                  Base de 2.400 comercios de Goierri / Alto Urola conectados al motor de prospección:
                </div>
                {REAL_LEADS.map((lead) => (
                  <div key={lead.id} className="jrg-lead-card">
                    <div className="jrg-lead-top">
                      <span className="jrg-lead-name">{lead.nombre}</span>
                      <span className="jrg-lead-badge">{lead.municipio}</span>
                    </div>
                    <div className="jrg-lead-meta">
                      <span>★ {lead.rating} ({lead.reviews} reviews)</span>
                      <span>{lead.categoria}</span>
                    </div>
                    <div className="jrg-lead-pitch-preview">
                      "{lead.pitch}"
                    </div>
                    <a
                      href={lead.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="jrg-whatsapp-btn"
                    >
                      <FaWhatsapp /> Enviar Pitch por WhatsApp
                    </a>
                  </div>
                ))}
              </div>
            )}

            {/* TAB: MÉTRICAS */}
            {activeTab === "analytics" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ background: "rgba(15, 23, 42, 0.6)", padding: "16px", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <div style={{ fontSize: "10px", fontFamily: "monospace", color: "#00f2fe", letterSpacing: "0.1em" }}>
                    MODEL PERFORMANCE
                  </div>
                  <div style={{ fontSize: "24px", fontWeight: 800, color: "#fff", marginTop: "6px" }}>
                    99.8%
                  </div>
                  <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "2px" }}>
                    Tasa de éxito de orquestación en tiempo real
                  </div>
                </div>

                <div style={{ background: "rgba(15, 23, 42, 0.6)", padding: "16px", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <div style={{ fontSize: "10px", fontFamily: "monospace", color: "#10b981", letterSpacing: "0.1em" }}>
                    LATENCIA DE STREAMING
                  </div>
                  <div style={{ fontSize: "24px", fontWeight: 800, color: "#fff", marginTop: "6px" }}>
                    35 ms
                  </div>
                  <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "2px" }}>
                    Velocidad de respuesta por token
                  </div>
                </div>

                <div style={{ background: "rgba(15, 23, 42, 0.6)", padding: "16px", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <div style={{ fontSize: "10px", fontFamily: "monospace", color: "#f59e0b", letterSpacing: "0.1em" }}>
                    LEADS ACTIVOS
                  </div>
                  <div style={{ fontSize: "24px", fontWeight: 800, color: "#fff", marginTop: "6px" }}>
                    2.418
                  </div>
                  <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "2px" }}>
                    Comercios mapeados en Goierri y Euskadi
                  </div>
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
