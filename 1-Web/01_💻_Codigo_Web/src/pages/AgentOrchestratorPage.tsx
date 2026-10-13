import { useState, useRef, useMemo, useEffect, Suspense, useCallback } from "react";
import { Link } from "react-router-dom";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Text, Billboard } from "@react-three/drei";
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
  FiMaximize2,
  FiTool,
  FiVolume2,
  FiVolumeX,
  FiExternalLink
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
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
    color: "#00f2fe",
    clothingColor: "#1e293b",
    hairColor: "#1e1e24",
    emoji: "⚡",
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
    color: "#10b981",
    clothingColor: "#065f46",
    hairColor: "#92400e",
    emoji: "🎯",
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
    color: "#8b5cf6",
    clothingColor: "#581c87",
    hairColor: "#27272a",
    emoji: "🧠",
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
    color: "#f59e0b",
    clothingColor: "#78350f",
    hairColor: "#3f3f46",
    emoji: "💻",
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
    color: "#ec4899",
    clothingColor: "#831843",
    hairColor: "#713f12",
    emoji: "📊",
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

// ============================================================================
// 5. COMPONENTES 3D: MOBILIARIO RETRO DE HERMES3D
// ============================================================================

// Puesto de Trabajo con Modelo GLTF y Fallback Procedural
function WorkstationDesk({
  position,
  rotation = 0,
  agentColor,
  screenCodeColor = "#00f2fe",
}: {
  position: [number, number, number];
  rotation?: number;
  agentColor: string;
  screenCodeColor?: string;
}) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Mesa de Madera Robusta */}
      <mesh position={[0, 0.72, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.8, 0.08, 1.0]} />
        <meshStandardMaterial color="#332219" roughness={0.7} metalness={0.1} />
      </mesh>

      {/* Patas Metálicas de la Mesa */}
      {[-0.8, 0.8].map((x, i) =>
        [-0.4, 0.4].map((z, j) => (
          <mesh key={`leg-${i}-${j}`} position={[x, 0.36, z]} castShadow>
            <cylinderGeometry args={[0.03, 0.03, 0.72, 12]} />
            <meshStandardMaterial color="#111827" metalness={0.8} roughness={0.3} />
          </mesh>
        ))
      )}

      {/* Monitor CRT / Pantalla Principal */}
      <group position={[0, 1.05, -0.22]}>
        {/* Soporte */}
        <mesh position={[0, -0.24, 0]}>
          <cylinderGeometry args={[0.08, 0.12, 0.16, 12]} />
          <meshStandardMaterial color="#1f2937" metalness={0.7} />
        </mesh>
        {/* Carcasa */}
        <mesh castShadow>
          <boxGeometry args={[0.9, 0.54, 0.08]} />
          <meshStandardMaterial color="#0f172a" roughness={0.5} />
        </mesh>
        {/* Pantalla con brillo (Terminal de Código) */}
        <mesh position={[0, 0, 0.045]}>
          <planeGeometry args={[0.82, 0.46]} />
          <meshBasicMaterial color={screenCodeColor} />
        </mesh>
      </group>

      {/* Teclado y Ratón en la Mesa */}
      <mesh position={[0, 0.77, 0.18]}>
        <boxGeometry args={[0.55, 0.02, 0.18]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      <mesh position={[0.42, 0.77, 0.18]}>
        <boxGeometry args={[0.1, 0.02, 0.14]} />
        <meshStandardMaterial color="#334155" />
      </mesh>

      {/* Taza de Café con Logo JRG */}
      <mesh position={[-0.6, 0.82, 0.2]}>
        <cylinderGeometry args={[0.06, 0.05, 0.12, 12]} />
        <meshStandardMaterial color={agentColor} roughness={0.3} />
      </mesh>

      {/* Silla Ergonómica de Oficina */}
      <group position={[0, 0, 0.72]}>
        <mesh position={[0, 0.48, 0]}>
          <boxGeometry args={[0.55, 0.08, 0.5]} />
          <meshStandardMaterial color="#1e293b" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.82, 0.22]}>
          <boxGeometry args={[0.52, 0.6, 0.08]} />
          <meshStandardMaterial color="#0f172a" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.22, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.44, 8]} />
          <meshStandardMaterial color="#000000" metalness={0.9} />
        </mesh>
      </group>
    </group>
  );
}

// Planta Decorativa en Maceta de Terracota
function PottedPlant({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.25, 0]} castShadow>
        <cylinderGeometry args={[0.26, 0.18, 0.5, 16]} />
        <meshStandardMaterial color="#854d0e" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.65, 0]} castShadow>
        <sphereGeometry args={[0.38, 12, 12]} />
        <meshStandardMaterial color="#15803d" roughness={0.7} />
      </mesh>
      <mesh position={[0.12, 0.95, 0.05]} castShadow>
        <sphereGeometry args={[0.28, 12, 12]} />
        <meshStandardMaterial color="#16a34a" roughness={0.6} />
      </mesh>
    </group>
  );
}

// Zona Lounge con Sofá y Mesa de Café
function LoungeCorner({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Sofá de Espera JRG */}
      <group position={[0, 0, 0]}>
        {/* Asiento */}
        <mesh position={[0, 0.38, 0]} castShadow>
          <boxGeometry args={[2.2, 0.3, 0.8]} />
          <meshStandardMaterial color="#0284c7" roughness={0.8} />
        </mesh>
        {/* Respaldo */}
        <mesh position={[0, 0.72, -0.35]} castShadow>
          <boxGeometry args={[2.2, 0.55, 0.22]} />
          <meshStandardMaterial color="#0369a1" roughness={0.8} />
        </mesh>
      </group>
      {/* Mesa de Café Baja */}
      <mesh position={[0, 0.22, 1.1]} castShadow>
        <boxGeometry args={[1.4, 0.14, 0.6]} />
        <meshStandardMaterial color="#1e293b" metalness={0.4} />
      </mesh>
    </group>
  );
}

// Máquina de Café & Dispensador de Agua (Break Room)
function CoffeeCorner({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Mueble bajo */}
      <mesh position={[0, 0.45, 0]} castShadow>
        <boxGeometry args={[1.2, 0.9, 0.6]} />
        <meshStandardMaterial color="#1e293b" roughness={0.5} />
      </mesh>
      {/* Cafetera Espresso */}
      <mesh position={[-0.25, 1.08, 0]} castShadow>
        <boxGeometry args={[0.42, 0.36, 0.38]} />
        <meshStandardMaterial color="#ef4444" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Dispensador de Agua */}
      <mesh position={[0.32, 1.25, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.16, 0.55, 16]} />
        <meshStandardMaterial color="#38bdf8" transparent opacity={0.7} />
      </mesh>
    </group>
  );
}

// Letrero Neón Iluminado en la Pared
function NeonWallSign({ text, position }: { text: string; position: [number, number, number] }) {
  return (
    <group position={position}>
      <Billboard follow lockX={false} lockY={false} lockZ={false}>
        <Text
          fontSize={0.48}
          color="#00f2fe"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.03}
          outlineColor="#003b46"
        >
          {text}
        </Text>
      </Billboard>
    </group>
  );
}

// ============================================================================
// 6. AGENTE 3D ANIMADO CON BURBUJA DE DIÁLOGO (HERMES3D ENGINE)
// ============================================================================

function VoxelAgentAvatar({
  agent,
  isSelected,
  onClick,
}: {
  agent: Agent;
  isSelected: boolean;
  onClick: () => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);

  // Animación suave de respiración y tipeo en el escritorio
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      // Suave respiración vertical
      groupRef.current.position.y = Math.sin(t * 2 + agent.deskPos[0]) * 0.02;
    }
    if (leftArmRef.current && rightArmRef.current) {
      // Movimiento de escribir en el teclado
      leftArmRef.current.rotation.x = -1.2 + Math.sin(t * 8 + 1) * 0.12;
      rightArmRef.current.rotation.x = -1.2 + Math.sin(t * 8 + 3) * 0.12;
    }
    if (headRef.current && isSelected) {
      // Inclinación suave si está seleccionado
      headRef.current.rotation.y = Math.sin(t * 1.5) * 0.15;
    }
  });

  return (
    <group
      position={[agent.deskPos[0], 0, agent.deskPos[2] + 0.65]}
      rotation={[0, agent.rotation + Math.PI, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      {/* Aro de Estado Pulsante en el Suelo */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[0.55, 0.65, 32]} />
        <meshBasicMaterial
          color={agent.color}
          transparent
          opacity={isSelected ? 0.9 : 0.4}
        />
      </mesh>

      {/* Modelo del Personaje Voxel */}
      <group ref={groupRef} position={[0, 0.42, 0]}>
        {/* Piernas */}
        <mesh position={[-0.12, -0.15, 0]}>
          <boxGeometry args={[0.14, 0.4, 0.16]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        <mesh position={[0.12, -0.15, 0]}>
          <boxGeometry args={[0.14, 0.4, 0.16]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>

        {/* Torso / Ropa de Identidad JRG */}
        <mesh position={[0, 0.22, 0]} castShadow>
          <boxGeometry args={[0.42, 0.48, 0.26]} />
          <meshStandardMaterial color={agent.clothingColor} roughness={0.7} />
        </mesh>

        {/* Cabeza */}
        <group ref={headRef} position={[0, 0.62, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.34, 0.34, 0.32]} />
            <meshStandardMaterial color="#ffd8b3" roughness={0.8} />
          </mesh>
          {/* Cabello */}
          <mesh position={[0, 0.14, -0.02]}>
            <boxGeometry args={[0.36, 0.16, 0.34]} />
            <meshStandardMaterial color={agent.hairColor} roughness={0.9} />
          </mesh>
          {/* Ojos */}
          <mesh position={[-0.08, 0.02, 0.17]}>
            <boxGeometry args={[0.05, 0.05, 0.02]} />
            <meshBasicMaterial color="#111827" />
          </mesh>
          <mesh position={[0.08, 0.02, 0.17]}>
            <boxGeometry args={[0.05, 0.05, 0.02]} />
            <meshBasicMaterial color="#111827" />
          </mesh>
        </group>

        {/* Brazos articulados */}
        <group ref={leftArmRef} position={[-0.26, 0.36, 0]}>
          <mesh position={[0, -0.18, 0.1]}>
            <boxGeometry args={[0.11, 0.38, 0.13]} />
            <meshStandardMaterial color={agent.clothingColor} />
          </mesh>
        </group>
        <group ref={rightArmRef} position={[0.26, 0.36, 0]}>
          <mesh position={[0, -0.18, 0.1]}>
            <boxGeometry args={[0.11, 0.38, 0.13]} />
            <meshStandardMaterial color={agent.clothingColor} />
          </mesh>
        </group>
      </group>

      {/* Cartel Holográfico Flotante (Nameplate) */}
      <Billboard position={[0, 1.85, 0]}>
        <Text
          fontSize={0.24}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.03}
          outlineColor="#020617"
        >
          {`${agent.emoji} ${agent.name}`}
        </Text>
        <Text
          position={[0, -0.18, 0]}
          fontSize={0.14}
          color={agent.color}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#020617"
        >
          {agent.role}
        </Text>
      </Billboard>

      {/* Burbuja de Diálogo 3D Estilo Hermes3D */}
      <Billboard position={[0, 2.35, 0]}>
        <group>
          {/* Fondo de la burbuja */}
          <mesh position={[0, 0, -0.01]}>
            <planeGeometry args={[2.4, 0.52]} />
            <meshBasicMaterial color="#06090e" transparent opacity={0.9} />
          </mesh>
          <mesh position={[0, 0, -0.02]}>
            <planeGeometry args={[2.44, 0.56]} />
            <meshBasicMaterial color={agent.color} />
          </mesh>
          <Text
            maxWidth={2.2}
            fontSize={0.12}
            color="#f8fafc"
            anchorX="center"
            anchorY="middle"
            lineHeight={1.2}
          >
            {agent.speechText}
          </Text>
        </group>
      </Billboard>
    </group>
  );
}

// Controlador de Cámara Suave
function CameraRig({
  selectedAgentPos,
}: {
  selectedAgentPos: [number, number, number] | null;
}) {
  const { camera } = useThree();

  useFrame(() => {
    if (selectedAgentPos) {
      // Lerp hacia la posición del agente seleccionado
      const targetVec = new THREE.Vector3(
        selectedAgentPos[0] + 4,
        selectedAgentPos[1] + 5,
        selectedAgentPos[2] + 6
      );
      camera.position.lerp(targetVec, 0.04);
    }
  });

  return null;
}

// ============================================================================
// 7. COMPONENTE PRINCIPAL DEL ORQUESTADOR (VISTA COMPLETA)
// ============================================================================

export default function AgentOrchestratorPage() {
  const [agents] = useState<Agent[]>(JRG_AGENTS);
  const [selectedAgentId, setSelectedAgentId] = useState<string>("jrg-aitor");
  const [activeFloor, setActiveFloor] = useState<1 | 2 | 3>(1);
  const [activeTab, setActiveTab] = useState<"chat" | "kanban" | "leads" | "skills" | "telemetry">("chat");
  const [viewMode, setViewMode] = useState<"3d" | "tactical">("3d");
  const [drawerOpen, setDrawerOpen] = useState<boolean>(true);
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

    // Agregar mensaje del usuario
    setChatHistory((prev) => ({
      ...prev,
      [selectedAgentId]: [
        ...(prev[selectedAgentId] || []),
        { role: "user", text: message },
      ],
    }));

    if (!textToSend) setInputMessage("");
    setIsTyping(true);

    // Respuesta inteligente simulada
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
          HEADER SUPERIOR (ESTILO HERMES3D)
          ==================================================================== */}
      <header className="jrg-orchestrator-header">
        <div className="jrg-header-brand">
          <Link to="/" className="jrg-back-link">
            <FiArrowLeft /> Web
          </Link>
          <div className="jrg-brand-title-wrap">
            <span className="jrg-brand-title">JRG Agency</span>
            <span className="jrg-brand-badge">
              <span className="jrg-live-pulse-dot" />
              5/5 AGENTES HQ
            </span>
          </div>
        </div>

        {/* Selector de Piso / Departamento de Hermes3D */}
        <div className="jrg-floor-selector">
          <button
            className={`jrg-floor-btn ${activeFloor === 1 ? "active" : ""}`}
            onClick={() => setActiveFloor(1)}
          >
            🏢 Piso 1: Dirección & ROI
          </button>
          <button
            className={`jrg-floor-btn ${activeFloor === 2 ? "active" : ""}`}
            onClick={() => setActiveFloor(2)}
          >
            🎯 Piso 2: Leads & Ventas
          </button>
          <button
            className={`jrg-floor-btn ${activeFloor === 3 ? "active" : ""}`}
            onClick={() => setActiveFloor(3)}
          >
            💻 Piso 3: Tech Lab & Dev
          </button>
        </div>

        {/* Controles del Header: Jukebox & Vista */}
        <div className="jrg-header-right">
          <div
            className={`jrg-jukebox-pill ${isJukeboxPlaying ? "playing" : ""}`}
            onClick={handleToggleJukebox}
            title="Hermes Lo-Fi Beats Player"
          >
            {isJukeboxPlaying ? <FiVolume2 color="#8b5cf6" /> : <FiVolumeX color="#94a3b8" />}
            <div className="jrg-equalizer-bars">
              <span className="jrg-eq-bar" />
              <span className="jrg-eq-bar" />
              <span className="jrg-eq-bar" />
            </div>
            <span className="jrg-jukebox-label">
              {isJukeboxPlaying ? "LO-FI BEATS: ON" : "LO-FI BEATS"}
            </span>
          </div>

          <button
            className="jrg-view-toggle-btn"
            onClick={() => setViewMode(viewMode === "3d" ? "tactical" : "3d")}
          >
            <FiLayers />
            {viewMode === "3d" ? "Vista 2D" : "Vista 3D"}
          </button>
        </div>
      </header>

      {/* ====================================================================
          CUERPO PRINCIPAL DEL ORQUESTADOR
          ==================================================================== */}
      <div className="jrg-orchestrator-body">
        {viewMode === "3d" ? (
          <div className="jrg-canvas-container">
            {/* Controles de Cámara Flotantes */}
            <div className="jrg-canvas-controls-overlay">
              <button
                className="jrg-cam-btn"
                onClick={() => setSelectedAgentId("jrg-aitor")}
              >
                <FiMaximize2 /> Centrar en Aitor
              </button>
            </div>

            {/* Pastilla del Agente Seleccionado */}
            <div
              className={`jrg-focused-agent-pill ${!drawerOpen ? "drawer-closed" : ""}`}
            >
              <span style={{ fontSize: "18px" }}>{selectedAgent.emoji}</span>
              <div>
                <strong style={{ fontSize: "13px", color: "#ffffff", display: "block" }}>
                  {selectedAgent.name}
                </strong>
                <span style={{ fontSize: "11px", color: selectedAgent.color }}>
                  {selectedAgent.role}
                </span>
              </div>
            </div>

            {/* Escenario 3D con Three.js */}
            <Canvas
              shadows
              camera={{ position: [14, 12, 14], fov: 42 }}
              gl={{ antialias: true, alpha: false }}
            >
              <color attach="background" args={["#06090e"]} />
              <ambientLight intensity={0.65} />
              <directionalLight
                position={[12, 20, 10]}
                intensity={1.2}
                castShadow
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
              />
              <pointLight position={[0, 6, 0]} intensity={0.8} color="#00f2fe" />

              <OrbitControls
                enableDamping
                dampingFactor={0.06}
                maxPolarAngle={Math.PI / 2.1}
                minDistance={5}
                maxDistance={35}
              />

              <CameraRig selectedAgentPos={selectedAgent.deskPos} />

              {/* Suelo del Edificio con Rejilla y Acabado Mate */}
              <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
                <planeGeometry args={[26, 22]} />
                <meshStandardMaterial color="#0b0f19" roughness={0.85} metalness={0.2} />
              </mesh>

              {/* Alfombra Central de la Oficina */}
              <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]} receiveShadow>
                <planeGeometry args={[16, 12]} />
                <meshStandardMaterial color="#0f172a" roughness={0.9} />
              </mesh>

              {/* Rótulo de Neón en la Pared de Fondo */}
              <NeonWallSign text="JRG AGENCY // AI AGENT WORKFORCE" position={[0, 4.2, -6.8]} />

              {/* Mobiliario de la Oficina Hermes3D */}
              <Suspense fallback={null}>
                {agents.map((agent) => (
                  <WorkstationDesk
                    key={`desk-${agent.id}`}
                    position={agent.deskPos}
                    rotation={agent.rotation}
                    agentColor={agent.color}
                    screenCodeColor={agent.color}
                  />
                ))}

                {/* Decoración del Cuartel General */}
                <PottedPlant position={[-6.2, 0, -4.5]} />
                <PottedPlant position={[6.2, 0, -4.5]} />
                <PottedPlant position={[-6.2, 0, 4.5]} />
                <PottedPlant position={[6.2, 0, 4.5]} />

                <CoffeeCorner position={[-6.5, 0, 0]} />
                <LoungeCorner position={[0, 0, 5.2]} />
              </Suspense>

              {/* Agentes Humanos Voxels Interactivos */}
              {agents.map((agent) => (
                <VoxelAgentAvatar
                  key={agent.id}
                  agent={agent}
                  isSelected={agent.id === selectedAgentId}
                  onClick={() => {
                    setSelectedAgentId(agent.id);
                    setDrawerOpen(true);
                  }}
                />
              ))}
            </Canvas>
          </div>
        ) : (
          /* ====================================================================
              VISTA TÁCTICA 2D (HERMES 2D MODE)
              ==================================================================== */
          <div className="jrg-tactical-view">
            <div className="jrg-tactical-grid-card">
              <div className="jrg-tactical-header">
                <div>
                  <h2 style={{ margin: 0, fontSize: "18px", color: "#ffffff" }}>
                    Tablero Táctico de Agentes JRG
                  </h2>
                  <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "#94a3b8" }}>
                    Distribución en tiempo real de operaciones en Gipuzkoa
                  </p>
                </div>
                <span className="jrg-brand-badge">ESTADO: 100% OPERATIVO</span>
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
                      <span style={{ fontSize: "24px" }}>{agent.emoji}</span>
                      <div>
                        <strong style={{ fontSize: "14px", color: "#ffffff" }}>{agent.name}</strong>
                        <div style={{ fontSize: "11px", color: agent.color }}>{agent.role}</div>
                      </div>
                    </div>
                    <p style={{ fontSize: "12px", color: "#cbd5e1", margin: "6px 0 0 0", lineHeight: 1.4 }}>
                      {agent.currentTask}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ====================================================================
            DRAWER LATERAL (PANELES HERMES3D)
            ==================================================================== */}
        <aside className={`jrg-orchestrator-drawer ${!drawerOpen ? "closed" : ""}`}>
          {/* Pestaña flotante para abrir/cerrar */}
          <button
            className="jrg-drawer-toggle-tab"
            onClick={() => setDrawerOpen(!drawerOpen)}
            title="Abrir/Cerrar Panel"
          >
            {drawerOpen ? <FiArrowLeft /> : <FiMessageSquare />}
          </button>

          {/* Selector de Pestañas */}
          <div className="jrg-drawer-tabs">
            <button
              className={`jrg-tab-item ${activeTab === "chat" ? "active" : ""}`}
              onClick={() => setActiveTab("chat")}
            >
              <FiMessageSquare /> Terminal
            </button>
            <button
              className={`jrg-tab-item ${activeTab === "kanban" ? "active" : ""}`}
              onClick={() => setActiveTab("kanban")}
            >
              <FiTrello /> Kanban
            </button>
            <button
              className={`jrg-tab-item ${activeTab === "leads" ? "active" : ""}`}
              onClick={() => setActiveTab("leads")}
            >
              <FiUsers /> Leads ({JRG_REAL_LEADS.length})
            </button>
            <button
              className={`jrg-tab-item ${activeTab === "skills" ? "active" : ""}`}
              onClick={() => setActiveTab("skills")}
            >
              <FiTool /> Skills
            </button>
            <button
              className={`jrg-tab-item ${activeTab === "telemetry" ? "active" : ""}`}
              onClick={() => setActiveTab("telemetry")}
            >
              <FiActivity /> ROI
            </button>
          </div>

          <div className="jrg-drawer-content">
            {/* TAB 1: TERMINAL & CHAT EN VIVO */}
            {activeTab === "chat" && (
              <div className="jrg-chat-container">
                {/* Cabecera del Agente Actual */}
                <div className="jrg-agent-header-card">
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div
                      className="jrg-agent-avatar-badge"
                      style={{ background: `${selectedAgent.color}22`, borderColor: selectedAgent.color }}
                    >
                      {selectedAgent.emoji}
                    </div>
                    <div className="jrg-agent-info">
                      <h3>{selectedAgent.name}</h3>
                      <p>{selectedAgent.role}</p>
                    </div>
                  </div>
                  <span
                    className="jrg-brand-badge"
                    style={{ borderColor: selectedAgent.color, color: selectedAgent.color }}
                  >
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
                      <div className="jrg-msg-bubble" style={{ color: "#00f2fe" }}>
                        ⚡ {selectedAgent.name} está procesando...
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
                    📍 Leads Zumarraga
                  </button>
                  <button
                    className="jrg-quick-prompt-btn"
                    onClick={() => handleSendMessage("¿Cómo paquetizamos el Kit Digital para hostelería?")}
                  >
                    💼 Kit Digital 3.000€
                  </button>
                  <button
                    className="jrg-quick-prompt-btn"
                    onClick={() => handleSendMessage("Prepara el mensaje para Restaurante Ezkiotarra")}
                  >
                    📱 Pitch WhatsApp
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

            {/* TAB 2: TABLERO KANBAN */}
            {activeTab === "kanban" && (
              <div className="jrg-kanban-container">
                {/* Input para Nueva Tarea */}
                <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                  <input
                    type="text"
                    className="jrg-chat-input"
                    placeholder="Nueva tarea para el equipo..."
                    value={newTaskInput}
                    onChange={(e) => setNewTaskInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
                  />
                  <button className="jrg-send-btn" onClick={handleAddTask}>
                    <FiPlus />
                  </button>
                </div>

                {(["in_progress", "review", "done", "backlog"] as const).map((statusKey) => {
                  const colTasks = tasks.filter((t) => t.status === statusKey);
                  const labels = {
                    in_progress: "🔥 En Proceso",
                    review: "👀 En Revisión",
                    done: "✅ Completadas",
                    backlog: "📥 Backlog",
                  };
                  return (
                    <div key={statusKey} className="jrg-kanban-col">
                      <div className="jrg-kanban-col-header">
                        <span>{labels[statusKey]}</span>
                        <span>{colTasks.length}</span>
                      </div>
                      {colTasks.map((task) => (
                        <div key={task.id} className="jrg-kanban-card">
                          <div className="jrg-task-title">{task.title}</div>
                          <div className="jrg-task-meta">
                            <span className="jrg-task-assignee">@{task.assignee}</span>
                            <span className={`jrg-task-priority ${task.priority}`}>
                              {task.priority.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })}
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
                          📍 {lead.municipio} • ⭐ {lead.rating} ({lead.reviews})
                        </span>
                      </div>
                      <div style={{ fontSize: "12px", color: "#94a3b8" }}>
                        Categoría: <strong style={{ color: "#e2e8f0" }}>{lead.categoria}</strong> • Tel: {lead.telefono}
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

            {/* TAB 4: SKILLS MARKETPLACE (HERMES3D SKILLS) */}
            {activeTab === "skills" && (
              <div className="jrg-skills-container">
                <div className="jrg-skill-card">
                  <span className="jrg-skill-icon">🛰️</span>
                  <div className="jrg-skill-details">
                    <h4>Google Maps Intelligence Scraper</h4>
                    <p>Extrae nombres, teléfonos móviles, calificaciones y estado del sitio web de negocios en el País Vasco.</p>
                    <span className="jrg-skill-tag">Asignado a: Maider</span>
                  </div>
                </div>

                <div className="jrg-skill-card">
                  <span className="jrg-skill-icon">💬</span>
                  <div className="jrg-skill-details">
                    <h4>WhatsApp Conversion Copy Engine</h4>
                    <p>Redacta argumentos breves de alta persuasión adaptados a comercios locales y hostelería.</p>
                    <span className="jrg-skill-tag">Asignado a: Iker</span>
                  </div>
                </div>

                <div className="jrg-skill-card">
                  <span className="jrg-skill-icon">⚡</span>
                  <div className="jrg-skill-details">
                    <h4>Vite & Three.js 48h Prototyper</h4>
                    <p>Compila y despliega bocetos interactivos con subdominio y código limpio listos para presentar al cliente.</p>
                    <span className="jrg-skill-tag">Asignado a: Unai</span>
                  </div>
                </div>

                <div className="jrg-skill-card">
                  <span className="jrg-skill-icon">💶</span>
                  <div className="jrg-skill-details">
                    <h4>Kit Digital ROI & Subsidies Auditor</h4>
                    <p>Verifica y tramita bonos de hasta 3.000€ en digitalización para autónomos y micropymes.</p>
                    <span className="jrg-skill-tag">Asignado a: Elena</span>
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
                    <div className="jrg-kpi-label">Oportunidad Mensual</div>
                  </div>
                </div>

                <div style={{ background: "rgba(255,255,255,0.03)", padding: "16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <h4 style={{ margin: "0 0 8px 0", color: "#00f2fe", fontSize: "13px" }}>
                    ⚡ Eficiencia de la Flota de Agentes
                  </h4>
                  <p style={{ margin: 0, fontSize: "12px", color: "#cbd5e1", lineHeight: 1.5 }}>
                    La combinación de prospección automatizada, desarrollo ágil en 48 horas y mensajes de WhatsApp personalizados reduce el ciclo de venta promedio de 14 días a solo 48 horas.
                  </p>
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
